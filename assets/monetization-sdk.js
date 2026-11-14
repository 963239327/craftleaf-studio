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

  root.CraftLeafSDK = {
    fnv1aHex6: fnv1aHex6,
    verifyOfflineKey: verifyOfflineKey,
    verifyLicense: verifyLicense,
    isUnlocked: isUnlocked,
    saveUnlocked: saveUnlocked,
    getConfig: getConfig,
    renderAffiliateBar: renderAffiliateBar
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.CraftLeafSDK;
  }
})(typeof window !== 'undefined' ? window : globalThis);
