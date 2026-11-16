/**
 * CraftLeaf Universal Zero-Backend Monetization, Gumroad License & Attribution SDK (v3)
 * Works in Static Sites (GitHub Pages), Browser Extensions (MV3 DOM-safe), and Headless Tests.
 *
 * Security Guarantees (#4, #14, #22):
 *  - ZERO offline keygen, checksum helpers, SHA-256 helpers, or public digest tables.
 *  - `isUnlocked()` reads ONLY private closure state (`verifiedSessionSlots`) populated exclusively
 *    after a successful `https://api.gumroad.com/v2/licenses/verify` call in this runtime.
 *  - `localStorage` caches ONLY the buyer's raw `licenseKey` string for convenience so returning
 *    buyers are automatically re-verified against Gumroad on page load (`reverifyStoredLicenses()`).
 *  - Hand-written `localStorage` records (legacy v1/v2 proof hashes, public digests, or fake keys)
 *    NEVER satisfy `isUnlocked()` and are purged when Gumroad rejects them.
 *  - Refunded, disputed, or chargebacked Gumroad purchases are rejected and revoked on reload.
 */
(function (root) {
  'use strict';

  var CACHE_PREFIX = 'craftleaf_gumroad_key_v3_';
  var LEGACY_PREFIXES = ['craftleaf_license_', 'craftleaf_license_v2_'];
  var UTM_SESSION_KEY = 'craftleaf_utm_v1';
  var GUMROAD_VERIFY_URL = 'https://api.gumroad.com/v2/licenses/verify';

  // Strictly private in-memory verification map — never exported, never serialized as proof.
  var verifiedSessionSlots = Object.create(null);
  var bootReverifyPromise = null;

  function getConfig() {
    return root.CRAFTLEAF_MONETIZATION || {
      brand: {},
      tips: {},
      products: {},
      affiliates: { amazonAssociateTag: '', items: [] },
      referrals: {},
      analytics: {}
    };
  }

  function encodeFormBody(fields) {
    var pairs = [];
    var keys = Object.keys(fields);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      pairs.push(encodeURIComponent(k) + '=' + encodeURIComponent(String(fields[k])));
    }
    return pairs.join('&');
  }

  function emitLicenseUpdated(slot, unlocked) {
    if (typeof root !== 'undefined' && typeof root.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
      try {
        root.dispatchEvent(new CustomEvent('craftleaf:license-updated', {
          detail: { slot: slot, unlocked: Boolean(unlocked) }
        }));
      } catch (_e) {}
    }
  }

  function purgeLegacyStorage() {
    if (typeof localStorage === 'undefined' || !localStorage) return;
    try {
      var knownSlots = ['allAccessPass', 'idPhotoPro', 'invoicePro', 'cardsheetPro', 'cleanPrintPro', 'pasteShieldPro'];
      for (var i = 0; i < LEGACY_PREFIXES.length; i++) {
        for (var j = 0; j < knownSlots.length; j++) {
          localStorage.removeItem(LEGACY_PREFIXES[i] + knownSlots[j]);
        }
      }
    } catch (_e) {}
  }

  function writeCachedLicenseKey(slot, permalink, trimmedKey) {
    if (typeof localStorage === 'undefined' || !localStorage) return;
    try {
      localStorage.setItem(CACHE_PREFIX + slot, JSON.stringify({
        slot: slot,
        permalink: permalink,
        licenseKey: trimmedKey
      }));
    } catch (_e) {}
  }

  function removeCachedLicenseKey(slot) {
    if (typeof localStorage === 'undefined' || !localStorage) return;
    try {
      localStorage.removeItem(CACHE_PREFIX + slot);
    } catch (_e) {}
  }

  async function verifyGumroadEndpoint(permalink, trimmedKey) {
    var resp = await fetch(GUMROAD_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeFormBody({
        product_permalink: permalink,
        license_key: trimmedKey,
        increment_uses_count: 'false'
      })
    });
    var data = await resp.json();
    if (data && data.success === true) {
      var p = data.purchase || null;
      if (p && (p.refunded || p.chargebacked || p.disputed)) {
        return { valid: false, reason: 'refunded' };
      }
      if (p && p.permalink && String(p.permalink) !== String(permalink)) {
        return { valid: false, reason: 'invalid' };
      }
      return { valid: true };
    }
    return { valid: false, reason: 'invalid' };
  }

  async function verifyLicense(productId, rawKey, options) {
    options = options || {};
    var trimmed = String(rawKey || '').trim();
    if (!trimmed) return { valid: false, reason: 'empty' };
    if (trimmed.length < 8) return { valid: false, reason: 'invalid' };
    if (typeof fetch !== 'function') return { valid: false, reason: 'network_error' };

    var cfg = getConfig();
    var prod = (cfg.products && cfg.products[productId]) || {};
    var permalink = options.gumroadPermalink || prod.gumroadPermalink;
    var allAccessPermalink = (cfg.products && cfg.products.allAccessPass && cfg.products.allAccessPass.gumroadPermalink) || 'craftleaf-all-access';
    if (!permalink) return { valid: false, reason: 'invalid' };

    try {
      var primary = await verifyGumroadEndpoint(permalink, trimmed);
      if (primary.reason === 'refunded') {
        verifiedSessionSlots[productId] = false;
        removeCachedLicenseKey(productId);
        emitLicenseUpdated(productId, false);
        return { valid: false, reason: 'refunded' };
      }
      if (primary.valid) {
        verifiedSessionSlots[productId] = true;
        writeCachedLicenseKey(productId, permalink, trimmed);
        emitLicenseUpdated(productId, true);
        return { valid: true, mode: 'gumroad', slot: productId };
      }

      if (permalink !== allAccessPermalink) {
        var fallbackAll = await verifyGumroadEndpoint(allAccessPermalink, trimmed);
        if (fallbackAll.reason === 'refunded') {
          verifiedSessionSlots.allAccessPass = false;
          removeCachedLicenseKey('allAccessPass');
          emitLicenseUpdated('allAccessPass', false);
          return { valid: false, reason: 'refunded' };
        }
        if (fallbackAll.valid) {
          verifiedSessionSlots.allAccessPass = true;
          writeCachedLicenseKey('allAccessPass', allAccessPermalink, trimmed);
          emitLicenseUpdated('allAccessPass', true);
          return { valid: true, mode: 'gumroad', slot: 'allAccessPass' };
        }
      }
      return { valid: false, reason: 'invalid' };
    } catch (_err) {
      return { valid: false, reason: 'network_error' };
    }
  }

  async function reverifyStoredLicenses() {
    purgeLegacyStorage();
    if (typeof localStorage === 'undefined' || !localStorage || typeof fetch !== 'function') {
      return { checked: 0, unlocked: 0 };
    }
    var cfg = getConfig();
    var products = cfg.products || {};
    var slots = ['allAccessPass', 'idPhotoPro', 'invoicePro', 'cardsheetPro', 'cleanPrintPro', 'pasteShieldPro'];
    var checked = 0;
    var unlockedCount = 0;

    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      var raw = null;
      try { raw = localStorage.getItem(CACHE_PREFIX + slot); } catch (_e) { raw = null; }
      if (!raw) continue;

      var parsed = null;
      try { parsed = JSON.parse(raw); } catch (_e2) { parsed = null; }
      if (!parsed || typeof parsed !== 'object' || typeof parsed.licenseKey !== 'string' || parsed.licenseKey.trim().length < 8) {
        verifiedSessionSlots[slot] = false;
        removeCachedLicenseKey(slot);
        continue;
      }

      var prod = products[slot] || {};
      var expectedPermalink = prod.gumroadPermalink;
      if (!expectedPermalink) {
        verifiedSessionSlots[slot] = false;
        removeCachedLicenseKey(slot);
        continue;
      }

      checked++;
      try {
        var res = await verifyGumroadEndpoint(expectedPermalink, parsed.licenseKey.trim());
        if (res.valid) {
          verifiedSessionSlots[slot] = true;
          unlockedCount++;
          emitLicenseUpdated(slot, true);
        } else {
          verifiedSessionSlots[slot] = false;
          removeCachedLicenseKey(slot);
          emitLicenseUpdated(slot, false);
        }
      } catch (_netErr) {
        // Offline: keep cached key for next online boot, but NEVER unlock without live verification.
        verifiedSessionSlots[slot] = false;
      }
    }
    return { checked: checked, unlocked: unlockedCount };
  }

  function isUnlocked(productId) {
    if (!productId) return false;
    return Boolean(verifiedSessionSlots[productId] || verifiedSessionSlots.allAccessPass);
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
    if (de && de.classList && de.classList.contains('zh')) return 'zh';
    if (document.body) {
      if (document.body.classList && document.body.classList.contains('lang-zh')) return 'zh';
      if (document.body.getAttribute && document.body.getAttribute('data-lang') === 'zh') return 'zh';
    }
    var hl = (de && de.getAttribute ? (de.getAttribute('lang') || '') : ((de && de.lang) || '')).toLowerCase();
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

  function parseQueryMap(qStr) {
    var out = Object.create(null);
    var clean = String(qStr || '').replace(/^\?/, '');
    if (!clean) return out;
    var parts = clean.split('&');
    for (var i = 0; i < parts.length; i++) {
      if (!parts[i]) continue;
      var eq = parts[i].indexOf('=');
      var k = eq === -1 ? parts[i] : parts[i].slice(0, eq);
      var v = eq === -1 ? '' : parts[i].slice(eq + 1);
      try {
        out[decodeURIComponent(k.replace(/\+/g, ' '))] = decodeURIComponent(v.replace(/\+/g, ' '));
      } catch (_e) {}
    }
    return out;
  }

  function captureIncomingUtm() {
    if (typeof location === 'undefined' || !location.search || typeof sessionStorage === 'undefined' || !sessionStorage) return;
    try {
      var sp = parseQueryMap(location.search);
      var src = sp.utm_source;
      if (!src) return;
      var saved = {
        utm_source: String(src).slice(0, 48),
        utm_medium: String(sp.utm_medium || 'social').slice(0, 32),
        utm_campaign: String(sp.utm_campaign || 'organic').slice(0, 64)
      };
      sessionStorage.setItem(UTM_SESSION_KEY, JSON.stringify(saved));
    } catch (_e) {}
  }

  function decorateGumroadUrl(href) {
    if (!href || String(href).indexOf('gumroad.com') === -1) return href;
    try {
      var raw = String(href);
      var hashIdx = raw.indexOf('#');
      var hashPart = hashIdx === -1 ? '' : raw.slice(hashIdx);
      var beforeHash = hashIdx === -1 ? raw : raw.slice(0, hashIdx);
      var qIdx = beforeHash.indexOf('?');
      var basePart = qIdx === -1 ? beforeHash : beforeHash.slice(0, qIdx);
      var qPart = qIdx === -1 ? '' : beforeHash.slice(qIdx + 1);
      var params = parseQueryMap(qPart);

      var stored = null;
      if (typeof sessionStorage !== 'undefined' && sessionStorage) {
        try { stored = JSON.parse(sessionStorage.getItem(UTM_SESSION_KEY) || 'null'); } catch (_e) {}
      }
      if (!params.utm_source) params.utm_source = (stored && stored.utm_source) || 'craftleaf-portal';
      if (!params.utm_medium) params.utm_medium = (stored && stored.utm_medium) || 'web';
      if (stored && stored.utm_campaign && !params.utm_campaign) params.utm_campaign = stored.utm_campaign;
      if (!params.utm_content) params.utm_content = currentPageSlug();

      var pairs = [];
      var keys = Object.keys(params);
      for (var i = 0; i < keys.length; i++) {
        pairs.push(encodeURIComponent(keys[i]) + '=' + encodeURIComponent(String(params[keys[i]])));
      }
      return basePart + (pairs.length ? '?' + pairs.join('&') : '') + hashPart;
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

    var resolvedProUrl = isZh ? String(opts.proUrlZh || '').trim() : String(opts.proUrl || '').trim();
    if (!resolvedProUrl && isZh && opts.proUrl && String(opts.proUrl).toLowerCase().indexOf('gumroad.com') === -1) {
      resolvedProUrl = String(opts.proUrl).trim();
    }

    var bodyEl = document.createElement('div');
    bodyEl.style.cssText = 'font-size:12.8px;color:#cbd5e1;line-height:1.45;margin-bottom:12px;';
    bodyEl.textContent = isZh
      ? (resolvedProUrl ? (opts.bodyZh || '如果这个免费工具帮您省下了开销或时间，欢迎请作者喝杯咖啡或解锁终身 Pro 版！') : '100% 纯浏览器本地完成，0 字节上传云端。如果帮您省下了开销或时间，欢迎微信扫码请作者喝杯咖啡！')
      : (opts.bodyEn || 'Saved time or money today? Support ongoing ad-free maintenance or unlock Lifetime Pro!');
    toast.appendChild(bodyEl);

    var row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;';

    var tipB = document.createElement('button');
    tipB.type = 'button';
    tipB.style.cssText = 'flex:1;padding:8px 10px;border-radius:9px;border:none;background:#10b981;color:#042f1e;font-weight:800;font-size:12.5px;cursor:pointer;';
    tipB.textContent = isZh ? '☕ 微信赞赏支持' : '☕ Buy a Coffee';
    tipB.onclick = function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
      openTipModal(lang);
    };
    row.appendChild(tipB);

    if (resolvedProUrl) {
      var proA = document.createElement('a');
      proA.href = decorateGumroadUrl(resolvedProUrl);
      proA.target = '_blank';
      proA.rel = 'noopener';
      proA.style.cssText = 'flex:1;text-align:center;padding:8px 10px;border-radius:9px;background:#f59e0b;color:#111827;font-weight:800;font-size:12.5px;text-decoration:none;';
      proA.textContent = isZh ? (opts.proLabelZh || '✨ 解锁 Pro') : (opts.proLabelEn || '✨ Unlock Pro');
      row.appendChild(proA);
    }

    toast.appendChild(row);
    document.body.appendChild(toast);
  }

  function isExtensionRuntime() {
    if (typeof location !== 'undefined' && location && typeof location.protocol === 'string') {
      if (location.protocol !== 'https:' && location.protocol !== 'http:') return true;
    }
    if (typeof chrome !== 'undefined' && chrome && chrome.runtime && chrome.runtime.id) return true;
    if (typeof browser !== 'undefined' && browser && browser.runtime && browser.runtime.id) return true;
    return false;
  }

  function resolveGoatCounterEndpoint() {
    if (typeof Image === 'undefined' || typeof location === 'undefined' || isExtensionRuntime()) return '';
    var cfg = getConfig();
    var gc = cfg.analytics && cfg.analytics.goatcounterEndpoint ? String(cfg.analytics.goatcounterEndpoint).trim() : '';
    if (!gc || !/^https:\/\//i.test(gc)) return '';
    var endpoint = gc.replace(/\/+$/, '');
    if (endpoint.slice(-6) !== '/count') endpoint += '/count';
    return endpoint;
  }

  function trackEvent(eventCode, title) {
    var endpoint = resolveGoatCounterEndpoint();
    if (!endpoint || !eventCode) return;
    try {
      var safeCode = String(eventCode).replace(/[^a-zA-Z0-9/_-]+/g, '-').slice(0, 80);
      var q = '?p=' + encodeURIComponent('buy-click/' + safeCode) +
        '&e=true' +
        '&t=' + encodeURIComponent(String(title || safeCode).slice(0, 120)) +
        '&rnd=' + String(Date.now());
      var beacon = new Image(1, 1);
      beacon.decoding = 'async';
      beacon.src = endpoint + q;
    } catch (_e) {}
  }

  function initOptionalAnalytics() {
    var endpoint = resolveGoatCounterEndpoint();
    if (!endpoint) return;
    try {
      // Zero PII: send pathname only — never send query strings, hashes, keys, emails, or photos (#42)
      var q = '?p=' + encodeURIComponent(location.pathname || '/') +
        '&t=' + encodeURIComponent((typeof document !== 'undefined' && document.title) || '') +
        '&rnd=' + String(Date.now());
      var beacon = new Image(1, 1);
      beacon.decoding = 'async';
      beacon.src = endpoint + q;
    } catch (_e) {}
  }

  // Purge any legacy v1/v2 records immediately & trigger background Gumroad re-verification
  purgeLegacyStorage();
  if (typeof document !== 'undefined' && document.addEventListener) {
    captureIncomingUtm();
    bootReverifyPromise = reverifyStoredLicenses();
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
      var buyEl = ev.target && ev.target.closest ? ev.target.closest('[data-buy-event], a[href*="gumroad.com"], a[href*="mbd.pub"], a[href*="afdian.com"]') : null;
      if (buyEl) {
        var evtId = buyEl.getAttribute('data-buy-event') ||
          ((detectActiveLang() === 'zh' ? 'zh-' : 'en-') + ((location && location.pathname) || '/').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, ''));
        trackEvent(evtId, (buyEl.textContent || '').trim());
      }
      var gumA = ev.target && ev.target.closest ? ev.target.closest('a[href*="gumroad.com"]') : null;
      if (gumA && gumA.href) {
        gumA.href = decorateGumroadUrl(gumA.href);
      }
    });
  }

  // Note: legacy offline key helpers, sha256Hex, and saveUnlocked are intentionally NOT exported (#4, #22).
  root.CraftLeafSDK = {
    verifyLicense: verifyLicense,
    reverifyStoredLicenses: reverifyStoredLicenses,
    getBootVerification: function () { return bootReverifyPromise; },
    isUnlocked: isUnlocked,
    getConfig: getConfig,
    renderAffiliateBar: renderAffiliateBar,
    openTipModal: openTipModal,
    showValueMomentPrompt: showValueMomentPrompt,
    decorateGumroadUrl: decorateGumroadUrl,
    trackEvent: trackEvent
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.CraftLeafSDK;
  }
})(typeof window !== 'undefined' ? window : globalThis);
