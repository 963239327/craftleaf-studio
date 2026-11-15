/**
 * CardSheet & Flashcard Print Layout Studio — Interactive Browser Application
 * Connects CardSheetCore + CraftLeafSDK to Live 1:1 mm DOM/SVG Stage, @media print Vector PDF & 300 DPI Canvas PNG.
 */
(function () {
  'use strict';

  var PRODUCT_ID = 'cardsheetPro';
  var KEY_PREFIX = 'CARDPRO';

  var I18N = {
    en: {
      appTitle: 'CardSheet & Flashcard Studio',
      appSub: '100% Local Browser Card Layout · Guillotine Crop Marks · Duplex Calibration',
      tabCards: 'Card & Flashcard Sheets',
      tab3d: '3D Standees & Tuckbox',
      portalLink: '← All Studio Tools',
      unlockBtn: '🔓 Unlock Pro ($9)',
      unlockedBtn: '✨ Pro Unlocked',
      secPaper: '1. Paper & Card Size Preset',
      lblPaper: 'Paper Size',
      lblOrient: 'Sheet Orientation',
      orientPortrait: 'Portrait',
      orientLandscape: 'Landscape',
      lblPreset: 'Card / Sticker Size Preset',
      lblCustomW: 'Card Width (mm)',
      lblCustomH: 'Card Height (mm)',
      lblRotateCard: 'Rotate Card 90° on Sheet',
      secInput: '2. Deck Content (Text Designer or Images)',
      modeText: '✍️ Flashcard / Card Designer',
      modeImage: '🖼️ Drag & Drop Images',
      lblSamples: 'Instant Sample Decks:',
      sampleVocab: '📚 Vocab Study',
      samplePnp: '⚔️ PnP Relic Deck',
      sampleDnd: '🎲 5e RPG Spells',
      sampleBiz: '💼 Business Cards',
      sampleSticker: '⭐ 50mm Stickers',
      sampleBatch54: '🧩 54-Card Batch (Pro)',
      lblRawDeck: 'Type/Paste Lines (Front | Back | Tag | Icon | Copies) or CSV / TSV / JSON:',
      btnImportCsv: '📂 Import CSV / TSV / JSON',
      btnClearDeck: 'Reset Sample',
      lblTheme: 'Card Visual Style',
      themeStudy: 'Clean Study Flashcard',
      themeTabletop: 'Tabletop Double-Frame',
      themeParchment: 'RPG Grimoire Parchment',
      themeMinimal: 'Minimal Business / Contact',
      themeBadge: 'Token / Sticker Badge',
      lblBackStyle: 'Card Back Content',
      backStyleDef: 'Per-Card Back Text / Definition',
      backStyleCrest: 'Unified Deck Crest Card Back',
      backStyleLowInk: 'Unified Low-Ink Eco Crest',
      lblCrestText: 'Unified Back Crest Title',
      lblFontScale: 'Typography Scale',
      dropFrontTitle: 'Drop Front Card Images Here (PNG / JPG / WebP / SVG)',
      dropFrontSub: 'Click or drag multiple card fronts — auto-paginated in filename order',
      dropBackTitle: 'Optional: Drop Shared Back Image (1 file) or Matched Backs (N files)',
      dropBackSub: '1 image = universal deck back; multiple images = matched 1-to-1 per card',
      btnClearImgs: 'Clear Uploaded Images',
      secMarks: '3. Shared Guillotine Crop Marks & Bleed',
      lblMarkStyle: 'Cut Guide Style',
      markGuillotine: 'Shared Margin Guillotine Ticks (8 Straight Cuts!)',
      markHairline: 'Full Through-Grid Hairlines',
      markCorners: 'Corner Crosshairs Only',
      markNone: 'No Crop Marks',
      lblGap: 'Gap Between Cards (mm)',
      lblBleed: 'Artwork Bleed (mm)',
      lblMargin: 'Printer Safe Margin (mm)',
      lblCardBorder: 'Print Inner Card Border',
      secDuplex: '4. Duplex Mirroring & Printer Offset Calibration',
      lblEnableDuplex: 'Generate Mirrored Duplex Back Sheets',
      lblFlipEdge: 'Printer Duplex Flip Axis',
      flipLong: 'Long-Edge Flip (Horizontal Mirror · Standard)',
      flipShort: 'Short-Edge Flip (Vertical Mirror + 180°)',
      lblPageOrder: 'Multi-Page Export Sequence',
      orderInterleaved: 'Interleaved (Front 1 → Back 1 → Front 2…)',
      orderGrouped: 'Grouped (All Fronts → All Backs)',
      lblOffsetX: 'Back Horizontal Shift (±X mm)',
      lblOffsetY: 'Back Vertical Shift (±Y mm)',
      btnResetOffset: 'Zero (0.0 mm)',
      duplexTip: '💡 Hold a test print against a window: if the back shifts left by 1.2mm, set +1.2mm X above for sub-millimeter alignment!',
      sec3dMode: '3D Tabletop Paper Craft Generator',
      subStandee: '🧍 Folded Paper Standees',
      subTuckbox: '📦 Parametric Deck Tuckbox',
      lblStandeeSize: 'Standee Base & Height Preset',
      standeeSmall: 'Small Creature (24 × 36 mm)',
      standeeMed: 'Medium 1-Inch Grid Hero (28 × 46 mm)',
      standeeLarge: 'Large Boss / Mecha (45 × 62 mm)',
      lblTuckW: 'Card Width (mm)',
      lblTuckH: 'Card Height (mm)',
      lblTuckCount: 'Deck Card Count',
      lblTuckGsm: 'Cardstock Thickness',
      gsm200: '200gsm Matte Cardstock (0.25mm/card)',
      gsm250: '250–300gsm Pro Core (0.31mm/card)',
      gsmSleeved: 'Sleeved Cards 60–100μm (0.46mm/card)',
      lblTuckTitle: 'Box Cover & Spine Title',
      lblTuckSub: 'Box Subtitle / Specs',
      btnPrintPdf: '🖨️ Print / Save Vector PDF',
      btnExportPng: '🖼️ Export 300 DPI PNG',
      btnExportSvg: '📐 Download 1:1 SVG Die-Line',
      lblZoom: 'Preview Zoom:',
      pnpBadge: '🎲 FROM OUR INDIE TABLETOP STUDIO',
      pnpTitle: 'Love Print-and-Play? Try Our 3 Original 2-Player Strategy Board Games!',
      pnpDesc: 'Play instant solo matches vs. built-in AI right in your browser, or grab the bilingual A4 + US Letter + Low-Ink Print-and-Play Trilogy Bundle.',
      pnpPlayBtn: '▶️ Play Free vs. AI in Browser',
      pnpBuyBtn: '📦 Get PnP Trilogy Bundle',
      seoGuidesTitle: '📘 Popular Print & Layout Use-Case Guides',
      modalTitle: 'Unlock CardSheet Studio Pro — Lifetime License',
      modalSubtitle: 'One-time $9.00 purchase (or Studio All-Access Pass). 100% local privacy, zero subscriptions.',
      modalFeat1: 'Unlimited Multi-Page Batch Deck Export (CSV / TSV / JSON / 54+ card decks auto-paginated)',
      modalFeat2: 'Duplex Back-Page Mirroring + 0.1mm Printer Offset Calibration (±X / ±Y mm)',
      modalFeat3: '3D Folded A-Frame Paper Standees & Custom Parametric Deck Tuckbox SVG/PDF Export',
      btnBuyPro: 'Buy CardSheet Pro Key ($9.00)',
      btnBuyAllAccess: 'Get Studio All-Access Pass ($19)',
      lblHaveKey: 'Already have a CARDPRO or STUDIOALL license key?',
      btnActivateKey: 'Activate Pro',
      btnPrintFree1Sheet: 'Or Print Free Single Front Sheet (Page 1 Only)',
      keySuccess: '✅ License verified! All Pro batch, duplex calibration & 3D features are permanently unlocked.',
      keyInvalid: '❌ Invalid license key checksum. Check format CARDPRO-XXXX-XXXX-XXXXXX.',
      freeBadgeNote: 'Free Tier: 1 Front Sheet unlimited prints · Pro ($9): Unlimited Batch + Duplex Calibration + 3D Tuckbox'
    },
    zh: {
      appTitle: 'CardSheet 卡牌与闪卡拼版工坊',
      appSub: '100% 浏览器纯本地排版 · 共线直刀裁切线 · 双面打印毫米级纠偏',
      tabCards: '卡牌 / 单词闪卡拼版',
      tab3d: '3D 折纸立牌与卡盒刀版',
      portalLink: '← 返回工坊全部工具',
      unlockBtn: '🔓 解锁专业版 (¥29.9)',
      unlockedBtn: '✨ 专业版已激活',
      secPaper: '1. 打印纸张与标准尺寸预设',
      lblPaper: '纸张规格',
      lblOrient: '纸张方向',
      orientPortrait: '竖版 (Portrait)',
      orientLandscape: '横版 (Landscape)',
      lblPreset: '卡牌 / 闪卡 / 名片 / 贴纸预设',
      lblCustomW: '卡片宽度 (mm)',
      lblCustomH: '卡片高度 (mm)',
      lblRotateCard: '单卡在纸面旋转 90° 排布',
      secInput: '2. 卡组内容输入（文本闪卡生成 / 拖拽图片）',
      modeText: '✍️ 文本/单词闪卡设计器',
      modeImage: '🖼️ 拖拽正背面卡图',
      lblSamples: '一键载入体验卡组：',
      sampleVocab: '📚 双语单词闪卡',
      samplePnp: '⚔️ 微缩桌游卡组',
      sampleDnd: '🎲 跑团法术物品卡',
      sampleBiz: '💼 极简双面名片',
      sampleSticker: '⭐ 50mm 方形贴纸',
      sampleBatch54: '🧩 54张全套卡组 (Pro)',
      lblRawDeck: '输入或粘贴文本（正面 | 背面 | 标签 | 图标 | 份数）或直接粘贴 CSV / TSV / JSON：',
      btnImportCsv: '📂 批量导入 CSV / TSV / JSON',
      btnClearDeck: '恢复默认示例',
      lblTheme: '卡面视觉主题',
      themeStudy: '清爽背诵闪卡风',
      themeTabletop: '经典双线桌游边框',
      themeParchment: '复古羊皮纸法术书',
      themeMinimal: '极简商务名片风',
      themeBadge: '桌游指示物贴纸徽章',
      lblBackStyle: '卡牌背面内容模式',
      backStyleDef: '每张独立背面释义 / 详情文本',
      backStyleCrest: '统一深色桌游牌背纹章',
      backStyleLowInk: '统一省墨线框桌游牌背',
      lblCrestText: '统一牌背中央标题',
      lblFontScale: '字号缩放比例',
      dropFrontTitle: '拖拽正面卡图到此（支持多选 PNG / JPG / WebP / SVG）',
      dropFrontSub: '点击选择或拖入多张图片，全部在本地内存处理，绝不上传服务器',
      dropBackTitle: '可选：拖入牌背图片（1 张=全局通用牌背；多张=按文件名一一对应）',
      dropBackSub: '配合双面镜像与毫米级偏移校准，家用打印机也能正反严丝合缝',
      btnClearImgs: '清空已选图片',
      secMarks: '3. 共线直刀裁剪线与出血留白',
      lblMarkStyle: '裁切辅助线样式',
      markGuillotine: '外边距共线直刀线（3×3 仅需 8 刀裁完！）',
      markHairline: '全贯通极细辅助线',
      markCorners: '四角十字裁切标',
      markNone: '隐藏裁切线',
      lblGap: '卡片间距 Gap (mm)',
      lblBleed: '画面出血边 Bleed (mm)',
      lblMargin: '打印机安全留白 (mm)',
      lblCardBorder: '绘制卡面内边框线',
      secDuplex: '4. 双面自动镜像与打印机毫米级偏移校准',
      lblEnableDuplex: '开启双面打印背面镜像页',
      lblFlipEdge: '打印机双面翻转轴向',
      flipLong: '长边翻转（水平左右镜像 · 竖版标准双面）',
      flipShort: '短边翻转（上下垂直镜像 + 180°旋转）',
      lblPageOrder: '多页输出排列顺序',
      orderInterleaved: '正反交替（正1 → 背1 → 正2 · 自动双面直出）',
      orderGrouped: '正反分组（全部正面 → 全部背面 · 手动翻面）',
      lblOffsetX: '背面水平纠偏 (±X mm)',
      lblOffsetY: '背面垂直纠偏 (±Y mm)',
      btnResetOffset: '归零 (0.0 mm)',
      duplexTip: '💡 校准秘诀：先打 1 张测试页对着窗户透光观察，若背面偏左 1.2mm，只需将上方 X 设为 +1.2mm 即可零误差对齐！',
      sec3dMode: '3D 折纸桌游立牌与参数化卡盒生成器',
      subStandee: '🧍 折叠三角桌游立牌',
      subTuckbox: '📦 参数化卡盒展开刀版',
      lblStandeeSize: '立牌底座与高度规格',
      standeeSmall: '小型怪物/随从 (24 × 36 mm)',
      standeeMed: '标准 1英寸跑团格子英雄 (28 × 46 mm)',
      standeeLarge: '大型 Boss / 机甲立牌 (45 × 62 mm)',
      lblTuckW: '内部卡牌宽度 (mm)',
      lblTuckH: '内部卡牌高度 (mm)',
      lblTuckCount: '收纳卡牌张数',
      lblTuckGsm: '卡纸克重与牌套厚度',
      gsm200: '200g 哑粉/白卡裸牌 (0.25mm/张)',
      gsm250: '250–300g 专业蓝芯卡纸 (0.31mm/张)',
      gsmSleeved: '已套磨砂牌套卡牌 (0.46mm/张)',
      lblTuckTitle: '卡盒封面与侧脊主标题',
      lblTuckSub: '卡盒副标题 / 容量标注',
      btnPrintPdf: '🖨️ 矢量打印 / 导出 PDF',
      btnExportPng: '🖼️ 导出 300 DPI 高清拼版图',
      btnExportSvg: '📐 下载 1:1 矢量 SVG 刀版',
      lblZoom: '画布缩放：',
      pnpBadge: '🎲 青叶像素独立桌游推荐',
      pnpTitle: '喜欢打印即玩 (PnP)？来体验我们原创的 3 款双人策略桌面游戏！',
      pnpDesc: '无需下载即可在浏览器免费挑战内置 AI 陪练，支持一键获取中英双语 A4 + US Letter + 省墨版完整打印典藏合集。',
      pnpPlayBtn: '▶️ 免费在线试玩 (AI 陪练)',
      pnpBuyBtn: '📦 获取三部曲完整打印包',
      seoGuidesTitle: '📘 热门卡牌拼版与双面打印专题指南',
      modalTitle: '解锁 CardSheet Studio Pro 专业版（一次买断永久可用）',
      modalSubtitle: '仅需 $9.00 / ¥29.9 一次性激活码买断（或工坊全通证），零订阅，100% 本地隐私运行。',
      modalFeat1: '无限页数批量套版导出（支持 CSV / TSV / JSON 与 54+ 张全套桌游卡组自动分页）',
      modalFeat2: '双面打印自动镜像 + 0.1mm 精度家用打印机进纸偏移校准 (±X / ±Y mm)',
      modalFeat3: '3D 折纸桌游立牌（背面自动倒置对齐）与自定义牌厚参数化卡盒 SVG/PDF 刀版导出',
      btnBuyPro: '获取 CardSheet Pro 激活码 ($9 / ¥29.9)',
      btnBuyAllAccess: '获取工坊全产品通证 ($19 / ¥69)',
      lblHaveKey: '已购买 CARDPRO 或 STUDIOALL 激活码？在此输入立即解锁：',
      btnActivateKey: '立即激活专业版',
      btnPrintFree1Sheet: '先免费打印单页正面（仅导出第 1 页正面）',
      keySuccess: '✅ 激活码校验通过！批量多页、双面毫米校准与 3D 立牌卡盒导出已永久解锁。',
      keyInvalid: '❌ 激活码格式或校验和无效，请核对 CARDPRO-XXXX-XXXX-XXXXXX。',
      freeBadgeNote: '免费版：单页正面高清拼版与共线裁切线永久免费 · Pro版：解锁无限批量分页 + 双面偏移校准 + 3D立牌卡盒'
    }
  };

  var state = {
    lang: 'en',
    workspaceTab: 'cards', // 'cards' | '3d-studio'
    sub3dMode: 'standee',  // 'standee' | 'tuckbox'
    paperId: 'a4',
    orientation: 'portrait',
    presetId: 'poker',
    customWMm: 63.5,
    customHMm: 88.9,
    rotateCards: false,
    inputMode: 'text', // 'text' | 'image'
    activeSample: 'vocab',
    rawDeckText: CardSheetCore.SAMPLE_DECKS.vocab.rawText,
    theme: 'study',
    backStyle: 'def', // 'def' | 'crest' | 'low-ink'
    crestText: '📚 ACTIVE RECALL',
    fontScale: 100,
    uploadedFronts: [], // [{ name, dataUrl, imgEl }]
    uploadedBacks: [],  // [{ name, dataUrl, imgEl }]
    markStyle: 'guillotine', // 'guillotine' | 'hairline' | 'corners' | 'none'
    gapMm: 0,
    bleedMm: 0,
    safeMarginMm: 5.0,
    showInnerBorder: true,
    includeBacks: false,
    flipEdge: 'long',
    pageOrder: 'interleaved',
    offsetXMm: 0,
    offsetYMm: 0,
    standeeSize: 'medium',
    tuckCardW: 63.5,
    tuckCardH: 88.9,
    tuckCount: 54,
    tuckThickness: 0.31,
    tuckTitle: 'RELIC DUEL',
    tuckSubtitle: '54 Cards · 63.5×88.9mm PnP Edition',
    zoom: 0.72,
    freeSinglePageOverride: false
  };

  function $(id) {
    return document.getElementById(id);
  }

  function t(key) {
    var dict = I18N[state.lang] || I18N.en;
    return dict[key] !== undefined ? dict[key] : (I18N.en[key] || key);
  }

  function isProUnlocked() {
    if (window.__CARDSHEET_OFFLINE_PRO_EDITION__ === true) return true;
    if (window.CraftLeafSDK && CraftLeafSDK.isUnlocked(PRODUCT_ID, KEY_PREFIX)) return true;
    return false;
  }

  function getActiveCards() {
    if (state.inputMode === 'image' && state.uploadedFronts.length > 0) {
      var sharedBack = state.uploadedBacks.length === 1 ? state.uploadedBacks[0] : null;
      return state.uploadedFronts.map(function (f, idx) {
        var matchedBack = sharedBack || state.uploadedBacks[idx] || null;
        return {
          id: 'img-card-' + (idx + 1),
          index: idx,
          front: f.name,
          back: '',
          tag: '',
          icon: '',
          frontImg: f.dataUrl,
          frontImgEl: f.imgEl,
          backImg: matchedBack ? matchedBack.dataUrl : null,
          backImgEl: matchedBack ? matchedBack.imgEl : null
        };
      });
    }
    return CardSheetCore.parseDeckInput(state.rawDeckText, 'auto');
  }

  function applyPresetDefaults(presetId, loadRecommendedSample) {
    var p = CardSheetCore.PRESETS[presetId] || CardSheetCore.PRESETS.poker;
    state.presetId = p.id;
    state.orientation = p.defaultOrientation || 'portrait';
    state.gapMm = p.defaultGapMm;
    state.bleedMm = p.defaultBleedMm;
    state.safeMarginMm = p.defaultSafeMarginMm;
    state.rotateCards = false;
    if (p.id !== 'custom') {
      state.customWMm = p.widthMm;
      state.customHMm = p.heightMm;
      state.tuckCardW = p.widthMm;
      state.tuckCardH = p.heightMm;
    }
    if (loadRecommendedSample && p.recommendedSample && CardSheetCore.SAMPLE_DECKS[p.recommendedSample]) {
      loadSampleDeck(p.recommendedSample, false);
    }
    syncFormInputsFromState();
  }

  function loadSampleDeck(sampleId, shouldRender) {
    var samp = CardSheetCore.SAMPLE_DECKS[sampleId];
    if (!samp) return;
    state.activeSample = sampleId;
    state.inputMode = 'text';
    state.rawDeckText = samp.rawText;
    state.theme = samp.theme || 'study';
    state.crestText = samp.backCrest || '⚔️ RELIC DUEL';
    if (sampleId === 'pnp' || sampleId === 'batch54') {
      state.backStyle = 'crest';
    } else {
      state.backStyle = 'def';
    }
    if (sampleId === 'batch54') {
      state.includeBacks = true;
    }
    syncFormInputsFromState();
    if (shouldRender !== false) renderAll();
  }

  function syncFormInputsFromState() {
    if ($('presetSelect')) $('presetSelect').value = state.presetId;
    if ($('customWInput')) $('customWInput').value = state.customWMm;
    if ($('customHInput')) $('customHInput').value = state.customHMm;
    if ($('customDimsRow')) $('customDimsRow').style.display = state.presetId === 'custom' ? 'grid' : 'none';
    if ($('rotateCardCheck')) $('rotateCardCheck').checked = state.rotateCards;
    if ($('deckTextarea')) $('deckTextarea').value = state.rawDeckText;
    if ($('themeSelect')) $('themeSelect').value = state.theme;
    if ($('backStyleSelect')) $('backStyleSelect').value = state.backStyle;
    if ($('crestInput')) $('crestInput').value = state.crestText;
    if ($('fontScaleRange')) $('fontScaleRange').value = state.fontScale;
    if ($('fontScaleVal')) $('fontScaleVal').textContent = state.fontScale + '%';
    if ($('markStyleSelect')) $('markStyleSelect').value = state.markStyle;
    if ($('gapInput')) $('gapInput').value = state.gapMm;
    if ($('gapRange')) $('gapRange').value = state.gapMm;
    if ($('bleedInput')) $('bleedInput').value = state.bleedMm;
    if ($('bleedRange')) $('bleedRange').value = state.bleedMm;
    if ($('marginInput')) $('marginInput').value = state.safeMarginMm;
    if ($('marginRange')) $('marginRange').value = state.safeMarginMm;
    if ($('innerBorderCheck')) $('innerBorderCheck').checked = state.showInnerBorder;
    if ($('duplexCheck')) $('duplexCheck').checked = state.includeBacks;
    if ($('flipEdgeSelect')) $('flipEdgeSelect').value = state.flipEdge;
    if ($('pageOrderSelect')) $('pageOrderSelect').value = state.pageOrder;
    if ($('offsetXRange')) $('offsetXRange').value = state.offsetXMm;
    if ($('offsetXInput')) $('offsetXInput').value = state.offsetXMm;
    if ($('offsetYRange')) $('offsetYRange').value = state.offsetYMm;
    if ($('offsetYInput')) $('offsetYInput').value = state.offsetYMm;
    if ($('standeeSizeSelect')) $('standeeSizeSelect').value = state.standeeSize;
    if ($('tuckWInput')) $('tuckWInput').value = state.tuckCardW;
    if ($('tuckHInput')) $('tuckHInput').value = state.tuckCardH;
    if ($('tuckCountInput')) $('tuckCountInput').value = state.tuckCount;
    if ($('tuckGsmSelect')) $('tuckGsmSelect').value = String(state.tuckThickness);
    if ($('tuckTitleInput')) $('tuckTitleInput').value = state.tuckTitle;
    if ($('tuckSubInput')) $('tuckSubInput').value = state.tuckSubtitle;
    if ($('zoomSelect')) $('zoomSelect').value = String(state.zoom);

    // Segmented buttons active states
    setSegActive('paperA4Btn', state.paperId === 'a4');
    setSegActive('paperLetterBtn', state.paperId === 'letter');
    setSegActive('orientPortraitBtn', state.orientation === 'portrait');
    setSegActive('orientLandscapeBtn', state.orientation === 'landscape');
    setSegActive('inputModeTextBtn', state.inputMode === 'text');
    setSegActive('inputModeImgBtn', state.inputMode === 'image');
    setSegActive('tabCardsBtn', state.workspaceTab === 'cards');
    setSegActive('tab3dBtn', state.workspaceTab === '3d-studio');
    setSegActive('subStandeeBtn', state.sub3dMode === 'standee');
    setSegActive('subTuckboxBtn', state.sub3dMode === 'tuckbox');

    if ($('textDesignerPane')) $('textDesignerPane').style.display = state.inputMode === 'text' ? 'block' : 'none';
    if ($('imageDropPane')) $('imageDropPane').style.display = state.inputMode === 'image' ? 'block' : 'none';
    if ($('cardsSidebarSections')) $('cardsSidebarSections').style.display = state.workspaceTab === 'cards' ? 'contents' : 'none';
    if ($('studio3dSidebarSection')) $('studio3dSidebarSection').style.display = state.workspaceTab === '3d-studio' ? 'block' : 'none';
    if ($('standeeControlsPane')) $('standeeControlsPane').style.display = state.sub3dMode === 'standee' ? 'block' : 'none';
    if ($('tuckboxControlsPane')) $('tuckboxControlsPane').style.display = state.sub3dMode === 'tuckbox' ? 'block' : 'none';
    if ($('exportSvgBtn')) $('exportSvgBtn').style.display = (state.workspaceTab === '3d-studio' && state.sub3dMode === 'tuckbox') ? 'inline-flex' : 'none';
  }

  function setSegActive(id, active) {
    var el = $(id);
    if (!el) return;
    if (active) el.classList.add('active');
    else el.classList.remove('active');
  }

  function updateDynamicPrintPageRule(paperId, orientation) {
    var paper = CardSheetCore.PAPERS[paperId] || CardSheetCore.PAPERS.a4;
    var sizeCss = orientation === 'landscape' ? paper.cssSizeLandscape : paper.cssSizePortrait;
    var wMm = orientation === 'landscape' ? paper.heightMm : paper.widthMm;
    var hMm = orientation === 'landscape' ? paper.widthMm : paper.heightMm;
    var st = $('dynamicPageStyle');
    if (!st) {
      st = document.createElement('style');
      st.id = 'dynamicPageStyle';
      document.head.appendChild(st);
    }
    st.textContent = '@page { size: ' + sizeCss + '; margin: 0; }\n' +
      '@media print { .print-sheet { width: ' + wMm + 'mm !important; height: ' + hMm + 'mm !important; } }';
  }

  function buildSheetGuidesSvg(page, grid) {
    var w = grid.paperWMm;
    var h = grid.paperHMm;
    var style = state.markStyle;
    var parts = [
      '<svg class="sheet-guides-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '">'
    ];

    if (style !== 'none') {
      var vCuts = page.verticalCutsMm || [];
      var hCuts = page.horizontalCutsMm || [];
      var strokeColor = '#0f172a';
      var strokeW = 0.24;

      var topTickStart = 1.2;
      var topTickEnd = Math.max(2.6, Math.min(grid.originYMm - 1.2, 8.5));
      var botTickEnd = h - 1.2;
      var botTickStart = Math.min(h - 2.6, Math.max(h - grid.originYMm + 1.2, h - 8.5));

      var leftTickStart = 1.2;
      var leftTickEnd = Math.max(2.6, Math.min(grid.originXMm - 1.2, 8.5));
      var rightTickEnd = w - 1.2;
      var rightTickStart = Math.min(w - 2.6, Math.max(w - grid.originXMm + 1.2, w - 8.5));

      if (style === 'guillotine' || style === 'hairline') {
        for (var i = 0; i < vCuts.length; i++) {
          var x = vCuts[i];
          if (grid.originYMm >= 2.2) {
            parts.push('<line x1="' + x + '" y1="' + topTickStart + '" x2="' + x + '" y2="' + topTickEnd + '" stroke="' + strokeColor + '" stroke-width="' + strokeW + '" />');
            parts.push('<line x1="' + x + '" y1="' + botTickStart + '" x2="' + x + '" y2="' + botTickEnd + '" stroke="' + strokeColor + '" stroke-width="' + strokeW + '" />');
          } else {
            parts.push('<line x1="' + x + '" y1="0" x2="' + x + '" y2="2.5" stroke="' + strokeColor + '" stroke-width="' + strokeW + '" />');
            parts.push('<line x1="' + x + '" y1="' + (h - 2.5) + '" x2="' + x + '" y2="' + h + '" stroke="' + strokeColor + '" stroke-width="' + strokeW + '" />');
          }
          if (style === 'hairline') {
            parts.push('<line x1="' + x + '" y1="' + topTickEnd + '" x2="' + x + '" y2="' + botTickStart + '" stroke="#94a3b8" stroke-width="0.16" stroke-dasharray="1.5,1.5" />');
          }
        }

        for (var j = 0; j < hCuts.length; j++) {
          var y = hCuts[j];
          if (grid.originXMm >= 2.2) {
            parts.push('<line x1="' + leftTickStart + '" y1="' + y + '" x2="' + leftTickEnd + '" y2="' + y + '" stroke="' + strokeColor + '" stroke-width="' + strokeW + '" />');
            parts.push('<line x1="' + rightTickStart + '" y1="' + y + '" x2="' + rightTickEnd + '" y2="' + y + '" stroke="' + strokeColor + '" stroke-width="' + strokeW + '" />');
          } else {
            parts.push('<line x1="0" y1="' + y + '" x2="2.5" y2="' + y + '" stroke="' + strokeColor + '" stroke-width="' + strokeW + '" />');
            parts.push('<line x1="' + (w - 2.5) + '" y1="' + y + '" x2="' + w + '" y2="' + y + '" stroke="' + strokeColor + '" stroke-width="' + strokeW + '" />');
          }
          if (style === 'hairline') {
            parts.push('<line x1="' + leftTickEnd + '" y1="' + y + '" x2="' + rightTickStart + '" y2="' + y + '" stroke="#94a3b8" stroke-width="0.16" stroke-dasharray="1.5,1.5" />');
          }
        }
      } else if (style === 'corners') {
        for (var vx = 0; vx < vCuts.length; vx++) {
          for (var hy = 0; hy < hCuts.length; hy++) {
            var cx = vCuts[vx];
            var cy = hCuts[hy];
            parts.push('<line x1="' + (cx - 1.8) + '" y1="' + cy + '" x2="' + (cx + 1.8) + '" y2="' + cy + '" stroke="#334155" stroke-width="0.2" />');
            parts.push('<line x1="' + cx + '" y1="' + (cy - 1.8) + '" x2="' + cx + '" y2="' + (cy + 1.8) + '" stroke="#334155" stroke-width="0.2" />');
          }
        }
      }
    }

    // Duplex Light-Hold Alignment Crosshair Target in top margin when duplex is enabled
    if (state.includeBacks && page.calibrationCrosshair && grid.originYMm >= 6.5) {
      var tx = page.calibrationCrosshair.xMm;
      var ty = page.calibrationCrosshair.yMm;
      var col = page.side === 'back' ? '#6d28d9' : '#0f172a';
      parts.push('<circle cx="' + tx + '" cy="' + ty + '" r="1.8" fill="none" stroke="' + col + '" stroke-width="0.22" />');
      parts.push('<line x1="' + (tx - 3.2) + '" y1="' + ty + '" x2="' + (tx + 3.2) + '" y2="' + ty + '" stroke="' + col + '" stroke-width="0.22" />');
      parts.push('<line x1="' + tx + '" y1="' + (ty - 2.6) + '" x2="' + tx + '" y2="' + (ty + 2.6) + '" stroke="' + col + '" stroke-width="0.22" />');
      for (var mm = -4; mm <= 4; mm++) {
        if (mm === 0) continue;
        parts.push('<line x1="' + (tx + mm) + '" y1="' + (ty - 0.7) + '" x2="' + (tx + mm) + '" y2="' + (ty + 0.7) + '" stroke="' + col + '" stroke-width="0.16" />');
      }
    }

    parts.push('</svg>');
    return parts.join('');
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildCardInnerHtml(card, side, grid) {
    var baseFontPt = Math.max(7.0, Math.min(13.5, Math.min(grid.cardWMm, grid.cardHMm) * 0.145)) * (state.fontScale / 100.0);
    var radiusCss = (grid.bleedMm === 0 && grid.gapMm > 0 && grid.cornerRadiusMm > 0) ? (grid.cornerRadiusMm + 'mm') : '0mm';

    if (side === 'front' && card.frontImg) {
      return '<img class="card-img-fill" src="' + card.frontImg + '" alt="' + escapeHtml(card.front) + '" />';
    }
    if (side === 'back' && card.backImg) {
      return '<img class="card-img-fill" src="' + card.backImg + '" alt="Card Back" />';
    }

    if (side === 'back' && (state.backStyle === 'crest' || state.backStyle === 'low-ink' || (!card.back && state.inputMode === 'image'))) {
      var lowInkCls = state.backStyle === 'low-ink' ? ' low-ink' : '';
      return '<div class="card-crest-back' + lowInkCls + '" style="font-size:' + baseFontPt.toFixed(1) + 'pt;border-radius:' + radiusCss + ';">' +
        '<div style="font-size:1.8em;margin-bottom:4px;">✦</div>' +
        '<div style="font-weight:800;letter-spacing:0.08em;font-size:0.92em;">' + escapeHtml(state.crestText || 'CRAFTLEAF') + '</div>' +
        '</div>';
    }

    var frameCls = state.showInnerBorder ? ' with-frame' : '';
    var themeCls = 'theme-' + (state.theme || 'study');

    if (side === 'front') {
      var showSubOnSingleSide = !state.includeBacks && card.back && state.theme !== 'study';
      return '<div class="card-designed ' + themeCls + frameCls + '" style="font-size:' + baseFontPt.toFixed(1) + 'pt;border-radius:' + radiusCss + ';">' +
        '<div class="card-top-bar">' +
          (card.tag ? '<span class="card-tag-pill">' + escapeHtml(card.tag) + '</span>' : '<span></span>') +
          (card.icon ? '<span class="card-icon-glyph">' + escapeHtml(card.icon) + '</span>' : '') +
        '</div>' +
        '<div class="card-center-body">' +
          '<div class="card-front-heading">' + escapeHtml(card.front) + '</div>' +
          (showSubOnSingleSide ? '<div class="card-front-subhint">' + escapeHtml(card.back) + '</div>' : '') +
        '</div>' +
        '<div class="card-foot-bar">' +
          '<span>#' + (card.index + 1) + '</span>' +
          '<span>' + (state.includeBacks ? 'FRONT' : (grid.cardWMm + '×' + grid.cardHMm + 'mm')) + '</span>' +
        '</div>' +
      '</div>';
    }

    // Back side with per-card definition/answer
    return '<div class="card-designed ' + themeCls + frameCls + '" style="font-size:' + baseFontPt.toFixed(1) + 'pt;border-radius:' + radiusCss + ';">' +
      '<div class="card-top-bar">' +
        '<span class="card-tag-pill">' + escapeHtml(card.front) + '</span>' +
        (card.icon ? '<span class="card-icon-glyph">' + escapeHtml(card.icon) + '</span>' : '') +
      '</div>' +
      '<div class="card-center-body">' +
        '<div class="card-back-definition">' + escapeHtml(card.back || '—') + '</div>' +
      '</div>' +
      '<div class="card-foot-bar">' +
        '<span>#' + (card.index + 1) + ' · BACK</span>' +
        '<span>' + escapeHtml(card.tag || '') + '</span>' +
      '</div>' +
    '</div>';
  }

  function renderCardSheetsStage() {
    var stage = $('sheetStageScroll');
    if (!stage) return;

    var cards = getActiveCards();
    var grid = CardSheetCore.computeSheetGrid({
      paperId: state.paperId,
      orientation: state.orientation,
      presetId: state.presetId,
      customWMm: state.customWMm,
      customHMm: state.customHMm,
      rotateCards: state.rotateCards,
      bleedMm: state.bleedMm,
      gapMm: state.gapMm,
      safeMarginMm: state.safeMarginMm
    });

    updateDynamicPrintPageRule(grid.paperId, grid.orientation);

    var pages = CardSheetCore.computePaginatedSheets(cards, grid, {
      includeBacks: state.includeBacks,
      flipEdge: state.flipEdge,
      pageOrder: state.pageOrder,
      offsetXMm: state.offsetXMm,
      offsetYMm: state.offsetYMm
    });

    // Update sidebar metric banner
    var metricEl = $('gridMetricBanner');
    if (metricEl) {
      if (state.lang === 'zh') {
        metricEl.innerHTML = '<span>📐 ' + grid.cols + '列 × ' + grid.rows + '行 = <strong>' + grid.perSheet + ' 张/页</strong></span>' +
          '<span>✂️ 共线直裁 <strong>' + grid.totalGuillotineCuts + ' 刀</strong> · 共 ' + pages.length + ' 页</span>';
      } else {
        metricEl.innerHTML = '<span>📐 ' + grid.cols + ' × ' + grid.rows + ' = <strong>' + grid.perSheet + ' cards/sheet</strong></span>' +
          '<span>✂️ <strong>' + grid.totalGuillotineCuts + ' straight cuts</strong> · ' + pages.length + ' page(s)</span>';
      }
    }

    var pxPerMmScreen = 3.779527559; // 96 DPI CSS mm
    var scaledWrapperH = Math.round(grid.paperHMm * pxPerMmScreen * state.zoom);
    var scaledWrapperW = Math.round(grid.paperWMm * pxPerMmScreen * state.zoom);

    var proUnlocked = isProUnlocked();
    var html = [];

    for (var pIdx = 0; pIdx < pages.length; pIdx++) {
      var page = pages[pIdx];
      var isProPage = (page.side === 'back') || (page.sheetNumber > 1);
      var sideLabel = page.side === 'front'
        ? (state.lang === 'zh' ? '正面 (Front)' : 'FRONT SIDE')
        : (state.lang === 'zh'
          ? ('镜像背面 (Back · 纠偏 X:' + (page.offsetXMm >= 0 ? '+' : '') + page.offsetXMm + 'mm, Y:' + (page.offsetYMm >= 0 ? '+' : '') + page.offsetYMm + 'mm)')
          : ('MIRRORED BACK (Offset X:' + (page.offsetXMm >= 0 ? '+' : '') + page.offsetXMm + 'mm, Y:' + (page.offsetYMm >= 0 ? '+' : '') + page.offsetYMm + 'mm)'));

      var lockBadge = (!proUnlocked && isProPage)
        ? ' <span class="pro-pill-mini">PRO EXPORT</span>'
        : '';

      var excludeCls = (state.freeSinglePageOverride && pIdx > 0) ? ' print-excluded' : '';

      html.push('<div class="sheet-wrapper' + excludeCls + '" style="min-height:' + (scaledWrapperH + 30) + 'px;min-width:' + scaledWrapperW + 'px;">');
      html.push(
        '<div class="sheet-caption">' +
          '<span>' + (state.lang === 'zh' ? ('第 ' + (pIdx + 1) + ' / ' + pages.length + ' 页（卡组第 ' + page.sheetNumber + ' 张纸）') : ('Page ' + (pIdx + 1) + ' of ' + pages.length + ' (Sheet #' + page.sheetNumber + ')')) + '</span>' +
          '<span class="side-badge ' + page.side + '">' + sideLabel + '</span>' +
          lockBadge +
        '</div>'
      );
      html.push(
        '<div class="print-sheet" data-page-index="' + pIdx + '" style="width:' + grid.paperWMm + 'mm;height:' + grid.paperHMm + 'mm;transform:scale(' + state.zoom + ');">'
      );

      for (var s = 0; s < page.slots.length; s++) {
        var slot = page.slots[s];
        var rotCss = slot.rotateDeg ? ('transform:rotate(' + slot.rotateDeg + 'deg);') : '';
        html.push(
          '<div class="card-cell" style="left:' + slot.cellXMm + 'mm;top:' + slot.cellYMm + 'mm;width:' + grid.cellWMm + 'mm;height:' + grid.cellHMm + 'mm;' + rotCss + '">' +
            '<div class="card-trim-box" style="left:' + grid.bleedMm + 'mm;top:' + grid.bleedMm + 'mm;width:' + grid.cardWMm + 'mm;height:' + grid.cardHMm + 'mm;">' +
              buildCardInnerHtml(slot.card, page.side, grid) +
            '</div>' +
          '</div>'
        );
      }

      html.push(buildSheetGuidesSvg(page, grid));
      html.push('</div></div>');
    }

    stage.innerHTML = html.join('');
    state._lastGrid = grid;
    state._lastPages = pages;
  }

  function render3dStudioStage() {
    var stage = $('sheetStageScroll');
    if (!stage) return;
    var pxPerMmScreen = 3.779527559;
    var proUnlocked = isProUnlocked();

    if (state.sub3dMode === 'standee') {
      var cards = getActiveCards();
      var sheets = CardSheetCore.computeStandeeLayout(cards, {
        paperId: state.paperId,
        sizePreset: state.standeeSize
      });
      var sh0 = sheets[0];
      updateDynamicPrintPageRule(state.paperId, 'portrait');

      var scaledH = Math.round(sh0.paperHMm * pxPerMmScreen * state.zoom);
      var scaledW = Math.round(sh0.paperWMm * pxPerMmScreen * state.zoom);
      var html = [];

      for (var p = 0; p < sheets.length; p++) {
        var sh = sheets[p];
        html.push('<div class="sheet-wrapper" style="min-height:' + (scaledH + 30) + 'px;min-width:' + scaledW + 'px;">');
        html.push(
          '<div class="sheet-caption">' +
            '<span>' + (state.lang === 'zh'
              ? ('3D 折叠桌游立牌拼版 · 第 ' + sh.sheetNumber + ' 页（每页 ' + sh.perSheet + ' 枚，反面已自动 180° 倒置对齐折痕）')
              : ('3D Folded A-Frame Standees · Sheet ' + sh.sheetNumber + ' (' + sh.perSheet + '/sheet · Back auto-inverted 180° across mountain fold)')) +
            '</span>' +
            (!proUnlocked ? '<span class="pro-pill-mini">PRO EXPORT</span>' : '') +
          '</div>'
        );
        html.push('<div class="print-sheet" style="width:' + sh.paperWMm + 'mm;height:' + sh.paperHMm + 'mm;transform:scale(' + state.zoom + ');">');

        for (var i = 0; i < sh.slots.length; i++) {
          var sl = sh.slots[i];
          var c = sl.card;
          html.push(
            '<div style="position:absolute;left:' + sl.xMm + 'mm;top:' + sl.yMm + 'mm;width:' + sh.stripWMm + 'mm;height:' + sh.stripHMm + 'mm;border:0.35mm solid #0f172a;background:#ffffff;font-size:7.5pt;overflow:hidden;">' +
              // Glue tab
              '<div style="height:' + sh.glueMm + 'mm;border-bottom:0.3mm dashed #2563eb;background:repeating-linear-gradient(45deg,#f8fafc,#f8fafc 2mm,#e2e8f0 2mm,#e2e8f0 3mm);display:flex;align-items:center;justify-content:center;font-size:6pt;font-weight:700;color:#475569;">GLUE TAB</div>' +
              // Inverted Back Panel
              '<div style="height:' + sh.bodyHMm + 'mm;border-bottom:0.45mm dash-dot #dc2626;border-bottom:0.4mm dashed #dc2626;transform:rotate(180deg);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2mm;text-align:center;">' +
                (c.frontImg
                  ? '<img src="' + c.frontImg + '" style="max-width:100%;max-height:100%;object-fit:contain;" />'
                  : ('<div style="font-size:15pt;margin-bottom:1.5mm;">' + escapeHtml(c.icon || '🛡️') + '</div><div style="font-weight:800;line-height:1.15;">' + escapeHtml(c.front) + '</div><div style="font-size:6pt;color:#64748b;margin-top:1mm;">BACK</div>')) +
              '</div>' +
              // Upright Front Panel
              '<div style="height:' + sh.bodyHMm + 'mm;border-bottom:0.3mm dashed #2563eb;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2mm;text-align:center;">' +
                (c.frontImg
                  ? '<img src="' + c.frontImg + '" style="max-width:100%;max-height:100%;object-fit:contain;" />'
                  : ('<div style="font-size:15pt;margin-bottom:1.5mm;">' + escapeHtml(c.icon || '🛡️') + '</div><div style="font-weight:800;line-height:1.15;">' + escapeHtml(c.front) + '</div><div style="font-size:6pt;color:#475569;margin-top:1mm;">' + escapeHtml(c.tag || 'HERO') + '</div>')) +
              '</div>' +
              // Bottom Base Flap
              '<div style="height:' + sh.baseMm + 'mm;background:#f8fafc;display:flex;align-items:center;justify-content:center;font-size:6pt;color:#64748b;font-weight:700;">BASE (' + sh.bodyWMm + '×' + sh.baseMm + 'mm)</div>' +
            '</div>'
          );
        }

        html.push('</div></div>');
      }
      stage.innerHTML = html.join('');
      state._lastTuckGeom = null;
    } else {
      // Parametric Tuckbox SVG Die-Line
      var geom = CardSheetCore.computeTuckboxGeometry({
        paperId: state.paperId,
        cardWMm: state.tuckCardW,
        cardHMm: state.tuckCardH,
        cardCount: state.tuckCount,
        cardThicknessMm: state.tuckThickness,
        title: state.tuckTitle,
        subtitle: state.tuckSubtitle
      });
      updateDynamicPrintPageRule(geom.paperId, geom.orientation);
      var svgMarkup = CardSheetCore.renderTuckboxSvg(geom, state.lang);
      state._lastTuckGeom = geom;
      state._lastTuckSvg = svgMarkup;

      var tScaledH = Math.round(geom.sheetHMm * pxPerMmScreen * state.zoom);
      var tScaledW = Math.round(geom.sheetWMm * pxPerMmScreen * state.zoom);
      var fitNote = geom.fitsSingleSheet
        ? (state.lang === 'zh' ? '✅ 完美适配单张纸打印' : '✅ Fits single sheet at 100% scale')
        : (state.lang === 'zh' ? '⚠️ 展开图超出当前纸张，建议减小牌数或使用更大纸张' : '⚠️ Net exceeds single sheet — reduce card count or print on A3');

      var tuckMetric = $('tuckMetricBanner');
      if (tuckMetric) {
        tuckMetric.innerHTML = '<span>📦 ' + geom.boxWMm + ' × ' + geom.boxHMm + ' × <strong>' + geom.boxDMm + ' mm</strong></span>' +
          '<span>' + fitNote + '</span>';
      }

      stage.innerHTML =
        '<div class="sheet-wrapper" style="min-height:' + (tScaledH + 30) + 'px;min-width:' + tScaledW + 'px;">' +
          '<div class="sheet-caption">' +
            '<span>' + (state.lang === 'zh'
              ? ('1:1 参数化卡盒刀版（盒体 ' + geom.boxWMm + '×' + geom.boxHMm + '×' + geom.boxDMm + 'mm · 展开净尺寸 ' + geom.netWMm + '×' + geom.netHMm + 'mm）')
              : ('1:1 Parametric Tuckbox Die-Line (Box ' + geom.boxWMm + '×' + geom.boxHMm + '×' + geom.boxDMm + 'mm · Unfolded ' + geom.netWMm + '×' + geom.netHMm + 'mm)')) +
            '</span>' +
            (!proUnlocked ? '<span class="pro-pill-mini">PRO EXPORT</span>' : '') +
          '</div>' +
          '<div class="print-sheet" style="width:' + geom.sheetWMm + 'mm;height:' + geom.sheetHMm + 'mm;transform:scale(' + state.zoom + ');">' +
            svgMarkup +
          '</div>' +
        '</div>';
    }
  }

  function applyI18nToDom() {
    document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-i18n');
      nodes[i].textContent = t(key);
    }

    // Populate localized preset options
    var presetSel = $('presetSelect');
    if (presetSel) {
      var curVal = state.presetId;
      var keys = Object.keys(CardSheetCore.PRESETS);
      var optsHtml = '';
      for (var k = 0; k < keys.length; k++) {
        var pr = CardSheetCore.PRESETS[keys[k]];
        var label = state.lang === 'zh' ? pr.nameZh : pr.nameEn;
        optsHtml += '<option value="' + pr.id + '"' + (pr.id === curVal ? ' selected' : '') + '>' + escapeHtml(label) + '</option>';
      }
      presetSel.innerHTML = optsHtml;
    }

    // Lang switch button text
    if ($('langToggleBtn')) {
      $('langToggleBtn').textContent = state.lang === 'zh' ? '🌐 English' : '🌐 中文界面';
    }

    // Pro status header button
    var proBtn = $('headerProBtn');
    if (proBtn) {
      if (isProUnlocked()) {
        proBtn.textContent = t('unlockedBtn');
        proBtn.classList.add('unlocked');
      } else {
        proBtn.textContent = t('unlockBtn');
        proBtn.classList.remove('unlocked');
      }
    }

    // Render Affiliate Bar via CraftLeafSDK
    if (window.CraftLeafSDK && $('affiliateSupplyMount')) {
      CraftLeafSDK.renderAffiliateBar($('affiliateSupplyMount'), 'print-craft', state.lang);
    }

    // Update PnP Cross-sell pricing & URLs from CRAFTLEAF_MONETIZATION
    var cfg = (window.CraftLeafSDK && CraftLeafSDK.getConfig()) || {};
    var pnp = (cfg.products && cfg.products.pnpTrilogyBundle) || {};
    var proCfg = (cfg.products && cfg.products[PRODUCT_ID]) || {};
    var allCfg = (cfg.products && cfg.products.allAccessPass) || {};

    if ($('pnpBundleLink')) {
      var pnpHref = state.lang === 'zh'
        ? (pnp.mianbaoduoUrl || pnp.gumroadUrl || '../play/index.html')
        : (pnp.gumroadUrl || pnp.itchUrl || '../play/index.html');
      $('pnpBundleLink').href = pnpHref;
      var pnpPrice = state.lang === 'zh' ? (pnp.priceCny || '¥19.9') : (pnp.priceUsd || '$7.99');
      $('pnpBundleLink').textContent = t('pnpBuyBtn') + ' (' + pnpPrice + ')';
    }

    if ($('modalBuyProLink')) {
      var checkoutPro = state.lang === 'zh' ? (proCfg.checkoutUrlZh || proCfg.checkoutUrlEn) : proCfg.checkoutUrlEn;
      // Avoid self-hash reload loop if checkoutUrl points to #unlock-pro placeholder before live store bind
      if (!checkoutPro || checkoutPro.indexOf('#unlock-pro') !== -1) {
        $('modalBuyProLink').href = (cfg.tips && (state.lang === 'zh' ? cfg.tips.afdianUrl : cfg.tips.kofiUrl)) || 'https://gumroad.com/';
      } else {
        $('modalBuyProLink').href = checkoutPro;
      }
      var proPrice = state.lang === 'zh' ? (proCfg.priceCny || '¥29.9') : (proCfg.priceUsd || '$9.00');
      $('modalBuyProLink').textContent = (state.lang === 'zh' ? '购买 CardSheet Pro 激活码 (' : 'Buy CardSheet Pro Key (') + proPrice + ')';
    }

    if ($('modalBuyAllLink')) {
      $('modalBuyAllLink').href = (state.lang === 'zh' ? allCfg.checkoutUrlZh : allCfg.checkoutUrlEn) || '../index.html#all-access';
    }
  }

  function renderAll() {
    applyI18nToDom();
    if (state.workspaceTab === '3d-studio') {
      render3dStudioStage();
    } else {
      renderCardSheetsStage();
    }
  }

  function requiresProForCurrentExport() {
    if (isProUnlocked()) return false;
    if (state.workspaceTab === '3d-studio') return true;
    var pages = state._lastPages || [];
    if (state.includeBacks) return true;
    if (pages.length > 1) return true;
    return false;
  }

  function openProModal(showFreeSingleSheetFallback) {
    var modal = $('proModalBackdrop');
    if (!modal) return;
    if ($('freeFallbackPrintBtn')) {
      $('freeFallbackPrintBtn').style.display = (showFreeSingleSheetFallback && state.workspaceTab === 'cards') ? 'inline-flex' : 'none';
    }
    if ($('licenseStatusMsg')) {
      $('licenseStatusMsg').textContent = isProUnlocked() ? t('keySuccess') : '';
      $('licenseStatusMsg').style.color = '#059669';
    }
    modal.classList.add('open');
  }

  function closeProModal() {
    var modal = $('proModalBackdrop');
    if (modal) modal.classList.remove('open');
  }

  function triggerVectorPrint(forceSingleFrontOnly) {
    if (!forceSingleFrontOnly && requiresProForCurrentExport()) {
      openProModal(true);
      return;
    }
    if (forceSingleFrontOnly) {
      state.freeSinglePageOverride = true;
      renderCardSheetsStage();
    } else {
      state.freeSinglePageOverride = false;
    }
    setTimeout(function () {
      window.print();
      if (state.freeSinglePageOverride) {
        state.freeSinglePageOverride = false;
        renderCardSheetsStage();
      }
    }, 60);
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    var raw = String(text || '');
    if (!raw) return y;
    // Tokenize mixed CJK + Latin gracefully
    var tokens = raw.match(/[\u4e00-\u9fff\u3040-\u30ff]|[^\s\u4e00-\u9fff\u3040-\u30ff]+|\s+/g) || [raw];
    var lines = [];
    var line = '';
    for (var i = 0; i < tokens.length; i++) {
      var test = line + tokens[i];
      if (ctx.measureText(test).width > maxWidth && line.trim().length > 0) {
        lines.push(line.trim());
        line = tokens[i].trimStart ? tokens[i].trimStart() : tokens[i];
        if (maxLines && lines.length >= maxLines) break;
      } else {
        line = test;
      }
    }
    if (line.trim().length > 0 && (!maxLines || lines.length < maxLines)) {
      lines.push(line.trim());
    }
    var startY = y - ((lines.length - 1) * lineHeight) / 2.0;
    for (var l = 0; l < lines.length; l++) {
      ctx.fillText(lines[l], x, startY + l * lineHeight);
    }
    return startY + lines.length * lineHeight;
  }

  /**
   * Export Crisp 300 DPI PNG Sheet directly from 1:1 mm Canvas Math
   */
  function export300DpiPng() {
    if (requiresProForCurrentExport()) {
      openProModal(true);
      return;
    }

    if (state.workspaceTab === '3d-studio' && state.sub3dMode === 'tuckbox' && state._lastTuckSvg && state._lastTuckGeom) {
      var geom = state._lastTuckGeom;
      var svgBlob = new Blob([state._lastTuckSvg], { type: 'image/svg+xml;charset=utf-8' });
      var url = URL.createObjectURL(svgBlob);
      var img = new Image();
      img.onload = function () {
        var cw = Math.round(geom.sheetWMm * CardSheetCore.PX_PER_MM_300);
        var ch = Math.round(geom.sheetHMm * CardSheetCore.PX_PER_MM_300);
        var cv = document.createElement('canvas');
        cv.width = cw;
        cv.height = ch;
        var ctx = cv.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(img, 0, 0, cw, ch);
        URL.revokeObjectURL(url);
        downloadCanvasPng(cv, 'cardsheet-tuckbox-' + geom.paperId + '-300dpi.png');
      };
      img.src = url;
      return;
    }

    if (state.workspaceTab === '3d-studio') {
      window.print();
      return;
    }

    var grid = state._lastGrid;
    var pages = state._lastPages || [];
    if (!grid || !pages.length) return;

    var page = pages[0];
    var pxMm = CardSheetCore.PX_PER_MM_300;
    var cw = Math.round(grid.paperWMm * pxMm);
    var ch = Math.round(grid.paperHMm * pxMm);
    var canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cw, ch);

    // Draw each card slot on Page 1
    for (var i = 0; i < page.slots.length; i++) {
      var sl = page.slots[i];
      var card = sl.card;
      var tx = sl.trimXMm * pxMm;
      var ty = sl.trimYMm * pxMm;
      var tw = grid.cardWMm * pxMm;
      var th = grid.cardHMm * pxMm;

      ctx.save();
      if (sl.rotateDeg) {
        ctx.translate(tx + tw / 2, ty + th / 2);
        ctx.rotate((sl.rotateDeg * Math.PI) / 180);
        ctx.translate(-(tx + tw / 2), -(ty + th / 2));
      }

      var imgEl = page.side === 'front' ? card.frontImgEl : card.backImgEl;
      if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
        ctx.drawImage(imgEl, sl.cellXMm * pxMm, sl.cellYMm * pxMm, grid.cellWMm * pxMm, grid.cellHMm * pxMm);
      } else {
        // Vector-crisp canvas flashcard / game card render
        ctx.fillStyle = state.theme === 'parchment' ? '#fffbeb' : '#ffffff';
        ctx.fillRect(tx, ty, tw, th);

        if (state.showInnerBorder) {
          ctx.strokeStyle = state.theme === 'parchment' ? '#78350f' : '#334155';
          ctx.lineWidth = Math.max(2, 0.4 * pxMm);
          ctx.strokeRect(tx + 1, ty + 1, tw - 2, th - 2);
        }

        var padX = tw * 0.08;
        var padY = th * 0.08;
        var basePx = Math.max(24, Math.min(tw, th) * 0.072) * (state.fontScale / 100.0);

        if (card.tag) {
          ctx.fillStyle = '#475569';
          ctx.font = '700 ' + Math.round(basePx * 0.62) + 'px -apple-system, BlinkMacSystemFont, sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(card.tag.slice(0, 26), tx + padX, ty + padY);
        }
        if (card.icon) {
          ctx.font = Math.round(basePx * 1.15) + 'px -apple-system, "Apple Color Emoji", sans-serif';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'top';
          ctx.fillText(card.icon, tx + tw - padX, ty + padY * 0.85);
        }

        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var bodyStr = page.side === 'front' ? card.front : (card.back || state.crestText);
        ctx.font = (page.side === 'front' ? '800 ' : '600 ') + Math.round(basePx) + 'px -apple-system, BlinkMacSystemFont, sans-serif';
        wrapCanvasText(ctx, bodyStr, tx + tw / 2, ty + th * 0.50, tw - padX * 2.2, basePx * 1.32, 5);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 ' + Math.round(basePx * 0.52) + 'px -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText('#' + (card.index + 1) + ' · ' + grid.cardWMm + '×' + grid.cardHMm + 'mm', tx + padX, ty + th - padY * 0.65);
      }
      ctx.restore();
    }

    // Draw Guillotine Cut Marks at 300 DPI
    if (state.markStyle !== 'none') {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = Math.max(2, Math.round(0.25 * pxMm));
      var vCuts = page.verticalCutsMm || [];
      var hCuts = page.horizontalCutsMm || [];
      var topEnd = Math.max(3.0, Math.min(grid.originYMm - 1.2, 8.5)) * pxMm;
      var botStart = ch - topEnd;
      var leftEnd = Math.max(3.0, Math.min(grid.originXMm - 1.2, 8.5)) * pxMm;
      var rightStart = cw - leftEnd;

      for (var vx = 0; vx < vCuts.length; vx++) {
        var xp = Math.round(vCuts[vx] * pxMm);
        ctx.beginPath();
        ctx.moveTo(xp, Math.round(1.2 * pxMm));
        ctx.lineTo(xp, Math.round(topEnd));
        ctx.moveTo(xp, Math.round(botStart));
        ctx.lineTo(xp, Math.round(ch - 1.2 * pxMm));
        ctx.stroke();
      }
      for (var hy = 0; hy < hCuts.length; hy++) {
        var yp = Math.round(hCuts[hy] * pxMm);
        ctx.beginPath();
        ctx.moveTo(Math.round(1.2 * pxMm), yp);
        ctx.lineTo(Math.round(leftEnd), yp);
        ctx.moveTo(Math.round(rightStart), yp);
        ctx.lineTo(Math.round(cw - 1.2 * pxMm), yp);
        ctx.stroke();
      }
    }

    downloadCanvasPng(canvas, 'cardsheet-' + grid.paperId + '-' + grid.presetId + '-300dpi.png');
  }

  function downloadCanvasPng(canvas, filename) {
    canvas.toBlob(function (blob) {
      if (!blob) return;
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      if (typeof window !== 'undefined' && window.CraftLeafSDK && window.CraftLeafSDK.showValueMomentPrompt && !isProUnlocked()) {
        window.CraftLeafSDK.showValueMomentPrompt({
          lang: state.lang,
          titleZh: '🃏 300 DPI 打印排版图已导出！',
          titleEn: '🃏 300 DPI Print Sheet Exported Locally!',
          bodyZh: '需要 CSV 批量导入整套单词卡与毫米级双面背面偏移校准？支持独立开发或解锁 CardSheet Pro！',
          bodyEn: 'Batch-import CSV decks with sub-mm duplex back-offset calibration via CardSheet Pro!',
          proUrl: 'https://stardustdemo.gumroad.com/l/cardsheet-pro?wanted=true',
          proLabelZh: '✨ 解锁批量双面 Pro ($9)',
          proLabelEn: '✨ Unlock Duplex Pro ($9)'
        });
      }
    }, 'image/png');
  }

  function downloadTuckboxSvg() {
    if (requiresProForCurrentExport()) {
      openProModal(false);
      return;
    }
    if (!state._lastTuckSvg) return;
    var blob = new Blob([state._lastTuckSvg], { type: 'image/svg+xml;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'tuckbox-' + state.tuckCardW + 'x' + state.tuckCardH + 'mm-' + state.tuckCount + 'cards.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  function handleImageFiles(fileList, targetArrayKey) {
    var files = Array.prototype.slice.call(fileList || []).filter(function (f) {
      return f.type.indexOf('image/') === 0;
    });
    if (!files.length) return;
    files.sort(function (a, b) { return a.name.localeCompare(b.name); });

    var loaded = 0;
    files.forEach(function (file) {
      var reader = new FileReader();
      reader.onload = function (ev) {
        var img = new Image();
        img.onload = function () {
          state[targetArrayKey].push({
            name: file.name.replace(/\.[^.]+$/, ''),
            dataUrl: ev.target.result,
            imgEl: img
          });
          loaded++;
          if (loaded === files.length) {
            state.inputMode = 'image';
            updateImageCounters();
            syncFormInputsFromState();
            renderAll();
          }
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function updateImageCounters() {
    if ($('imgStatusText')) {
      if (state.lang === 'zh') {
        $('imgStatusText').textContent = '已载入正面图 ' + state.uploadedFronts.length + ' 张 · 背面图 ' + state.uploadedBacks.length + ' 张';
      } else {
        $('imgStatusText').textContent = 'Loaded ' + state.uploadedFronts.length + ' front image(s) · ' + state.uploadedBacks.length + ' back image(s)';
      }
    }
  }

  function wireEvents() {
    // Language toggle
    $('langToggleBtn').addEventListener('click', function () {
      state.lang = state.lang === 'en' ? 'zh' : 'en';
      updateImageCounters();
      renderAll();
    });

    // Workspace Mode Tabs
    $('tabCardsBtn').addEventListener('click', function () {
      state.workspaceTab = 'cards';
      syncFormInputsFromState();
      renderAll();
    });
    $('tab3dBtn').addEventListener('click', function () {
      state.workspaceTab = '3d-studio';
      syncFormInputsFromState();
      renderAll();
    });
    $('subStandeeBtn').addEventListener('click', function () {
      state.sub3dMode = 'standee';
      syncFormInputsFromState();
      renderAll();
    });
    $('subTuckboxBtn').addEventListener('click', function () {
      state.sub3dMode = 'tuckbox';
      syncFormInputsFromState();
      renderAll();
    });

    // Paper & Orientation
    $('paperA4Btn').addEventListener('click', function () {
      state.paperId = 'a4';
      syncFormInputsFromState();
      renderAll();
    });
    $('paperLetterBtn').addEventListener('click', function () {
      state.paperId = 'letter';
      syncFormInputsFromState();
      renderAll();
    });
    $('orientPortraitBtn').addEventListener('click', function () {
      state.orientation = 'portrait';
      syncFormInputsFromState();
      renderAll();
    });
    $('orientLandscapeBtn').addEventListener('click', function () {
      state.orientation = 'landscape';
      syncFormInputsFromState();
      renderAll();
    });

    // Preset & Custom mm
    $('presetSelect').addEventListener('change', function (e) {
      applyPresetDefaults(e.target.value, false);
      renderAll();
    });
    $('customWInput').addEventListener('input', function (e) {
      state.customWMm = parseFloat(e.target.value) || 63.5;
      renderAll();
    });
    $('customHInput').addEventListener('input', function (e) {
      state.customHMm = parseFloat(e.target.value) || 88.9;
      renderAll();
    });
    $('rotateCardCheck').addEventListener('change', function (e) {
      state.rotateCards = e.target.checked;
      renderAll();
    });

    // Input mode switch
    $('inputModeTextBtn').addEventListener('click', function () {
      state.inputMode = 'text';
      syncFormInputsFromState();
      renderAll();
    });
    $('inputModeImgBtn').addEventListener('click', function () {
      state.inputMode = 'image';
      syncFormInputsFromState();
      renderAll();
    });

    // Sample deck chips
    var sampleChips = document.querySelectorAll('[data-sample]');
    for (var i = 0; i < sampleChips.length; i++) {
      sampleChips[i].addEventListener('click', function (ev) {
        var sid = ev.currentTarget.getAttribute('data-sample');
        if (sid === 'business') applyPresetDefaults('business-us', false);
        else if (sid === 'stickers') applyPresetDefaults('square-50', false);
        else if (sid === 'vocab' && state.presetId !== 'flashcard-a7' && state.presetId !== 'flashcard-3x5') {
          applyPresetDefaults('flashcard-a7', false);
        } else if ((sid === 'pnp' || sid === 'dnd' || sid === 'batch54') && (state.presetId === 'business-us' || state.presetId === 'square-50')) {
          applyPresetDefaults('poker', false);
        }
        loadSampleDeck(sid, true);
      });
    }

    $('deckTextarea').addEventListener('input', function (e) {
      state.rawDeckText = e.target.value;
      renderAll();
    });

    // CSV / TSV / JSON File Import
    $('importCsvBtn').addEventListener('click', function () {
      $('csvFileInput').click();
    });
    $('csvFileInput').addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        state.rawDeckText = String(ev.target.result || '');
        state.inputMode = 'text';
        syncFormInputsFromState();
        renderAll();
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    $('resetDeckBtn').addEventListener('click', function () {
      loadSampleDeck('vocab', true);
    });

    // Theme & Typography
    $('themeSelect').addEventListener('change', function (e) {
      state.theme = e.target.value;
      renderAll();
    });
    $('backStyleSelect').addEventListener('change', function (e) {
      state.backStyle = e.target.value;
      renderAll();
    });
    $('crestInput').addEventListener('input', function (e) {
      state.crestText = e.target.value;
      renderAll();
    });
    $('fontScaleRange').addEventListener('input', function (e) {
      state.fontScale = parseInt(e.target.value, 10) || 100;
      $('fontScaleVal').textContent = state.fontScale + '%';
      renderAll();
    });

    // Drag & Drop Image Zones
    function bindDropzone(zoneId, inputId, targetKey) {
      var zone = $(zoneId);
      var inp = $(inputId);
      zone.addEventListener('click', function () { inp.click(); });
      inp.addEventListener('change', function (e) {
        handleImageFiles(e.target.files, targetKey);
        e.target.value = '';
      });
      zone.addEventListener('dragover', function (e) {
        e.preventDefault();
        zone.classList.add('dragover');
      });
      zone.addEventListener('dragleave', function () {
        zone.classList.remove('dragover');
      });
      zone.addEventListener('drop', function (e) {
        e.preventDefault();
        zone.classList.remove('dragover');
        if (e.dataTransfer && e.dataTransfer.files) {
          handleImageFiles(e.dataTransfer.files, targetKey);
        }
      });
    }
    bindDropzone('frontDropzone', 'frontImgInput', 'uploadedFronts');
    bindDropzone('backDropzone', 'backImgInput', 'uploadedBacks');

    $('clearImgsBtn').addEventListener('click', function () {
      state.uploadedFronts = [];
      state.uploadedBacks = [];
      updateImageCounters();
      renderAll();
    });

    // Crop Marks, Gap, Bleed, Margin
    $('markStyleSelect').addEventListener('change', function (e) {
      state.markStyle = e.target.value;
      renderAll();
    });
    function bindSyncedRange(rangeId, numId, stateKey) {
      $(rangeId).addEventListener('input', function (e) {
        var v = parseFloat(e.target.value) || 0;
        state[stateKey] = v;
        $(numId).value = v;
        renderAll();
      });
      $(numId).addEventListener('input', function (e) {
        var v = parseFloat(e.target.value);
        if (isNaN(v)) v = 0;
        state[stateKey] = v;
        $(rangeId).value = v;
        renderAll();
      });
    }
    bindSyncedRange('gapRange', 'gapInput', 'gapMm');
    bindSyncedRange('bleedRange', 'bleedInput', 'bleedMm');
    bindSyncedRange('marginRange', 'marginInput', 'safeMarginMm');
    bindSyncedRange('offsetXRange', 'offsetXInput', 'offsetXMm');
    bindSyncedRange('offsetYRange', 'offsetYInput', 'offsetYMm');

    $('innerBorderCheck').addEventListener('change', function (e) {
      state.showInnerBorder = e.target.checked;
      renderAll();
    });

    // Duplex Controls
    $('duplexCheck').addEventListener('change', function (e) {
      state.includeBacks = e.target.checked;
      renderAll();
    });
    $('flipEdgeSelect').addEventListener('change', function (e) {
      state.flipEdge = e.target.value;
      renderAll();
    });
    $('pageOrderSelect').addEventListener('change', function (e) {
      state.pageOrder = e.target.value;
      renderAll();
    });
    $('resetOffsetBtn').addEventListener('click', function () {
      state.offsetXMm = 0;
      state.offsetYMm = 0;
      syncFormInputsFromState();
      renderAll();
    });

    // 3D Standee & Tuckbox Controls
    $('standeeSizeSelect').addEventListener('change', function (e) {
      state.standeeSize = e.target.value;
      renderAll();
    });
    $('tuckWInput').addEventListener('input', function (e) {
      state.tuckCardW = parseFloat(e.target.value) || 63.5;
      renderAll();
    });
    $('tuckHInput').addEventListener('input', function (e) {
      state.tuckCardH = parseFloat(e.target.value) || 88.9;
      renderAll();
    });
    $('tuckCountInput').addEventListener('input', function (e) {
      state.tuckCount = parseInt(e.target.value, 10) || 54;
      renderAll();
    });
    $('tuckGsmSelect').addEventListener('change', function (e) {
      state.tuckThickness = parseFloat(e.target.value) || 0.31;
      renderAll();
    });
    $('tuckTitleInput').addEventListener('input', function (e) {
      state.tuckTitle = e.target.value;
      renderAll();
    });
    $('tuckSubInput').addEventListener('input', function (e) {
      state.tuckSubtitle = e.target.value;
      renderAll();
    });

    // Zoom & Export Actions
    $('zoomSelect').addEventListener('change', function (e) {
      state.zoom = parseFloat(e.target.value) || 0.72;
      renderAll();
    });
    $('printPdfBtn').addEventListener('click', function () {
      triggerVectorPrint(false);
    });
    $('exportPngBtn').addEventListener('click', function () {
      export300DpiPng();
    });
    $('exportSvgBtn').addEventListener('click', function () {
      downloadTuckboxSvg();
    });

    // Pro Modal Events
    $('headerProBtn').addEventListener('click', function () {
      openProModal(false);
    });
    $('closeProModalBtn').addEventListener('click', closeProModal);
    $('proModalBackdrop').addEventListener('click', function (e) {
      if (e.target === $('proModalBackdrop')) closeProModal();
    });
    $('freeFallbackPrintBtn').addEventListener('click', function () {
      closeProModal();
      triggerVectorPrint(true);
    });
    $('activateKeyBtn').addEventListener('click', function () {
      var raw = $('licenseKeyInput').value;
      if (!window.CraftLeafSDK) return;
      CraftLeafSDK.verifyLicense(PRODUCT_ID, raw, { keyPrefix: KEY_PREFIX }).then(function (res) {
        var msgEl = $('licenseStatusMsg');
        if (res && res.valid) {
          msgEl.textContent = t('keySuccess');
          msgEl.style.color = '#059669';
          renderAll();
          setTimeout(closeProModal, 1100);
        } else {
          msgEl.textContent = t('keyInvalid');
          msgEl.style.color = '#dc2626';
        }
      });
    });
  }

  function initFromUrlParams() {
    try {
      var params = new URLSearchParams(window.location.search || '');
      var langParam = params.get('lang');
      if (langParam === 'zh' || langParam === 'en') {
        state.lang = langParam;
      } else if (navigator.language && navigator.language.toLowerCase().indexOf('zh') === 0) {
        state.lang = 'zh';
      }

      var paperParam = params.get('paper');
      if (paperParam === 'letter' || paperParam === 'a4') {
        state.paperId = paperParam;
      }

      var presetParam = params.get('preset');
      if (presetParam) {
        var deep = CardSheetCore.resolveDeepLinkPreset(presetParam);
        if (deep) {
          applyPresetDefaults(deep.presetId, false);
          if (deep.sampleDeck) loadSampleDeck(deep.sampleDeck, false);
          if (deep.enableDuplexPreview) state.includeBacks = true;
          if (deep.workspaceTab) state.workspaceTab = deep.workspaceTab;
          if (deep.sub3dMode) state.sub3dMode = deep.sub3dMode;
        }
      } else {
        // Default initial experience: Poker 3×3 playable Relic PnP deck so visitors see magic on first load!
        applyPresetDefaults('poker', false);
        loadSampleDeck('pnp', false);
      }

      if (window.location.hash === '#unlock-pro') {
        setTimeout(function () { openProModal(false); }, 250);
      }
    } catch (_e) {
      applyPresetDefaults('poker', false);
      loadSampleDeck('pnp', false);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initFromUrlParams();
    syncFormInputsFromState();
    wireEvents();
    updateImageCounters();
    renderAll();
  });
})();
