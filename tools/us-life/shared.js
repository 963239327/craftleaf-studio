/**
 * CraftLeaf US-Life Bilingual Micro-Tools Shared Runtime
 * - Instant Simplified Chinese (default) <-> English toggle
 * - Dynamic window.CRAFTLEAF_MONETIZATION product link resolver with Gumroad storefront fallbacks
 * - Shareable URL query sync & toast clipboard helpers
 */
(function (root) {
  'use strict';

  var STORAGE_LANG_KEY = 'craftleaf_uslife_lang';
  var STOREFRONT_ROOT = 'https://stardustdemo.gumroad.com';

  var PRODUCT_FALLBACKS = {
    citizenshipPrep: 'https://stardustdemo.gumroad.com/l/us-citizenship-test-2025-chinese-prep',
    aiPromptPack: 'https://stardustdemo.gumroad.com/l/ai-prompt-pack-bilingual',
    idPhotoPro: 'https://stardustdemo.gumroad.com/l/idphoto-pro',
    freelancerOsKit: 'https://stardustdemo.gumroad.com/l/solofounder-finance-os-pro',
    soloStarterKit: 'https://stardustdemo.gumroad.com/l/solofounder-starter-kit',
    allAccessPass: 'https://stardustdemo.gumroad.com/l/craftleaf-all-access',
    blackFridayGuide: 'https://stardustdemo.gumroad.com/l/black-friday-2026-chinese-guide',
    taxPrepGuide: 'https://stardustdemo.gumroad.com/l/us-first-year-tax-prep-chinese-organizer',
    creditStarterGuide: 'https://stardustdemo.gumroad.com/l/us-credit-from-zero-chinese-guide',
    waDriverGuide: 'https://stardustdemo.gumroad.com/l/wa-driver-license-chinese-study-roadtest-pack',
    healthcareKit: 'https://stardustdemo.gumroad.com/l/us-healthcare-doctor-visit-bilingual-kit',
    leaseGuide: 'https://stardustdemo.gumroad.com/l/us-apartment-lease-12-clauses-chinese-guide',
    settlingCarGuide: 'https://stardustdemo.gumroad.com/l/us-settling-in-and-first-car-chinese-playbook',
    newcomerMasterBundle: 'https://stardustdemo.gumroad.com/l/us-newcomer-first-year-7in1-bundle',
    storefront: STOREFRONT_ROOT
  };

  var currentLang = 'zh';
  var listeners = [];

  function detectInitialLang() {
    try {
      var params = new URLSearchParams(root.location.search);
      var qLang = (params.get('lang') || '').toLowerCase();
      if (qLang === 'en' || qLang === 'zh') return qLang;
      var saved = localStorage.getItem(STORAGE_LANG_KEY);
      if (saved === 'en' || saved === 'zh') return saved;
    } catch (_e) {}
    return 'zh';
  }

  function resolveProductUrl(productKey, lang) {
    var cfg = root.CRAFTLEAF_MONETIZATION || {};
    var prod = (cfg.products && cfg.products[productKey]) || null;
    if (prod) {
      if (lang === 'en') {
        return prod.checkoutUrlEn || prod.fullPackUrlEn || prod.gumroadUrl || prod.checkoutUrlZh || PRODUCT_FALLBACKS[productKey] || STOREFRONT_ROOT;
      }
      return prod.checkoutUrlZh || prod.fullPackUrlZh || prod.gumroadUrl || prod.checkoutUrlEn || PRODUCT_FALLBACKS[productKey] || STOREFRONT_ROOT;
    }
    return PRODUCT_FALLBACKS[productKey] || STOREFRONT_ROOT;
  }

  function hydrateMonetizationLinks(lang) {
    var nodes = document.querySelectorAll('[data-product-key]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute('data-product-key');
      el.setAttribute('href', resolveProductUrl(key, lang));
    }
    var sfNodes = document.querySelectorAll('[data-storefront-link]');
    var tipsUrl = (root.CRAFTLEAF_MONETIZATION && root.CRAFTLEAF_MONETIZATION.tips && root.CRAFTLEAF_MONETIZATION.tips.kofiUrl) || STOREFRONT_ROOT;
    for (var j = 0; j < sfNodes.length; j++) {
      sfNodes[j].setAttribute('href', tipsUrl || STOREFRONT_ROOT);
    }
  }

  function applyDomTranslations(lang) {
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
    var nodes = document.querySelectorAll('[data-zh]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var val = lang === 'zh' ? el.getAttribute('data-zh') : (el.getAttribute('data-en') || el.getAttribute('data-zh'));
      if (val !== null) {
        if (el.getAttribute('data-html') === 'true') {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    }
    var phNodes = document.querySelectorAll('[data-ph-zh]');
    for (var k = 0; k < phNodes.length; k++) {
      var inp = phNodes[k];
      inp.setAttribute('placeholder', lang === 'zh' ? inp.getAttribute('data-ph-zh') : (inp.getAttribute('data-ph-en') || inp.getAttribute('data-ph-zh')));
    }
    var toggleBtn = document.getElementById('langToggleBtn');
    if (toggleBtn) {
      toggleBtn.textContent = lang === 'zh' ? '🌐 EN / 中文' : '🌐 中文 / EN';
      toggleBtn.setAttribute('aria-label', lang === 'zh' ? 'Switch language to English' : '切换为简体中文');
    }
    hydrateMonetizationLinks(lang);
  }

  function setLang(lang) {
    currentLang = lang === 'en' ? 'en' : 'zh';
    try {
      localStorage.setItem(STORAGE_LANG_KEY, currentLang);
    } catch (_e) {}
    applyDomTranslations(currentLang);
    for (var i = 0; i < listeners.length; i++) {
      try {
        listeners[i](currentLang);
      } catch (_err) {}
    }
  }

  function getLang() {
    return currentLang;
  }

  function onLangChange(fn) {
    if (typeof fn === 'function') listeners.push(fn);
  }

  function initPage(onChangeCallback) {
    if (onChangeCallback) onLangChange(onChangeCallback);
    currentLang = detectInitialLang();
    var toggleBtn = document.getElementById('langToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        setLang(currentLang === 'zh' ? 'en' : 'zh');
      });
    }
    applyDomTranslations(currentLang);
    if (onChangeCallback) {
      onChangeCallback(currentLang);
    }
  }

  var toastTimer = null;
  function showToast(message) {
    var toast = document.getElementById('usLifeToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'usLifeToast';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2600);
  }

  function copyText(text, okMsgZh, okMsgEn) {
    var msg = currentLang === 'zh' ? (okMsgZh || '✅ 已复制到剪贴板') : (okMsgEn || '✅ Copied to clipboard');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast(msg);
      }).catch(function () {
        fallbackCopy(text, msg);
      });
    } else {
      fallbackCopy(text, msg);
    }
  }

  function fallbackCopy(text, msg) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(msg);
    } catch (_e) {}
    document.body.removeChild(ta);
  }

  function syncUrlParams(paramObj) {
    try {
      var url = new URL(root.location.href);
      Object.keys(paramObj).forEach(function (k) {
        var v = paramObj[k];
        if (v === null || v === undefined || v === '') {
          url.searchParams.delete(k);
        } else {
          url.searchParams.set(k, String(v));
        }
      });
      if (currentLang === 'en') {
        url.searchParams.set('lang', 'en');
      } else {
        url.searchParams.delete('lang');
      }
      root.history.replaceState({}, '', url.toString());
      return url.toString();
    } catch (_e) {
      return root.location.href;
    }
  }

  root.CraftLeafUSLife = {
    initPage: initPage,
    getLang: getLang,
    setLang: setLang,
    onLangChange: onLangChange,
    resolveProductUrl: resolveProductUrl,
    hydrateMonetizationLinks: hydrateMonetizationLinks,
    showToast: showToast,
    copyText: copyText,
    syncUrlParams: syncUrlParams,
    STOREFRONT_ROOT: STOREFRONT_ROOT
  };
})(typeof window !== 'undefined' ? window : globalThis);
