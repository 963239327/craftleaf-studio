/**
 * CleanPrint & AI-Chat to PDF Studio — Public Product Page Interactive Controller
 * Connects interactive Before/After slider, live theme switcher, and CraftLeafSDK Pro license verifier.
 */
(function (root) {
  'use strict';

  var pageState = {
    lang: 'en',
    splitPct: 46,
    lowInk: true,
    theme: 'standard'
  };

  function applySplit(pct) {
    var clamped = Math.max(5, Math.min(95, Number(pct) || 46));
    pageState.splitPct = clamped;
    var beforeLayer = document.getElementById('layerBefore');
    var divider = document.getElementById('splitDivider');
    var range = document.getElementById('rngCompareSplit');
    if (beforeLayer) {
      beforeLayer.style.clipPath = 'inset(0 ' + (100 - clamped) + '% 0 0)';
    }
    if (divider) {
      divider.style.left = clamped + '%';
    }
    if (range && Number(range.value) !== clamped) {
      range.value = String(clamped);
    }
  }

  function syncPreviewTheme() {
    var afterLayer = document.getElementById('layerAfter');
    if (!afterLayer) return;
    var classes = ['compare-layer', 'layer-after'];
    if (pageState.lowInk) classes.push('low-ink');
    if (pageState.theme === 'serif') classes.push('theme-serif');
    if (pageState.theme === 'swiss') classes.push('theme-swiss');
    if (pageState.theme === 'twocol') classes.push('theme-twocol');
    afterLayer.className = classes.join(' ');

    Array.prototype.forEach.call(document.querySelectorAll('[data-theme-btn]'), function (btn) {
      var val = btn.getAttribute('data-theme-btn');
      if (val === pageState.theme) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    var lowInkBtn = document.getElementById('btnToggleLowInk');
    if (lowInkBtn) {
      if (pageState.lowInk) lowInkBtn.classList.add('active');
      else lowInkBtn.classList.remove('active');
    }
  }

  function applyLanguage(lang) {
    pageState.lang = lang === 'zh' ? 'zh' : 'en';
    document.body.setAttribute('data-lang', pageState.lang);
    var switchBtn = document.getElementById('btnSwitchLang');
    if (switchBtn) {
      switchBtn.textContent = pageState.lang === 'en' ? '中文 / EN' : 'English / 中文';
    }

    var cfg = (root.CraftLeafSDK && root.CraftLeafSDK.getConfig && root.CraftLeafSDK.getConfig()) || {};
    var proMeta = (cfg.products && cfg.products.cleanPrintPro) || {};
    var bundleMeta = (cfg.products && cfg.products.allAccessPass) || {};

    var proPriceEl = document.getElementById('lblProPrice');
    if (proPriceEl) {
      proPriceEl.textContent = pageState.lang === 'zh'
        ? (proMeta.priceCny || '¥19.9') + ' (约 ' + (proMeta.priceUsd || '$5.99') + ')'
        : (proMeta.priceUsd || '$5.99');
    }

    var buyProBtn = document.getElementById('btnCheckoutPro');
    if (buyProBtn) {
      buyProBtn.href = (pageState.lang === 'zh' ? proMeta.checkoutUrlZh : proMeta.checkoutUrlEn) || '#pro-verifier';
    }

    var buyAllBtn = document.getElementById('btnCheckoutAllAccess');
    if (buyAllBtn) {
      buyAllBtn.href = (pageState.lang === 'zh' ? bundleMeta.checkoutUrlZh : bundleMeta.checkoutUrlEn) || '../../index.html#all-access';
    }

    var affContainer = document.getElementById('affiliateSuppliesMount');
    if (affContainer && root.CraftLeafSDK && root.CraftLeafSDK.renderAffiliateBar) {
      root.CraftLeafSDK.renderAffiliateBar(affContainer, 'print-craft', pageState.lang);
    }
  }

  function initLanding() {
    var initialLang = 'en';
    try {
      var saved = localStorage.getItem('cleanprint_web_lang');
      if (saved === 'zh' || saved === 'en') initialLang = saved;
      else if (typeof navigator !== 'undefined' && /^zh/i.test(navigator.language || '')) initialLang = 'zh';
    } catch (_e) {}

    applyLanguage(initialLang);
    applySplit(46);
    syncPreviewTheme();

    var switchBtn = document.getElementById('btnSwitchLang');
    if (switchBtn) {
      switchBtn.addEventListener('click', function () {
        var next = pageState.lang === 'en' ? 'zh' : 'en';
        try { localStorage.setItem('cleanprint_web_lang', next); } catch (_e) {}
        applyLanguage(next);
      });
    }

    var splitInput = document.getElementById('rngCompareSplit');
    if (splitInput) {
      splitInput.addEventListener('input', function (ev) {
        applySplit(ev.target.value);
      });
    }

    var stage = document.getElementById('compareStage');
    if (stage) {
      var dragging = false;
      stage.addEventListener('pointerdown', function (ev) {
        dragging = true;
        var rect = stage.getBoundingClientRect();
        applySplit(((ev.clientX - rect.left) / Math.max(1, rect.width)) * 100);
      });
      root.addEventListener('pointermove', function (ev) {
        if (!dragging) return;
        var rect = stage.getBoundingClientRect();
        applySplit(((ev.clientX - rect.left) / Math.max(1, rect.width)) * 100);
      });
      root.addEventListener('pointerup', function () {
        dragging = false;
      });
    }

    var lowInkBtn = document.getElementById('btnToggleLowInk');
    if (lowInkBtn) {
      lowInkBtn.addEventListener('click', function () {
        pageState.lowInk = !pageState.lowInk;
        syncPreviewTheme();
      });
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-theme-btn]'), function (btn) {
      btn.addEventListener('click', function () {
        pageState.theme = btn.getAttribute('data-theme-btn') || 'standard';
        syncPreviewTheme();
      });
    });

    var verifyBtn = document.getElementById('btnWebVerifyKey');
    if (verifyBtn) {
      verifyBtn.addEventListener('click', function () {
        var input = document.getElementById('inpWebLicenseKey');
        var out = document.getElementById('webVerifyResult');
        var raw = (input && input.value ? input.value : '').trim();
        if (!raw || !root.CraftLeafSDK) {
          out.textContent = pageState.lang === 'zh'
            ? '请粘贴 Gumroad 订单回执上的专属 License Key。'
            : 'Please paste the Gumroad License Key from your CleanPrint Pro or All-Access receipt.';
          out.className = 'verify-result err';
          return;
        }
        root.CraftLeafSDK.verifyLicense('cleanPrintPro', raw).then(function (res) {
          if (res && res.valid) {
            out.textContent = pageState.lang === 'zh'
              ? '✓ Gumroad 激活密钥验证通过！请在浏览器插件弹窗或设置页中粘贴使用。'
              : '✓ Verified Gumroad Pro License! Paste this key inside the CleanPrint extension popup to unlock Pro.';
            out.className = 'verify-result ok';
          } else {
            out.textContent = pageState.lang === 'zh'
              ? (res && res.reason === 'network_error' ? '✕ 网络连接不可用，请联网后验证 Gumroad 密钥。' : '✕ Gumroad 密钥验证未通过或已退款，请检查 XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX。')
              : (res && res.reason === 'network_error' ? '✕ Network offline — connect to verify your Gumroad License Key.' : '✕ Invalid or refunded Gumroad License Key (expected XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX).');
            out.className = 'verify-result err';
          }
        });
      });
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initLanding);
    } else {
      initLanding();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
