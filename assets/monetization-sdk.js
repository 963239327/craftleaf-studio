/**
 * CraftLeaf Universal Zero-Backend Monetization, License & Attribution SDK (v2 Hardened)
 * Works in Static Sites (GitHub Pages), Browser Extensions (MV3 DOM-safe), and Headless Tests.
 *
 * Security & Privacy Guarantees:
 *  - ZERO key-generation or reversible checksum algorithm shipped in client code (#4).
 *  - Pre-issued buyer keys inside paid store ZIPs are verified via one-way SHA-256 digests only.
 *  - Native Gumroad License Keys are verified via https://api.gumroad.com/v2/licenses/verify,
 *    rejecting refunded/chargebacked purchases and surfacing 'network_error' when offline (#14).
 *  - LocalStorage unlock records require cryptographic proof digests (never string-length checks).
 *  - Outbound Gumroad links automatically forward UTM campaign & landing-page attribution (#5).
 */
(function (root) {
  'use strict';

  var STORAGE_PREFIX = 'craftleaf_license_v2_';
  var UTM_SESSION_KEY = 'craftleaf_utm_v1';

  // Compact FIPS 180-4 SHA-256 (synchronous, zero dependencies, works in Browser + MV3 + JSC + Node)
  var K256 = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  function rotr(x, n) {
    return (x >>> n) | (x << (32 - n));
  }

  function sha256Hex(str) {
    var utf8 = unescape(encodeURIComponent(String(str)));
    var bitLen = utf8.length * 8;
    var words = [];
    for (var i = 0; i < utf8.length; i++) {
      words[i >> 2] |= (utf8.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
    }
    words[utf8.length >> 2] |= 0x80 << (24 - (utf8.length % 4) * 8);
    var totalWords = (((utf8.length + 8) >> 6) + 1) * 16;
    for (var z = 0; z < totalWords; z++) {
      if (words[z] === undefined) words[z] = 0;
    }
    words[totalWords - 2] = Math.floor(bitLen / 0x100000000);
    words[totalWords - 1] = bitLen >>> 0;

    var H = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];
    var W = new Array(64);
    for (var offset = 0; offset < totalWords; offset += 16) {
      for (var t = 0; t < 16; t++) W[t] = words[offset + t] | 0;
      for (var t2 = 16; t2 < 64; t2++) {
        var s0 = rotr(W[t2 - 15], 7) ^ rotr(W[t2 - 15], 18) ^ (W[t2 - 15] >>> 3);
        var s1 = rotr(W[t2 - 2], 17) ^ rotr(W[t2 - 2], 19) ^ (W[t2 - 2] >>> 10);
        W[t2] = (W[t2 - 16] + s0 + W[t2 - 7] + s1) | 0;
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (var r = 0; r < 64; r++) {
        var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        var ch = (e & f) ^ ((~e) & g);
        var temp1 = (h + S1 + ch + K256[r] + W[r]) | 0;
        var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var temp2 = (S0 + maj) | 0;
        h = g; g = f; f = e; e = (d + temp1) | 0;
        d = c; c = b; b = a; a = (temp1 + temp2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    var hex = '';
    for (var hi = 0; hi < 8; hi++) {
      hex += ('00000000' + (H[hi] >>> 0).toString(16)).slice(-8);
    }
    return hex;
  }

  function normalizeKey(raw) {
    return String(raw || '').trim().toUpperCase().replace(/\s+/g, '');
  }

  function getConfig() {
    return root.CRAFTLEAF_MONETIZATION || {
      brand: {},
      tips: {},
      products: {},
      affiliates: { amazonAssociateTag: '', items: [] },
      referrals: {},
      analytics: {},
      issuedKeyDigests: {}
    };
  }

  function checkIssuedDigest(rawKey, allowedPrefixes) {
    var key = normalizeKey(rawKey);
    if (!key) return { valid: false, reason: 'empty' };
    var parts = key.split('-');
    if (parts.length !== 4) return { valid: false, reason: 'format' };
    var prefix = parts[0];
    var validPrefixes = (allowedPrefixes || []).concat(['STUDIOALL']);
    if (validPrefixes.indexOf(prefix) === -1) {
      return { valid: false, reason: 'prefix' };
    }
    var cfg = getConfig();
    var table = (cfg && cfg.issuedKeyDigests && cfg.issuedKeyDigests[prefix]) || [];
    var digest = sha256Hex('CraftLeaf-Issued-v2::' + key).slice(0, 32);
    if (table.indexOf(digest) === -1) {
      return { valid: false, reason: 'unrecognized' };
    }
    return { valid: true, mode: 'issued', prefix: prefix, digest: digest };
  }

  function writeProofRecord(storageId, record) {
    try {
      localStorage.setItem(STORAGE_PREFIX + storageId, JSON.stringify(record));
    } catch (_e) {}
  }

  function saveUnlocked(productId, rawKey, options) {
    options = options || {};
    var cfg = getConfig();
    var prod = (cfg.products && cfg.products[productId]) || {};
    var prefix = options.keyPrefix || prod.keyPrefix || 'PRO';
    var issued = checkIssuedDigest(rawKey, [prefix]);
    if (!issued.valid) return false;
    var targetId = issued.prefix === 'STUDIOALL' ? 'allAccessPass' : productId;
    writeProofRecord(targetId, {
      mode: 'issued',
      prefix: issued.prefix,
      digest: issued.digest,
      proof: sha256Hex('CLIssuedProof-v2::' + issued.prefix + '::' + issued.digest).slice(0, 32),
      unlockedAt: new Date().toISOString()
    });
    return true;
  }

  async function verifyGumroadEndpoint(permalink, trimmedKey) {
    var body = new URLSearchParams();
    body.set('product_permalink', permalink);
    body.set('license_key', trimmedKey);
    body.set('increment_uses_count', 'false');
    var resp = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });
    var data = await resp.json();
    if (data && data.success) {
      if (data.purchase && (data.purchase.refunded || data.purchase.chargebacked)) {
        return { valid: false, reason: 'refunded' };
      }
      return { valid: true };
    }
    return { valid: false, reason: 'invalid' };
  }

  async function verifyLicense(productId, rawKey, options) {
    options = options || {};
    var trimmed = String(rawKey || '').trim();
    if (!trimmed) return { valid: false, reason: 'empty' };

    var cfg = getConfig();
    var prod = (cfg.products && cfg.products[productId]) || {};
    var prefix = options.keyPrefix || prod.keyPrefix || 'PRO';

    // 1. Check one-way SHA-256 digest of pre-issued buyer ZIP keys (zero keygen math in public code)
    var issued = checkIssuedDigest(trimmed, [prefix]);
    if (issued.valid) {
      saveUnlocked(productId, trimmed, { keyPrefix: prefix });
      return { valid: true, mode: 'issued', prefix: issued.prefix };
    }

    // 2. Verify live Gumroad license key via official CORS endpoint (plus All-Access fallback)
    var permalink = options.gumroadPermalink || prod.gumroadPermalink;
    var allAccessPermalink = (cfg.products && cfg.products.allAccessPass && cfg.products.allAccessPass.gumroadPermalink) || 'craftleaf-all-access';
    if (permalink && trimmed.length >= 8 && typeof fetch === 'function') {
      try {
        var primary = await verifyGumroadEndpoint(permalink, trimmed);
        if (primary.reason === 'refunded') {
          return { valid: false, reason: 'refunded' };
        }
        var targetSlot = productId;
        var ok = primary.valid;
        if (!ok && permalink !== allAccessPermalink) {
          var fallbackAll = await verifyGumroadEndpoint(allAccessPermalink, trimmed);
          if (fallbackAll.reason === 'refunded') {
            return { valid: false, reason: 'refunded' };
          }
          if (fallbackAll.valid) {
            ok = true;
            targetSlot = 'allAccessPass';
          }
        }
        if (ok) {
          var kh = sha256Hex('CLGumroadKey-v2::' + trimmed).slice(0, 32);
          writeProofRecord(targetSlot, {
            mode: 'gumroad',
            target: targetSlot,
            keyHash: kh,
            proof: sha256Hex('CLGumroadProof-v2::' + targetSlot + '::' + kh).slice(0, 32),
            unlockedAt: new Date().toISOString()
          });
          return { valid: true, mode: 'gumroad' };
        }
      } catch (_err) {
        return { valid: false, reason: 'network_error' };
      }
    }
    return { valid: false, reason: 'invalid' };
  }

  function validateStoredRecord(slotId, rawJson, expectedPrefixes) {
    if (!rawJson) return false;
    try {
      var parsed = JSON.parse(rawJson);
      if (!parsed || typeof parsed !== 'object') return false;
      if (parsed.mode === 'issued') {
        if (!parsed.prefix || !parsed.digest || !parsed.proof) return false;
        if (expectedPrefixes.indexOf(parsed.prefix) === -1) return false;
        var cfg = getConfig();
        var table = (cfg && cfg.issuedKeyDigests && cfg.issuedKeyDigests[parsed.prefix]) || [];
        if (table.indexOf(parsed.digest) === -1) return false;
        var expectedProof = sha256Hex('CLIssuedProof-v2::' + parsed.prefix + '::' + parsed.digest).slice(0, 32);
        return parsed.proof === expectedProof;
      }
      if (parsed.mode === 'gumroad') {
        if (!parsed.keyHash || !parsed.proof || parsed.target !== slotId) return false;
        var expectedGumProof = sha256Hex('CLGumroadProof-v2::' + slotId + '::' + parsed.keyHash).slice(0, 32);
        return parsed.proof === expectedGumProof;
      }
      return false;
    } catch (_e) {
      return false;
    }
  }

  function isUnlocked(productId, keyPrefix) {
    try {
      var cfg = getConfig();
      var prod = (cfg.products && cfg.products[productId]) || {};
      var pfx = keyPrefix || prod.keyPrefix || 'PRO';
      if (validateStoredRecord(productId, localStorage.getItem(STORAGE_PREFIX + productId), [pfx, 'STUDIOALL'])) {
        return true;
      }
      if (validateStoredRecord('allAccessPass', localStorage.getItem(STORAGE_PREFIX + 'allAccessPass'), ['STUDIOALL'])) {
        return true;
      }
      return false;
    } catch (_e) {
      return false;
    }
  }

  function buildAmazonUrl(rawUrl, assocTag) {
    var clean = String(rawUrl || '').replace(/([?&])tag=[^&]+(&?)/i, function (_m, p1, p2) {
      return p2 ? p1 : '';
    }).replace(/[?&]$/, '');
    if (!assocTag) return clean;
    return clean + (clean.indexOf('?') === -1 ? '?' : '&') + 'tag=' + encodeURIComponent(assocTag);
  }

  function clearChildren(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  function renderAffiliateBar(containerEl, category, lang) {
    if (!containerEl) return;
    var cfg = getConfig();
    var assocTag = (cfg.affiliates && cfg.affiliates.amazonAssociateTag) ? String(cfg.affiliates.amazonAssociateTag).trim() : '';
    var items = ((cfg.affiliates && cfg.affiliates.items) || []).filter(function (it) {
      return !category || it.category === category;
    });
    if (!items.length) return;
    var isZh = lang === 'zh';

    // Support lightweight headless unit-test mock containers without document.createElement
    if (typeof document === 'undefined' || typeof containerEl.appendChild !== 'function') {
      containerEl.textContent = items.map(function (it) { return isZh ? it.titleZh : it.titleEn; }).join(' | ');
      return;
    }

    clearChildren(containerEl);
    var box = document.createElement('div');
    box.style.cssText = 'border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;background:#f8fafc;margin-top:16px;font-size:13px;';

    var heading = document.createElement('div');
    heading.style.cssText = 'font-weight:600;color:#0f172a;margin-bottom:8px;';
    heading.textContent = isZh ? '🖨️ 推荐打印耗材与裁切工具（家用省钱清单）' : '🖨️ Recommended Print Supplies & Paper (Optional Home Crafting)';
    box.appendChild(heading);

    var grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;';
    items.forEach(function (it) {
      var a = document.createElement('a');
      a.href = buildAmazonUrl(it.url, assocTag);
      a.target = '_blank';
      a.rel = assocTag ? 'noopener sponsored' : 'noopener';
      a.style.cssText = 'display:block;padding:8px 10px;background:#ffffff;border:1px solid #cbd5e1;border-radius:8px;color:#1e293b;text-decoration:none;line-height:1.4;';
      var lbl = document.createElement('span');
      lbl.textContent = (isZh ? it.titleZh : it.titleEn) + ' ';
      var arr = document.createElement('span');
      arr.style.cssText = 'color:#2563eb;font-weight:600;';
      arr.textContent = '→';
      a.appendChild(lbl);
      a.appendChild(arr);
      grid.appendChild(a);
    });
    box.appendChild(grid);

    var disc = document.createElement('div');
    disc.style.cssText = 'margin-top:8px;font-size:11.5px;color:#64748b;line-height:1.45;';
    disc.textContent = isZh
      ? '说明：以上耗材完全按需选购（去药店冲印无需购买相纸）。作为亚马逊联盟成员（Amazon Associate），若未来启用合作链接产生合格购买，作者可能获得少量佣金，商品价格与库存由亚马逊决定。'
      : 'Disclosure: Optional supplies only (not needed for drugstore pickup). As an Amazon Associate we may earn from qualifying purchases when affiliate links are active; prices and availability are set by Amazon.';
    box.appendChild(disc);

    containerEl.appendChild(box);
  }

  function detectActiveLang() {
    if (typeof document === 'undefined') return 'en';
    var de = document.documentElement;
    if (de.classList && de.classList.contains('zh')) return 'zh';
    if (document.body && (document.body.classList.contains('lang-zh') || document.body.getAttribute('data-lang') === 'zh')) return 'zh';
    var hl = (de.getAttribute('lang') || '').toLowerCase();
    if (hl.indexOf('zh') === 0) return 'zh';
    try {
      var sl = localStorage.getItem('craftleaf_lang');
      if (sl === 'zh' || sl === 'en') return sl;
    } catch (_e) {}
    return (typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase().indexOf('zh') === 0) ? 'zh' : 'en';
  }

  function resolvePortalBase() {
    if (typeof document !== 'undefined') {
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].getAttribute('src') || '';
        var idx = src.indexOf('assets/monetization-sdk.js');
        if (idx !== -1) return src.slice(0, idx);
      }
    }
    return 'https://963239327.github.io/craftleaf-studio/';
  }

  function currentPageSlug() {
    if (typeof location === 'undefined') return 'app';
    var p = (location.pathname || '/').replace(/^\/craftleaf-studio\/?/, '').replace(/index\.html$/, '').replace(/^\/+|\/+$/g, '');
    return (p || 'portal-home').replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 64);
  }

  function captureIncomingUtm() {
    if (typeof location === 'undefined' || !location.search) return;
    try {
      var sp = new URLSearchParams(location.search);
      var src = sp.get('utm_source');
      if (!src) return;
      var saved = {
        utm_source: src.slice(0, 48),
        utm_medium: (sp.get('utm_medium') || 'social').slice(0, 32),
        utm_campaign: (sp.get('utm_campaign') || 'organic').slice(0, 64)
      };
      sessionStorage.setItem(UTM_SESSION_KEY, JSON.stringify(saved));
    } catch (_e) {}
  }

  function decorateGumroadUrl(href) {
    if (!href || href.indexOf('gumroad.com') === -1) return href;
    try {
      var u = new URL(href, typeof location !== 'undefined' ? location.href : 'https://963239327.github.io');
      var stored = null;
      try { stored = JSON.parse(sessionStorage.getItem(UTM_SESSION_KEY) || 'null'); } catch (_e) {}
      if (!u.searchParams.get('utm_source')) {
        u.searchParams.set('utm_source', (stored && stored.utm_source) || 'craftleaf-portal');
      }
      if (!u.searchParams.get('utm_medium')) {
        u.searchParams.set('utm_medium', (stored && stored.utm_medium) || 'web');
      }
      if (stored && stored.utm_campaign && !u.searchParams.get('utm_campaign')) {
        u.searchParams.set('utm_campaign', stored.utm_campaign);
      }
      if (!u.searchParams.get('utm_content')) {
        u.searchParams.set('utm_content', currentPageSlug());
      }
      return u.toString();
    } catch (_e) {
      return href;
    }
  }

  function openTipModal(forcedLang) {
    if (typeof document === 'undefined') return;
    var lang = forcedLang || detectActiveLang();
    var isZh = lang === 'zh';
    var cfg = getConfig();
    var tips = cfg.tips || {};
    var coffeeUrl = decorateGumroadUrl(tips.buyMeACoffeeUrl || tips.stripeTipUrl || 'https://stardustdemo.gumroad.com/l/coffee');
    var qrUrl = resolvePortalBase() + (tips.wechatQrPath || 'assets/wechat-reward-qr.png');

    var existing = document.getElementById('craftleafTipModal');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var overlay = document.createElement('div');
    overlay.id = 'craftleafTipModal';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(2,6,23,0.76);backdrop-filter:blur(6px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:18px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif;';

    var card = document.createElement('div');
    card.style.cssText = 'background:#ffffff;color:#0f172a;max-width:410px;width:100%;border-radius:20px;padding:24px 22px;box-shadow:0 24px 60px rgba(0,0,0,0.45);text-align:center;position:relative;';

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = '✕';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.style.cssText = 'position:absolute;top:12px;right:14px;border:none;background:#f1f5f9;color:#475569;width:30px;height:30px;border-radius:999px;font-size:15px;font-weight:700;cursor:pointer;';
    closeBtn.onclick = function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); };
    card.appendChild(closeBtn);

    if (isZh) {
      var hZh = document.createElement('h3');
      hZh.style.cssText = 'margin:2px 0 6px;font-size:20px;color:#0f172a;';
      hZh.textContent = '☕ 请独立开发者喝杯咖啡';
      card.appendChild(hZh);

      var pZh = document.createElement('p');
      pZh.style.cssText = 'margin:0 0 14px;font-size:13.5px;color:#475569;line-height:1.5;';
      pZh.textContent = '小工具帮您省下了时间或开销？微信扫一扫或手机长按识别赞赏码（0手续费直达作者），支持工具永久免广告运行 ❤️';
      card.appendChild(pZh);

      var qrImg = document.createElement('img');
      qrImg.src = qrUrl;
      qrImg.alt = 'WeChat Reward QR Code';
      qrImg.style.cssText = 'width:246px;height:246px;object-fit:contain;border-radius:14px;border:1px solid #e2e8f0;display:block;margin:0 auto 14px;';
      card.appendChild(qrImg);

      var usdLink = document.createElement('a');
      usdLink.href = coffeeUrl;
      usdLink.target = '_blank';
      usdLink.rel = 'noopener';
      usdLink.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;gap:6px;width:100%;padding:10px 14px;border-radius:10px;background:#0f172a;color:#f8fafc;font-size:13.5px;font-weight:700;text-decoration:none;';
      usdLink.textContent = '💳 使用美元信用卡 / Apple Pay 赞助 ($3+) →';
      card.appendChild(usdLink);
    } else {
      var hEn = document.createElement('h3');
      hEn.style.cssText = 'margin:2px 0 8px;font-size:21px;color:#0f172a;';
      hEn.textContent = '☕ Buy the Indie Creator a Coffee';
      card.appendChild(hEn);

      var pEn = document.createElement('p');
      pEn.style.cssText = 'margin:0 0 18px;font-size:14px;color:#475569;line-height:1.55;';
      pEn.textContent = 'Saved $16+ at the drugstore or love our 100% local, zero-tracking privacy tools? Support ongoing open-source maintenance with a quick $3 coffee via Apple Pay, Google Pay, or Card!';
      card.appendChild(pEn);

      var mainCta = document.createElement('a');
      mainCta.href = coffeeUrl;
      mainCta.target = '_blank';
      mainCta.rel = 'noopener';
      mainCta.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:13px 16px;border-radius:12px;background:#10b981;color:#042f1e;font-size:15px;font-weight:800;text-decoration:none;margin-bottom:12px;';
      mainCta.textContent = '☕ Support with Card / Apple Pay ($3+) →';
      card.appendChild(mainCta);

      var toggleQr = document.createElement('button');
      toggleQr.type = 'button';
      toggleQr.style.cssText = 'border:none;background:transparent;color:#64748b;font-size:12.5px;cursor:pointer;text-decoration:underline;';
      toggleQr.textContent = 'Using WeChat Pay? Show WeChat Reward QR Code';
      var hiddenQr = document.createElement('img');
      hiddenQr.src = qrUrl;
      hiddenQr.alt = 'WeChat Reward QR';
      hiddenQr.style.cssText = 'display:none;width:210px;height:210px;object-fit:contain;border-radius:12px;border:1px solid #e2e8f0;margin:10px auto 0;';
      toggleQr.onclick = function () {
        hiddenQr.style.display = hiddenQr.style.display === 'none' ? 'block' : 'none';
      };
      card.appendChild(toggleQr);
      card.appendChild(hiddenQr);
    }

    overlay.appendChild(card);
    overlay.addEventListener('click', function (ev) {
      if (ev.target === overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    });
    document.body.appendChild(overlay);
  }

  /**
   * Non-blocking "Peak Gratitude / Value Moment" post-export conversion toast (#16).
   */
  function showValueMomentPrompt(opts) {
    if (typeof document === 'undefined' || !document.body) return;
    opts = opts || {};
    var lang = opts.lang || detectActiveLang();
    var isZh = lang === 'zh';
    var existing = document.getElementById('craftleafValueToast');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var toast = document.createElement('div');
    toast.id = 'craftleafValueToast';
    toast.style.cssText = 'position:fixed;right:18px;bottom:18px;max-width:360px;width:calc(100% - 36px);background:#0f172a;color:#f8fafc;border:1px solid #334155;border-radius:16px;padding:16px 16px 14px;box-shadow:0 18px 42px rgba(2,6,23,0.55);z-index:99990;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif;';

    var closeB = document.createElement('button');
    closeB.type = 'button';
    closeB.textContent = '✕';
    closeB.setAttribute('aria-label', 'Dismiss');
    closeB.style.cssText = 'position:absolute;top:10px;right:12px;border:none;background:transparent;color:#94a3b8;font-size:14px;cursor:pointer;';
    closeB.onclick = function () { if (toast.parentNode) toast.parentNode.removeChild(toast); };
    toast.appendChild(closeB);

    var titleEl = document.createElement('div');
    titleEl.style.cssText = 'font-weight:800;font-size:14.5px;color:#34d399;margin-bottom:5px;padding-right:20px;';
    titleEl.textContent = isZh ? (opts.titleZh || '✅ 已在本地导出完成（0字节上传）！') : (opts.titleEn || '✅ Exported 100% Locally!');
    toast.appendChild(titleEl);

    var bodyEl = document.createElement('div');
    bodyEl.style.cssText = 'font-size:12.8px;color:#cbd5e1;line-height:1.45;margin-bottom:12px;';
    bodyEl.textContent = isZh
      ? (opts.bodyZh || '如果这个免费工具帮您省下了开销或时间，欢迎请作者喝杯咖啡或解锁终身 Pro 版！')
      : (opts.bodyEn || 'Saved time or money today? Support ongoing ad-free maintenance or unlock Lifetime Pro!');
    toast.appendChild(bodyEl);

    var row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;';

    var tipB = document.createElement('button');
    tipB.type = 'button';
    tipB.style.cssText = 'flex:1;padding:8px 10px;border-radius:9px;border:none;background:#10b981;color:#042f1e;font-weight:800;font-size:12.5px;cursor:pointer;';
    tipB.textContent = isZh ? '☕ 赞赏支持' : '☕ Buy a Coffee';
    tipB.onclick = function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
      openTipModal(lang);
    };
    row.appendChild(tipB);

    if (opts.proUrl) {
      var proA = document.createElement('a');
      proA.href = decorateGumroadUrl(opts.proUrl);
      proA.target = '_blank';
      proA.rel = 'noopener';
      proA.style.cssText = 'flex:1;text-align:center;padding:8px 10px;border-radius:9px;background:#f59e0b;color:#111827;font-weight:800;font-size:12.5px;text-decoration:none;';
      proA.textContent = isZh ? (opts.proLabelZh || '✨ 解锁 Pro') : (opts.proLabelEn || '✨ Unlock Pro');
      row.appendChild(proA);
    }

    toast.appendChild(row);
    document.body.appendChild(toast);
  }

  function initOptionalAnalytics() {
    if (typeof document === 'undefined' || !document.head) return;
    var cfg = getConfig();
    var gc = cfg.analytics && cfg.analytics.goatcounterEndpoint ? String(cfg.analytics.goatcounterEndpoint).trim() : '';
    if (!gc) return;
    var s = document.createElement('script');
    s.async = true;
    s.setAttribute('data-goatcounter', gc);
    s.src = 'https://gc.zgo.at/count.js';
    document.head.appendChild(s);
  }

  if (typeof document !== 'undefined' && document.addEventListener) {
    captureIncomingUtm();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initOptionalAnalytics);
    } else {
      initOptionalAnalytics();
    }
    document.addEventListener('click', function (ev) {
      var tipEl = ev.target && ev.target.closest ? ev.target.closest('#tipLink, #tipLinkZh, #studioTipLink, [data-craftleaf-tip]') : null;
      if (tipEl) {
        ev.preventDefault();
        var forced = tipEl.id === 'tipLinkZh' ? 'zh' : (tipEl.id === 'tipLink' ? 'en' : undefined);
        openTipModal(forced);
        return;
      }
      var gumA = ev.target && ev.target.closest ? ev.target.closest('a[href*="gumroad.com"]') : null;
      if (gumA && gumA.href) {
        gumA.href = decorateGumroadUrl(gumA.href);
      }
    });
  }

  // Note: fnv1aHex6 & verifyOfflineKey are intentionally NOT exported (#4).
  root.CraftLeafSDK = {
    sha256Hex: sha256Hex,
    verifyLicense: verifyLicense,
    isUnlocked: isUnlocked,
    saveUnlocked: saveUnlocked,
    getConfig: getConfig,
    renderAffiliateBar: renderAffiliateBar,
    openTipModal: openTipModal,
    showValueMomentPrompt: showValueMomentPrompt,
    decorateGumroadUrl: decorateGumroadUrl
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.CraftLeafSDK;
  }
})(typeof window !== 'undefined' ? window : globalThis);
