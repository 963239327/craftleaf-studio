/**
 * CraftLeaf Universal Zero-Backend Monetization & License SDK
 * Works in Static Sites (GitHub Pages), Browser Extensions (MV3), and Offline HTML Apps.
 * Supports:
 *  1. Offline cryptographic checksum license keys (<PREFIX>-XXXX-XXXX-XXXXXX or STUDIOALL-...)
 *  2. Direct Gumroad License Verification API (CORS-enabled, zero server needed)
 *  3. Affiliate supply recommendations & Tip Jar UI widgets
 */
(function (root) {
  'use strict';

  var SALT = 'StudioCraft-2026-v1';
  var STORAGE_PREFIX = 'craftleaf_license_';

  function fnv1aHex6(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return ('00000000' + h.toString(16).toUpperCase()).slice(-8).slice(0, 6);
  }

  function normalizeKey(raw) {
    return String(raw || '').trim().toUpperCase().replace(/\s+/g, '');
  }

  /**
   * Verify an offline license key of shape <PREFIX>-<A4>-<B4>-<HEX6>
   * Accepts either the product's specific prefix (e.g. "IDPRO") or universal "STUDIOALL".
   */
  function verifyOfflineKey(rawKey, allowedPrefixes) {
    var key = normalizeKey(rawKey);
    var parts = key.split('-');
    if (parts.length !== 4) return { valid: false, reason: 'format' };
    var prefix = parts[0];
    var p1 = parts[1];
    var p2 = parts[2];
    var sig = parts[3];
    var validPrefixes = (allowedPrefixes || []).concat(['STUDIOALL']);
    if (validPrefixes.indexOf(prefix) === -1) {
      return { valid: false, reason: 'prefix' };
    }
    if (!/^[A-Z2-9]{4}$/.test(p1) || !/^[A-Z2-9]{4}$/.test(p2) || !/^[0-9A-F]{6}$/.test(sig)) {
      return { valid: false, reason: 'charset' };
    }
    var expected = fnv1aHex6(prefix + '-' + p1 + '-' + p2 + '::' + SALT);
    if (sig !== expected) {
      return { valid: false, reason: 'checksum' };
    }
    return { valid: true, mode: 'offline', prefix: prefix, key: key };
  }

  /**
   * Verify via Offline Checksum FIRST; if not matching offline format and gumroadPermalink is provided,
   * verify directly against Gumroad's public license endpoint.
   */
  async function verifyLicense(productId, rawKey, options) {
    options = options || {};
    var cfg = (root.CRAFTLEAF_MONETIZATION && root.CRAFTLEAF_MONETIZATION.products && root.CRAFTLEAF_MONETIZATION.products[productId]) || {};
    var prefix = options.keyPrefix || cfg.keyPrefix || 'PRO';
    var offline = verifyOfflineKey(rawKey, [prefix]);
    if (offline.valid) {
      saveUnlocked(productId, offline.key);
      return offline;
    }
    var permalink = options.gumroadPermalink || cfg.gumroadPermalink;
    if (permalink && rawKey && String(rawKey).trim().length >= 8 && typeof fetch === 'function') {
      try {
        var body = new URLSearchParams();
        body.set('product_permalink', permalink);
        body.set('license_key', String(rawKey).trim());
        var resp = await fetch('https://api.gumroad.com/v2/licenses/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString()
        });
        var data = await resp.json();
        if (data && data.success && (!data.purchase || !data.purchase.refunded)) {
          saveUnlocked(productId, String(rawKey).trim());
          return { valid: true, mode: 'gumroad', key: String(rawKey).trim() };
        }
      } catch (_err) {
        // Ignore network errors and report invalid key
      }
    }
    return { valid: false, reason: offline.reason || 'invalid' };
  }

  function saveUnlocked(productId, key) {
    try {
      localStorage.setItem(STORAGE_PREFIX + productId, JSON.stringify({
        key: key,
        unlockedAt: new Date().toISOString()
      }));
    } catch (_e) {}
  }

  function isUnlocked(productId, keyPrefix) {
    try {
      var raw = localStorage.getItem(STORAGE_PREFIX + productId) || localStorage.getItem(STORAGE_PREFIX + 'allAccessPass');
      if (!raw) return false;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.key) return false;
      var cfg = (root.CRAFTLEAF_MONETIZATION && root.CRAFTLEAF_MONETIZATION.products && root.CRAFTLEAF_MONETIZATION.products[productId]) || {};
      var pfx = keyPrefix || cfg.keyPrefix || 'PRO';
      var check = verifyOfflineKey(parsed.key, [pfx]);
      return check.valid || parsed.key.length >= 12;
    } catch (_e) {
      return false;
    }
  }

  function getConfig() {
    return root.CRAFTLEAF_MONETIZATION || { brand: {}, tips: {}, products: {}, affiliates: { items: [] } };
  }

  function renderAffiliateBar(containerEl, category, lang) {
    if (!containerEl) return;
    var cfg = getConfig();
    var items = ((cfg.affiliates && cfg.affiliates.items) || []).filter(function (it) {
      return !category || it.category === category;
    });
    if (!items.length) return;
    var isZh = lang === 'zh';
    var html = '<div style="border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;background:#f8fafc;margin-top:16px;font-size:13px;">' +
      '<div style="font-weight:600;color:#0f172a;margin-bottom:8px;">' +
      (isZh ? '🖨️ 推荐打印耗材与工具（省钱实测清单）' : '🖨️ Recommended Print Supplies & Paper (Save vs. Copy Shops)') +
      '</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;">';
    items.forEach(function (it) {
      html += '<a href="' + it.url + '" target="_blank" rel="noopener sponsored" ' +
        'style="display:block;padding:8px 10px;background:#ffffff;border:1px solid #cbd5e1;border-radius:8px;color:#1e293b;text-decoration:none;line-height:1.4;">' +
        '<span>' + (isZh ? it.titleZh : it.titleEn) + '</span> <span style="color:#2563eb;font-weight:600;">→</span></a>';
    });
    html += '</div></div>';
    containerEl.innerHTML = html;
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

  function openTipModal(forcedLang) {
    if (typeof document === 'undefined') return;
    var lang = forcedLang || detectActiveLang();
    var isZh = lang === 'zh';
    var cfg = getConfig();
    var tips = cfg.tips || {};
    var coffeeUrl = tips.buyMeACoffeeUrl || tips.stripeTipUrl || 'https://stardustdemo.gumroad.com/l/coffee';
    var qrUrl = resolvePortalBase() + (tips.wechatQrPath || 'assets/wechat-reward-qr.png');

    var existing = document.getElementById('craftleafTipModal');
    if (existing) existing.parentNode.removeChild(existing);

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
      // Chinese visitors: WeChat Reward QR primary + Overseas USD Apple Pay / Card secondary
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
      // English / Western visitors: Apple Pay & Credit Card USD Coffee primary (no confusing WeChat prompt upfront!)
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

  // Auto-bind all tip buttons across the entire portal!
  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('click', function (ev) {
      var t = ev.target && ev.target.closest ? ev.target.closest('#tipLink, #tipLinkZh, #studioTipLink, [data-craftleaf-tip]') : null;
      if (!t) return;
      ev.preventDefault();
      var forced = t.id === 'tipLinkZh' ? 'zh' : (t.id === 'tipLink' ? 'en' : undefined);
      openTipModal(forced);
    });
  }

  root.CraftLeafSDK = {
    fnv1aHex6: fnv1aHex6,
    verifyOfflineKey: verifyOfflineKey,
    verifyLicense: verifyLicense,
    isUnlocked: isUnlocked,
    saveUnlocked: saveUnlocked,
    getConfig: getConfig,
    renderAffiliateBar: renderAffiliateBar,
    openTipModal: openTipModal
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.CraftLeafSDK;
  }
})(typeof window !== 'undefined' ? window : globalThis);
