/**
 * CraftLeaf Passport & Visa ID Photo 4x6" Print Sheet Studio
 * 100% Client-Side HTML5 Canvas — Zero Server Uploads
 */
(function (root) {
  'use strict';

  var DPI = 300;

  var PRESETS = {
    us: {
      id: 'us',
      nameEn: 'US Passport / Visa (2×2 in / 51×51 mm)',
      nameZh: '美国护照 / 美签 B1/B2 (2×2英寸 / 51×51mm)',
      widthMm: 50.8,
      heightMm: 50.8,
      widthIn: '2 × 2 in',
      widthPx: 600,
      heightPx: 600,
      crownRange: [0.08, 0.16],
      eyeRange: [0.35, 0.44],
      chinRange: [0.68, 0.77],
      bgDefault: '#FFFFFF',
      noteEn: '2×2 in (600×600 px @ 300 DPI) · Head height 25–35 mm (50–69%) · Pure white background · No eyeglasses allowed.',
      noteZh: '2×2英寸 (600×600px @ 300DPI) · 头顶至下巴 25–35mm (50–69%) · 纯白背景 · 严禁佩戴眼镜。'
    },
    schengen: {
      id: 'schengen',
      nameEn: 'Schengen / EU Visa (35×45 mm)',
      nameZh: '申根 / 欧盟签证标准照 (35×45mm)',
      widthMm: 35,
      heightMm: 45,
      widthIn: '1.38 × 1.77 in',
      widthPx: 413,
      heightPx: 531,
      crownRange: [0.06, 0.12],
      eyeRange: [0.38, 0.46],
      chinRange: [0.77, 0.84],
      bgDefault: '#FFFFFF',
      noteEn: '35×45 mm (413×531 px @ 300 DPI) · ICAO 9303 crown-to-chin 32–36 mm (70–80%) · Neutral closed-mouth expression.',
      noteZh: '35×45毫米 (413×531px @ 300DPI) · 头顶至下巴 32–36mm (占画面70–80%) · 自然平视闭口表情。'
    },
    uk: {
      id: 'uk',
      nameEn: 'UK Passport / Visa (35×45 mm)',
      nameZh: '英国护照 / 英签标准照 (35×45mm)',
      widthMm: 35,
      heightMm: 45,
      widthIn: '1.38 × 1.77 in',
      widthPx: 413,
      heightPx: 531,
      crownRange: [0.07, 0.13],
      eyeRange: [0.38, 0.46],
      chinRange: [0.74, 0.82],
      bgDefault: '#F7F8FA',
      noteEn: '35×45 mm (413×531 px @ 300 DPI) · HMPO head height 29–34 mm · Light grey/cream or white plain background.',
      noteZh: '35×45毫米 (413×531px @ 300DPI) · 英国护照署要求头高 29–34mm · 浅灰白或纯白无阴影背景。'
    },
    canada: {
      id: 'canada',
      nameEn: 'Canada Passport / PR (50×70 mm)',
      nameZh: '加拿大护照 / 枫叶卡 (50×70mm)',
      widthMm: 50,
      heightMm: 70,
      widthIn: '1.97 × 2.76 in',
      widthPx: 591,
      heightPx: 827,
      crownRange: [0.12, 0.18],
      eyeRange: [0.35, 0.43],
      chinRange: [0.59, 0.66],
      bgDefault: '#FFFFFF',
      noteEn: '50×70 mm (591×827 px @ 300 DPI) · IRCC crown-to-chin 31–36 mm · Auto-rotated 2×2 on 4×6" sheet to fit 4 full prints!',
      noteZh: '50×70毫米 (591×827px @ 300DPI) · 面部高 31–36mm · 4×6相纸智能横排可拼 4 张完整大尺寸加签照！'
    },
    japan: {
      id: 'japan',
      nameEn: 'Japan Visa (45×45 mm)',
      nameZh: '日本旅游/商务签证正方形 (45×45mm)',
      widthMm: 45,
      heightMm: 45,
      widthIn: '1.77 × 1.77 in',
      widthPx: 531,
      heightPx: 531,
      crownRange: [0.08, 0.14],
      eyeRange: [0.38, 0.46],
      chinRange: [0.74, 0.82],
      bgDefault: '#FFFFFF',
      noteEn: '45×45 mm (531×531 px @ 300 DPI) · Official Japan MOFA square visa format · Crown-to-chin 30–34 mm · White background.',
      noteZh: '45×45毫米正方形 (531×531px @ 300DPI) · 日本外务省现行签证方形规格 · 头高30–34mm · 纯白背景。'
    },
    china: {
      id: 'china',
      nameEn: 'China Passport / Visa (33×48 mm)',
      nameZh: '中国护照 / 赴华签证小二寸 (33×48mm)',
      widthMm: 33,
      heightMm: 48,
      widthIn: '1.30 × 1.89 in',
      widthPx: 390,
      heightPx: 567,
      crownRange: [0.06, 0.11],
      eyeRange: [0.37, 0.45],
      chinRange: [0.69, 0.77],
      bgDefault: '#FFFFFF',
      noteEn: '33×48 mm (390×567 px @ 300 DPI) · COVA head height 28–33 mm, width 15–22 mm · Both ears & eyebrows visible.',
      noteZh: '33×48毫米小二寸 (390×567px @ 300DPI) · 头高 28–33mm，头宽 15–22mm · 需露出双耳与双眉，不戴首饰。'
    },
    opt: {
      id: 'opt',
      nameEn: 'USCIS OPT / EAD / H-1B (2×2 in / 51×51 mm)',
      nameZh: '美国 OPT / EAD 工卡 / I-765 (2×2英寸)',
      widthMm: 50.8,
      heightMm: 50.8,
      widthIn: '2 × 2 in',
      widthPx: 600,
      heightPx: 600,
      crownRange: [0.08, 0.16],
      eyeRange: [0.35, 0.44],
      chinRange: [0.68, 0.77],
      bgDefault: '#FFFFFF',
      noteEn: '2×2 in (600×600 px @ 300 DPI) · Passes USCIS I-765 online portal check + prints 6 photos on one $0.39 CVS/Walgreens 4×6 sheet.',
      noteZh: '2×2英寸 (600×600px @ 300DPI) · 同时满足 USCIS I-765 网申上传检测与 CVS/Walgreens $0.39 冲印6张。'
    },
    baby: {
      id: 'baby',
      nameEn: 'Infant / Baby Passport (2×2 in / Relaxed Guide)',
      nameZh: '婴幼儿 / 新生儿护照签证 (2×2英寸 · 俯拍友好)',
      widthMm: 50.8,
      heightMm: 50.8,
      widthIn: '2 × 2 in',
      widthPx: 600,
      heightPx: 600,
      crownRange: [0.09, 0.20],
      eyeRange: [0.33, 0.48],
      chinRange: [0.66, 0.78],
      bgDefault: '#FFFFFF',
      noteEn: '2×2 in (600×600 px) · Lay baby on plain white bedsheet & use White-Background Boost to remove sheet wrinkles cleanly.',
      noteZh: '2×2英寸 · 将宝宝平放在白色床单俯拍，拉高「背景去灰增白」滑块即可一键消除床单折痕阴影。'
    }
  };

  var SHEETS = {
    '4x6': {
      id: '4x6',
      nameEn: '4×6" Drugstore Sheet (1800×1200 px)',
      nameZh: '4×6寸药店冲印排版 (1800×1200 px)',
      widthPx: 1800,
      heightPx: 1200,
      cssPageSize: '6in 4in'
    },
    'a4': {
      id: 'a4',
      nameEn: 'A4 Home Print Sheet (2480×3508 px)',
      nameZh: 'A4 家用打印纸排版 (2480×3508 px)',
      widthPx: 2480,
      heightPx: 3508,
      cssPageSize: '210mm 297mm'
    }
  };

  var I18N = {
    en: {
      studioHome: '← CraftLeaf Studio',
      appTitle: 'Passport & Visa ID Photo 4×6" Studio',
      privacyBadge: '100% Client-Side · Zero Upload',
      invoiceToolLink: 'Invoice PDF Studio →',
      seoGuidesLink: 'Country Spec Guides',
      unlockBtn: 'Unlock Pro ($3.99)',
      unlockedBtn: 'PRO UNLOCKED ✓',
      heroTitle: 'Make Compliant 300 DPI Passport & Visa Photos + $0.39 Drugstore 4×6" Sheets',
      heroDesc: 'Align head crown & chin with official biometric guides, brighten home walls to studio white, and tile onto 4×6" or A4 print sheets — 100% offline in your browser.',
      savingsPill: '💡 Print 6–8 photos for $0.39 at CVS/Walgreens vs. $16.99 in-store',
      sec1: '1. Portrait Source',
      dropzoneText: '📷 Choose or Drop Portrait Photo',
      demoBtn: '✨ Demo Portrait',
      sec2: '2. Country & Visa Specification',
      sec3: '3. Pose & Biometric Framing',
      lblZoom: 'Zoom Scale',
      lblRotate: 'Fine Tilt / Rotate',
      btnRotLeft: '↺ -90°',
      btnRotRight: '↻ +90°',
      btnCenter: '⌖ Re-Center',
      btnFlip: '⇄ Mirror',
      chkGuides: 'Show Head Crown / Eye / Chin Biometric Overlay',
      sec4: '4. Studio Lighting & White-Wall Boost',
      lblBright: 'Brightness',
      lblContrast: 'Contrast',
      lblBgBoost: 'White-Background Boost (Home Wall Whitener)',
      swatchWhite: 'Pure White',
      swatchCream: 'UK Soft Grey',
      swatchBlue: 'Light Blue',
      btnResetAdj: 'Reset Lighting',
      chkTrimMarks: 'Draw Precision Scissor Trim Marks & 1" Scale Bar',
      cropCardTitle: 'Biometric Alignment Canvas',
      dragHint: 'Drag photo directly to position eyes & crown inside green target bands · Scroll wheel to zoom',
      sheetCardTitle: '300 DPI Print Sheet Live Preview',
      tab4x6: '4×6" Sheet ($0.39)',
      tabA4: 'A4 Sheet',
      freeCardTitle: 'Single Cropped Photo',
      freeCardDesc: 'Exact 300 DPI biometric PNG ready for online visa/USCIS digital portals.',
      btnDlSingle: '⬇ Download Single 300 DPI PNG',
      pro4x6Title: '4×6" Cut-Ready Print Sheet',
      pro4x6Desc: 'Unwatermarked 1800×1200 px 300 DPI sheet with scissor trim ticks for CVS, Walgreens, Walmart, Boots.',
      btnDl4x6: '⬇ Download 4×6" Sheet PNG',
      proA4Title: 'A4 Sheet + Direct Print',
      proA4Desc: 'Unwatermarked 2480×3508 px A4 sheet PNG + 1:1 physical scale print view.',
      btnDlA4: '⬇ Download A4 PNG',
      btnPrintSheet: '🖨️ Print Cut-Ready Sheet',
      tipText: 'Saved $16+ vs. retail passport photo booths? Support independent privacy-first tools:',
      tipCta: '☕ Leave a Tip / Support Studio',
      guidesFooterTitle: 'Official Country Photo Size & Drugstore Printing Guides:',
      modalTitle: 'Unlock ID Photo Print Sheet Pro',
      modalSub: 'One-time $3.99 lifetime browser unlock — zero subscription, works 100% offline forever.',
      perk1: 'Clean, unwatermarked 300 DPI 4×6" (1800×1200 px) & A4 (2480×3508 px) tiled sheets',
      perk2: 'Precision corner crop ticks, scissor cut lines & 1-inch calibration bar',
      perk3: '1:1 physical-size Print View for home inkjet/laser printers',
      perk4: 'Also unlocked automatically with the $19 CraftLeaf All-Access Pass (STUDIOALL-...)',
      buyKeyBtn: 'Buy Instant Pro Key ($3.99) →',
      allAccessLink: 'Or get All-Access Pass for all 6 Studio tools ($19)',
      verifyBtn: 'Activate',
      keyPlaceholder: 'IDPRO-XXXX-XXXX-XXXXXX',
      msgInvalid: 'Invalid license key. Check format (IDPRO-XXXX-XXXX-XXXXXX) or STUDIOALL key.',
      msgSuccess: 'Pro Unlocked! Watermarks removed — enjoy unlimited 4×6" & A4 print sheets.',
      guideTop: 'CROWN / TOP OF HAIR',
      guideEye: 'EYE LINE',
      guideChin: 'CHIN TARGET',
      demoBadge: 'Synthetic Studio Portrait #',
      sheetStatsTpl: '{count} photos tiled · {dim} px @ 300 DPI · Exact {mm} mm cut size'
    },
    zh: {
      studioHome: '← 返回工坊首页',
      appTitle: '出国护照签证证件照 4×6寸 冲印拼版器',
      privacyBadge: '100% 浏览器本地处理 · 绝不上传照片',
      invoiceToolLink: '自由职业英文发票生成器 →',
      seoGuidesLink: '各国签证照尺寸指南',
      unlockBtn: '解锁 Pro 拼版 ($3.99 / ¥12.9)',
      unlockedBtn: '已解锁 PRO 专业版 ✓',
      heroTitle: '在家手机拍合规 300 DPI 各国护照签证照 + 4×6寸自助冲印排版',
      heroDesc: '内置官方头顶/双眼/下巴生物识别对齐线与白墙去灰增白算法，一键拼成 4×6寸相纸（药店冲印仅需几毛钱），照片全程不离开您的设备。',
      savingsPill: '💡 一张 4×6寸相纸可排 6–8 张证件照，立省 95% 照相馆费用',
      sec1: '1. 导入人像照片',
      dropzoneText: '📷 选择或拖拽人像原图',
      demoBtn: '✨ 切换示例人像',
      sec2: '2. 选择国家 / 签证规格',
      sec3: '3. 拖拽缩放与头顶/下巴比例校准',
      lblZoom: '画面缩放',
      lblRotate: '水平微调旋转',
      btnRotLeft: '↺ 左转90°',
      btnRotRight: '↻ 右转90°',
      btnCenter: '⌖ 居中复位',
      btnFlip: '⇄ 左右镜像',
      chkGuides: '显示官方头顶 / 眼位 / 下巴合规辅助线',
      sec4: '4. 人像提亮与白墙去灰增白',
      lblBright: '面部亮度',
      lblContrast: '清晰对比度',
      lblBgBoost: '背景白墙去灰增白（居家灰墙秒变纯白底）',
      swatchWhite: '纯白底',
      swatchCream: '英签浅灰白',
      swatchBlue: '浅蓝底',
      btnResetAdj: '重置光效',
      chkTrimMarks: '绘制精准剪刀裁切十字线与 1英寸 比例尺',
      cropCardTitle: '生物识别比例对齐画布',
      dragHint: '在画布上直接按住拖动照片，使头顶、双眼和下巴落入绿色标准带 · 滚轮缩放',
      sheetCardTitle: '300 DPI 冲印拼版实时预览',
      tab4x6: '4×6寸相纸 (6-8张)',
      tabA4: 'A4 打印纸',
      freeCardTitle: '单张高清电子版证件照',
      freeCardDesc: '标准 300 DPI 电子版 PNG，直接用于美签 DS-160 / I-765 / 各国网申系统上传。',
      btnDlSingle: '⬇ 免费下载单张 300 DPI 电子照',
      pro4x6Title: '4×6寸 无水印冲印拼版大图',
      pro4x6Desc: '1800×1200 px 真 300 DPI 无水印相纸拼版 + 精准裁切线，支持药店/网店/家用相纸冲印。',
      btnDl4x6: '⬇ 下载 4×6寸 冲印拼版 PNG',
      proA4Title: 'A4 排版大图 + 1:1 物理打印',
      proA4Desc: '2480×3508 px A4 高清无水印排版 + 浏览器直连打印机 1:1 原尺寸输出。',
      btnDlA4: '⬇ 下载 A4 拼版 PNG',
      btnPrintSheet: '🖨️ 1:1 打印裁切版',
      tipText: '省下了照相馆上百元费用？欢迎支持坚持零上传隐私保护的独立开发者：',
      tipCta: '☕ 请作者喝杯咖啡 / 赞助支持',
      guidesFooterTitle: '各国官方护照签证照尺寸标准与省钱冲印攻略：',
      modalTitle: '解锁证件照冲印拼版 Pro 专业版',
      modalSub: '一次性买断仅 $3.99 (¥12.9) — 无订阅套路，激活码本地永久生效。',
      perk1: '导出无水印 300 DPI 4×6寸 (1800×1200) 与 A4 (2480×3508) 高清冲印拼版图',
      perk2: '自带四角精准剪刀裁切刻度线与 1英寸/25.4mm 实体防缩印校验尺',
      perk3: '解锁浏览器 1:1 原尺寸激光/喷墨直打模式',
      perk4: '支持使用 $19 全家桶通票激活码 (STUDIOALL-...) 一键通用解锁',
      buyKeyBtn: '立即获取 Pro 激活码 ($3.99) →',
      allAccessLink: '或入手 $19 工坊全系 6 款工具通票 (All-Access Pass)',
      verifyBtn: '立即激活',
      keyPlaceholder: 'IDPRO-XXXX-XXXX-XXXXXX',
      msgInvalid: '激活码无效，请核对格式 (IDPRO-XXXX-XXXX-XXXXXX 或 STUDIOALL-...)。',
      msgSuccess: 'Pro 激活成功！拼版预览水印已全部移除，可无限导出高清冲印版。',
      guideTop: '头顶发际最高点区',
      guideEye: '双眼水平线区',
      guideChin: '下巴底端对齐区',
      demoBadge: '内置合成演示人像 #',
      sheetStatsTpl: '共拼排 {count} 张 · {dim} px @ 300 DPI · 裁切实寸 {mm} mm'
    }
  };

  function resolvePresetKey(raw) {
    if (!raw) return 'us';
    var clean = String(raw).toLowerCase().trim();
    if (PRESETS[clean]) return clean;
    if (clean === 'eu' || clean === 'schengen-visa') return 'schengen';
    if (clean === 'cn' || clean === 'chinese') return 'china';
    if (clean === 'ca') return 'canada';
    if (clean === 'jp') return 'japan';
    if (clean === 'gb') return 'uk';
    if (clean === 'uscis' || clean === 'ead') return 'opt';
    return 'us';
  }

  /**
   * Computes exact 300-DPI non-distorted tile positions for 4x6" (1800x1200) or A4 (2480x3508)
   */
  function computeSheetLayout(presetKey, sheetKey) {
    var preset = PRESETS[resolvePresetKey(presetKey)];
    var sheet = SHEETS[sheetKey] || SHEETS['4x6'];
    var sw = sheet.widthPx;
    var sh = sheet.heightPx;
    var pw = preset.widthPx;
    var ph = preset.heightPx;

    var minMargin = sheetKey === 'a4' ? 110 : 0;
    var usableW = sw - minMargin * 2;
    var usableH = sh - minMargin * 2;

    // Compare upright vs rotated-90-deg tile orientation to maximize photo count on 4x6!
    function calcOrientation(tw, th, rotated) {
      // Determine optimal gutter: use 20px gutter when room allows without losing a column/row
      var maxColsZero = Math.floor(usableW / tw);
      var maxRowsZero = Math.floor(usableH / th);
      if (maxColsZero < 1 || maxRowsZero < 1) {
        return { cols: 0, rows: 0, count: 0, rotated: rotated };
      }
      var gutter = sheetKey === 'a4' ? 28 : 20;
      var colsWithGutter = Math.floor((usableW + gutter) / (tw + gutter));
      var rowsWithGutter = Math.floor((usableH + gutter) / (th + gutter));
      var useGutterX = colsWithGutter === maxColsZero ? gutter : 0;
      var useGutterY = rowsWithGutter === maxRowsZero ? gutter : 0;
      var cols = maxColsZero;
      var rows = maxRowsZero;
      // Keep A4 neat (max 4x5 = 20 or 3x5 = 15) so scissor lanes stay generous
      if (sheetKey === 'a4' && cols > 4) cols = 4;
      if (sheetKey === 'a4' && rows > 5) rows = 5;

      var gridW = cols * tw + (cols - 1) * useGutterX;
      var gridH = rows * th + (rows - 1) * useGutterY;
      var startX = Math.round((sw - gridW) / 2);
      var startY = Math.round((sh - gridH) / 2);
      var tiles = [];
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          tiles.push({
            x: startX + c * (tw + useGutterX),
            y: startY + r * (th + useGutterY),
            w: tw,
            h: th,
            rotated: rotated
          });
        }
      }
      return {
        sheetId: sheet.id,
        sheetWidthPx: sw,
        sheetHeightPx: sh,
        tileWidthPx: tw,
        tileHeightPx: th,
        cols: cols,
        rows: rows,
        gutterX: useGutterX,
        gutterY: useGutterY,
        marginX: startX,
        marginY: startY,
        rotated: rotated,
        count: tiles.length,
        tiles: tiles
      };
    }

    var upright = calcOrientation(pw, ph, false);
    var sideways = (pw !== ph && sheetKey === '4x6') ? calcOrientation(ph, pw, true) : { count: -1 };
    return sideways.count > upright.count ? sideways : upright;
  }

  // Export testable pure core on global object
  var StudioAPI = {
    DPI: DPI,
    PRESETS: PRESETS,
    SHEETS: SHEETS,
    I18N: I18N,
    resolvePresetKey: resolvePresetKey,
    computeSheetLayout: computeSheetLayout
  };
  root.IDPhotoStudio = StudioAPI;

  // Stop here if running in headless JSC unit test without DOM
  if (typeof document === 'undefined') {
    return;
  }

  // --- Interactive Browser App State ---
  var state = {
    lang: 'en',
    presetKey: 'us',
    sheetKey: '4x6',
    sourceCanvas: null,
    demoIndex: 0,
    isDemo: true,
    zoom: 1.0,
    rotationDeg: 0,
    quadrantRot: 0,
    flipX: false,
    panX: 0, // normalized offset relative to crop width
    panY: 0,
    brightness: 0,
    contrast: 4,
    bgBoost: 45,
    bgColor: '#FFFFFF',
    showGuides: true,
    showTrimMarks: true,
    dragging: false,
    dragStartX: 0,
    dragStartY: 0,
    panStartX: 0,
    panStartY: 0
  };

  function $(id) {
    return document.getElementById(id);
  }

  function isPro() {
    return !!(root.CraftLeafSDK && root.CraftLeafSDK.isUnlocked('idPhotoPro', 'IDPRO'));
  }

  /**
   * Generates a crisp, realistic high-res synthetic studio portrait on an offscreen canvas
   * with a slightly gray home wall background so users immediately see White-Background Boost in action!
   */
  function generateDemoPortraitCanvas(variantIndex) {
    var palettes = [
      { wallTop: '#dfe4ec', wallBot: '#cfd6e2', skin: '#f1c6a7', skinShadow: '#dfb08e', hair: '#1e2430', suit: '#1e293b', shirt: '#f8fafc', tie: '#2563eb', iris: '#3b2f2f', lip: '#c97b72', style: 'short' },
      { wallTop: '#e4e2dd', wallBot: '#d5d2cb', skin: '#e5b28f', skinShadow: '#cf9974', hair: '#2c1d14', suit: '#0f766e', shirt: '#ffffff', tie: '#0d9488', iris: '#292524', lip: '#b86862', style: 'long' },
      { wallTop: '#dde5ea', wallBot: '#cbd5df', skin: '#f6d5be', skinShadow: '#e3bca2', hair: '#4a2e1b', suit: '#334155', shirt: '#f1f5f9', tie: '#7c3aed', iris: '#334155', lip: '#c57774', style: 'parted' }
    ];
    var p = palettes[variantIndex % palettes.length];
    var w = 1000;
    var h = 1200;
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    var ctx = c.getContext('2d');

    // Home wall subtle gradient (light gray-ish wall so White-Background Boost noticeably whitens it!)
    var wallGrad = ctx.createLinearGradient(0, 0, w, h);
    wallGrad.addColorStop(0, p.wallTop);
    wallGrad.addColorStop(1, p.wallBot);
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle soft ambient studio halo behind head
    var halo = ctx.createRadialGradient(w * 0.5, h * 0.44, 60, w * 0.5, h * 0.44, 480);
    halo.addColorStop(0, 'rgba(255,255,255,0.45)');
    halo.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, w, h);

    var cx = w * 0.5;

    // Back hair for long hair variant
    if (p.style === 'long') {
      ctx.fillStyle = p.hair;
      ctx.beginPath();
      ctx.ellipse(cx, h * 0.47, 225, 300, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shoulders / Suit jacket
    ctx.fillStyle = p.suit;
    ctx.beginPath();
    ctx.moveTo(cx - 390, h);
    ctx.quadraticCurveTo(cx - 355, h * 0.77, cx - 125, h * 0.735);
    ctx.lineTo(cx + 125, h * 0.735);
    ctx.quadraticCurveTo(cx + 355, h * 0.77, cx + 390, h);
    ctx.closePath();
    ctx.fill();

    // Crisp shirt V-collar
    ctx.fillStyle = p.shirt;
    ctx.beginPath();
    ctx.moveTo(cx - 105, h * 0.73);
    ctx.lineTo(cx, h * 0.96);
    ctx.lineTo(cx + 105, h * 0.73);
    ctx.closePath();
    ctx.fill();

    // Tie / Neckline accent
    ctx.fillStyle = p.tie;
    ctx.beginPath();
    ctx.moveTo(cx - 26, h * 0.79);
    ctx.lineTo(cx + 26, h * 0.79);
    ctx.lineTo(cx + 34, h * 0.96);
    ctx.lineTo(cx, h);
    ctx.lineTo(cx - 34, h * 0.96);
    ctx.closePath();
    ctx.fill();

    // Suit lapels
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.moveTo(cx - 108, h * 0.732);
    ctx.lineTo(cx - 158, h * 0.86);
    ctx.lineTo(cx - 42, h * 0.95);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 108, h * 0.732);
    ctx.lineTo(cx + 158, h * 0.86);
    ctx.lineTo(cx + 42, h * 0.95);
    ctx.closePath();
    ctx.fill();

    // Neck + chin shadow
    ctx.fillStyle = p.skin;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(cx - 76, h * 0.60, 152, 195, 48) : ctx.rect(cx - 76, h * 0.60, 152, 195);
    ctx.fill();

    ctx.fillStyle = p.skinShadow;
    ctx.beginPath();
    ctx.ellipse(cx, h * 0.675, 76, 38, 0, 0, Math.PI);
    ctx.fill();

    // Both ears (clearly visible for China/Schengen compliance!)
    [-1, 1].forEach(function (dir) {
      ctx.fillStyle = p.skinShadow;
      ctx.beginPath();
      ctx.ellipse(cx + dir * 186, h * 0.455, 28, 54, dir * -0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.skin;
      ctx.beginPath();
      ctx.ellipse(cx + dir * 183, h * 0.455, 22, 46, dir * -0.08, 0, Math.PI * 2);
      ctx.fill();
    });

    // Head oval with natural studio shading
    var faceGrad = ctx.createRadialGradient(cx - 32, h * 0.39, 30, cx, h * 0.44, 240);
    faceGrad.addColorStop(0, p.skin);
    faceGrad.addColorStop(0.82, p.skin);
    faceGrad.addColorStop(1, p.skinShadow);
    ctx.fillStyle = faceGrad;
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.205);
    ctx.bezierCurveTo(cx + 175, h * 0.205, cx + 190, h * 0.36, cx + 180, h * 0.48);
    ctx.bezierCurveTo(cx + 168, h * 0.61, cx + 92, h * 0.695, cx, h * 0.702);
    ctx.bezierCurveTo(cx - 92, h * 0.695, cx - 168, h * 0.61, cx - 180, h * 0.48);
    ctx.bezierCurveTo(cx - 190, h * 0.36, cx - 175, h * 0.205, cx, h * 0.205);
    ctx.closePath();
    ctx.fill();

    // Hair crown (top around y = 0.145 * h = 174px, chin around y = 0.702 * h = 842px)
    ctx.fillStyle = p.hair;
    ctx.beginPath();
    ctx.moveTo(cx - 184, h * 0.39);
    ctx.bezierCurveTo(cx - 205, h * 0.22, cx - 125, h * 0.142, cx, h * 0.145);
    ctx.bezierCurveTo(cx + 130, h * 0.142, cx + 205, h * 0.22, cx + 184, h * 0.39);
    ctx.bezierCurveTo(cx + 162, h * 0.275, cx + 82, h * 0.235, cx - 15, h * 0.245);
    ctx.bezierCurveTo(cx - 102, h * 0.248, cx - 160, h * 0.29, cx - 184, h * 0.39);
    ctx.closePath();
    ctx.fill();

    // Eyebrows (cleanly visible above eyes)
    ctx.strokeStyle = p.hair;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    [-1, 1].forEach(function (dir) {
      ctx.beginPath();
      ctx.moveTo(cx + dir * 42, h * 0.388);
      ctx.quadraticCurveTo(cx + dir * 82, h * 0.372, cx + dir * 118, h * 0.39);
      ctx.stroke();
    });

    // Eyes at y = 0.43 * h (right inside biometric eye band!)
    var eyeY = h * 0.432;
    [-1, 1].forEach(function (dir) {
      var ex = cx + dir * 78;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(ex, eyeY, 31, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = p.iris;
      ctx.beginPath();
      ctx.arc(ex, eyeY, 13.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.arc(ex, eyeY, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Catchlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ex - 4, eyeY - 4, 3, 0, Math.PI * 2);
      ctx.fill();

      // Upper eyelid crease
      ctx.strokeStyle = p.hair;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(ex - 32, eyeY + 1);
      ctx.quadraticCurveTo(ex, eyeY - 19, ex + 32, eyeY + 2);
      ctx.stroke();
    });

    // Subtle nose bridge & tip
    ctx.strokeStyle = p.skinShadow;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(cx - 4, h * 0.435);
    ctx.lineTo(cx - 8, h * 0.525);
    ctx.quadraticCurveTo(cx, h * 0.542, cx + 14, h * 0.528);
    ctx.stroke();

    // Neutral closed mouth (compliant neutral smile)
    var mouthY = h * 0.598;
    ctx.fillStyle = p.lip;
    ctx.beginPath();
    ctx.moveTo(cx - 50, mouthY);
    ctx.quadraticCurveTo(cx - 18, mouthY - 12, cx, mouthY - 7);
    ctx.quadraticCurveTo(cx + 18, mouthY - 12, cx + 50, mouthY);
    ctx.quadraticCurveTo(cx, mouthY + 20, cx - 50, mouthY);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(85, 35, 35, 0.45)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - 49, mouthY);
    ctx.quadraticCurveTo(cx, mouthY + 4, cx + 49, mouthY);
    ctx.stroke();

    return c;
  }

  function clampByte(v) {
    return v < 0 ? 0 : (v > 255 ? 255 : v | 0);
  }

  function hexToRgb(hex) {
    var clean = String(hex || '#FFFFFF').replace('#', '');
    if (clean.length === 3) {
      clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
    }
    var n = parseInt(clean, 16);
    if (isNaN(n)) return { r: 255, g: 255, b: 255 };
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  /**
   * Renders the single exact 300-DPI biometric photo canvas (without guide overlays)
   */
  function renderSingleBiometricCanvas() {
    var preset = PRESETS[state.presetKey];
    var out = document.createElement('canvas');
    out.width = preset.widthPx;
    out.height = preset.heightPx;
    var ctx = out.getContext('2d');

    // Fill target backdrop color
    ctx.fillStyle = state.bgColor || preset.bgDefault || '#FFFFFF';
    ctx.fillRect(0, 0, out.width, out.height);

    if (!state.sourceCanvas) return out;

    var src = state.sourceCanvas;
    var srcW = (state.quadrantRot % 180 !== 0) ? src.height : src.width;
    var srcH = (state.quadrantRot % 180 !== 0) ? src.width : src.height;

    // Cover-fit base scale
    var baseScale = Math.max(out.width / srcW, out.height / srcH);
    var totalScale = baseScale * state.zoom;

    ctx.save();
    ctx.translate(out.width / 2 + state.panX * out.width, out.height / 2 + state.panY * out.height);
    var totalRad = ((state.quadrantRot + state.rotationDeg) * Math.PI) / 180;
    ctx.rotate(totalRad);
    ctx.scale(state.flipX ? -totalScale : totalScale, totalScale);
    ctx.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(src, -src.width / 2, -src.height / 2);
    ctx.restore();

    // Apply pixel-level Brightness, Contrast & Smart White-Background Boost
    if (state.brightness !== 0 || state.contrast !== 0 || state.bgBoost > 0) {
      var imgData = ctx.getImageData(0, 0, out.width, out.height);
      var d = imgData.data;
      var bOffset = state.brightness * 2.1;
      var cFactor = (259 * (state.contrast * 2.2 + 255)) / (255 * (259 - state.contrast * 2.2));
      var boost = state.bgBoost / 100;
      var targetBg = hexToRgb(state.bgColor || '#FFFFFF');

      var w = out.width;
      var h = out.height;
      // Central face/torso protection ellipse so skin/shirt highlights stay natural
      var faceCx = w * 0.5;
      var faceCy = h * 0.56;
      var rx = w * 0.34;
      var ry = h * 0.44;

      var lumFloor = 232 - boost * 92; // at 50% boost -> ~186, at 100% -> 140
      var satCap = 22 + boost * 36;

      for (var y = 0; y < h; y++) {
        var dy = (y - faceCy) / ry;
        var dy2 = dy * dy;
        var rowOff = y * w * 4;
        for (var x = 0; x < w; x++) {
          var idx = rowOff + x * 4;
          var r = d[idx];
          var g = d[idx + 1];
          var b = d[idx + 2];

          // Brightness + Contrast
          r = clampByte(cFactor * (r - 128) + 128 + bOffset);
          g = clampByte(cFactor * (g - 128) + 128 + bOffset);
          b = clampByte(cFactor * (b - 128) + 128 + bOffset);

          if (boost > 0) {
            var maxC = r > g ? (r > b ? r : b) : (g > b ? g : b);
            var minC = r < g ? (r < b ? r : b) : (g < b ? g : b);
            var chroma = maxC - minC;
            var lum = 0.299 * r + 0.587 * g + 0.114 * b;

            if (lum > lumFloor && chroma < satCap) {
              var dx = (x - faceCx) / rx;
              var ellipseDist = dx * dx + dy2;
              // Protect central face area while softly feathering background walls & upper corners
              var spatialMask = ellipseDist <= 0.72 ? 0 : (ellipseDist >= 1.18 ? 1 : (ellipseDist - 0.72) / 0.46);
              if (spatialMask > 0) {
                var lumWeight = Math.min(1, (lum - lumFloor) / 42);
                var satWeight = Math.min(1, (satCap - chroma) / 24);
                var mix = boost * spatialMask * lumWeight * satWeight;
                if (mix > 0.96) mix = 1;
                r = clampByte(r + (targetBg.r - r) * mix);
                g = clampByte(g + (targetBg.g - g) * mix);
                b = clampByte(b + (targetBg.b - b) * mix);
              }
            }
          }

          d[idx] = r;
          d[idx + 1] = g;
          d[idx + 2] = b;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    return out;
  }

  /**
   * Draws interactive biometric overlays onto the visible crop editor canvas
   */
  function drawCropEditor(singleCanvas) {
    var cropCanvas = $('cropCanvas');
    var preset = PRESETS[state.presetKey];
    var dict = I18N[state.lang];

    // Display size around 340px wide while keeping exact aspect ratio
    var dispW = 340;
    var dispH = Math.round((dispW * preset.heightPx) / preset.widthPx);
    cropCanvas.width = dispW * 2; // @2x Retina sharp UI canvas
    cropCanvas.height = dispH * 2;
    cropCanvas.style.width = dispW + 'px';
    cropCanvas.style.height = dispH + 'px';

    var ctx = cropCanvas.getContext('2d');
    ctx.scale(2, 2);
    ctx.drawImage(singleCanvas, 0, 0, dispW, dispH);

    if (!state.showGuides) return;

    // Vertical nose centerline
    ctx.save();
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.65)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(dispW / 2, 0);
    ctx.lineTo(dispW / 2, dispH);
    ctx.stroke();

    function drawZoneBand(range, colorFill, colorStroke, labelText) {
      var y1 = range[0] * dispH;
      var y2 = range[1] * dispH;
      ctx.fillStyle = colorFill;
      ctx.fillRect(0, y1, dispW, y2 - y1);
      ctx.strokeStyle = colorStroke;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(0, y1);
      ctx.lineTo(dispW, y1);
      ctx.moveTo(0, y2);
      ctx.lineTo(dispW, y2);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.font = '700 9.5px -apple-system, BlinkMacSystemFont, sans-serif';
      var tw = ctx.measureText(labelText).width + 10;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
      ctx.fillRect(6, y1 + 2, tw, 14);
      ctx.fillStyle = '#ecfdf5';
      ctx.fillText(labelText, 11, y1 + 12);
    }

    drawZoneBand(preset.crownRange, 'rgba(16, 185, 129, 0.14)', 'rgba(5, 150, 105, 0.85)', dict.guideTop);
    drawZoneBand(preset.eyeRange, 'rgba(59, 130, 246, 0.14)', 'rgba(37, 99, 235, 0.85)', dict.guideEye);
    drawZoneBand(preset.chinRange, 'rgba(16, 185, 129, 0.14)', 'rgba(5, 150, 105, 0.85)', dict.guideChin);

    // Biometric head oval guide
    var crownMid = ((preset.crownRange[0] + preset.crownRange[1]) / 2) * dispH;
    var chinMid = ((preset.chinRange[0] + preset.chinRange[1]) / 2) * dispH;
    var headH = chinMid - crownMid;
    var headCy = crownMid + headH / 2;
    var headRx = headH * 0.36;
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.85)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(dispW / 2, headCy, headRx, headH / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Builds the full-resolution 300 DPI print sheet canvas (1800x1200 or 2480x3508).
   * If watermarkMode is true, draws the Free preview watermark; if false, draws clean Pro cut-ready output.
   */
  function buildPrintSheetCanvas(singleCanvas, sheetKey, watermarkMode) {
    var layout = computeSheetLayout(state.presetKey, sheetKey);
    var preset = PRESETS[state.presetKey];
    var sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = layout.sheetWidthPx;
    sheetCanvas.height = layout.sheetHeightPx;
    var ctx = sheetCanvas.getContext('2d');

    // Crisp pure white photo paper sheet background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

    // Place each 300-DPI photo tile
    layout.tiles.forEach(function (t) {
      ctx.save();
      if (t.rotated) {
        ctx.translate(t.x + t.w / 2, t.y + t.h / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.drawImage(singleCanvas, -singleCanvas.width / 2, -singleCanvas.height / 2);
      } else {
        ctx.drawImage(singleCanvas, t.x, t.y, t.w, t.h);
      }
      ctx.restore();

      // Subtle hairline photo border so white-on-white background edges are crystal clear to cut!
      if (state.showTrimMarks) {
        ctx.save();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(t.x + 0.5, t.y + 0.5, t.w - 1, t.h - 1);

        // Precision corner crop ticks extending outward into margin/gutter
        var tickLen = 18;
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        var corners = [
          [t.x, t.y, -1, -1],
          [t.x + t.w, t.y, 1, -1],
          [t.x, t.y + t.h, -1, 1],
          [t.x + t.w, t.y + t.h, 1, 1]
        ];
        corners.forEach(function (c) {
          var cx = c[0], cy = c[1], dx = c[2], dy = c[3];
          ctx.beginPath();
          ctx.moveTo(cx + dx * 3, cy);
          ctx.lineTo(cx + dx * tickLen, cy);
          ctx.moveTo(cx, cy + dy * 3);
          ctx.lineTo(cx, cy + dy * tickLen);
          ctx.stroke();
        });
        ctx.restore();
      }
    });

    // Draw scissor trim icons & 1-inch (300 px) physical scale verification bar when margin permits
    if (state.showTrimMarks && layout.marginY >= 36) {
      ctx.save();
      ctx.fillStyle = '#475569';
      ctx.strokeStyle = '#475569';
      ctx.font = '600 22px -apple-system, BlinkMacSystemFont, sans-serif';
      var headerNote = '✂ ' + preset.nameEn + ' · 300 DPI Exact Cut Sheet (' + layout.count + 'x)';
      ctx.fillText(headerNote, Math.max(36, layout.marginX), Math.max(28, layout.marginY - 14));

      // 1-inch = 300px physical scale check bar at bottom margin
      if (sheetCanvas.height - (layout.marginY + layout.rows * layout.tileHeightPx) >= 36) {
        var barY = sheetCanvas.height - 20;
        var barX = Math.max(36, layout.marginX);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(barX, barY - 8);
        ctx.lineTo(barX, barY);
        ctx.lineTo(barX + 300, barY);
        ctx.lineTo(barX + 300, barY - 8);
        ctx.stroke();
        ctx.font = '600 19px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText('1.00 inch / 25.4 mm Scale Check (Print at 100% / Actual Size)', barX + 314, barY);
      }
      ctx.restore();
    } else if (state.showTrimMarks && layout.marginX === 0 && layout.marginY === 0) {
      // Edge-to-edge 6-up 2x2" on 4x6": draw crisp scissor marks right along the cut intersections!
      ctx.save();
      ctx.fillStyle = '#334155';
      ctx.font = '700 22px sans-serif';
      for (var c = 1; c < layout.cols; c++) {
        ctx.fillText('✂', c * layout.tileWidthPx - 11, 24);
      }
      ctx.fillText('✂', 8, layout.tileHeightPx + 8);
      ctx.restore();
    }

    // Free Tier Preview Watermark
    if (watermarkMode) {
      ctx.save();
      ctx.translate(sheetCanvas.width / 2, sheetCanvas.height / 2);
      ctx.rotate(-0.32);
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(15, 23, 42, 0.16)';
      var fontSize = sheetKey === 'a4' ? 58 : 40;
      ctx.font = '800 ' + fontSize + 'px -apple-system, BlinkMacSystemFont, sans-serif';
      for (var wy = -sheetCanvas.height * 0.45; wy <= sheetCanvas.height * 0.45; wy += fontSize * 4.2) {
        ctx.fillText('PREVIEW - UNLOCK PRO FOR CUT-READY 4x6 SHEET', 0, wy);
      }

      // Subtle central pill banner
      ctx.rotate(0.32);
      var pillW = sheetKey === 'a4' ? 1260 : 1040;
      var pillH = sheetKey === 'a4' ? 84 : 64;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
      ctx.fillRect(-pillW / 2, -pillH / 2, pillW, pillH);
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 ' + (sheetKey === 'a4' ? 32 : 25) + 'px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('PREVIEW - UNLOCK PRO ($3.99) FOR CUT-READY 4x6 SHEET', 0, sheetKey === 'a4' ? 11 : 9);
      ctx.restore();
    }

    return { canvas: sheetCanvas, layout: layout };
  }

  function refreshAllCanvases() {
    var single = renderSingleBiometricCanvas();
    drawCropEditor(single);

    var unlocked = isPro();
    var built = buildPrintSheetCanvas(single, state.sheetKey, !unlocked);
    var previewEl = $('sheetCanvas');
    // Render crisp scaled preview canvas
    var scale = state.sheetKey === 'a4' ? 0.28 : 0.44;
    previewEl.width = Math.round(built.canvas.width * scale);
    previewEl.height = Math.round(built.canvas.height * scale);
    var pctx = previewEl.getContext('2d');
    pctx.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in pctx) pctx.imageSmoothingQuality = 'high';
    pctx.drawImage(built.canvas, 0, 0, previewEl.width, previewEl.height);

    // Update metadata stats
    var preset = PRESETS[state.presetKey];
    var dict = I18N[state.lang];
    var stats = dict.sheetStatsTpl
      .replace('{count}', String(built.layout.count))
      .replace('{dim}', built.layout.sheetWidthPx + '×' + built.layout.sheetHeightPx)
      .replace('{mm}', preset.widthMm + '×' + preset.heightMm);
    $('sheetStatsText').textContent = stats;
    $('specCallout').textContent = state.lang === 'zh' ? preset.noteZh : preset.noteEn;
  }

  function updateProUI() {
    var unlocked = isPro();
    var dict = I18N[state.lang];
    var topBtn = $('openProModalBtn');
    topBtn.textContent = unlocked ? dict.unlockedBtn : dict.unlockBtn;
    topBtn.classList.toggle('unlocked', unlocked);

    // Update Checkout CTA URL from shared config
    var cfg = (root.CRAFTLEAF_MONETIZATION && root.CRAFTLEAF_MONETIZATION.products) || {};
    var idCfg = cfg.idPhotoPro || {};
    var allCfg = cfg.allAccessPass || {};
    var buyEl = $('buyProCta');
    if (buyEl) {
      buyEl.href = (state.lang === 'zh' && idCfg.checkoutUrlZh) ? idCfg.checkoutUrlZh : (idCfg.checkoutUrlEn || '#unlock-pro');
    }
    var allEl = $('buyAllAccessCta');
    if (allEl && allCfg.checkoutUrlEn) {
      allEl.href = (state.lang === 'zh' && allCfg.checkoutUrlZh) ? allCfg.checkoutUrlZh : allCfg.checkoutUrlEn;
    }

    var tips = (root.CRAFTLEAF_MONETIZATION && root.CRAFTLEAF_MONETIZATION.tips) || {};
    var tipLink = $('studioTipLink');
    if (tipLink) {
      tipLink.href = (state.lang === 'zh' ? (tips.afdianUrl || tips.stripeTipUrl) : (tips.stripeTipUrl || tips.kofiUrl)) || '#';
    }
  }

  function applyLanguage() {
    var dict = I18N[state.lang];
    document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-i18n');
      if (dict[key]) {
        nodes[i].textContent = dict[key];
      }
    }
    var keyInp = $('licenseKeyInput');
    if (keyInp) keyInp.placeholder = dict.keyPlaceholder;
    $('langToggleBtn').textContent = state.lang === 'zh' ? 'English / EN' : '中文 / EN';

    // Repopulate preset dropdown labels in current language
    var sel = $('presetSelect');
    var curVal = state.presetKey;
    sel.innerHTML = '';
    Object.keys(PRESETS).forEach(function (k) {
      var opt = document.createElement('option');
      opt.value = k;
      opt.textContent = state.lang === 'zh' ? PRESETS[k].nameZh : PRESETS[k].nameEn;
      if (k === curVal) opt.selected = true;
      sel.appendChild(opt);
    });

    // Render shared affiliate widget
    if (root.CraftLeafSDK && typeof root.CraftLeafSDK.renderAffiliateBar === 'function') {
      root.CraftLeafSDK.renderAffiliateBar($('affiliateMount'), 'id-photo', state.lang);
      root.CraftLeafSDK.renderAffiliateBar($('affiliateTrimmerMount'), 'print-craft', state.lang);
    }

    updateProUI();
    refreshAllCanvases();
  }

  function downloadCanvasPng(canvas, filename) {
    var link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function openUnlockModal() {
    $('proModal').classList.add('open');
    $('licenseMsg').textContent = '';
    $('licenseMsg').className = 'modal-msg';
    setTimeout(function () {
      $('licenseKeyInput').focus();
    }, 50);
  }

  function closeUnlockModal() {
    $('proModal').classList.remove('open');
  }

  function loadPortraitFile(file) {
    if (!file || !file.type || file.type.indexOf('image/') !== 0) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      var img = new Image();
      img.onload = function () {
        var c = document.createElement('canvas');
        // Cap working buffer at 2400px max edge for instant real-time slider responsiveness
        var maxEdge = 2400;
        var scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
        c.width = Math.max(1, Math.round(img.width * scale));
        c.height = Math.max(1, Math.round(img.height * scale));
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, c.width, c.height);
        state.sourceCanvas = c;
        state.isDemo = false;
        state.zoom = 1.0;
        state.panX = 0;
        state.panY = 0;
        state.rotationDeg = 0;
        state.quadrantRot = 0;
        syncSlidersFromState();
        refreshAllCanvases();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function loadNextDemoPortrait() {
    state.sourceCanvas = generateDemoPortraitCanvas(state.demoIndex);
    state.demoIndex = (state.demoIndex + 1) % 3;
    state.isDemo = true;
    state.zoom = 1.04;
    state.panX = 0;
    state.panY = -0.02;
    state.rotationDeg = 0;
    state.quadrantRot = 0;
    syncSlidersFromState();
    refreshAllCanvases();
  }

  function syncSlidersFromState() {
    $('zoomSlider').value = Math.round(state.zoom * 100);
    $('zoomVal').textContent = Math.round(state.zoom * 100) + '%';
    $('rotateSlider').value = state.rotationDeg;
    $('rotateVal').textContent = (state.rotationDeg > 0 ? '+' : '') + state.rotationDeg + '°';
    $('brightSlider').value = state.brightness;
    $('brightVal').textContent = (state.brightness > 0 ? '+' : '') + state.brightness;
    $('contrastSlider').value = state.contrast;
    $('contrastVal').textContent = (state.contrast > 0 ? '+' : '') + state.contrast;
    $('bgBoostSlider').value = state.bgBoost;
    $('bgBoostVal').textContent = state.bgBoost + '%';
  }

  function setSheetTab(sheetKey) {
    state.sheetKey = SHEETS[sheetKey] ? sheetKey : '4x6';
    $('tabBtn4x6').classList.toggle('active', state.sheetKey === '4x6');
    $('tabBtnA4').classList.toggle('active', state.sheetKey === 'a4');
    refreshAllCanvases();
  }

  function preparePrintMount(sheetKey) {
    var single = renderSingleBiometricCanvas();
    var built = buildPrintSheetCanvas(single, sheetKey, !isPro());
    var mount = $('printSheetMount');
    mount.innerHTML = '';
    var pageStyle = $('dynamicPrintPageStyle');
    if (!pageStyle) {
      pageStyle = document.createElement('style');
      pageStyle.id = 'dynamicPrintPageStyle';
      document.head.appendChild(pageStyle);
    }
    var sheetSpec = SHEETS[sheetKey] || SHEETS['4x6'];
    pageStyle.textContent = '@media print { @page { size: ' + sheetSpec.cssPageSize + '; margin: 0; } }';

    var img = document.createElement('img');
    img.src = built.canvas.toDataURL('image/png');
    img.style.width = sheetKey === 'a4' ? '210mm' : '6in';
    img.style.height = sheetKey === 'a4' ? '297mm' : '4in';
    mount.appendChild(img);
    document.body.classList.add('print-sheet-mode');
    return img;
  }

  function triggerPrintSheet(sheetKey) {
    if (!isPro()) {
      openUnlockModal();
      return;
    }
    var img = preparePrintMount(sheetKey);
    if (img.complete) {
      window.print();
    } else {
      img.onload = function () {
        window.print();
      };
    }
  }

  function init() {
    // Parse URL params (?preset=schengen&lang=zh)
    try {
      var params = new URLSearchParams(window.location.search || '');
      if (params.get('preset')) {
        state.presetKey = resolvePresetKey(params.get('preset'));
        state.bgColor = PRESETS[state.presetKey].bgDefault;
      }
      var savedLang = localStorage.getItem('craftleaf_lang');
      if (params.get('lang') === 'zh' || params.get('lang') === 'en') {
        state.lang = params.get('lang');
      } else if (savedLang === 'zh' || savedLang === 'en') {
        state.lang = savedLang;
      }
    } catch (_e) {}

    // Load initial synthetic portrait immediately so visitors can test right away
    state.sourceCanvas = generateDemoPortraitCanvas(0);
    state.demoIndex = 1;
    state.zoom = 1.04;
    state.panY = -0.02;

    // Bind events
    $('langToggleBtn').addEventListener('click', function () {
      state.lang = state.lang === 'en' ? 'zh' : 'en';
      try { localStorage.setItem('craftleaf_lang', state.lang); } catch (_e) {}
      applyLanguage();
    });

    $('demoPortraitBtn').addEventListener('click', loadNextDemoPortrait);

    var fileInput = $('photoFileInput');
    var dropzone = $('uploadDropzone');
    dropzone.addEventListener('click', function () { fileInput.click(); });
    fileInput.addEventListener('change', function (e) {
      if (e.target.files && e.target.files[0]) loadPortraitFile(e.target.files[0]);
    });
    dropzone.addEventListener('dragover', function (e) {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', function () {
      dropzone.classList.remove('dragover');
    });
    dropzone.addEventListener('drop', function (e) {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        loadPortraitFile(e.dataTransfer.files[0]);
      }
    });

    $('presetSelect').addEventListener('change', function (e) {
      state.presetKey = resolvePresetKey(e.target.value);
      state.bgColor = PRESETS[state.presetKey].bgDefault;
      syncBgSwatchActive();
      refreshAllCanvases();
    });

    $('zoomSlider').addEventListener('input', function (e) {
      state.zoom = Number(e.target.value) / 100;
      $('zoomVal').textContent = e.target.value + '%';
      refreshAllCanvases();
    });

    $('rotateSlider').addEventListener('input', function (e) {
      state.rotationDeg = Number(e.target.value);
      $('rotateVal').textContent = (state.rotationDeg > 0 ? '+' : '') + state.rotationDeg + '°';
      refreshAllCanvases();
    });

    $('rotLeftBtn').addEventListener('click', function () {
      state.quadrantRot = (state.quadrantRot - 90) % 360;
      refreshAllCanvases();
    });
    $('rotRightBtn').addEventListener('click', function () {
      state.quadrantRot = (state.quadrantRot + 90) % 360;
      refreshAllCanvases();
    });
    $('recenterBtn').addEventListener('click', function () {
      state.panX = 0;
      state.panY = state.isDemo ? -0.02 : 0;
      state.zoom = state.isDemo ? 1.04 : 1.0;
      state.rotationDeg = 0;
      syncSlidersFromState();
      refreshAllCanvases();
    });
    $('flipBtn').addEventListener('click', function () {
      state.flipX = !state.flipX;
      refreshAllCanvases();
    });

    $('guidesCheckbox').addEventListener('change', function (e) {
      state.showGuides = e.target.checked;
      refreshAllCanvases();
    });
    $('trimMarksCheckbox').addEventListener('change', function (e) {
      state.showTrimMarks = e.target.checked;
      refreshAllCanvases();
    });

    $('brightSlider').addEventListener('input', function (e) {
      state.brightness = Number(e.target.value);
      $('brightVal').textContent = (state.brightness > 0 ? '+' : '') + state.brightness;
      refreshAllCanvases();
    });
    $('contrastSlider').addEventListener('input', function (e) {
      state.contrast = Number(e.target.value);
      $('contrastVal').textContent = (state.contrast > 0 ? '+' : '') + state.contrast;
      refreshAllCanvases();
    });
    $('bgBoostSlider').addEventListener('input', function (e) {
      state.bgBoost = Number(e.target.value);
      $('bgBoostVal').textContent = state.bgBoost + '%';
      refreshAllCanvases();
    });
    $('resetAdjBtn').addEventListener('click', function () {
      state.brightness = 0;
      state.contrast = 4;
      state.bgBoost = 45;
      state.bgColor = PRESETS[state.presetKey].bgDefault;
      syncBgSwatchActive();
      syncSlidersFromState();
      refreshAllCanvases();
    });

    var swatches = document.querySelectorAll('.swatch-btn');
    function syncBgSwatchActive() {
      for (var i = 0; i < swatches.length; i++) {
        swatches[i].classList.toggle('active', swatches[i].getAttribute('data-bg') === state.bgColor);
      }
    }
    for (var s = 0; s < swatches.length; s++) {
      swatches[s].addEventListener('click', function (ev) {
        state.bgColor = ev.currentTarget.getAttribute('data-bg') || '#FFFFFF';
        syncBgSwatchActive();
        refreshAllCanvases();
      });
    }

    // Direct canvas drag & wheel zoom
    var cropViewport = $('cropViewport');
    cropViewport.addEventListener('pointerdown', function (e) {
      state.dragging = true;
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      state.panStartX = state.panX;
      state.panStartY = state.panY;
      if (cropViewport.setPointerCapture) cropViewport.setPointerCapture(e.pointerId);
    });
    cropViewport.addEventListener('pointermove', function (e) {
      if (!state.dragging) return;
      var rect = cropViewport.getBoundingClientRect();
      var dx = (e.clientX - state.dragStartX) / Math.max(1, rect.width);
      var dy = (e.clientY - state.dragStartY) / Math.max(1, rect.height);
      state.panX = Math.max(-0.8, Math.min(0.8, state.panStartX + dx));
      state.panY = Math.max(-0.8, Math.min(0.8, state.panStartY + dy));
      refreshAllCanvases();
    });
    function endDrag() { state.dragging = false; }
    cropViewport.addEventListener('pointerup', endDrag);
    cropViewport.addEventListener('pointercancel', endDrag);
    cropViewport.addEventListener('wheel', function (e) {
      e.preventDefault();
      var delta = e.deltaY < 0 ? 0.04 : -0.04;
      state.zoom = Math.max(0.5, Math.min(2.8, Math.round((state.zoom + delta) * 100) / 100));
      syncSlidersFromState();
      refreshAllCanvases();
    }, { passive: false });

    // Sheet tabs
    $('tabBtn4x6').addEventListener('click', function () { setSheetTab('4x6'); });
    $('tabBtnA4').addEventListener('click', function () { setSheetTab('a4'); });

    // Exports
    $('dlSingleBtn').addEventListener('click', function () {
      var single = renderSingleBiometricCanvas();
      var p = PRESETS[state.presetKey];
      downloadCanvasPng(single, 'id-photo-' + p.id + '-' + p.widthPx + 'x' + p.heightPx + '-300dpi.png');
    });

    $('dl4x6Btn').addEventListener('click', function () {
      if (!isPro()) {
        openUnlockModal();
        return;
      }
      var single = renderSingleBiometricCanvas();
      var built = buildPrintSheetCanvas(single, '4x6', false);
      downloadCanvasPng(built.canvas, 'id-photo-' + state.presetKey + '-4x6in-1800x1200-300dpi.png');
    });

    $('dlA4Btn').addEventListener('click', function () {
      if (!isPro()) {
        openUnlockModal();
        return;
      }
      var single = renderSingleBiometricCanvas();
      var built = buildPrintSheetCanvas(single, 'a4', false);
      downloadCanvasPng(built.canvas, 'id-photo-' + state.presetKey + '-A4-2480x3508-300dpi.png');
    });

    $('printSheetBtn').addEventListener('click', function () {
      triggerPrintSheet(state.sheetKey);
    });
    window.addEventListener('beforeprint', function () {
      preparePrintMount(state.sheetKey);
    });
    window.addEventListener('afterprint', function () {
      document.body.classList.remove('print-sheet-mode');
    });

    // Pro Modal
    $('openProModalBtn').addEventListener('click', openUnlockModal);
    $('closeProModalBtn').addEventListener('click', closeUnlockModal);
    $('proModal').addEventListener('click', function (e) {
      if (e.target === $('proModal')) closeUnlockModal();
    });

    $('verifyKeyBtn').addEventListener('click', async function () {
      var raw = $('licenseKeyInput').value;
      var msgEl = $('licenseMsg');
      var dict = I18N[state.lang];
      if (!root.CraftLeafSDK) return;
      var res = await root.CraftLeafSDK.verifyLicense('idPhotoPro', raw);
      if (res && res.valid) {
        msgEl.textContent = dict.msgSuccess;
        msgEl.className = 'modal-msg ok';
        updateProUI();
        refreshAllCanvases();
        setTimeout(closeUnlockModal, 1100);
      } else {
        msgEl.textContent = dict.msgInvalid;
        msgEl.className = 'modal-msg err';
      }
    });

    if (window.location.hash === '#unlock-pro' && !isPro()) {
      openUnlockModal();
    }

    syncBgSwatchActive();
    syncSlidersFromState();
    applyLanguage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : globalThis);
