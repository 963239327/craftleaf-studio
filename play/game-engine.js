/**
 * Star Chef Showdown (星厨对决：铁人回转料理王)
 * Complete Digital Tabletop Engine + Smart Heuristic Sous-Chef AI + Cozy Bistro UI
 * Zero external runtime dependencies. Runs in Browser AND Headless macOS JavaScriptCore (jsc).
 */
(function (root) {
  'use strict';

  /* ==========================================================================
   * 1. SAFE STORAGE & MONETIZATION CONFIG FALLBACK (Sandbox / itch.io Safe)
   * ========================================================================== */
  function safeStorageGet(key, fallback) {
    try {
      if (typeof localStorage !== 'undefined' && localStorage !== null) {
        var val = localStorage.getItem(key);
        return val !== null ? val : fallback;
      }
    } catch (_err) {
      // Blocked third-party iframe storage on itch.io / Safari Private — silently fallback
    }
    return fallback;
  }

  function safeStorageSet(key, value) {
    try {
      if (typeof localStorage !== 'undefined' && localStorage !== null) {
        localStorage.setItem(key, String(value));
        return true;
      }
    } catch (_err) {
      // Ignore SecurityError / QuotaExceededError
    }
    return false;
  }

  var DEFAULT_MONETIZATION = {
    brand: {
      studioName: 'CraftLeaf & Pixel Studio',
      studioNameZh: '青叶像素独立工坊',
      portalUrl: 'https://963239327.github.io/craftleaf-studio/'
    },
    tips: {
      kofiUrl: 'https://ko-fi.com/',
      buyMeACoffeeUrl: 'https://buymeacoffee.com/',
      stripeTipUrl: 'https://963239327.github.io/craftleaf-studio/#support',
      afdianUrl: 'https://afdian.com/'
    },
    products: {
      pnpTrilogyBundle: {
        priceUsd: '$7.99',
        singlePriceUsd: '$3.99',
        priceCny: '¥19.9',
        itchUrl: 'https://itch.io/',
        gumroadUrl: 'https://963239327.github.io/craftleaf-studio/#games',
        mianbaoduoUrl: 'https://mbd.pub/'
      }
    },
    affiliates: {
      items: [
        {
          id: 'cardstock-200gsm',
          category: 'print-craft',
          titleEn: '200gsm / 110lb White Cardstock for Tactile PnP Cards',
          titleZh: '200g 加厚白卡纸（桌游卡牌打印实测推荐）',
          url: 'https://www.amazon.com/s?k=110lb+white+cardstock+paper&tag=craftleaf-20'
        },
        {
          id: 'paper-trimmer',
          category: 'print-craft',
          titleEn: 'Slide Paper Trimmer for One-Cut Wide-Gutter Cards',
          titleZh: '滑轨直刀裁纸器（顺宽刀道一刀齐裁）',
          url: 'https://www.amazon.com/s?k=slide+paper+trimmer+cutter&tag=craftleaf-20'
        }
      ]
    }
  };

  function getMonetization() {
    var cfg = (root && root.CRAFTLEAF_MONETIZATION) ? root.CRAFTLEAF_MONETIZATION : DEFAULT_MONETIZATION;
    return {
      brand: cfg.brand || DEFAULT_MONETIZATION.brand,
      tips: cfg.tips || DEFAULT_MONETIZATION.tips,
      products: cfg.products || DEFAULT_MONETIZATION.products,
      affiliates: cfg.affiliates || DEFAULT_MONETIZATION.affiliates
    };
  }

  /* ==========================================================================
   * 2. SEEDABLE PRNG (Mulberry32 — Deterministic Sim & Reproducible Replays)
   * ========================================================================== */
  function createRNG(seed) {
    var state = (Number(seed) >>> 0) || 0x20261113;
    function nextFloat() {
      state = (state + 0x6D2B79F5) >>> 0;
      var t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    function rollD6() {
      return Math.floor(nextFloat() * 6) + 1;
    }
    function shuffle(arr) {
      var copy = arr.slice();
      for (var i = copy.length - 1; i > 0; i--) {
        var j = Math.floor(nextFloat() * (i + 1));
        var tmp = copy[i];
        copy[i] = copy[j];
        copy[j] = tmp;
      }
      return copy;
    }
    return {
      getState: function () { return state; },
      setState: function (s) { state = (Number(s) >>> 0) || 1; },
      nextFloat: nextFloat,
      rollD6: rollD6,
      shuffle: shuffle
    };
  }

  /* ==========================================================================
   * 3. CANONICAL GAME DATA (v0.7.14 — 8 Rondel Seats & 12 Multi-Use Cards)
   * ========================================================================== */
  var CUISINES = {
    fire:  { id: 'fire',  icon: '🔥', en: 'Flame Grill', zh: '炙烤系', cls: 'cuisine-fire' },
    water: { id: 'water', icon: '💧', en: 'Seafood',     zh: '海鲜系', cls: 'cuisine-water' },
    grass: { id: 'grass', icon: '🌿', en: 'Mountain',    zh: '山珍系', cls: 'cuisine-grass' },
    elec:  { id: 'elec',  icon: '⚡', en: 'Pastry',      zh: '甜品系', cls: 'cuisine-elec' }
  };

  var ING_META = {
    meat:     { id: 'meat',     icon: '🥩', en: 'Wagyu',   zh: '和牛' },
    shrimp:   { id: 'shrimp',   icon: '🦐', en: 'Lobster', zh: '龙虾' },
    mushroom: { id: 'mushroom', icon: '🍄', en: 'Truffle', zh: '松露' }
  };

  var RONDEL_SEATS = [
    {
      idx: 0, num: '①', icon: '👨‍🍳', cls: 'seat-elec', startTag: 'P1',
      nameEn: 'Welcome Bar', nameZh: '主厨迎宾台',
      descEn: 'Draw 1 Card + +1🧂 Spice', descZh: '摸 1 张牌 + 领 1🧂香料'
    },
    {
      idx: 1, num: '②', icon: '🥩', cls: 'seat-fire', startTag: '',
      nameEn: 'Wagyu Butcher', nameZh: '雪花和牛档',
      descEn: '+1🥩 Wagyu + Draw 1 Card', descZh: '拿 1🥩和牛 + 摸 1 张牌'
    },
    {
      idx: 2, num: '③', icon: '🦐', cls: 'seat-water', startTag: '',
      nameEn: 'Lobster Tank', nameZh: '深海龙虾池',
      descEn: '+1🦐 Lobster + Pick 1 Menu Card', descZh: '拿 1🦐龙虾 + 拿公开菜单1张'
    },
    {
      idx: 3, num: '④', icon: '🍄', cls: 'seat-grass', startTag: '',
      nameEn: 'Truffle Grove', nameZh: '云雾松露林',
      descEn: '+1🍄 Truffle + +1🧂 Spice', descZh: '拿 1🍄松露 + 领 1🧂香料'
    },
    {
      idx: 4, num: '⑤', icon: '🧊', cls: 'seat-water', startTag: 'P2',
      nameEn: 'Polar Ice Vault', nameZh: '极地冰块库',
      descEn: '+1🧊 Ice (Max 1) + Draw 1 Card', descZh: '领 1🧊救锅冰(限1) + 摸 1 张牌'
    },
    {
      idx: 5, num: '⑥', icon: '🧂', cls: 'seat-elec', startTag: '',
      nameEn: 'Spice Bazaar', nameZh: '丝路香料坊',
      descEn: '+2🧂 Spice + Borrow 1 Rival Gear', descZh: '领 2🧂 + 本回掌勺可借对手1厨具'
    },
    {
      idx: 6, num: '⑦', icon: '🍳', cls: 'seat-fire', startTag: '',
      nameEn: 'Blazing Station', nameZh: '猛火掌勺台',
      descEn: '+1 Any 🥩/🦐/🍄 + +1🧂 Spice', descZh: '任选 1 份食材入盘 + 领 1🧂香料'
    },
    {
      idx: 7, num: '⑧', icon: '🛎️', cls: 'seat-boss', startTag: '',
      nameEn: 'Royal Tasting Bell', nameZh: '皇家品鉴铃',
      descEn: 'Draw 1; Cook 5°–7° here: +2★!', descZh: '摸 1 张牌；此格 5°~7° 出锅额外+2★'
    }
  ];

  var CARDS = [
    {
      id: 1, code: 'NO.01', cuisine: 'fire', art: 'steakDish', isBoss: false,
      nameEn: 'Flaming Tomahawk Wagyu', nameZh: '烈焰战斧和牛排',
      recipe: { meat: 2, shrimp: 0, mushroom: 0, spice: 1 }, recipeTotal: 3,
      prepTextEn: '+1🥩 +1🧂', prepTextZh: '拿 1🥩 + 领 1🧂',
      prep: { meat: 1, shrimp: 0, mushroom: 0, spice: 1, ice: 0, draw: 0, anyIng: false },
      gearNameEn: 'Applewood Smoker', gearNameZh: '果木熏烤架',
      gearTagEn: 'Heat +1°', gearTagZh: '升温+1°',
      gearDescEn: 'After 1st roll: free +1° wok heat (1/dish).',
      gearDescZh: '首投后可发动：当前灶台温度免费 +1°。',
      starsHalf: 1, starsGold: 5, starsPerf: 7,
      dishBonusEn: '5°–6°: 5★ +2🧂 | 7°: 7★ +2🧂 & Keep 1 Ing',
      dishBonusZh: '5°~6°得5★+2🧂；7°得7★+2🧂且留1材'
    },
    {
      id: 2, code: 'NO.02', cuisine: 'water', art: 'seafoodPot', isBoss: false,
      nameEn: 'Golden Truffle Seafood Pot', nameZh: '黄金松露海皇煲',
      recipe: { meat: 0, shrimp: 2, mushroom: 1, spice: 0 }, recipeTotal: 3,
      prepTextEn: '+1🦐 + Draw 1', prepTextZh: '拿 1🦐 + 摸 1 牌',
      prep: { meat: 0, shrimp: 1, mushroom: 0, spice: 0, ice: 0, draw: 1, anyIng: false },
      gearNameEn: 'Deep-Sea Claypot', gearNameZh: '深海高汤砂锅',
      gearTagEn: 'Cool -1°', gearTagZh: '降温-1°',
      gearDescEn: 'After rolling: -1° heat (min 2°, rescues 8°→7°!).',
      gearDescZh: '投骰后可发动：降温 -1°（最低2°，可救回7°）！',
      starsHalf: 1, starsGold: 5, starsPerf: 7,
      dishBonusEn: '5°–6°: 5★ +1🍄 | 7°: 7★ +1🍄 & Keep 1 Ing',
      dishBonusZh: '5°~6°得5★+1🍄；7°得7★+1🍄且留1材'
    },
    {
      id: 3, code: 'NO.03', cuisine: 'grass', art: 'herbSalad', isBoss: false,
      nameEn: 'Misty Matsutake Kamameshi', nameZh: '迷雾森林松茸釜饭',
      recipe: { meat: 0, shrimp: 0, mushroom: 2, spice: 1 }, recipeTotal: 3,
      prepTextEn: '+1🍄 +1🧂', prepTextZh: '拿 1🍄 + 领 1🧂',
      prep: { meat: 0, shrimp: 0, mushroom: 1, spice: 1, ice: 0, draw: 0, anyIng: false },
      gearNameEn: 'Kyoto Copper Kamado', gearNameZh: '京都紫铜釜锅',
      gearTagEn: 'Free Simmer', gearTagZh: '免费小火骰',
      gearDescEn: 'Roll 1 Simmer Die (+1/+2°) for 0🧂!',
      gearDescZh: '追投时免费投 1 次小火骰（+1/+2°）免付🧂！',
      starsHalf: 1, starsGold: 5, starsPerf: 7,
      dishBonusEn: '5°–6°: 5★ +Step 1 | 7°: 7★ +Step 1 & Keep 1 Ing',
      dishBonusZh: '5°~6°得5★+进1步(含停留)；7°得7★+进1步+留1材'
    },
    {
      id: 4, code: 'NO.04', cuisine: 'fire', art: 'seafoodPot', isBoss: false,
      nameEn: 'Typhoon Garlic Lobster', nameZh: '避风塘爆炒金蒜龙虾',
      recipe: { meat: 1, shrimp: 1, mushroom: 0, spice: 1 }, recipeTotal: 3,
      prepTextEn: '+1🦐 +1🥩', prepTextZh: '拿 1🦐 + 拿 1🥩',
      prep: { meat: 1, shrimp: 1, mushroom: 0, spice: 0, ice: 0, draw: 0, anyIng: false },
      gearNameEn: 'Carbon Steel Wok', gearNameZh: '百炼中华铁锅',
      gearTagEn: 'Free Reroll', gearTagZh: '免费重投',
      gearDescEn: 'Reroll the die you just rolled for free!',
      gearDescZh: '掌勺时将刚投出的 1 颗骰子免费重投 1 次！',
      starsHalf: 1, starsGold: 5, starsPerf: 7,
      dishBonusEn: '5°–6°: 5★ / 7°: 7★ (+Keep 1), Steal 1🧂!',
      dishBonusZh: '5°~6°得5★ / 7°得7★(留1材)，均夺对手1🧂(无则领1)'
    },
    {
      id: 5, code: 'NO.05', cuisine: 'grass', art: 'herbSalad', isBoss: false,
      nameEn: 'Jade Abalone Braised Greens', nameZh: '翡翠鲍汁扣百蔬',
      recipe: { meat: 0, shrimp: 1, mushroom: 1, spice: 0 }, recipeTotal: 2,
      prepTextEn: '+1🍄 + Draw 1', prepTextZh: '拿 1🍄 + 摸 1 牌',
      prep: { meat: 0, shrimp: 0, mushroom: 1, spice: 0, ice: 0, draw: 1, anyIng: false },
      gearNameEn: 'Damascus Chef Knife', gearNameZh: '大马士革主厨刀',
      gearTagEn: '-1 Recipe Ing', gearTagZh: '抵1份食材',
      gearDescEn: 'On 3-cost recipes (incl. 🧂): pay 1 fewer 🥩/🦐/🍄!',
      gearDescZh: '烹饪总配方3份(含🧂)名菜时：少交 1 份基础食材！',
      starsHalf: 1, starsGold: 4, starsPerf: 6,
      dishBonusEn: '5°–6°: 4★ +1🍄 | 7°: 6★ +1🍄 & Keep 1 Ing',
      dishBonusZh: '5°~6°得4★+1🍄；7°得6★+1🍄且留1材'
    },
    {
      id: 6, code: 'NO.06', cuisine: 'elec', art: 'wokPan', isBoss: false,
      nameEn: 'Molten Matcha Lava Soufflé', nameZh: '流心熔岩抹茶舒芙蕾',
      recipe: { meat: 1, shrimp: 0, mushroom: 1, spice: 1 }, recipeTotal: 3,
      prepTextEn: '+1🥩 +1🧂', prepTextZh: '拿 1🥩 + 领 1🧂',
      prep: { meat: 1, shrimp: 0, mushroom: 0, spice: 1, ice: 0, draw: 0, anyIng: false },
      gearNameEn: 'Molecular Blowtorch', gearNameZh: '分子料理喷枪',
      gearTagEn: '4°/6° → +1°', gearTagZh: '精准+1°',
      gearDescEn: 'At exact 4° or 6°: +1° directly without rolling!',
      gearDescZh: '灶台处于 4° 或 6° 时：不投骰直接升温 +1°！',
      starsHalf: 1, starsGold: 5, starsPerf: 7,
      dishBonusEn: '5°–6°: 5★ +Draw 1 | 7°: 7★ +Draw 1 & Keep 1 Ing',
      dishBonusZh: '5°~6°得5★+摸1牌；7°得7★+摸1牌且留1材'
    },
    {
      id: 7, code: 'NO.07', cuisine: 'elec', art: 'steakDish', isBoss: false,
      nameEn: 'Royal Foie Gras Brûlée', nameZh: '皇家焦糖鹅肝布蕾',
      recipe: { meat: 2, shrimp: 0, mushroom: 1, spice: 0 }, recipeTotal: 3,
      prepTextEn: '+1🥩 +1🧊 Ice', prepTextZh: '拿 1🥩 + 领 1🧊冰',
      prep: { meat: 1, shrimp: 0, mushroom: 0, spice: 0, ice: 1, draw: 0, anyIng: false },
      gearNameEn: 'Royal Convection Oven', gearNameZh: '皇家旋转烤箱',
      gearTagEn: '1/6 → +2°', gearTagZh: '定温+2°',
      gearDescEn: 'When die rolls 1 or 6: set that roll to +2°!',
      gearDescZh: '投出 1 点或 6 点时：将该骰结果改为 +2°！',
      starsHalf: 1, starsGold: 5, starsPerf: 7,
      dishBonusEn: '5°–6°: 5★ +1🧊 | 7°: 7★ +1🧊 & Keep 1 Ing',
      dishBonusZh: '5°~6°得5★+1🧊(限1)；7°得7★+1🧊且留1材'
    },
    {
      id: 8, code: 'NO.08', cuisine: 'water', art: 'seafoodPot', isBoss: false,
      nameEn: 'Aurora Seared Bluefin Tuna', nameZh: '极光炙烤蓝鳍金枪鱼',
      recipe: { meat: 0, shrimp: 2, mushroom: 0, spice: 0 }, recipeTotal: 2,
      prepTextEn: '+2🦐 Lobster', prepTextZh: '拿 2🦐龙虾',
      prep: { meat: 0, shrimp: 2, mushroom: 0, spice: 0, ice: 0, draw: 0, anyIng: false },
      gearNameEn: 'Polar Chilling Platter', gearNameZh: '极地锁鲜冰盘',
      gearTagEn: 'Cool -1/-2°', gearTagZh: '降温-1或-2°',
      gearDescEn: 'After rolling: -1° or -2° heat (min 2°, saves 8°/9°!).',
      gearDescZh: '投骰后可发动：降温 1° 或 2°（最低2°，可救回7°）！',
      starsHalf: 1, starsGold: 4, starsPerf: 6,
      dishBonusEn: '5°–6°: 4★ +1🧂 | 7°: 6★ +1🧂 & Keep 1🦐',
      dishBonusZh: '5°~6°得4★+1🧂；7°得6★+1🧂且留1🦐'
    },
    {
      id: 9, code: 'NO.09', cuisine: 'grass', art: 'herbSalad', isBoss: false,
      nameEn: 'Black Truffle Egg Pappardelle', nameZh: '黑松露温泉蛋宽面',
      recipe: { meat: 1, shrimp: 0, mushroom: 1, spice: 0 }, recipeTotal: 2,
      prepTextEn: '+1🍄 + Draw 1', prepTextZh: '拿 1🍄 + 摸 1 牌',
      prep: { meat: 0, shrimp: 0, mushroom: 1, spice: 0, ice: 0, draw: 1, anyIng: false },
      gearNameEn: 'Artisan Pasta Roller', gearNameZh: '手工意面压面机',
      gearTagEn: '5°–7°: Draw 1', gearTagZh: '出锅摸1牌',
      gearDescEn: 'Passive: Finish dish at 5°–7° to draw +1 card!',
      gearDescZh: '被动：本次在 5°~7° 成功出锅额外摸 1 张牌！',
      starsHalf: 1, starsGold: 4, starsPerf: 6,
      dishBonusEn: '5°–6°: 4★ +Draw 1 | 7°: 6★ +Draw 1 & Keep 1 Ing',
      dishBonusZh: '5°~6°得4★+摸1牌；7°得6★+摸1牌且留1材'
    },
    {
      id: 10, code: 'NO.10', cuisine: 'fire', art: 'steakDish', isBoss: false,
      nameEn: 'Dongpo Braised Pork Belly', nameZh: '东坡红烧慢炖肉',
      recipe: { meat: 2, shrimp: 0, mushroom: 0, spice: 1 }, recipeTotal: 3,
      prepTextEn: '+1🥩 +1🧂', prepTextZh: '拿 1🥩 + 领 1🧂',
      prep: { meat: 1, shrimp: 0, mushroom: 0, spice: 1, ice: 0, draw: 0, anyIng: false },
      gearNameEn: 'Aged Shaoxing Wine Jar', gearNameZh: '绍兴陈年花雕坛',
      gearTagEn: 'Start +1🧂', gearTagZh: '开火赠1🧂',
      gearDescEn: 'When cooking: immediately gain +1🧂 Spice!',
      gearDescZh: '开火掌勺时可发动：立即领 1🧂香料控温！',
      starsHalf: 1, starsGold: 5, starsPerf: 7,
      dishBonusEn: '5°–6°: 5★ +1🥩 | 7°: 7★ +1🥩 & Keep 1 Ing',
      dishBonusZh: '5°~6°得5★+1🥩；7°得7★+1🥩且留1材'
    },
    {
      id: 11, code: 'NO.11', cuisine: 'elec', art: 'herbSalad', isBoss: false,
      nameEn: 'Prosciutto Caramelized Melon', nameZh: '帕尔玛火腿焦糖蜜瓜',
      recipe: { meat: 1, shrimp: 0, mushroom: 1, spice: 0 }, recipeTotal: 2,
      prepTextEn: '+1 Any 🥩/🦐/🍄', prepTextZh: '任选 1 份 🥩/🦐/🍄',
      prep: { meat: 0, shrimp: 0, mushroom: 0, spice: 0, ice: 0, draw: 0, anyIng: true },
      gearNameEn: 'Royal Silver Cloche', gearNameZh: '皇家银质托盘',
      gearTagEn: '5°–7°: +1🧂', gearTagZh: '黄金赠1🧂',
      gearDescEn: 'Passive: Finish dish at 5°–7° to gain +1🧂!',
      gearDescZh: '被动：本次在 5°~7° 成功出锅额外领 1🧂！',
      starsHalf: 1, starsGold: 4, starsPerf: 6,
      dishBonusEn: '5°–6°: 4★ +2🧂 | 7°: 6★ +2🧂 & Keep 1 Ing',
      dishBonusZh: '5°~6°得4★+2🧂；7°得6★+2🧂且留1材'
    },
    {
      id: 12, code: 'NO.12', cuisine: 'water', art: 'seafoodPot', isBoss: true,
      nameEn: 'Buddha Jumps Over the Wall', nameZh: '佛跳墙·山海国宴盅',
      recipe: { meat: 1, shrimp: 1, mushroom: 1, spice: 0 }, recipeTotal: 3,
      prepTextEn: '+1🦐 +1🍄', prepTextZh: '拿 1🦐 + 拿 1🍄',
      prep: { meat: 0, shrimp: 1, mushroom: 1, spice: 0, ice: 0, draw: 0, anyIng: false },
      gearNameEn: 'Imperial Dragon Cauldron', gearNameZh: '御膳房九龙金鼎',
      gearTagEn: 'Simmer ±1°', gearTagZh: '小火骰±1°',
      gearDescEn: 'After rolling Simmer Die: adjust delta +1° or -1°!',
      gearDescZh: '投出小火骰后：将该骰升温值 +1° 或 -1°！',
      starsHalf: 2, starsGold: 6, starsPerf: 8,
      dishBonusEn: '5°–6°: 6★ +1🧂 | 7°: 8★ +1🧂 & Keep 1 Ing!',
      dishBonusZh: '5°~6°得6★+1🧂；7°极品得8★+1🧂且留1材！'
    }
  ];

  var CARD_BY_ID = {};
  for (var ci = 0; ci < CARDS.length; ci++) {
    CARD_BY_ID[CARDS[ci].id] = CARDS[ci];
  }

  var SVG_ICONS = {
    steakDish: '<svg viewBox="0 0 64 64" width="100%" height="100%"><circle cx="32" cy="32" r="28" fill="#ffe4e6" stroke="#1c1917" stroke-width="2.4"/><ellipse cx="32" cy="36" rx="22" ry="14" fill="#ffffff" stroke="#1c1917" stroke-width="2"/><ellipse cx="30" cy="35" rx="14" ry="9" fill="#fb7185" stroke="#1c1917" stroke-width="2"/><line x1="22" y1="31" x2="34" y2="39" stroke="#881337" stroke-width="2"/><line x1="26" y1="28" x2="38" y2="36" stroke="#881337" stroke-width="2"/><circle cx="43" cy="32" r="4" fill="#4ade80" stroke="#1c1917" stroke-width="1.5"/></svg>',
    seafoodPot: '<svg viewBox="0 0 64 64" width="100%" height="100%"><circle cx="32" cy="32" r="28" fill="#e0f2fe" stroke="#1c1917" stroke-width="2.4"/><path d="M14 32 L50 32 L46 48 L18 48 Z" fill="#38bdf8" stroke="#1c1917" stroke-width="2.2"/><path d="M20 32 C22 20, 32 20, 34 32" fill="#fb7185" stroke="#1c1917" stroke-width="2"/><circle cx="40" cy="28" r="5" fill="#fde047" stroke="#1c1917" stroke-width="1.8"/></svg>',
    wokPan: '<svg viewBox="0 0 64 64" width="100%" height="100%"><circle cx="32" cy="32" r="28" fill="#fef9c3" stroke="#1c1917" stroke-width="2.4"/><path d="M12 30 C14 48, 44 48, 46 30 Z" fill="#475569" stroke="#1c1917" stroke-width="2.2"/><line x1="45" y1="31" x2="56" y2="25" stroke="#1c1917" stroke-width="4" stroke-linecap="round"/><path d="M22 26 C20 18, 28 16, 26 12 M34 26 C32 18, 40 16, 38 12" fill="none" stroke="#f97316" stroke-width="2.2"/></svg>',
    herbSalad: '<svg viewBox="0 0 64 64" width="100%" height="100%"><circle cx="32" cy="32" r="28" fill="#dcfce7" stroke="#1c1917" stroke-width="2.4"/><path d="M16 34 C16 48, 48 48, 48 34 Z" fill="#ffffff" stroke="#1c1917" stroke-width="2.2"/><circle cx="24" cy="29" r="7" fill="#4ade80" stroke="#1c1917" stroke-width="1.8"/><circle cx="38" cy="29" r="7" fill="#22c55e" stroke="#1c1917" stroke-width="1.8"/><circle cx="31" cy="25" r="5" fill="#fb7185" stroke="#1c1917" stroke-width="1.8"/></svg>'
  };

  /* ==========================================================================
   * 4. PURE DETERMINISTIC ENGINE
   * ========================================================================== */
  function makePlayer(id, startSeat) {
    return {
      id: id,
      seat: startSeat,
      stars: 0,
      ing: { meat: 0, shrimp: 0, mushroom: 0 },
      spice: 1,
      ice: 0,
      hand: [],
      gears: [],
      stamps: { fire: false, water: false, grass: false, elec: false },
      firstDishDone: false,
      threeStampsDone: false,
      dishesCooked: 0,
      perfectDishes: 0,
      busts: 0
    };
  }

  function countStamps(player) {
    var c = 0;
    if (player.stamps.fire) c++;
    if (player.stamps.water) c++;
    if (player.stamps.grass) c++;
    if (player.stamps.elec) c++;
    return c;
  }

  function countRemainingResources(player) {
    return player.ing.meat + player.ing.shrimp + player.ing.mushroom + player.spice;
  }

  function addLog(state, en, zh, tone) {
    state.logs.push({
      id: ++state.logSeq,
      round: state.round,
      en: en,
      zh: zh,
      tone: tone || 'info'
    });
    if (state.logs.length > 60) {
      state.logs.shift();
    }
  }

  function chefLabelEn(state, pIdx) {
    if (state.mode === '1p') return pIdx === 0 ? '🔴 You' : '🔵 Sous-Chef AI';
    return pIdx === 0 ? '🔴 Crimson Chef (P1)' : '🔵 Cordon Chef (P2)';
  }

  function chefLabelZh(state, pIdx) {
    if (state.mode === '1p') return pIdx === 0 ? '🔴 你(赤焰)' : '🔵 AI副厨';
    return pIdx === 0 ? '🔴 P1赤焰大厨' : '🔵 P2蓝带主厨';
  }

  function drawFromDeckRaw(state) {
    if (state.deck.length === 0 && state.discard.length > 0) {
      state.deck = state.rng.shuffle(state.discard);
      state.discard = [];
      addLog(state, '🔄 Discard pile reshuffled into fresh Menu Deck.', '🔄 弃牌堆已洗混为新牌库循环。', 'muted');
    }
    return state.deck.length > 0 ? state.deck.shift() : null;
  }

  function refillOpenMenuNow(state) {
    while (state.openMenu.length < 3) {
      var cid = drawFromDeckRaw(state);
      if (cid === null) break;
      state.openMenu.push(cid);
    }
  }

  function createGame(options) {
    options = options || {};
    var seed = (options.seed !== undefined && options.seed !== null)
      ? (Number(options.seed) >>> 0)
      : ((Date.now() ^ Math.floor(Math.random() * 0xFFFFFFFF)) >>> 0);
    var rng = createRNG(seed);
    var allIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var shuffled = rng.shuffle(allIds);

    var state = {
      seed: seed,
      rng: rng,
      mode: options.mode || '1p', // '1p' | '2p' | 'ai-vs-ai'
      lang: options.lang || 'en',
      round: 1,
      activePlayer: 0,
      phase: 'MOVE_RONDEL',
      prompt: null,
      effectQueue: [],
      wok: null,
      turnContext: {
        cookedThisTurn: false,
        canBorrowOpponentGear: false
      },
      dualGearClaimedBy: null,
      dualGearClaimedRound: null,
      dualGearSharedP2: false,
      endgameTriggeredBy: null,
      winner: null, // 0 | 1 | 'tie'
      winReasonEn: '',
      winReasonZh: '',
      deck: shuffled,
      discard: [],
      openMenu: [],
      players: [makePlayer(0, 0), makePlayer(1, 4)],
      logs: [],
      logSeq: 0,
      actionCount: 0
    };

    // Deal Open Menu (3) + P1 Hand (2) + P2 Hand (2)
    refillOpenMenuNow(state);
    state.players[0].hand.push(drawFromDeckRaw(state), drawFromDeckRaw(state));
    state.players[1].hand.push(drawFromDeckRaw(state), drawFromDeckRaw(state));

    addLog(
      state,
      '🍳 Kitchen open! Race to 18★ — Move 1–2 seats free, use cards 3 ways, and tame the 7° Wok!',
      '🍳 星厨开灶！目标满 18★ —— 顺时针1~2步免费、一卡三用、冲击7°厨神锁汁点！',
      'highlight'
    );
    return state;
  }

  function countAllCards(state) {
    var seen = {};
    var total = 0;
    function collect(list) {
      for (var i = 0; i < list.length; i++) {
        var id = list[i];
        total++;
        seen[id] = (seen[id] || 0) + 1;
      }
    }
    collect(state.deck);
    collect(state.discard);
    collect(state.openMenu);
    collect(state.players[0].hand);
    collect(state.players[1].hand);
    collect(state.players[0].gears);
    collect(state.players[1].gears);
    if (state.wok && state.wok.cardId) collect([state.wok.cardId]);
    if (state.prompt && state.prompt.heldCardId) collect([state.prompt.heldCardId]);
    return { total: total, unique: Object.keys(seen).length, seen: seen };
  }

  function getActingPlayer(state) {
    if (state.phase === 'GAME_OVER') return null;
    if (state.prompt) return state.prompt.player;
    if (state.phase === 'FOLLOW_REACTION') return 1 - state.activePlayer;
    return state.activePlayer;
  }

  function addStars(state, pIdx, amount) {
    var p = state.players[pIdx];
    p.stars = Math.min(35, p.stars + amount);
  }

  function resolveSeatArrivalEffects(state, pIdx, seatIdx, fromKamameshi) {
    var p = state.players[pIdx];
    var oppIdx = 1 - pIdx;
    var opp = state.players[oppIdx];
    var queueFront = [];

    // Check Bump (挤位)
    if (opp.seat === seatIdx) {
      addLog(
        state,
        '💥 Bump at Seat ' + RONDEL_SEATS[seatIdx].num + '! ' + chefLabelEn(state, oppIdx) + ' gets a free bonus draw.',
        '💥 同格挤位（' + RONDEL_SEATS[seatIdx].num + '）！' + chefLabelZh(state, oppIdx) + ' 获得免费摸 1 张牌。',
        'accent'
      );
      queueFront.push({ kind: 'DRAW_DECK', player: oppIdx, reason: 'bump' });
    }

    switch (seatIdx) {
      case 0: // ① Draw 1 + 1 Spice
        p.spice += 1;
        queueFront.push({ kind: 'DRAW_DECK', player: pIdx, reason: 'seat1' });
        break;
      case 1: // ② +1 Meat + Draw 1
        p.ing.meat += 1;
        queueFront.push({ kind: 'DRAW_DECK', player: pIdx, reason: 'seat2' });
        break;
      case 2: // ③ +1 Shrimp + Pick 1 Open Menu
        p.ing.shrimp += 1;
        queueFront.push({ kind: 'PICK_OPEN_MENU', player: pIdx });
        break;
      case 3: // ④ +1 Mushroom + 1 Spice
        p.ing.mushroom += 1;
        p.spice += 1;
        break;
      case 4: // ⑤ +1 Ice (max 1) + Draw 1
        if (p.ice < 1) p.ice = 1;
        queueFront.push({ kind: 'DRAW_DECK', player: pIdx, reason: 'seat5' });
        break;
      case 5: // ⑥ +2 Spice + Borrow 1 Opponent Gear this turn
        p.spice += 2;
        if (!fromKamameshi) {
          state.turnContext.canBorrowOpponentGear = true;
        }
        break;
      case 6: // ⑦ +1 Any Ing + 1 Spice
        p.spice += 1;
        queueFront.push({ kind: 'PICK_ANY_ING', player: pIdx, reason: 'seat7' });
        break;
      case 7: // ⑧ Draw 1 (+1★ passive checked when starting cook on seat 7)
        queueFront.push({ kind: 'DRAW_DECK', player: pIdx, reason: 'seat8' });
        break;
    }

    // Unshift in order at front of effectQueue
    state.effectQueue = queueFront.concat(state.effectQueue);
  }

  function finalizeGameOver(state) {
    state.phase = 'GAME_OVER';
    state.prompt = null;
    state.effectQueue = [];
    var p0 = state.players[0];
    var p1 = state.players[1];
    var s0 = countStamps(p0);
    var s1 = countStamps(p1);
    var r0 = countRemainingResources(p0);
    var r1 = countRemainingResources(p1);

    if (p0.stars !== p1.stars) {
      state.winner = p0.stars > p1.stars ? 0 : 1;
      state.winReasonEn = p0.stars + '★ vs ' + p1.stars + '★';
      state.winReasonZh = p0.stars + '★ 对 ' + p1.stars + '★';
    } else if (s0 !== s1) {
      state.winner = s0 > s1 ? 0 : 1;
      state.winReasonEn = 'Tie at ' + p0.stars + '★ — won on Cuisine Stamps (' + s0 + ' vs ' + s1 + ')!';
      state.winReasonZh = '同为 ' + p0.stars + '★ —— 凭流派章数量胜出（' + s0 + ' 对 ' + s1 + '）！';
    } else if (r0 !== r1) {
      state.winner = r0 > r1 ? 0 : 1;
      state.winReasonEn = 'Tie on ★ & Stamps — won on Leftover Pantry (' + r0 + ' vs ' + r1 + ')!';
      state.winReasonZh = '同星同章 —— 凭剩余食材+香料总数胜出（' + r0 + ' 对 ' + r1 + '）！';
    } else {
      state.winner = 'tie';
      state.winReasonEn = 'Exact Tie on Stars, Stamps & Pantry — Shared Master Chef Crown!';
      state.winReasonZh = '星数、流派章与余粮完全相同 —— 共享铁人料理王桂冠！';
    }

    var winBannerEn = state.winner === 'tie'
      ? '🏆 Game Over! ' + state.winReasonEn
      : '🏆 ' + chefLabelEn(state, state.winner) + ' wins! (' + state.winReasonEn + ')';
    var winBannerZh = state.winner === 'tie'
      ? '🏆 对局结束！' + state.winReasonZh
      : '🏆 ' + chefLabelZh(state, state.winner) + ' 获胜！（' + state.winReasonZh + '）';
    addLog(state, winBannerEn, winBannerZh, 'win');
  }

  function advanceTurnOrEndgame(state) {
    var p0 = state.players[0];
    var p1 = state.players[1];

    if (state.activePlayer === 0) {
      if (p0.stars >= 18 && state.endgameTriggeredBy === null) {
        state.endgameTriggeredBy = 0;
        addLog(
          state,
          '🔔 ' + chefLabelEn(state, 0) + ' reached ' + p0.stars + '★! ' + chefLabelEn(state, 1) + ' gets 1 final equalizing turn!',
          '🔔 ' + chefLabelZh(state, 0) + ' 达成 ' + p0.stars + '★ 触发终局！' + chefLabelZh(state, 1) + ' 进行最后 1 个平权回合！',
          'highlight'
        );
      }
      state.activePlayer = 1;
      state.turnContext = { cookedThisTurn: false, canBorrowOpponentGear: false };
      state.phase = 'MOVE_RONDEL';
      return;
    }

    // End of P2's turn (end of full round)
    if (state.endgameTriggeredBy !== null || p0.stars >= 18 || p1.stars >= 18) {
      finalizeGameOver(state);
      return;
    }

    state.round += 1;
    state.activePlayer = 0;
    state.turnContext = { cookedThisTurn: false, canBorrowOpponentGear: false };
    state.phase = 'MOVE_RONDEL';
  }

  function drainEffects(state) {
    while (state.effectQueue.length > 0 && !state.prompt && state.phase !== 'GAME_OVER') {
      var eff = state.effectQueue.shift();

      if (eff.kind === 'REFILL_MENU') {
        refillOpenMenuNow(state);
      } else if (eff.kind === 'DRAW_DECK') {
        var pl = state.players[eff.player];
        if (pl.hand.length < 2) {
          var drawn = drawFromDeckRaw(state);
          if (drawn !== null) {
            pl.hand.push(drawn);
          }
        } else {
          state.prompt = {
            type: 'DISCARD_FOR_DRAW',
            player: eff.player,
            heldCardId: null,
            reason: eff.reason || 'draw'
          };
          return;
        }
      } else if (eff.kind === 'PICK_OPEN_MENU') {
        refillOpenMenuNow(state);
        if (state.openMenu.length > 0) {
          state.prompt = {
            type: 'PICK_OPEN_MENU',
            player: eff.player
          };
          return;
        }
      } else if (eff.kind === 'PICK_ANY_ING') {
        state.prompt = {
          type: 'PICK_ANY_ING',
          player: eff.player,
          reason: eff.reason || 'any'
        };
        return;
      } else if (eff.kind === 'PICK_KEPT_ING') {
        state.prompt = {
          type: 'PICK_KEPT_ING',
          player: eff.player,
          options: eff.options
        };
        return;
      } else if (eff.kind === 'ADVANCE_RONDEL_1') {
        var mover = state.players[eff.player];
        mover.seat = (mover.seat + 1) % 8;
        addLog(
          state,
          '🚶 Kamameshi bonus: ' + chefLabelEn(state, eff.player) + ' advances 1 step to ' + RONDEL_SEATS[mover.seat].num + ' ' + RONDEL_SEATS[mover.seat].nameEn + '!',
          '🚶 松茸釜饭特效：' + chefLabelZh(state, eff.player) + ' 顺时针进1步至 ' + RONDEL_SEATS[mover.seat].num + RONDEL_SEATS[mover.seat].nameZh + '！',
          'accent'
        );
        resolveSeatArrivalEffects(state, eff.player, mover.seat, true);
      } else if (eff.kind === 'AFTER_RONDEL') {
        if (state.players[state.activePlayer].hand.length === 0) {
          state.phase = 'MAIN_ACTION';
        } else {
          state.phase = 'PREP_OPTIONAL';
        }
      } else if (eff.kind === 'AFTER_PREP') {
        state.phase = 'MAIN_ACTION';
      } else if (eff.kind === 'END_MAIN_ACTION') {
        var followerIdx = 1 - state.activePlayer;
        var follower = state.players[followerIdx];
        if (!state.turnContext.cookedThisTurn && follower.spice >= 1) {
          state.phase = 'FOLLOW_REACTION';
        } else {
          advanceTurnOrEndgame(state);
        }
      } else if (eff.kind === 'END_FOLLOW') {
        advanceTurnOrEndgame(state);
      }
    }
  }

  /* ==========================================================================
   * 5. COOKABILITY & WOK ACTION QUERIES
   * ========================================================================== */
  function getCookOptionsForCard(state, pIdx, cardId) {
    var p = state.players[pIdx];
    var opp = state.players[1 - pIdx];
    var card = CARD_BY_ID[cardId];
    if (!card) return { canCook: false, modes: [] };

    var modes = [];
    var r = card.recipe;

    // Standard full recipe cost
    if (
      p.ing.meat >= r.meat &&
      p.ing.shrimp >= r.shrimp &&
      p.ing.mushroom >= r.mushroom &&
      p.spice >= r.spice
    ) {
      modes.push({
        useKnife: false,
        knifeSource: null,
        reducedIng: null,
        cost: { meat: r.meat, shrimp: r.shrimp, mushroom: r.mushroom, spice: r.spice }
      });
    }

    // Damascus Chef Knife (NO.05) on 3-cost recipes
    var hasOwnKnife = p.gears.indexOf(5) !== -1;
    var canBorrowKnife = !hasOwnKnife && state.turnContext.canBorrowOpponentGear && opp.gears.indexOf(5) !== -1;
    if (card.recipeTotal === 3 && (hasOwnKnife || canBorrowKnife)) {
      var knifeSource = hasOwnKnife ? 'self' : 'opp';
      var ings = ['meat', 'shrimp', 'mushroom'];
      for (var i = 0; i < ings.length; i++) {
        var k = ings[i];
        if (r[k] > 0) {
          var cm = r.meat - (k === 'meat' ? 1 : 0);
          var cs = r.shrimp - (k === 'shrimp' ? 1 : 0);
          var cmu = r.mushroom - (k === 'mushroom' ? 1 : 0);
          if (p.ing.meat >= cm && p.ing.shrimp >= cs && p.ing.mushroom >= cmu && p.spice >= r.spice) {
            modes.push({
              useKnife: true,
              knifeSource: knifeSource,
              reducedIng: k,
              cost: { meat: cm, shrimp: cs, mushroom: cmu, spice: r.spice }
            });
          }
        }
      }
    }

    return {
      canCook: modes.length > 0,
      modes: modes
    };
  }

  function getAvailableWokActions(state) {
    if (state.phase !== 'WOK_COOKING' || !state.wok) return [];
    var w = state.wok;
    var p = state.players[state.activePlayer];
    var opp = state.players[1 - state.activePlayer];
    var actions = [];

    function canUseGear(gearId) {
      if (w.usedGears[gearId]) return null;
      if (p.gears.indexOf(gearId) !== -1) return 'self';
      if (state.turnContext.canBorrowOpponentGear && !w.borrowedOpponentGear && opp.gears.indexOf(gearId) !== -1) {
        return 'opp';
      }
      return null;
    }

    if (w.temp <= 7) {
      actions.push({ type: 'WOK_PLATE' });
      actions.push({ type: 'WOK_ROLL_BLAZING' });
      if (p.spice >= 1) {
        actions.push({ type: 'WOK_ROLL_SIMMER' });
      }
    } else {
      actions.push({ type: 'WOK_ACCEPT_BUST' });
    }

    // Rescue Ice (-2°, min 2°)
    if (p.ice >= 1 && w.temp >= 4) {
      actions.push({ type: 'WOK_USE_ICE' });
    }

    // Gear 1: Applewood Smoker (+1°)
    var g1 = canUseGear(1);
    if (g1 && w.temp >= 2 && w.temp <= 6) {
      actions.push({ type: 'WOK_USE_GEAR', gearId: 1, owner: g1 });
    }

    // Gear 2: Deep-Sea Claypot (-1°, min 2°, rescues 8°->7°!)
    var g2 = canUseGear(2);
    if (g2 && w.lastRoll && w.temp >= 3 && (w.temp <= 8)) {
      actions.push({ type: 'WOK_USE_GEAR', gearId: 2, owner: g2 });
    }

    // Gear 3: Kyoto Copper Kamado (Free Simmer Die)
    var g3 = canUseGear(3);
    if (g3 && w.temp <= 7) {
      actions.push({ type: 'WOK_USE_GEAR', gearId: 3, owner: g3 });
    }

    // Gear 4: Carbon Steel Wok (Free Reroll last die)
    var g4 = canUseGear(4);
    if (g4 && w.lastRoll) {
      actions.push({ type: 'WOK_USE_GEAR', gearId: 4, owner: g4 });
    }

    // Gear 6: Molecular Blowtorch (+1° at exact 4° or 6°)
    var g6 = canUseGear(6);
    if (g6 && (w.temp === 4 || w.temp === 6)) {
      actions.push({ type: 'WOK_USE_GEAR', gearId: 6, owner: g6 });
    }

    // Gear 7: Royal Convection Oven (1 or 6 -> +2°)
    var g7 = canUseGear(7);
    if (g7 && w.lastRoll && (w.lastRoll.face === 1 || w.lastRoll.face === 6) && w.lastRoll.delta !== 2) {
      actions.push({ type: 'WOK_USE_GEAR', gearId: 7, owner: g7 });
    }

    // Gear 8: Polar Chilling Platter (-1° or -2°, min 2°)
    var g8 = canUseGear(8);
    if (g8 && w.lastRoll && w.temp >= 3) {
      if (w.temp - 1 <= 7 || w.temp <= 7) {
        actions.push({ type: 'WOK_USE_GEAR', gearId: 8, amount: 1, owner: g8 });
      }
      if (w.temp >= 4 && (w.temp - 2 <= 7 || w.temp <= 7)) {
        actions.push({ type: 'WOK_USE_GEAR', gearId: 8, amount: 2, owner: g8 });
      }
    }

    // Gear 10: Aged Shaoxing Wine Jar (+1 Spice)
    var g10 = canUseGear(10);
    if (g10 && w.temp <= 7) {
      actions.push({ type: 'WOK_USE_GEAR', gearId: 10, owner: g10 });
    }

    // Gear 12: Imperial Dragon Cauldron (Simmer ±1°)
    var g12 = canUseGear(12);
    if (g12 && w.lastRoll && w.lastRoll.type === 'simmer') {
      if (w.temp <= 6) {
        actions.push({ type: 'WOK_USE_GEAR', gearId: 12, adj: 1, owner: g12 });
      }
      if (w.temp >= 3 && w.temp - 1 <= 7) {
        actions.push({ type: 'WOK_USE_GEAR', gearId: 12, adj: -1, owner: g12 });
      }
    }

    return actions;
  }

  /* ==========================================================================
   * 6. APPLY ACTION (Central Validated Reducer)
   * ========================================================================== */
  function finishWokCooking(state, outcome) {
    // outcome: 'plate' | 'bust'
    var w = state.wok;
    var pIdx = state.activePlayer;
    var p = state.players[pIdx];
    var opp = state.players[1 - pIdx];
    var card = CARD_BY_ID[w.cardId];
    var temp = w.temp;

    // Move dish card to discard pile & immediately refill Open Menu if cooked from menu
    state.discard.push(w.cardId);
    state.wok = null;
    if (w.fromMenu) {
      refillOpenMenuNow(state);
    }
    p.dishesCooked += 1;

    var postQueue = [];

    if (outcome === 'bust' || temp >= 8) {
      p.busts += 1;
      addStars(state, pIdx, 1);
      p.spice += 1;
      addLog(
        state,
        '💥 WOK BUST at ' + temp + '° on ' + card.nameEn + '! Consolation: +1★ & +1🧂.',
        '💥 ' + temp + '° 焦黑爆锅（' + card.nameZh + '）！获保底安慰奖 +1★ 与 +1🧂。',
        'danger'
      );
    } else if (temp <= 4) {
      var halfStars = card.starsHalf;
      addStars(state, pIdx, halfStars);
      addLog(
        state,
        '🛎️ Plated ' + card.nameEn + ' half-cooked at ' + temp + '° → +' + halfStars + '★.',
        '🛎️ ' + temp + '° 低温出锅《' + card.nameZh + '》 → 获 +' + halfStars + '★。',
        'info'
      );
    } else {
      // Golden (5°~6°) or Master Chef Perfect (7°)
      var isPerfect = (temp === 7);
      var baseStars = isPerfect ? card.starsPerf : card.starsGold;
      var bonusStars = 0;
      var bonusNotesEn = [];
      var bonusNotesZh = [];

      if (isPerfect) {
        p.perfectDishes += 1;
      } else {
        // v0.7.12: 5° returns +1🧂 Spice; 6° returns +2🧂 Spice!
        var searSpice = (temp === 6) ? 2 : 1;
        p.spice += searSpice;
        bonusNotesEn.push('+' + searSpice + '🧂 Sear');
        bonusNotesZh.push('黄金锅气+' + searSpice + '🧂');
      }

      // Seat ⑧ Royal Tasting Bell bonus (+2★ at 5°~7° in v0.7.12)
      if (w.startedAtBell) {
        bonusStars += 2;
        bonusNotesEn.push('+2★ Bell');
        bonusNotesZh.push('品鉴铃+2★');
      }

      // First 5°~7° Dish Milestone (+1★)
      if (!p.firstDishDone) {
        p.firstDishDone = true;
        bonusStars += 1;
        bonusNotesEn.push('+1★ 1st Dish');
        bonusNotesZh.push('首菜里程碑+1★');
      }

      // Cuisine Stamp & 3-Cuisine Grand Banquet (+3★)
      if (!p.stamps[card.cuisine]) {
        p.stamps[card.cuisine] = true;
        bonusNotesEn.push(CUISINES[card.cuisine].icon + ' Stamp');
        bonusNotesZh.push('打卡' + CUISINES[card.cuisine].icon + CUISINES[card.cuisine].zh);
        if (countStamps(p) >= 3 && !p.threeStampsDone) {
          p.threeStampsDone = true;
          bonusStars += 3;
          bonusNotesEn.push('👑 +3★ 3-Cuisine Banquet!');
          bonusNotesZh.push('👑 三系满汉奖+3★！');
        }
      }

      addStars(state, pIdx, baseStars + bonusStars);

      // Keep 1 spent basic ingredient at exact 7° Perfect Sear
      if (isPerfect && w.paidBasic.length > 0) {
        var uniq = [];
        for (var ui = 0; ui < w.paidBasic.length; ui++) {
          if (uniq.indexOf(w.paidBasic[ui]) === -1) uniq.push(w.paidBasic[ui]);
        }
        if (uniq.length === 1) {
          p.ing[uniq[0]] += 1;
          bonusNotesEn.push('Kept 1' + ING_META[uniq[0]].icon);
          bonusNotesZh.push('锁汁留1' + ING_META[uniq[0]].icon);
        } else {
          postQueue.push({ kind: 'PICK_KEPT_ING', player: pIdx, options: uniq });
        }
      }

      // Card-specific 5°~7° Dish Completion Effect
      switch (card.id) {
        case 1: p.spice += 2; break;
        case 2: p.ing.mushroom += 1; break;
        case 3: postQueue.push({ kind: 'ADVANCE_RONDEL_1', player: pIdx }); break;
        case 4:
          if (opp.spice > 0) {
            opp.spice -= 1;
            p.spice += 1;
            bonusNotesEn.push('Stole 1🧂');
            bonusNotesZh.push('夺对手1🧂');
          } else {
            p.spice += 1;
          }
          break;
        case 5: p.ing.mushroom += 1; break;
        case 6: postQueue.push({ kind: 'DRAW_DECK', player: pIdx, reason: 'dish6' }); break;
        case 7: if (p.ice < 1) p.ice = 1; break;
        case 8: p.spice += 1; break;
        case 9: postQueue.push({ kind: 'DRAW_DECK', player: pIdx, reason: 'dish9' }); break;
        case 10: p.ing.meat += 1; break;
        case 11: p.spice += 2; break;
        case 12: p.spice += 1; break;
      }

      // Passive Completion Kitchen Gears (NO.09 Pasta Roller & NO.11 Silver Cloche)
      if (p.gears.indexOf(9) !== -1 && !w.usedGears[9]) {
        w.usedGears[9] = true;
        postQueue.push({ kind: 'DRAW_DECK', player: pIdx, reason: 'gear9' });
        bonusNotesEn.push('Gear Draw +1');
        bonusNotesZh.push('压面机摸1牌');
      }
      if (p.gears.indexOf(11) !== -1 && !w.usedGears[11]) {
        w.usedGears[11] = true;
        p.spice += 1;
        bonusNotesEn.push('Cloche +1🧂');
        bonusNotesZh.push('银托盘+1🧂');
      }
      // Seat ⑥ Auto-borrow passive completion gear if no opponent gear borrowed yet
      if (state.turnContext.canBorrowOpponentGear && !w.borrowedOpponentGear) {
        if (opp.gears.indexOf(9) !== -1) {
          w.borrowedOpponentGear = true;
          postQueue.push({ kind: 'DRAW_DECK', player: pIdx, reason: 'borrow9' });
          bonusNotesEn.push('Borrowed Pasta Roller');
          bonusNotesZh.push('借用压面机摸1牌');
        } else if (opp.gears.indexOf(11) !== -1) {
          w.borrowedOpponentGear = true;
          p.spice += 1;
          bonusNotesEn.push('Borrowed Silver Cloche +1🧂');
          bonusNotesZh.push('借用银托盘+1🧂');
        }
      }

      var totalEarned = baseStars + bonusStars;
      var extraEn = bonusNotesEn.length ? ' (' + bonusNotesEn.join(', ') + ')' : '';
      var extraZh = bonusNotesZh.length ? '（' + bonusNotesZh.join('、') + '）' : '';
      addLog(
        state,
        (isPerfect ? '🔥 PERFECT 7° SEAR! ' : '⭐ GOLDEN ' + temp + '°! ') +
          chefLabelEn(state, pIdx) + ' plated ' + card.nameEn + ' for +' + totalEarned + '★!' + extraEn,
        (isPerfect ? '🔥 7°厨神极品锁汁！' : '⭐ ' + temp + '°黄金锅气！') +
          chefLabelZh(state, pIdx) + ' 出锅《' + card.nameZh + '》斩获 +' + totalEarned + '★！' + extraZh,
        isPerfect ? 'perfect' : 'gold'
      );
    }

    // Cleanup: Chef draws 1 card + End Main Action
    postQueue.push({ kind: 'DRAW_DECK', player: pIdx, reason: 'cleanup' });
    postQueue.push({ kind: 'END_MAIN_ACTION' });

    state.phase = 'RESOLVING';
    state.effectQueue = postQueue.concat(state.effectQueue);
    drainEffects(state);
  }

  function applyAction(state, action) {
    if (!action || state.phase === 'GAME_OVER') return state;
    state.actionCount += 1;

    // 1. Handle active sub-prompts first
    if (state.prompt) {
      var pr = state.prompt;
      var pl = state.players[pr.player];

      if (pr.type === 'DISCARD_FOR_DRAW' && action.type === 'CHOOSE_DISCARD_FOR_DRAW') {
        if (action.skipDraw && pr.reason === 'bump') {
          state.prompt = null;
          addLog(
            state,
            chefLabelEn(state, pr.player) + ' kept their 2-card hand.',
            chefLabelZh(state, pr.player) + ' 选择保留当前 2 张手牌。',
            'muted'
          );
          drainEffects(state);
          return state;
        }
        var dIdx = pl.hand.indexOf(action.cardId);
        if (dIdx === -1) dIdx = 0;
        var discarded = pl.hand.splice(dIdx, 1)[0];
        state.discard.push(discarded);
        if (pr.heldCardId) {
          pl.hand.push(pr.heldCardId);
        } else {
          var nextCard = drawFromDeckRaw(state);
          if (nextCard !== null) pl.hand.push(nextCard);
        }
        state.prompt = null;
        drainEffects(state);
        return state;
      }

      if (pr.type === 'PICK_OPEN_MENU' && action.type === 'CHOOSE_OPEN_MENU') {
        var mIdx = state.openMenu.indexOf(action.cardId);
        if (mIdx === -1) mIdx = 0;
        var picked = state.openMenu.splice(mIdx, 1)[0];
        refillOpenMenuNow(state);
        state.prompt = null;
        if (pl.hand.length < 2) {
          pl.hand.push(picked);
          drainEffects(state);
        } else {
          state.prompt = {
            type: 'DISCARD_FOR_DRAW',
            player: pr.player,
            heldCardId: picked,
            reason: 'menu'
          };
        }
        return state;
      }

      if (pr.type === 'PICK_ANY_ING' && action.type === 'CHOOSE_ANY_ING') {
        var ingKey = ING_META[action.ing] ? action.ing : 'meat';
        pl.ing[ingKey] += 1;
        state.prompt = null;
        drainEffects(state);
        return state;
      }

      if (pr.type === 'PICK_KEPT_ING' && action.type === 'CHOOSE_KEPT_ING') {
        var keepKey = pr.options.indexOf(action.ing) !== -1 ? action.ing : pr.options[0];
        pl.ing[keepKey] += 1;
        addLog(
          state,
          '🔒 7° Moisture Lock: ' + chefLabelEn(state, pr.player) + ' kept 1 ' + ING_META[keepKey].icon + ' ' + ING_META[keepKey].en + '!',
          '🔒 7°锁汁保留：' + chefLabelZh(state, pr.player) + ' 退回 1 份 ' + ING_META[keepKey].icon + ING_META[keepKey].zh + ' 入托盘！',
          'accent'
        );
        state.prompt = null;
        drainEffects(state);
        return state;
      }

      return state;
    }

    var pIdx = state.activePlayer;
    var p = state.players[pIdx];
    var opp = state.players[1 - pIdx];

    // 2. Step 1: MOVE_RONDEL
    if (state.phase === 'MOVE_RONDEL' && action.type === 'MOVE_RONDEL') {
      var steps = Math.max(1, Math.min(8, Number(action.steps) || 1));
      var spiceCost = steps > 2 ? (steps - 2) : 0;
      if (p.spice < spiceCost) {
        steps = 2;
        spiceCost = 0;
      }
      p.spice -= spiceCost;
      p.seat = (p.seat + steps) % 8;
      var seatObj = RONDEL_SEATS[p.seat];
      addLog(
        state,
        chefLabelEn(state, pIdx) + ' moved ' + steps + ' step' + (steps > 1 ? 's' : '') +
          (spiceCost > 0 ? ' (-' + spiceCost + '🧂)' : ' (free)') +
          ' → ' + seatObj.num + ' ' + seatObj.nameEn + '.',
        chefLabelZh(state, pIdx) + ' 顺时针移动 ' + steps + ' 步' +
          (spiceCost > 0 ? '（付' + spiceCost + '🧂）' : '（免费）') +
          ' → 停在 ' + seatObj.num + seatObj.nameZh + '。',
        'info'
      );
      state.phase = 'RESOLVING';
      state.effectQueue.push({ kind: 'AFTER_RONDEL' });
      resolveSeatArrivalEffects(state, pIdx, p.seat, false);
      drainEffects(state);
      return state;
    }

    // 3. Step 2: PREP_OPTIONAL
    if (state.phase === 'PREP_OPTIONAL') {
      if (action.type === 'SKIP_PREP') {
        state.phase = 'MAIN_ACTION';
        return state;
      }
      if (action.type === 'PREP_CARD') {
        var hIdx = p.hand.indexOf(action.cardId);
        if (hIdx === -1) {
          state.phase = 'MAIN_ACTION';
          return state;
        }
        var cid = p.hand.splice(hIdx, 1)[0];
        state.discard.push(cid);
        var card = CARD_BY_ID[cid];
        var prp = card.prep;
        p.ing.meat += prp.meat;
        p.ing.shrimp += prp.shrimp;
        p.ing.mushroom += prp.mushroom;
        p.spice += prp.spice;
        if (prp.ice > 0 && p.ice < 1) p.ice = 1;

        addLog(
          state,
          '🥗 Prep: ' + chefLabelEn(state, pIdx) + ' discarded ' + card.nameEn + ' → ' + card.prepTextEn + '.',
          '🥗 弃牌备菜：' + chefLabelZh(state, pIdx) + ' 弃《' + card.nameZh + '》 → ' + card.prepTextZh + '。',
          'info'
        );

        state.phase = 'RESOLVING';
        if (prp.anyIng) {
          state.effectQueue.push({ kind: 'PICK_ANY_ING', player: pIdx, reason: 'prep11' });
        }
        if (prp.draw > 0) {
          state.effectQueue.push({ kind: 'DRAW_DECK', player: pIdx, reason: 'prep' });
        }
        state.effectQueue.push({ kind: 'AFTER_PREP' });
        drainEffects(state);
        return state;
      }
      if (action.type === 'EQUIP_GEAR') {
        var gIdx2 = p.hand.indexOf(action.cardId);
        if (gIdx2 === -1 || (p.gears.length >= 2 && p.spice < 1)) {
          state.phase = 'MAIN_ACTION';
          return state;
        }
        var eqId2 = p.hand.splice(gIdx2, 1)[0];
        var eqCard2 = CARD_BY_ID[eqId2];
        if (p.gears.length >= 2) {
          p.spice -= 1;
          var repIdx2 = p.gears.indexOf(action.replaceGearId);
          if (repIdx2 === -1) repIdx2 = 0;
          var oldGear2 = p.gears.splice(repIdx2, 1)[0];
          state.discard.push(oldGear2);
        }
        p.gears.push(eqId2);

        var dualMsgEn2 = '';
        var dualMsgZh2 = '';
        var claimedDual2 = false;
        // v0.7.14 (#112): Sole ⭐ Dual-Gear +2★ & Draw 1 badge is claimed in Step 2 once chef already holds ≥1 Cuisine Stamp (0-stamp equip does not retroactively claim)
        if (p.gears.length === 2 && countStamps(p) >= 1 && state.dualGearClaimedBy === null) {
          state.dualGearClaimedBy = pIdx;
          state.dualGearClaimedRound = state.round;
          addStars(state, pIdx, 2);
          claimedDual2 = true;
          dualMsgEn2 = ' 🥈 Dual-Gear Badge (≥1 Stamp): +2★ & Draw 1!';
          dualMsgZh2 = ' 🥈 双厨具神兵奖（≥1流派章）：夺唯一 +2★ 并摸 1 牌！';
        }

        addLog(
          state,
          '⚙️ Step 2 Gear: ' + chefLabelEn(state, pIdx) + ' equipped ' + eqCard2.gearNameEn + ' (' + eqCard2.gearTagEn + ').' + dualMsgEn2,
          '⚙️ 第2步装厨具：' + chefLabelZh(state, pIdx) + ' 装备【' + eqCard2.gearNameZh + '】（' + eqCard2.gearTagZh + '）。' + dualMsgZh2,
          dualMsgEn2 ? 'gold' : 'info'
        );

        state.phase = 'RESOLVING';
        if (claimedDual2) {
          state.effectQueue.push({ kind: 'DRAW_DECK', player: pIdx, reason: 'dualGear' });
        }
        state.effectQueue.push({ kind: 'AFTER_PREP' });
        drainEffects(state);
        return state;
      }
    }

    // 4. Step 3: MAIN_ACTION
    if (state.phase === 'MAIN_ACTION') {
      if (action.type === 'EQUIP_GEAR') {
        var gIdx = p.hand.indexOf(action.cardId);
        if (gIdx === -1) return state;
        var eqId = p.hand.splice(gIdx, 1)[0];
        var eqCard = CARD_BY_ID[eqId];
        if (p.gears.length >= 2) {
          var repIdx = p.gears.indexOf(action.replaceGearId);
          if (repIdx === -1) repIdx = 0;
          var oldGear = p.gears.splice(repIdx, 1)[0];
          state.discard.push(oldGear);
        }
        p.gears.push(eqId);

        var dualMsgEn = '';
        var dualMsgZh = '';
        var claimedDual = false;
        if (p.gears.length === 2 && countStamps(p) >= 1 && state.dualGearClaimedBy === null) {
          state.dualGearClaimedBy = pIdx;
          state.dualGearClaimedRound = state.round;
          addStars(state, pIdx, 2);
          claimedDual = true;
          dualMsgEn = ' 🥈 Dual-Gear Badge (≥1 Stamp): +2★ & Draw 1!';
          dualMsgZh = ' 🥈 双厨具神兵奖（≥1流派章）：夺唯一 +2★ 并摸 1 牌！';
        }

        addLog(
          state,
          '⚙️ Gear: ' + chefLabelEn(state, pIdx) + ' equipped ' + eqCard.gearNameEn + ' (' + eqCard.gearTagEn + ').' + dualMsgEn,
          '⚙️ 装设厨具：' + chefLabelZh(state, pIdx) + ' 装备【' + eqCard.gearNameZh + '】（' + eqCard.gearTagZh + '）。' + dualMsgZh,
          dualMsgEn ? 'gold' : 'info'
        );

        state.phase = 'RESOLVING';
        if (claimedDual) {
          state.effectQueue.push({ kind: 'DRAW_DECK', player: pIdx, reason: 'dualGear' });
        }
        state.effectQueue.push({ kind: 'END_MAIN_ACTION' });
        drainEffects(state);
        return state;
      }

      if (action.type === 'RESTOCK') {
        state.phase = 'RESOLVING';
        if (action.mode === 'DRAW') {
          addLog(
            state,
            '🧺 Restock: ' + chefLabelEn(state, pIdx) + ' drew 1 card from Menu Deck.',
            '🧺 休整补给：' + chefLabelZh(state, pIdx) + ' 从牌库摸 1 张牌。',
            'info'
          );
          state.effectQueue.push({ kind: 'DRAW_DECK', player: pIdx, reason: 'restock' });
        } else {
          var rIng = ING_META[action.ing] ? action.ing : 'meat';
          p.ing[rIng] += 1;
          addLog(
            state,
            '🧺 Restock: ' + chefLabelEn(state, pIdx) + ' took +1 ' + ING_META[rIng].icon + ' ' + ING_META[rIng].en + '.',
            '🧺 休整补给：' + chefLabelZh(state, pIdx) + ' 拿取 1 份 ' + ING_META[rIng].icon + ING_META[rIng].zh + '。',
            'info'
          );
        }
        state.effectQueue.push({ kind: 'END_MAIN_ACTION' });
        drainEffects(state);
        return state;
      }

      if (action.type === 'START_COOK') {
        var src = action.source === 'menu' ? 'menu' : 'hand';
        var pool = src === 'menu' ? state.openMenu : p.hand;
        var cPos = pool.indexOf(action.cardId);
        if (cPos === -1) return state;

        var cookOpts = getCookOptionsForCard(state, pIdx, action.cardId);
        if (!cookOpts.canCook) return state;

        // Pick matching payment mode
        var chosenMode = cookOpts.modes[0];
        for (var mi = 0; mi < cookOpts.modes.length; mi++) {
          var m = cookOpts.modes[mi];
          if (action.useKnife && m.useKnife && (!action.reducedIng || m.reducedIng === action.reducedIng)) {
            chosenMode = m;
            break;
          }
          if (action.useKnife === false && !m.useKnife) {
            chosenMode = m;
            break;
          }
        }
        // Prefer saving 1 ingredient via Chef Knife automatically when available unless explicitly declined
        if (action.useKnife === undefined) {
          for (var mj = 0; mj < cookOpts.modes.length; mj++) {
            if (cookOpts.modes[mj].useKnife) {
              chosenMode = cookOpts.modes[mj];
              break;
            }
          }
        }

        // Remove card from hand or openMenu into wok
        pool.splice(cPos, 1);

        // Deduct cost and record paid basic ingredients
        p.ing.meat -= chosenMode.cost.meat;
        p.ing.shrimp -= chosenMode.cost.shrimp;
        p.ing.mushroom -= chosenMode.cost.mushroom;
        p.spice -= chosenMode.cost.spice;

        var paidBasic = [];
        var bi;
        for (bi = 0; bi < chosenMode.cost.meat; bi++) paidBasic.push('meat');
        for (bi = 0; bi < chosenMode.cost.shrimp; bi++) paidBasic.push('shrimp');
        for (bi = 0; bi < chosenMode.cost.mushroom; bi++) paidBasic.push('mushroom');

        var usedGears = {};
        var borrowedOpponentGear = false;
        if (chosenMode.useKnife) {
          usedGears[5] = true;
          if (chosenMode.knifeSource === 'opp') borrowedOpponentGear = true;
        }

        // Mandatory 1st Free Blazing Die Roll from 1° start! (Always lands 2°~7°, 0% bust!)
        var firstFace = state.rng.rollD6();
        var startTemp = 1 + firstFace;
        var dishCard = CARD_BY_ID[action.cardId];

        state.turnContext.cookedThisTurn = true;
        state.phase = 'WOK_COOKING';
        state.wok = {
          cardId: action.cardId,
          fromMenu: src === 'menu',
          startedAtBell: p.seat === 7,
          paidBasic: paidBasic,
          temp: startTemp,
          usedGears: usedGears,
          borrowedOpponentGear: borrowedOpponentGear,
          lastRoll: { type: 'blazing', face: firstFace, delta: firstFace, prevTemp: 1 },
          rolls: [{ labelEn: '1st Blazing', labelZh: '首投猛火', face: firstFace, delta: firstFace, tempAfter: startTemp }]
        };

        addLog(
          state,
          '🔥 Fired up ' + dishCard.nameEn + (chosenMode.useKnife ? ' (Chef Knife -1' + ING_META[chosenMode.reducedIng].icon + ')' : '') +
            '! 1° + 🎲' + firstFace + ' → ' + startTemp + '°.',
          '🔥 开火烹饪《' + dishCard.nameZh + '》' + (chosenMode.useKnife ? '（主厨刀省1' + ING_META[chosenMode.reducedIng].icon + '）' : '') +
            '！1°底温 + 🎲' + firstFace + ' → 升至 ' + startTemp + '°。',
          'accent'
        );
        return state;
      }
    }

    // 5. WOK_COOKING Actions
    if (state.phase === 'WOK_COOKING' && state.wok) {
      var w = state.wok;

      if (action.type === 'WOK_PLATE' && w.temp <= 7) {
        finishWokCooking(state, 'plate');
        return state;
      }

      if (action.type === 'WOK_ACCEPT_BUST' && w.temp >= 8) {
        finishWokCooking(state, 'bust');
        return state;
      }

      if (action.type === 'WOK_ROLL_BLAZING' && w.temp <= 7) {
        var bFace = state.rng.rollD6();
        var prevT = w.temp;
        w.temp = prevT + bFace;
        w.lastRoll = { type: 'blazing', face: bFace, delta: bFace, prevTemp: prevT };
        w.rolls.push({ labelEn: 'Blazing', labelZh: '猛火追投', face: bFace, delta: bFace, tempAfter: w.temp });
        addLog(
          state,
          '🎲 Blazing Die rolled ' + bFace + ' (+' + bFace + '°): ' + prevT + '° → ' + w.temp + '°' + (w.temp >= 8 ? ' ⚠️ OVERHEAT!' : '!'),
          '🎲 免费猛火骰投出 ' + bFace + '点（+' + bFace + '°）：' + prevT + '° → ' + w.temp + '°' + (w.temp >= 8 ? ' ⚠️ 超温警报！' : '！'),
          w.temp >= 8 ? 'danger' : 'info'
        );
        return state;
      }

      if (action.type === 'WOK_ROLL_SIMMER' && w.temp <= 7 && p.spice >= 1) {
        p.spice -= 1;
        var sFace = state.rng.rollD6();
        var sDelta = sFace <= 3 ? 1 : 2;
        var prevSim = w.temp;
        w.temp = prevSim + sDelta;
        w.lastRoll = { type: 'simmer', face: sFace, delta: sDelta, prevTemp: prevSim };
        w.rolls.push({ labelEn: 'Simmer (-1🧂)', labelZh: '小火骰(-1🧂)', face: sFace, delta: sDelta, tempAfter: w.temp });
        addLog(
          state,
          '🧂 Simmer Die (-1🧂) rolled ' + sFace + ' (+' + sDelta + '°): ' + prevSim + '° → ' + w.temp + '°!',
          '🧂 付1🧂投小火骰出 ' + sFace + '点（+' + sDelta + '°）：' + prevSim + '° → ' + w.temp + '°！',
          w.temp >= 8 ? 'danger' : 'info'
        );
        return state;
      }

      if (action.type === 'WOK_USE_ICE' && p.ice >= 1 && w.temp >= 4) {
        p.ice -= 1;
        var beforeIce = w.temp;
        w.temp = Math.max(2, w.temp - 2);
        w.rolls.push({ labelEn: '🧊 Ice -2°', labelZh: '🧊救锅冰-2°', face: null, delta: w.temp - beforeIce, tempAfter: w.temp });
        addLog(
          state,
          '🧊 Rescue Ice cooled the wok: ' + beforeIce + '° → ' + w.temp + '°!',
          '🧊 投入救锅冰降温：' + beforeIce + '° → ' + w.temp + '°！',
          'accent'
        );
        return state;
      }

      if (action.type === 'WOK_USE_GEAR') {
        var gid = Number(action.gearId);
        if (w.usedGears[gid]) return state;
        var ownsIt = p.gears.indexOf(gid) !== -1;
        var borrowsIt = !ownsIt && state.turnContext.canBorrowOpponentGear && !w.borrowedOpponentGear && opp.gears.indexOf(gid) !== -1;
        if (!ownsIt && !borrowsIt) return state;

        var gCard = CARD_BY_ID[gid];
        var oldT = w.temp;

        if (gid === 1 && w.temp >= 2 && w.temp <= 6) {
          w.usedGears[1] = true;
          if (borrowsIt) w.borrowedOpponentGear = true;
          w.temp += 1;
          w.lastRoll = null;
        } else if (gid === 2 && w.lastRoll && w.temp >= 3) {
          w.usedGears[2] = true;
          if (borrowsIt) w.borrowedOpponentGear = true;
          w.temp = Math.max(2, w.temp - 1);
        } else if (gid === 3 && w.temp <= 7) {
          w.usedGears[3] = true;
          if (borrowsIt) w.borrowedOpponentGear = true;
          var kFace = state.rng.rollD6();
          var kDelta = kFace <= 3 ? 1 : 2;
          w.temp = oldT + kDelta;
          w.lastRoll = { type: 'simmer', face: kFace, delta: kDelta, prevTemp: oldT };
        } else if (gid === 4 && w.lastRoll) {
          w.usedGears[4] = true;
          if (borrowsIt) w.borrowedOpponentGear = true;
          var baseT = w.lastRoll.prevTemp;
          var rType = w.lastRoll.type;
          var rFace = state.rng.rollD6();
          var rDelta = rType === 'simmer' ? (rFace <= 3 ? 1 : 2) : rFace;
          w.temp = baseT + rDelta;
          w.lastRoll = { type: rType, face: rFace, delta: rDelta, prevTemp: baseT };
        } else if (gid === 6 && (w.temp === 4 || w.temp === 6)) {
          w.usedGears[6] = true;
          if (borrowsIt) w.borrowedOpponentGear = true;
          w.temp += 1;
          w.lastRoll = null;
        } else if (gid === 7 && w.lastRoll && (w.lastRoll.face === 1 || w.lastRoll.face === 6) && w.lastRoll.delta !== 2) {
          w.usedGears[7] = true;
          if (borrowsIt) w.borrowedOpponentGear = true;
          w.temp = w.lastRoll.prevTemp + 2;
          w.lastRoll.delta = 2;
        } else if (gid === 8 && w.lastRoll && w.temp >= 3) {
          var coolAmt = action.amount === 2 ? 2 : 1;
          w.usedGears[8] = true;
          if (borrowsIt) w.borrowedOpponentGear = true;
          w.temp = Math.max(2, w.temp - coolAmt);
        } else if (gid === 10 && w.temp <= 7) {
          w.usedGears[10] = true;
          if (borrowsIt) w.borrowedOpponentGear = true;
          p.spice += 1;
        } else if (gid === 12 && w.lastRoll && w.lastRoll.type === 'simmer') {
          var adj = action.adj === -1 ? -1 : 1;
          w.usedGears[12] = true;
          if (borrowsIt) w.borrowedOpponentGear = true;
          var adjDelta = w.lastRoll.delta + adj;
          w.temp = Math.max(2, w.lastRoll.prevTemp + adjDelta);
          w.lastRoll.delta = adjDelta;
        } else {
          return state;
        }

        w.rolls.push({
          labelEn: '⚙️ ' + gCard.gearNameEn,
          labelZh: '⚙️ ' + gCard.gearNameZh,
          face: w.lastRoll ? w.lastRoll.face : null,
          delta: w.temp - oldT,
          tempAfter: w.temp
        });

        addLog(
          state,
          '⚙️ ' + (borrowsIt ? 'Borrowed ' : '') + gCard.gearNameEn + ': ' +
            (gid === 10 ? '+1🧂 Spice!' : (oldT + '° → ' + w.temp + '°!')),
          '⚙️ 发动' + (borrowsIt ? '借用' : '') + '【' + gCard.gearNameZh + '】：' +
            (gid === 10 ? '立即领 +1🧂！' : (oldT + '° → ' + w.temp + '°！')),
          'accent'
        );
        return state;
      }
    }

    // 6. Out-of-Turn Follow Reaction
    if (state.phase === 'FOLLOW_REACTION') {
      var fIdx = 1 - state.activePlayer;
      var follower = state.players[fIdx];
      if (action.type === 'PASS_FOLLOW' || follower.spice < 1) {
        advanceTurnOrEndgame(state);
        return state;
      }
      if (action.type === 'DO_FOLLOW') {
        follower.spice -= 1;
        state.phase = 'RESOLVING';
        if (action.mode === 'DRAW') {
          addLog(
            state,
            '🤝 Follow (-1🧂): ' + chefLabelEn(state, fIdx) + ' drew 1 card.',
            '🤝 回合外跟随（-1🧂）：' + chefLabelZh(state, fIdx) + ' 摸 1 张牌。',
            'info'
          );
          state.effectQueue.push({ kind: 'DRAW_DECK', player: fIdx, reason: 'follow' });
        } else {
          var fIng = ING_META[action.ing] ? action.ing : 'meat';
          follower.ing[fIng] += 1;
          addLog(
            state,
            '🤝 Follow (-1🧂): ' + chefLabelEn(state, fIdx) + ' took +1 ' + ING_META[fIng].icon + ' ' + ING_META[fIng].en + '.',
            '🤝 回合外跟随（-1🧂）：' + chefLabelZh(state, fIdx) + ' 拿取 1 份 ' + ING_META[fIng].icon + ING_META[fIng].zh + '。',
            'info'
          );
        }
        state.effectQueue.push({ kind: 'END_FOLLOW' });
        drainEffects(state);
        return state;
      }
    }

    return state;
  }

  /* ==========================================================================
   * 7. SMART HEURISTIC SOUS-CHEF AI (Fast, Strategic & Fun to Play Against!)
   * ========================================================================== */
  function scoreGearPower(cardId, p) {
    // High-utility wok control & discount gears ranked highest
    var weights = {
      6: 9.5,  // Blowtorch (4°/6° -> +1° guaranteed!)
      8: 9.2,  // Polar Platter (-1/-2° rescue!)
      2: 8.8,  // Claypot (-1° rescue!)
      3: 8.5,  // Kamado (Free Simmer!)
      5: 8.4,  // Damascus Chef Knife (-1 recipe ing!)
      1: 7.5,  // Smoker (+1°)
      4: 7.4,  // Carbon Wok (Reroll)
      10: 7.2, // Shaoxing Wine Jar (+1🧂)
      7: 6.8,  // Convection Oven
      12: 6.6, // Cauldron
      9: 6.4,  // Pasta Roller
      11: 6.2  // Silver Cloche
    };
    return weights[cardId] || 6.0;
  }

  function scoreDishDesirability(state, pIdx, cardId) {
    var p = state.players[pIdx];
    var c = CARD_BY_ID[cardId];
    var score = c.starsGold * 2.2;
    if (!p.stamps[c.cuisine]) {
      score += 3.5;
      if (countStamps(p) === 2 && !p.threeStampsDone) {
        score += 7.5; // Completing 3rd stamp yields +3★!
      }
    }
    if (!p.firstDishDone) score += 2.0;
    if (p.stars + c.starsGold >= 18) score += 12.0; // Lethal push!
    return score;
  }

  function missingForCard(state, pIdx, cardId, extraIng, extraSpice) {
    var p = state.players[pIdx];
    var c = CARD_BY_ID[cardId];
    var r = c.recipe;
    var mMeat = Math.max(0, r.meat - (p.ing.meat + (extraIng.meat || 0)));
    var mShr = Math.max(0, r.shrimp - (p.ing.shrimp + (extraIng.shrimp || 0)));
    var mMush = Math.max(0, r.mushroom - (p.ing.mushroom + (extraIng.mushroom || 0)));
    var basicDeficit = mMeat + mShr + mMush;
    if (c.recipeTotal === 3 && p.gears.indexOf(5) !== -1 && basicDeficit > 0) {
      basicDeficit = Math.max(0, basicDeficit - 1);
    }
    var spDeficit = Math.max(0, r.spice - (p.spice + (extraSpice || 0)));
    return basicDeficit + spDeficit;
  }

  function pickNeededIng(state, pIdx) {
    var p = state.players[pIdx];
    var pool = p.hand.concat(state.openMenu);
    var demand = { meat: 0.2, shrimp: 0.2, mushroom: 0.2 };
    for (var i = 0; i < pool.length; i++) {
      var c = CARD_BY_ID[pool[i]];
      var w = scoreDishDesirability(state, pIdx, c.id) / (1 + missingForCard(state, pIdx, c.id, {}, 0));
      if (p.ing.meat < c.recipe.meat) demand.meat += w * (c.recipe.meat - p.ing.meat);
      if (p.ing.shrimp < c.recipe.shrimp) demand.shrimp += w * (c.recipe.shrimp - p.ing.shrimp);
      if (p.ing.mushroom < c.recipe.mushroom) demand.mushroom += w * (c.recipe.mushroom - p.ing.mushroom);
    }
    var best = 'meat';
    if (demand.shrimp > demand[best]) best = 'shrimp';
    if (demand.mushroom > demand[best]) best = 'mushroom';
    return best;
  }

  function evaluateCardKeepValue(state, pIdx, cardId) {
    var miss = missingForCard(state, pIdx, cardId, {}, 0);
    var dishScore = scoreDishDesirability(state, pIdx, cardId) - miss * 3.2;
    var p = state.players[pIdx];
    var gearScore = p.gears.length < 2 ? scoreGearPower(cardId, p) : 0;
    return Math.max(dishScore, gearScore);
  }

  function chooseAIAction(state) {
    var actor = getActingPlayer(state);
    if (actor === null) return null;
    var p = state.players[actor];
    var opp = state.players[1 - actor];

    // 1. Sub-prompts
    if (state.prompt) {
      var pr = state.prompt;
      if (pr.type === 'DISCARD_FOR_DRAW') {
        var c0 = p.hand[0];
        var c1 = p.hand[1];
        var v0 = evaluateCardKeepValue(state, actor, c0);
        var v1 = evaluateCardKeepValue(state, actor, c1);
        if (pr.reason === 'bump' && v0 > 13 && v1 > 13) {
          return { type: 'CHOOSE_DISCARD_FOR_DRAW', skipDraw: true };
        }
        return { type: 'CHOOSE_DISCARD_FOR_DRAW', cardId: v0 <= v1 ? c0 : c1 };
      }
      if (pr.type === 'PICK_OPEN_MENU') {
        var bestMenuId = state.openMenu[0];
        var bestVal = -999;
        for (var mi = 0; mi < state.openMenu.length; mi++) {
          var mid = state.openMenu[mi];
          var val = evaluateCardKeepValue(state, actor, mid);
          if (val > bestVal) {
            bestVal = val;
            bestMenuId = mid;
          }
        }
        return { type: 'CHOOSE_OPEN_MENU', cardId: bestMenuId };
      }
      if (pr.type === 'PICK_ANY_ING') {
        return { type: 'CHOOSE_ANY_ING', ing: pickNeededIng(state, actor) };
      }
      if (pr.type === 'PICK_KEPT_ING') {
        var need = pickNeededIng(state, actor);
        var chosen = pr.options.indexOf(need) !== -1 ? need : pr.options[0];
        return { type: 'CHOOSE_KEPT_ING', ing: chosen };
      }
    }

    // 2. Step 1: Rondel Movement Evaluation (1 to 5 steps)
    if (state.phase === 'MOVE_RONDEL') {
      var bestStep = 1;
      var bestStepScore = -999;
      var candidatePool = p.hand.concat(state.openMenu);
      var maxAffordableSteps = Math.min(6, 2 + p.spice);

      for (var st = 1; st <= maxAffordableSteps; st++) {
        var cost = st > 2 ? st - 2 : 0;
        var dest = (p.seat + st) % 8;
        var sc = -cost * 2.4;

        // Slight penalty for giving opponent a free Bump draw unless seat is super juicy
        if (opp.seat === dest) sc -= 1.1;

        var addIng = { meat: 0, shrimp: 0, mushroom: 0 };
        var addSp = -cost;
        if (dest === 0) { addSp += 1; sc += 2.2; }
        if (dest === 1) { addIng.meat = 1; sc += 2.8; }
        if (dest === 2) { addIng.shrimp = 1; sc += 3.1; }
        if (dest === 3) { addIng.mushroom = 1; addSp += 1; sc += 3.0; }
        if (dest === 4) { sc += (p.ice === 0 ? 3.4 : 1.5); }
        if (dest === 5) { addSp += 2; sc += 2.8 + (opp.gears.length > 0 ? 1.8 : 0); }
        if (dest === 6) {
          var want = pickNeededIng(state, actor);
          addIng[want] = 1;
          addSp += 1;
          sc += 3.8;
        }
        if (dest === 7) { sc += 2.0; }

        // Evaluate whether landing here unlocks cooking a high-value dish right now!
        var bestCookUnlock = 0;
        for (var ci = 0; ci < candidatePool.length; ci++) {
          var cid = candidatePool[ci];
          var missAfter = missingForCard(state, actor, cid, addIng, addSp);
          var des = scoreDishDesirability(state, actor, cid);
          if (missAfter === 0) {
            var cookBonus = des + (dest === 7 ? 3.5 : 0);
            if (cookBonus > bestCookUnlock) bestCookUnlock = cookBonus;
          } else if (missAfter === 1) {
            var nearBonus = des * 0.42;
            if (nearBonus > bestCookUnlock) bestCookUnlock = nearBonus;
          }
        }
        sc += bestCookUnlock;

        if (sc > bestStepScore) {
          bestStepScore = sc;
          bestStep = st;
        }
      }
      return { type: 'MOVE_RONDEL', steps: bestStep };
    }

    // 3. Step 2: Optional Discard-to-Prep
    if (state.phase === 'PREP_OPTIONAL') {
      if (p.hand.length === 0) return { type: 'SKIP_PREP' };

      // Check best currently cookable dish without prepping
      var currentBestCook = 0;
      var allTargets = p.hand.concat(state.openMenu);
      for (var ti = 0; ti < allTargets.length; ti++) {
        if (getCookOptionsForCard(state, actor, allTargets[ti]).canCook) {
          var dScore = scoreDishDesirability(state, actor, allTargets[ti]);
          if (dScore > currentBestCook) currentBestCook = dScore;
        }
      }

      var bestPrepCard = null;
      var bestPrepGain = 0;

      for (var hi = 0; hi < p.hand.length; hi++) {
        var hId = p.hand[hi];
        var hCard = CARD_BY_ID[hId];
        var prp = hCard.prep;
        var simIng = { meat: prp.meat, shrimp: prp.shrimp, mushroom: prp.mushroom };
        if (prp.anyIng) simIng[pickNeededIng(state, actor)] += 1;

        // Remaining cook targets if we discard hId
        var remTargets = state.openMenu.slice();
        for (var hj = 0; hj < p.hand.length; hj++) {
          if (hj !== hi) remTargets.push(p.hand[hj]);
        }

        var unlockedCook = 0;
        for (var rti = 0; rti < remTargets.length; rti++) {
          if (missingForCard(state, actor, remTargets[rti], simIng, prp.spice) === 0) {
            var ds = scoreDishDesirability(state, actor, remTargets[rti]);
            if (ds > unlockedCook) unlockedCook = ds;
          }
        }

        // Prep if it unlocks a better cook immediately, OR if we can't cook anything and aren't saving a top gear
        if (unlockedCook > currentBestCook + 1.0) {
          var gain = unlockedCook - currentBestCook + 5.0;
          if (gain > bestPrepGain) {
            bestPrepGain = gain;
            bestPrepCard = hId;
          }
        } else if (currentBestCook === 0) {
          // If we don't plan to equip a top gear right now, prepping builds engine fast!
          var wantGear = p.gears.length < 2 && scoreGearPower(hId, p) >= 8.4 && state.round <= 4;
          if (!wantGear) {
            var resourceVal = (prp.meat + prp.shrimp + prp.mushroom + (prp.anyIng ? 1.2 : 0)) * 2.2 +
              prp.spice * 1.5 + prp.ice * 2.0 + prp.draw * 1.6;
            if (resourceVal > bestPrepGain) {
              bestPrepGain = resourceVal;
              bestPrepCard = hId;
            }
          }
        }
      }

      if (bestPrepCard !== null && bestPrepGain >= 3.2) {
        return { type: 'PREP_CARD', cardId: bestPrepCard };
      }

      // v0.7.12: Step 2 Optional Equip Gear into empty slot (free! preserves Step 3 Cook/Restock!)
      if (p.hand.length > 0 && p.gears.length < 2) {
        var bestStep2Gear = null;
        var bestStep2Score = -1;
        for (var sgi = 0; sgi < p.hand.length; sgi++) {
          var sgid = p.hand[sgi];
          // Don't consume our only cookable hand dish if Open Menu can't be cooked
          var sgOpts = getCookOptionsForCard(state, actor, sgid);
          if (sgOpts.canCook && currentBestCook > 0) {
            var menuCookable = false;
            for (var mci = 0; mci < state.openMenu.length; mci++) {
              if (getCookOptionsForCard(state, actor, state.openMenu[mci]).canCook) menuCookable = true;
            }
            if (!menuCookable) continue;
          }
          var sgs = scoreGearPower(sgid, p);
          if (
            p.gears.length === 1 &&
            countStamps(p) >= 1 &&
            state.dualGearClaimedBy === null
          ) {
            sgs += 6.5; // Grab sole +2★ & Draw 1 badge!
          }
          if (sgs > bestStep2Score) {
            bestStep2Score = sgs;
            bestStep2Gear = sgid;
          }
        }
        if (bestStep2Gear !== null && bestStep2Score >= 7.8) {
          return { type: 'EQUIP_GEAR', cardId: bestStep2Gear };
        }
      }
      return { type: 'SKIP_PREP' };
    }

    // 4. Step 3: Core Main Action (Cook vs Restock)
    if (state.phase === 'MAIN_ACTION') {
      // A) Check all cookable dishes (Hand + Open Menu)
      var bestCookAct = null;
      var bestCookVal = -1;

      for (var si = 0; si < 2; si++) {
        var source = si === 0 ? 'menu' : 'hand'; // Cooking from Open Menu preserves hand!
        var list = source === 'menu' ? state.openMenu : p.hand;
        for (var li = 0; li < list.length; li++) {
          var cid2 = list[li];
          var opts = getCookOptionsForCard(state, actor, cid2);
          if (opts.canCook) {
            var val2 = scoreDishDesirability(state, actor, cid2) + (source === 'menu' ? 0.8 : 0);
            if (val2 > bestCookVal) {
              bestCookVal = val2;
              bestCookAct = { type: 'START_COOK', source: source, cardId: cid2 };
            }
          }
        }
      }

      if (bestCookAct) return bestCookAct;

      // B) Restock missing ingredient (or Draw card if hand is empty)
      if (p.hand.length === 0) {
        return { type: 'RESTOCK', mode: 'DRAW' };
      }
      return { type: 'RESTOCK', mode: 'ING', ing: pickNeededIng(state, actor) };
    }

    // 5. WOK_COOKING Push-Your-Luck EV Engine
    if (state.phase === 'WOK_COOKING' && state.wok) {
      var w = state.wok;
      var avail = getAvailableWokActions(state);
      var findGear = function (id, extraCheck) {
        for (var ai = 0; ai < avail.length; ai++) {
          if (avail[ai].type === 'WOK_USE_GEAR' && avail[ai].gearId === id) {
            if (!extraCheck || extraCheck(avail[ai])) return avail[ai];
          }
        }
        return null;
      };
      var hasType = function (t) {
        for (var ai = 0; ai < avail.length; ai++) {
          if (avail[ai].type === t) return avail[ai];
        }
        return null;
      };

      // Always grab free +1 Spice from Shaoxing Wine Jar (Gear 10) first!
      var g10 = findGear(10);
      if (g10) return g10;

      // Exact 7° Perfect Sear -> Plate immediately!
      if (w.temp === 7) {
        return { type: 'WOK_PLATE' };
      }

      // Overheated (8°+) -> Rescue to <= 7° if possible!
      if (w.temp >= 8) {
        // Priority 1: Hit exact 7° with Claypot (-1° at 8°), Platter (-1° at 8° or -2° at 9°), Cauldron (-1° at 8°), Oven (6->+2°), or Ice (-2° at 9°)
        if (w.temp === 8) {
          var c2 = findGear(2);
          if (c2) return c2;
          var c12 = findGear(12, function (a) { return a.adj === -1; });
          if (c12) return c12;
          var c8_1 = findGear(8, function (a) { return a.amount === 1; });
          if (c8_1) return c8_1;
        }
        if (w.temp === 9) {
          var c8_2 = findGear(8, function (a) { return a.amount === 2; });
          if (c8_2) return c8_2;
          var ice9 = hasType('WOK_USE_ICE');
          if (ice9) return ice9;
        }
        var c7 = findGear(7);
        if (c7 && w.lastRoll && w.lastRoll.prevTemp + 2 <= 7) return c7;
        var ice8 = hasType('WOK_USE_ICE');
        if (ice8 && w.temp - 2 <= 7) return ice8;
        var c8Any = findGear(8, function (a) { return w.temp - a.amount <= 7; });
        if (c8Any) return c8Any;
        var reroll4 = findGear(4);
        if (reroll4) return reroll4;
        return { type: 'WOK_ACCEPT_BUST' };
      }

      // Temp === 6°: Check direct +1° gears to hit 7° Perfect!
      if (w.temp === 6) {
        var bt6 = findGear(6);
        if (bt6) return bt6;
        var sm6 = findGear(1);
        if (sm6) return sm6;
        var caul6 = findGear(12, function (a) { return a.adj === 1; });
        if (caul6) return caul6;

        // Has safety net for 8°? Push Simmer for 7°!
        var has8Safety = Boolean(findGear(2) || findGear(8) || hasType('WOK_USE_ICE'));
        if (has8Safety) {
          var freeSim6 = findGear(3);
          if (freeSim6) return freeSim6;
          if (hasType('WOK_ROLL_SIMMER')) return { type: 'WOK_ROLL_SIMMER' };
        }
        // Otherwise lock in Golden 6°!
        return { type: 'WOK_PLATE' };
      }

      // Temp === 5°: DESIGN.md Golden Rule — Simmer Die (+1°/+2°) has 0% bust & 50% 7° Perfect!
      if (w.temp === 5) {
        var freeSim5 = findGear(3);
        if (freeSim5) return freeSim5;
        if (hasType('WOK_ROLL_SIMMER')) return { type: 'WOK_ROLL_SIMMER' };
        var sm5 = findGear(1);
        if (sm5 && (findGear(6) || findGear(2) || hasType('WOK_USE_ICE'))) return sm5;
        return { type: 'WOK_PLATE' };
      }

      // Temp === 4°: Blowtorch/Smoker (+1° -> 5°) or Simmer Die (100% 5°~6° Golden!)
      if (w.temp === 4) {
        var bt4 = findGear(6);
        if (bt4) return bt4;
        var sm4 = findGear(1);
        if (sm4) return sm4;
        var freeSim4 = findGear(3);
        if (freeSim4) return freeSim4;
        if (hasType('WOK_ROLL_SIMMER')) return { type: 'WOK_ROLL_SIMMER' };
        // No spice at 4°: push Blazing if we hold safety net or trailing badly, else still push Blazing (50% 5~7° vs 1★ half-cooked -> EV of Blazing at 4° is 0.5*5.5 + 0.5*1.2 = 3.35★ >> 1★!)
        return { type: 'WOK_ROLL_BLAZING' };
      }

      // Temp === 2° or 3°: If rolled 1 on initial roll and have Royal Oven (1 -> +2°), boost!
      var ovLow = findGear(7);
      if (ovLow && w.lastRoll && w.lastRoll.face === 1) return ovLow;

      // At 2° or 3°, free Blazing Die has massive positive EV!
      return { type: 'WOK_ROLL_BLAZING' };
    }

    // 6. Out-of-Turn Follow Reaction
    if (state.phase === 'FOLLOW_REACTION') {
      // Keep 1🧂 reserve if sitting on a ready-to-cook recipe that needs 1🧂; otherwise Follow when spice >= 2 or missing 1 basic ing!
      var needIng = pickNeededIng(state, actor);
      var unlocksDish = false;
      var targets = p.hand.concat(state.openMenu);
      var addOne = { meat: 0, shrimp: 0, mushroom: 0 };
      addOne[needIng] = 1;
      for (var fi = 0; fi < targets.length; fi++) {
        if (!getCookOptionsForCard(state, actor, targets[fi]).canCook &&
            missingForCard(state, actor, targets[fi], addOne, -1) === 0) {
          unlocksDish = true;
          break;
        }
      }
      if (unlocksDish || p.spice >= 2) {
        if (p.hand.length === 0) return { type: 'DO_FOLLOW', mode: 'DRAW' };
        return { type: 'DO_FOLLOW', mode: 'ING', ing: needIng };
      }
      return { type: 'PASS_FOLLOW' };
    }

    return null;
  }

  /* ==========================================================================
   * 8. PROCEDURAL COZY BISTRO WEBAUDIO SYNTHESIZER (Zero External MP3s!)
   * ========================================================================== */
  var BistroAudio = (function () {
    var ctx = null;
    var muted = safeStorageGet('starchef_muted', '0') === '1';

    function ensureCtx() {
      if (muted) return null;
      var AC = root && (root.AudioContext || root.webkitAudioContext);
      if (!AC) return null;
      if (!ctx) {
        try { ctx = new AC(); } catch (_e) { return null; }
      }
      if (ctx && ctx.state === 'suspended') {
        try { ctx.resume(); } catch (_e2) {}
      }
      return ctx;
    }

    function playTone(freq, dur, type, vol, slideTo, delaySec) {
      var c = ensureCtx();
      if (!c) return;
      var t0 = c.currentTime + (delaySec || 0);
      var osc = c.createOscillator();
      var gain = c.createGain();
      osc.type = type || 'triangle';
      osc.frequency.setValueAtTime(freq, t0);
      if (slideTo) {
        osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
      }
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.linearRampToValueAtTime(vol || 0.12, t0 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    }

    function playNoise(dur, vol, filterFreq) {
      var c = ensureCtx();
      if (!c) return;
      var len = Math.floor(c.sampleRate * dur);
      var buf = c.createBuffer(1, len, c.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.45));
      }
      var src = c.createBufferSource();
      src.buffer = buf;
      var biq = c.createBiquadFilter();
      biq.type = 'bandpass';
      biq.frequency.value = filterFreq || 1800;
      var gain = c.createGain();
      gain.gain.value = vol || 0.08;
      src.connect(biq);
      biq.connect(gain);
      gain.connect(c.destination);
      src.start();
    }

    return {
      isMuted: function () { return muted; },
      toggleMute: function () {
        muted = !muted;
        safeStorageSet('starchef_muted', muted ? '1' : '0');
        if (!muted) playTone(660, 0.12, 'sine', 0.1, 880, 0);
        return muted;
      },
      step: function () {
        playTone(290, 0.08, 'triangle', 0.12, 190, 0);
        playTone(440, 0.07, 'sine', 0.07, 520, 0.04);
      },
      prep: function () {
        playNoise(0.09, 0.11, 2400);
        playTone(520, 0.09, 'triangle', 0.09, 640, 0.03);
      },
      gear: function () {
        playTone(587, 0.12, 'sine', 0.1, 880, 0);
        playTone(880, 0.16, 'triangle', 0.08, 1174, 0.06);
      },
      sizzleRoll: function (temp) {
        playNoise(0.18, 0.12, 2900);
        var base = 330 + Math.min(8, temp) * 55;
        playTone(base, 0.14, 'triangle', 0.11, base * 1.15, 0.02);
      },
      bellGold: function (isPerfect) {
        playTone(784, 0.28, 'sine', 0.14, 784, 0);
        playTone(1046.5, 0.34, 'sine', 0.13, 1046.5, 0.08);
        if (isPerfect) {
          playTone(1318.5, 0.45, 'sine', 0.15, 1568, 0.16);
        }
      },
      bust: function () {
        playNoise(0.28, 0.14, 600);
        playTone(220, 0.28, 'sawtooth', 0.09, 110, 0);
      },
      victory: function () {
        var notes = [523.25, 659.25, 783.99, 1046.5];
        for (var i = 0; i < notes.length; i++) {
          playTone(notes[i], 0.26, 'triangle', 0.13, notes[i], i * 0.09);
        }
      }
    };
  })();

  /* ==========================================================================
   * 9. TRILOGY THUMBNAILS (Self-Contained Inline SVGs for Funnel Showcase)
   * ========================================================================== */
  var TRILOGY_SVGS = {
    starChef: '<svg viewBox="0 0 160 110" width="100%" height="100%"><rect x="2" y="2" width="156" height="106" rx="12" fill="#fffbeb" stroke="#78350f" stroke-width="3"/><rect x="10" y="10" width="140" height="22" rx="6" fill="#e11d48"/><text x="80" y="25" text-anchor="middle" fill="#fff" font-size="10.2" font-weight="800">STAR CHEF SHOWDOWN</text><circle cx="44" cy="65" r="23" fill="#ffe4e6" stroke="#1c1917" stroke-width="2"/><path d="M28 63 C30 77, 58 77, 60 63 Z" fill="#475569" stroke="#1c1917" stroke-width="2"/><rect x="76" y="42" width="72" height="18" rx="4" fill="#fef08a" stroke="#b45309" stroke-width="1.5"/><text x="112" y="54" text-anchor="middle" fill="#78350f" font-size="7.8" font-weight="800">5°–7° WOK HEI!</text><rect x="76" y="66" width="72" height="28" rx="4" fill="#fff" stroke="#1c1917" stroke-width="1.5"/><text x="112" y="79" text-anchor="middle" fill="#0f172a" font-size="8.2" font-weight="700">8-Seat Rondel</text><text x="112" y="90" text-anchor="middle" fill="#be123c" font-size="8.2" font-weight="700">3-Sheet PnP</text></svg>',
    woodland: '<svg viewBox="0 0 160 110" width="100%" height="100%"><rect x="2" y="2" width="156" height="106" rx="12" fill="#f0fdf4" stroke="#14532d" stroke-width="3"/><rect x="10" y="10" width="140" height="22" rx="6" fill="#15803d"/><text x="80" y="25" text-anchor="middle" fill="#fff" font-size="10.2" font-weight="800">WOODLAND SEASONS</text><circle cx="44" cy="65" r="23" fill="#dcfce7" stroke="#14532d" stroke-width="2"/><polygon points="44,44 29,69 59,69" fill="#16a34a" stroke="#14532d" stroke-width="1.8"/><rect x="41" y="69" width="6" height="10" fill="#78350f"/><rect x="76" y="42" width="72" height="18" rx="4" fill="#fef9c3" stroke="#15803d" stroke-width="1.5"/><text x="112" y="54" text-anchor="middle" fill="#14532d" font-size="7.4" font-weight="800">4 SEASONS WHEEL</text><rect x="76" y="66" width="72" height="28" rx="4" fill="#fff" stroke="#14532d" stroke-width="1.5"/><text x="112" y="79" text-anchor="middle" fill="#0f172a" font-size="8.2" font-weight="700">Cozy Critters</text><text x="112" y="90" text-anchor="middle" fill="#15803d" font-size="8.2" font-weight="700">3-Sheet PnP</text></svg>',
    cloudspire: '<svg viewBox="0 0 160 110" width="100%" height="100%"><rect x="2" y="2" width="156" height="106" rx="12" fill="#faf5ff" stroke="#4c1d95" stroke-width="3"/><rect x="10" y="10" width="140" height="22" rx="6" fill="#6d28d9"/><text x="80" y="25" text-anchor="middle" fill="#fff" font-size="10.2" font-weight="800">CLOUDSPIRE ALCHEMY</text><circle cx="44" cy="65" r="23" fill="#ede9fe" stroke="#4c1d95" stroke-width="2"/><path d="M38 47 L50 47 L48 57 L57 75 L31 75 L40 57 Z" fill="#8b5cf6" stroke="#4c1d95" stroke-width="1.8"/><rect x="76" y="42" width="72" height="18" rx="4" fill="#e0e7ff" stroke="#4c1d95" stroke-width="1.5"/><text x="112" y="54" text-anchor="middle" fill="#4c1d95" font-size="7.4" font-weight="800">MANA TRANSMUTE</text><rect x="76" y="66" width="72" height="28" rx="4" fill="#fff" stroke="#4c1d95" stroke-width="1.5"/><text x="112" y="79" text-anchor="middle" fill="#0f172a" font-size="8.2" font-weight="700">Sky-Tower Duel</text><text x="112" y="90" text-anchor="middle" fill="#6d28d9" font-size="8.2" font-weight="700">3-Sheet PnP</text></svg>'
  };

  /* ==========================================================================
   * 10. INTERACTIVE BROWSER UI CONTROLLER
   * ========================================================================== */
  function initBrowserUI() {
    if (typeof document === 'undefined') return;
    var appRoot = document.getElementById('starChefApp');
    if (!appRoot) return;

    var savedLang = safeStorageGet('starchef_lang', 'en');
    var preset = root.__STARCHEF_PRESET__ || null;
    var initialLang = (preset && preset.lang) ? preset.lang : savedLang;
    var initialMode = (preset && preset.mode) ? preset.mode : '1p';

    var state = createGame({
      seed: preset && preset.seed ? preset.seed : undefined,
      mode: initialMode,
      lang: initialLang === 'zh' ? 'zh' : 'en'
    });

    var ui = {
      showCoach: preset && preset.hideCoach ? false : (safeStorageGet('starchef_coach', '1') !== '0'),
      activeModal: (preset && preset.modal) ? preset.modal : null, // 'rules' | 'bundle' | 'victory' | 'card'
      inspectedCardId: null,
      passCurtainPlayer: null, // In 2p mode, hides hand briefly on handoff if openHands === false
      openHands2P: true,
      aiTimer: null
    };

    if (preset && typeof preset.setup === 'function') {
      preset.setup(state, ui, { applyAction: applyAction, chooseAIAction: chooseAIAction });
    }

    function t(en, zh) {
      return state.lang === 'zh' ? zh : en;
    }

    function isItchEmbed() {
      return Boolean(root.__ITCH_EMBED__);
    }

    function getSampleLinks() {
      var mon = getMonetization();
      var portal = (mon.brand && mon.brand.portalUrl) || 'https://963239327.github.io/craftleaf-studio/';
      if (isItchEmbed()) {
        return {
          starChef: portal + 'games/previews/star_chef_sample_preview.pdf',
          woodland: portal + 'games/previews/woodland_seasons_sample_preview.pdf',
          cloudspire: portal + 'games/previews/cloudspire_alchemy_sample_preview.pdf',
          catalog: portal + (state.lang === 'zh'
            ? 'cn-guides/2-page-poker-deck-2-player-print-and-play-board-games-zh.html'
            : 'seo/2-page-poker-deck-print-and-play-board-games-for-2-players.html')
        };
      }
      return {
        starChef: '../games/previews/star_chef_sample_preview.pdf',
        woodland: '../games/previews/woodland_seasons_sample_preview.pdf',
        cloudspire: '../games/previews/cloudspire_alchemy_sample_preview.pdf',
        catalog: state.lang === 'zh'
          ? '../cn-guides/2-page-poker-deck-2-player-print-and-play-board-games-zh.html'
          : '../seo/2-page-poker-deck-print-and-play-board-games-for-2-players.html'
      };
    }

    function getBundleCheckoutUrl() {
      var mon = getMonetization();
      var prod = (mon.products && mon.products.pnpTrilogyBundle) || DEFAULT_MONETIZATION.products.pnpTrilogyBundle;
      if (state.lang === 'zh') {
        var mbd = String(prod.mianbaoduoUrl || '').trim();
        return (mbd && mbd !== 'https://mbd.pub/') ? mbd : '';
      }
      if (isItchEmbed() && prod.itchUrl) return prod.itchUrl;
      return prod.gumroadUrl || prod.itchUrl || 'https://963239327.github.io/craftleaf-studio/#games';
    }

    function getTipUrl() {
      var mon = getMonetization();
      var tips = mon.tips || DEFAULT_MONETIZATION.tips;
      if (state.lang === 'zh' && tips.afdianUrl) return tips.afdianUrl;
      return tips.kofiUrl || tips.stripeTipUrl || 'https://ko-fi.com/';
    }

    function formatRecipeBadges(recipe) {
      var parts = [];
      if (recipe.meat > 0) parts.push('<span class="ing-pill meat">' + recipe.meat + '🥩</span>');
      if (recipe.shrimp > 0) parts.push('<span class="ing-pill shrimp">' + recipe.shrimp + '🦐</span>');
      if (recipe.mushroom > 0) parts.push('<span class="ing-pill mushroom">' + recipe.mushroom + '🍄</span>');
      if (recipe.spice > 0) parts.push('<span class="ing-pill spice">' + recipe.spice + '🧂</span>');
      return parts.join('');
    }

    function getCoachMessage() {
      var actor = getActingPlayer(state);
      if (state.phase === 'GAME_OVER') {
        return t(
          '🏆 Match finished! Play a fast rematch or grab the 3-Game Printable Tabletop Trilogy below!',
          '🏆 对局圆满结束！可立即再来一局，或下载全套 3 款可打印实体桌游合集包！'
        );
      }
      if (state.mode === '1p' && actor === 1) {
        return t(
          '🤖 Sous-Chef AI is evaluating rondel routes & wok heat odds...',
          '🤖 蓝带 AI 副厨正在计算吧台走位与灶台火候期望……'
        );
      }
      if (state.prompt) {
        if (state.prompt.type === 'DISCARD_FOR_DRAW') {
          return t(
            '🃏 Hand Limit is 2! Click 1 card in your hand to cycle out before drawing your new card.',
            '🃏 手牌上限 2 张！请点击手牌中要弃置的 1 张旧牌，再摸取新牌。'
          );
        }
        if (state.prompt.type === 'PICK_OPEN_MENU') {
          return t(
            '🦐 Seat ③ Lobster Tank: Click any 1 of the 3 face-up Open Menu cards to take into your hand!',
            '🦐 ③号深海龙虾池：点击中央【公开菜单池】任意 1 张名菜卡拿入手牌！'
          );
        }
        if (state.prompt.type === 'PICK_ANY_ING') {
          return t(
            '🥗 Wild Ingredient: Choose +1 🥩 Wagyu, 🦐 Lobster, or 🍄 Truffle for your tray!',
            '🥗 百搭食材：请任选拿取 1 份 🥩和牛、🦐龙虾 或 🍄松露 放入托盘！'
          );
        }
        if (state.prompt.type === 'PICK_KEPT_ING') {
          return t(
            '🔥 7° Master Chef Lock! Choose 1 spent ingredient to return right back to your tray!',
            '🔥 7°极品锁汁！请任选保留 1 份刚消耗的基础食材退回备菜托盘！'
          );
        }
      }
      if (state.phase === 'MOVE_RONDEL') {
        return t(
          '① Step 1/3 (Move): Click a glowing Bistro Counter seat! 1–2 steps clockwise are FREE (+1🧂 per extra step).',
          '① 第1步（吧台走位）：点击发光档口顺时针移动！走 1~2 步免费，每多走 1 步付 1🧂。'
        );
      }
      if (state.phase === 'PREP_OPTIONAL') {
        return t(
          '② Step 2/3 (Optional Prep): Click "① Prep" on 1 hand card to trade it for tokens, or click "Skip Prep →".',
          '② 第2步（可选弃牌备菜）：点手牌【①备菜】换取食材筹码，或点【跳过备菜 →】直接进主行动。'
        );
      }
      if (state.phase === 'MAIN_ACTION') {
        return t(
          '③ Step 3/3 (Main Action): Cook a ready dish (Hand or Open Menu!), Equip Gear (≤2), or Restock!',
          '③ 第3步（主行动三选一）：直接【🔥开火烹饪】手牌或中央公开菜单名菜、【⚙️装厨具】或【🧺补给】！'
        );
      }
      if (state.phase === 'WOK_COOKING') {
        var temp = state.wok ? state.wok.temp : 1;
        if (temp >= 8) {
          return t(
            '⚠️ WOK OVERHEATING (' + temp + '°)! Use 🧊 Rescue Ice / Cooling Gear now, or Accept Bust (+1★ +1🧂).',
            '⚠️ 灶台超温（' + temp + '°）！快用【🧊救锅冰】或降温厨具救回 ≤7°，否则爆锅领保底 1★+1🧂。'
          );
        }
        if (temp === 7) {
          return t(
            '🔥 JACKPOT 7° PERFECT SEAR! Click "🛎️ Plate & Serve!" for max ★ + keep 1 ingredient!',
            '🔥 命中 7° 厨神锁汁点！立即点击【🛎️停火出锅】拿满极品高星并保留 1 份食材！'
          );
        }
        if (temp === 5) {
          return t(
            '💡 Pro Tip at 5°: Paying 1🧂 for Simmer Die (+1°/+2°) has 0% bust — 6° returns +2🧂 (net +1🧂!) & 7° hits Perfect!',
            '💡 5°黄金锦囊：付 1🧂 投小火骰（+1/+2°）爆锅率 0%——落 6° 领 2🧂（净赚 1🧂），落 7° 直拿极品！'
          );
        }
        if (temp === 4) {
          return t(
            '🎯 At 4°: Simmer Die (1🧂) guarantees 5°–6° Golden Zone (100% safe)! Blazing Die has 50% bust risk.',
            '🎯 4°控温提示：付 1🧂 投小火骰可 100% 稳进 5°~6° 黄金锅气区！免费猛火骰有 50% 爆锅风险。'
          );
        }
        return t(
          '🔥 Wok at ' + temp + '°: Push toward 5°–6° Golden or 7° Perfect without hitting 8°+, or Plate anytime!',
          '🔥 当前灶温 ' + temp + '°：继续追投冲击 5°~6° 黄金区与 7° 极品点，或随时【🛎️停火出锅】！'
        );
      }
      if (state.phase === 'FOLLOW_REACTION') {
        return t(
          '🤝 Out-of-Turn Follow: Active chef didn’t cook! Pay 1🧂 to grab +1 Ingredient or Draw 1 Card, or Pass.',
          '🤝 回合外跟随：主动方本回合未开火！你可付 1🧂 拿 1 份基础食材或摸 1 张牌，也可跳过。'
        );
      }
      return '';
    }

    function scheduleAIIfNeeded() {
      if (ui.aiTimer) {
        clearTimeout(ui.aiTimer);
        ui.aiTimer = null;
      }
      if (preset && preset.freezeAI) return;
      if (state.phase === 'GAME_OVER') return;
      var actor = getActingPlayer(state);
      if (state.mode === '1p' && actor === 1) {
        var delay = state.phase === 'WOK_COOKING' ? 620 : 520;
        ui.aiTimer = setTimeout(function () {
          ui.aiTimer = null;
          if (state.mode !== '1p' || getActingPlayer(state) !== 1 || state.phase === 'GAME_OVER') return;
          var act = chooseAIAction(state);
          if (act) {
            dispatchWithSound(act);
          }
        }, delay);
      }
    }

    function dispatchWithSound(action) {
      var prevPhase = state.phase;
      var prevWinner = state.winner;

      applyAction(state, action);

      // Trigger cozy procedural audio
      if (action.type === 'MOVE_RONDEL') BistroAudio.step();
      else if (action.type === 'PREP_CARD' || action.type === 'RESTOCK' || action.type === 'DO_FOLLOW') BistroAudio.prep();
      else if (action.type === 'EQUIP_GEAR' || action.type === 'WOK_USE_GEAR' || action.type === 'WOK_USE_ICE') BistroAudio.gear();
      else if (action.type === 'START_COOK' || action.type === 'WOK_ROLL_BLAZING' || action.type === 'WOK_ROLL_SIMMER') {
        BistroAudio.sizzleRoll(state.wok ? state.wok.temp : 4);
      } else if (action.type === 'WOK_PLATE') {
        var lastLog = state.logs[state.logs.length - 1];
        BistroAudio.bellGold(lastLog && lastLog.tone === 'perfect');
      } else if (action.type === 'WOK_ACCEPT_BUST') {
        BistroAudio.bust();
      }

      if (prevWinner === null && state.phase === 'GAME_OVER') {
        BistroAudio.victory();
        ui.activeModal = 'victory';
        if (typeof window !== 'undefined' && window.CraftLeafSDK && window.CraftLeafSDK.showValueMomentPrompt) {
          window.CraftLeafSDK.showValueMomentPrompt({
            lang: ui.lang,
            titleZh: '👨‍🍳 精彩对局！喜欢实体卡牌面对面博弈吗？',
            titleEn: '👨‍🍳 Great Match! Want the Physical Tabletop Trilogy?',
            bodyZh: '《口袋双人打印桌游三部曲》仅需单面打印 3–4 张纸，周末和伴侣/朋友 8 分钟开局！',
            bodyEn: 'Get all 3 single-sided 2-player strategy PnP games (US Letter + A4 + Low-Ink) for $7.99!',
            proUrl: 'https://stardustdemo.gumroad.com/l/pocket-tabletop-trilogy?wanted=true',
            proLabelZh: '🎲 获取三部曲 PDF ($7.99)',
            proLabelEn: '🎲 Get 3-Game Pack ($7.99)'
          });
        }
      } else if (prevPhase !== state.phase && state.mode === '2p' && !ui.openHands2P) {
        var nextActor = getActingPlayer(state);
        if (nextActor !== null && action.type !== 'MOVE_RONDEL') {
          // Keep smooth flow
        }
      }

      render();
      scheduleAIIfNeeded();
    }

    function renderDishCard(cardId, context) {
      // context: 'menu' | 'hand' | 'inspect'
      var c = CARD_BY_ID[cardId];
      var cuisine = CUISINES[c.cuisine];
      var actor = getActingPlayer(state);
      var humanIdx = state.mode === '1p' ? 0 : (actor !== null ? actor : state.activePlayer);
      var isActorTurn = (state.mode === '2p' || actor === 0) && actor === state.activePlayer && !state.prompt;
      var cookInfo = getCookOptionsForCard(state, humanIdx, cardId);

      var pickMenuMode = state.prompt && state.prompt.type === 'PICK_OPEN_MENU' && context === 'menu' &&
        (state.mode === '2p' || state.prompt.player === 0);
      var discardDrawMode = state.prompt && state.prompt.type === 'DISCARD_FOR_DRAW' && context === 'hand' &&
        (state.mode === '2p' || state.prompt.player === 0);

      var actionBtns = '';
      if (pickMenuMode) {
        actionBtns = '<button class="card-act-btn primary full" data-act="pick-menu" data-cid="' + c.id + '">' +
          t('🦐 Take into Hand', '🦐 拿入手牌') + '</button>';
      } else if (discardDrawMode) {
        actionBtns = '<button class="card-act-btn warn full" data-act="discard-draw" data-cid="' + c.id + '">' +
          t('♻️ Cycle Out to Draw', '♻️ 弃此旧牌并摸新牌') + '</button>';
      } else if (context === 'menu' && isActorTurn && state.phase === 'MAIN_ACTION') {
        if (cookInfo.canCook) {
          actionBtns = '<button class="card-act-btn cook full" data-act="cook-menu" data-cid="' + c.id + '">' +
            t('🔥 Cook Now!', '🔥 直接开火烹饪！') + '</button>';
        } else {
          actionBtns = '<span class="card-need-hint">' + t('Need Recipe Tokens', '凑齐托盘食材可直烹') + '</span>';
        }
      } else if (context === 'hand' && isActorTurn) {
        var actChef = state.players[actor];
        if (state.phase === 'PREP_OPTIONAL') {
          var prepBtn = '<button class="card-act-btn prep" data-act="prep-card" data-cid="' + c.id + '">' +
            t('① Prep', '① 备菜') + '</button>';
          var canEq = actChef.gears.length < 2 || actChef.spice >= 1;
          var eqLbl = actChef.gears.length < 2 ? t('② Gear (Free)', '② 厨具(免)') : t('② Swap (1🧂)', '② 替旧(1🧂)');
          var gearStep2Btn = canEq
            ? '<button class="card-act-btn gear" data-act="equip-card" data-cid="' + c.id + '">' + eqLbl + '</button>'
            : '<button class="card-act-btn disabled" disabled>' + eqLbl + '</button>';
          actionBtns = prepBtn + gearStep2Btn;
        } else if (state.phase === 'MAIN_ACTION') {
          actionBtns = cookInfo.canCook
            ? '<button class="card-act-btn cook full" data-act="cook-hand" data-cid="' + c.id + '">' + t('③ Cook Dish!', '③ 开火掌勺！') + '</button>'
            : '<button class="card-act-btn disabled full" disabled>' + t('③ Need Ingredients', '③ 食材不足') + '</button>';
        }
      }

      return (
        '<div class="dish-card ' + cuisine.cls + (c.isBoss ? ' boss-card' : '') + (cookInfo.canCook ? ' can-cook' : '') + '" data-inspect="' + c.id + '">' +
          '<div class="dish-card-head">' +
            '<span class="dish-code">' + c.code + '</span>' +
            '<span class="dish-title">' + t(c.nameEn, c.nameZh) + '</span>' +
            '<span class="dish-cuisine-tag">' + cuisine.icon + '</span>' +
          '</div>' +
          '<div class="dish-card-mid">' +
            '<div class="dish-art" data-inspect-btn="' + c.id + '" title="' + t('Click to zoom card details', '点击放大查看卡牌详情') + '">' + SVG_ICONS[c.art] + '</div>' +
            '<div class="dish-meta">' +
              '<div class="dish-recipe-row">' + formatRecipeBadges(c.recipe) +
                (cookInfo.canCook ? '<span class="ready-dot" title="Ready">✓</span>' : '') +
              '</div>' +
              '<div class="dish-prep-line"><b>' + t('Prep:', '备菜:') + '</b> ' + t(c.prepTextEn, c.prepTextZh) + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="dish-uses">' +
            '<div class="dish-use-line gear-line"><span>⚙️ ' + t(c.gearNameEn, c.gearNameZh) + '</span><em>' + t(c.gearTagEn, c.gearTagZh) + '</em></div>' +
            '<div class="dish-use-line star-line"><span>🍽️ ' + t('5–6°:' + c.starsGold + '★ · 7°:' + c.starsPerf + '★', '黄金' + c.starsGold + '★ · 7°极品' + c.starsPerf + '★') + '</span></div>' +
            '<div class="dish-bonus-sub">' + t(c.dishBonusEn, c.dishBonusZh) + '</div>' +
          '</div>' +
          (actionBtns ? '<div class="dish-card-actions">' + actionBtns + '</div>' : '') +
        '</div>'
      );
    }

    function renderChefSummaryPanel(pIdx, isTopRival) {
      var p = state.players[pIdx];
      var isTurn = getActingPlayer(state) === pIdx && state.phase !== 'GAME_OVER';
      var pct = Math.min(100, Math.round((p.stars / 18) * 100));
      var cuisinesList = ['fire', 'water', 'grass', 'elec'];
      var stampsHtml = cuisinesList.map(function (ck) {
        var owned = p.stamps[ck];
        return '<span class="stamp-chip ' + (owned ? 'owned ' + CUISINES[ck].cls : 'empty') + '" title="' +
          t(CUISINES[ck].en, CUISINES[ck].zh) + '">' + CUISINES[ck].icon + (owned ? '✓' : '') + '</span>';
      }).join('');

      var gearsHtml = '';
      if (p.gears.length === 0) {
        gearsHtml = '<div class="gear-empty">' + t('No Kitchen Gear yet (Max 2)', '暂未装设横置厨具（上限2件）') + '</div>';
      } else {
        gearsHtml = p.gears.map(function (gid) {
          var gc = CARD_BY_ID[gid];
          return '<div class="gear-mini-pill" data-inspect-btn="' + gid + '">' +
            '<span>⚙️ ' + t(gc.gearNameEn, gc.gearNameZh) + '</span>' +
            '<b>' + t(gc.gearTagEn, gc.gearTagZh) + '</b>' +
          '</div>';
        }).join('');
      }

      return (
        '<section class="chef-panel ' + (pIdx === 0 ? 'p1-theme' : 'p2-theme') + (isTurn ? ' active-turn' : '') + '">' +
          '<div class="chef-panel-top">' +
            '<div class="chef-ident">' +
              '<span class="chef-name">' + (state.lang === 'zh' ? chefLabelZh(state, pIdx) : chefLabelEn(state, pIdx)) + '</span>' +
              '<span class="seat-loc-pill">' + RONDEL_SEATS[p.seat].num + ' ' + RONDEL_SEATS[p.seat].icon + '</span>' +
            '</div>' +
            '<div class="star-badge-big">' +
              '<span class="star-num">' + p.stars + '★</span>' +
              '<span class="star-goal">/ 18★' + (p.stars >= 18 ? ' (+18!)' : '') + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="star-progress-track"><div class="star-progress-fill" style="width:' + pct + '%"></div></div>' +
          '<div class="pantry-strip">' +
            '<span class="token-counter meat" title="Wagyu">🥩<b>' + p.ing.meat + '</b></span>' +
            '<span class="token-counter shrimp" title="Lobster">🦐<b>' + p.ing.shrimp + '</b></span>' +
            '<span class="token-counter mushroom" title="Truffle">🍄<b>' + p.ing.mushroom + '</b></span>' +
            '<span class="token-counter spice" title="Spice">🧂<b>' + p.spice + '</b></span>' +
            '<span class="token-counter ice ' + (p.ice > 0 ? 'has-ice' : '') + '" title="Rescue Ice (-2°)">🧊<b>' + p.ice + '/1</b></span>' +
            (isTopRival ? '<span class="token-counter hand-cnt" title="Hand Cards">🂠<b>' + p.hand.length + '/2</b></span>' : '') +
          '</div>' +
          '<div class="stamps-and-milestone-row">' +
            '<div class="stamps-bar">' + stampsHtml + '</div>' +
            '<span class="stamp-bonus-hint">' + countStamps(p) + '/3 ' + t('(+3★)', '(满3系+3★)') + '</span>' +
          '</div>' +
          '<div class="gears-list">' + gearsHtml + '</div>' +
        '</section>'
      );
    }

    function renderRondelSeat(seatIdx) {
      var s = RONDEL_SEATS[seatIdx];
      var p0Here = state.players[0].seat === seatIdx;
      var p1Here = state.players[1].seat === seatIdx;
      var actor = getActingPlayer(state);
      var humanCanMove = state.phase === 'MOVE_RONDEL' && !state.prompt &&
        (state.mode === '2p' || actor === 0);

      var activeP = state.players[state.activePlayer];
      var stepsDist = ((seatIdx - activeP.seat + 8) % 8) || 8;
      var spiceCost = stepsDist > 2 ? (stepsDist - 2) : 0;
      var affordable = humanCanMove && activeP.spice >= spiceCost;

      var costBadge = '';
      if (humanCanMove) {
        if (affordable) {
          costBadge = '<span class="step-cost-pill ' + (spiceCost === 0 ? 'free' : 'paid') + '">' +
            (spiceCost === 0 ? t(stepsDist + ' st · FREE', stepsDist + '步·免费') : (stepsDist + t(' st · ', '步·') + spiceCost + '🧂')) +
          '</span>';
        } else {
          costBadge = '<span class="step-cost-pill locked">' + spiceCost + '🧂</span>';
        }
      }

      return (
        '<button type="button" class="rondel-seat ' + s.cls + (affordable ? ' clickable' : '') + '" ' +
          (affordable ? ('data-act="move-seat" data-steps="' + stepsDist + '"') : 'disabled') + '>' +
          '<div class="rondel-seat-top">' +
            '<span class="seat-num">' + s.num + (s.startTag ? '<small>' + s.startTag + '</small>' : '') + '</span>' +
            '<span class="seat-icon">' + s.icon + '</span>' +
          '</div>' +
          '<div class="seat-name">' + t(s.nameEn, s.nameZh) + '</div>' +
          '<div class="seat-desc">' + t(s.descEn, s.descZh) + '</div>' +
          '<div class="seat-footer">' +
            '<div class="seat-pawns">' +
              (p0Here ? '<span class="chef-pawn p1" title="P1">🔴</span>' : '') +
              (p1Here ? '<span class="chef-pawn p2" title="P2">🔵</span>' : '') +
            '</div>' +
            costBadge +
          '</div>' +
        '</button>'
      );
    }

    function renderWokArena() {
      var w = state.wok;
      var c = CARD_BY_ID[w.cardId];
      var actor = getActingPlayer(state);
      var canControl = (state.mode === '2p' || actor === 0) && !state.prompt;
      var avail = getAvailableWokActions(state);

      var cells = [
        { t: 1, lbl: '1°', sub: t('Start', '起锅'), cls: 'z-start' },
        { t: 2, lbl: '2°', sub: c.starsHalf + '★', cls: 'z-low' },
        { t: 3, lbl: '3°', sub: c.starsHalf + '★', cls: 'z-low' },
        { t: 4, lbl: '4°', sub: c.starsHalf + '★', cls: 'z-low' },
        { t: 5, lbl: '5°⭐', sub: c.starsGold + '★+1🧂', cls: 'z-gold' },
        { t: 6, lbl: '6°⭐⭐', sub: c.starsGold + '★+2🧂', cls: 'z-gold' },
        { t: 7, lbl: '7°🔥', sub: c.starsPerf + '★+1材', cls: 'z-perf' },
        { t: 8, lbl: '💥8°+', sub: t('1★+1🧂', '爆1★+1🧂'), cls: 'z-bust' }
      ];

      var gaugeHtml = cells.map(function (cell) {
        var isCur = (cell.t < 8 && w.temp === cell.t) || (cell.t === 8 && w.temp >= 8);
        return '<div class="wok-cell ' + cell.cls + (isCur ? ' current' : '') + '">' +
          '<b>' + cell.lbl + '</b><span>' + cell.sub + '</span>' +
          (isCur ? '<div class="wok-pointer">🔥' + w.temp + '°</div>' : '') +
        '</div>';
      }).join('');

      var lastRollBadge = '';
      if (w.rolls.length > 0) {
        var lr = w.rolls[w.rolls.length - 1];
        lastRollBadge = '<span class="last-roll-pill">' +
          t(lr.labelEn, lr.labelZh) + (lr.face ? (' [🎲' + lr.face + ']') : '') +
          ' ➔ <b>' + lr.tempAfter + '°</b></span>';
      }

      var ctrlBtns = '';
      if (canControl) {
        var primaryBtns = [];
        var gearBtns = [];

        for (var i = 0; i < avail.length; i++) {
          var a = avail[i];
          if (a.type === 'WOK_ROLL_BLAZING') {
            primaryBtns.push('<button class="wok-btn blazing" data-act="wok-blazing">' +
              '🔥 ' + t('Roll Blazing (+1~6° · Free)', '投猛火骰 (+1~6° · 免费)') + '</button>');
          } else if (a.type === 'WOK_ROLL_SIMMER') {
            primaryBtns.push('<button class="wok-btn simmer" data-act="wok-simmer">' +
              '🧂 ' + t('Roll Simmer (+1~2° · 1🧂)', '投小火骰 (+1~2° · 付1🧂)') + '</button>');
          } else if (a.type === 'WOK_PLATE') {
            var plateCls = w.temp === 7 ? 'perfect' : (w.temp >= 5 ? 'gold' : 'low');
            var starPreview = w.temp === 7 ? c.starsPerf : (w.temp >= 5 ? c.starsGold : c.starsHalf);
            var searSpiceNote = w.temp === 5 ? '+1🧂' : (w.temp === 6 ? '+2🧂' : '');
            primaryBtns.push('<button class="wok-btn plate ' + plateCls + '" data-act="wok-plate">' +
              '🛎️ ' + t('Plate at ' + w.temp + '° (' + starPreview + '★' + searSpiceNote + (w.startedAtBell && w.temp >= 5 ? '+2★Bell' : '') + ')',
                        w.temp + '° 停火出锅（' + starPreview + '★' + searSpiceNote + (w.startedAtBell && w.temp >= 5 ? '+品鉴铃2★' : '') + '）') +
            '</button>');
          } else if (a.type === 'WOK_ACCEPT_BUST') {
            primaryBtns.push('<button class="wok-btn bust" data-act="wok-bust">' +
              '💥 ' + t('Accept Bust (+1★ & +1🧂)', '接受爆锅安慰奖 (+1★ +1🧂)') + '</button>');
          } else if (a.type === 'WOK_USE_ICE') {
            gearBtns.push('<button class="wok-gear-btn ice" data-act="wok-ice">' +
              '🧊 ' + t('Use Rescue Ice (-2°)', '使用救锅冰 (-2°)') + '</button>');
          } else if (a.type === 'WOK_USE_GEAR') {
            var gc = CARD_BY_ID[a.gearId];
            var suffix = '';
            if (a.gearId === 8) suffix = ' (-' + a.amount + '°)';
            if (a.gearId === 12) suffix = ' (' + (a.adj > 0 ? '+1°' : '-1°') + ')';
            gearBtns.push('<button class="wok-gear-btn" data-act="wok-gear" data-gid="' + a.gearId + '" ' +
              (a.amount ? ('data-amt="' + a.amount + '" ') : '') +
              (a.adj ? ('data-adj="' + a.adj + '" ') : '') + '>' +
              '⚙️ ' + (a.owner === 'opp' ? t('Borrow ', '借 ') : '') +
              t(gc.gearNameEn, gc.gearNameZh) + suffix + ' · ' + t(gc.gearTagEn, gc.gearTagZh) +
            '</button>');
          }
        }

        ctrlBtns = '<div class="wok-primary-row">' + primaryBtns.join('') + '</div>' +
          (gearBtns.length ? '<div class="wok-gears-row">' + gearBtns.join('') + '</div>' : '');
      } else {
        ctrlBtns = '<div class="wok-ai-watch">' + t('👀 Sous-Chef AI is working the wok...', '👀 蓝带 AI 副厨正在控温颠勺……') + '</div>';
      }

      return (
        '<div class="wok-arena-box ' + (w.temp >= 8 ? 'overheat' : (w.temp === 7 ? 'perfect-glow' : '')) + '">' +
          '<div class="wok-head-row">' +
            '<div class="wok-dish-badge">' +
              '<span class="wok-svg-mini">' + SVG_ICONS[c.art] + '</span>' +
              '<div>' +
                '<strong>🔥 ' + t('Cooking: ' + c.nameEn, '正在掌勺：《' + c.nameZh + '》') + '</strong>' +
                '<div class="wok-dish-sub">' + t(c.dishBonusEn, c.dishBonusZh) +
                  (w.startedAtBell ? ' · <b>🛎️ +1★</b>' : '') + '</div>' +
              '</div>' +
            '</div>' +
            lastRollBadge +
          '</div>' +
          '<div class="wok-gauge-grid">' + gaugeHtml + '</div>' +
          ctrlBtns +
        '</div>'
      );
    }

    function renderCenterStage() {
      var topRow = [0, 1, 2, 3].map(renderRondelSeat).join('');
      // Clockwise bottom row: ⑧ ← ⑦ ← ⑥ ← ⑤ (matching Page 2 board!)
      var botRow = [7, 6, 5, 4].map(renderRondelSeat).join('');

      var centerInner = '';
      if (state.phase === 'WOK_COOKING' && state.wok) {
        centerInner = renderWokArena();
      } else {
        var menuHtml = state.openMenu.map(function (cid) {
          return renderDishCard(cid, 'menu');
        }).join('');
        centerInner =
          '<div class="open-menu-box">' +
            '<div class="open-menu-head">' +
              '<span>📋 ' + t('Open Menu Pool (Cook Directly or Claim at Seat ③!)', '中央公开菜单池（凑齐食材可直接开火烹饪！）') + '</span>' +
              '<span class="deck-pill">🂠 ' + t('Deck ', '牌库 ') + state.deck.length + ' · ' + t('Discard ', '弃牌 ') + state.discard.length + '</span>' +
            '</div>' +
            '<div class="open-menu-grid">' + menuHtml + '</div>' +
          '</div>';
      }

      return (
        '<div class="rondel-board">' +
          '<div class="rondel-row">' + topRow + '</div>' +
          centerInner +
          '<div class="rondel-row">' + botRow + '</div>' +
        '</div>'
      );
    }

    function renderRightControlDock() {
      var actor = getActingPlayer(state);
      var viewIdx = state.mode === '1p' ? 0 : (actor !== null ? actor : 0);
      var p = state.players[viewIdx];

      var handCardsHtml = p.hand.length === 0
        ? '<div class="empty-hand-card">' + t('Hand Empty (0/2) — Move to ①②③⑤⑧ or Restock to draw!', '手牌为空（0/2）—— 停在摸牌档口或选休整补给摸牌！') + '</div>'
        : p.hand.map(function (cid) { return renderDishCard(cid, 'hand'); }).join('');

      // Contextual phase action dock
      var dockHtml = '';
      var isHumanActing = (state.mode === '2p' || actor === 0) && state.phase !== 'GAME_OVER';

      if (isHumanActing && state.prompt) {
        var pr = state.prompt;
        if (pr.type === 'PICK_ANY_ING') {
          dockHtml = '<div class="action-dock highlight">' +
            '<div class="dock-label">' + t('Pick +1 Ingredient:', '任选 1 份食材入盘：') + '</div>' +
            '<div class="dock-btn-row">' +
              '<button class="dock-btn meat" data-act="pick-any" data-ing="meat">+1 🥩 ' + t('Wagyu', '和牛') + '</button>' +
              '<button class="dock-btn shrimp" data-act="pick-any" data-ing="shrimp">+1 🦐 ' + t('Lobster', '龙虾') + '</button>' +
              '<button class="dock-btn mushroom" data-act="pick-any" data-ing="mushroom">+1 🍄 ' + t('Truffle', '松露') + '</button>' +
            '</div></div>';
        } else if (pr.type === 'PICK_KEPT_ING') {
          var kBtns = pr.options.map(function (k) {
            return '<button class="dock-btn accent" data-act="pick-kept" data-ing="' + k + '">' +
              t('Keep 1 ', '保留 1') + ING_META[k].icon + ' ' + t(ING_META[k].en, ING_META[k].zh) + '</button>';
          }).join('');
          dockHtml = '<div class="action-dock highlight">' +
            '<div class="dock-label">🔥 ' + t('7° Perfect Sear — Keep 1 Spent Ingredient:', '7°锁汁 —— 选择保留 1 份食材退回托盘：') + '</div>' +
            '<div class="dock-btn-row">' + kBtns + '</div></div>';
        } else if (pr.type === 'DISCARD_FOR_DRAW' && pr.reason === 'bump') {
          dockHtml = '<div class="action-dock highlight">' +
            '<div class="dock-label">💥 ' + t('Bumped! Click 1 hand card above to cycle, or:', '被挤位免费摸牌！点上方1张旧手牌置换，或：') + '</div>' +
            '<div class="dock-btn-row">' +
              '<button class="dock-btn subtle" data-act="skip-bump-draw">' + t('Keep Current 2 Cards', '保留当前手牌（跳过摸牌）') + '</button>' +
            '</div></div>';
        }
      } else if (isHumanActing && state.phase === 'PREP_OPTIONAL') {
        dockHtml = '<div class="action-dock">' +
          '<button class="dock-btn primary full" data-act="skip-prep">' +
            t('Skip Step 2 (Prep / Gear) → Go to Step 3', '跳过第 2 步（备菜/装厨具）→ 进入第 3 步') +
          '</button></div>';
      } else if (isHumanActing && state.phase === 'MAIN_ACTION') {
        dockHtml = '<div class="action-dock">' +
          '<div class="dock-label">🧺 ' + t('Or Restock (Option B):', '或选 B. 休整补给：') + '</div>' +
          '<div class="dock-btn-row">' +
            '<button class="dock-btn" data-act="restock-draw">🂠 ' + t('Draw 1', '摸1牌') + '</button>' +
            '<button class="dock-btn meat" data-act="restock-ing" data-ing="meat">+1🥩</button>' +
            '<button class="dock-btn shrimp" data-act="restock-ing" data-ing="shrimp">+1🦐</button>' +
            '<button class="dock-btn mushroom" data-act="restock-ing" data-ing="mushroom">+1🍄</button>' +
          '</div></div>';
      } else if (isHumanActing && state.phase === 'FOLLOW_REACTION') {
        dockHtml = '<div class="action-dock highlight">' +
          '<div class="dock-label">🤝 ' + t('Out-of-Turn Follow (Pay 1🧂 or Pass):', '回合外跟随（付 1🧂 同步补给或跳过）：') + '</div>' +
          '<div class="dock-btn-row">' +
            '<button class="dock-btn" data-act="follow-draw">🂠 ' + t('Draw (1🧂)', '摸牌(1🧂)') + '</button>' +
            '<button class="dock-btn meat" data-act="follow-ing" data-ing="meat">+1🥩(1🧂)</button>' +
            '<button class="dock-btn shrimp" data-act="follow-ing" data-ing="shrimp">+1🦐(1🧂)</button>' +
            '<button class="dock-btn mushroom" data-act="follow-ing" data-ing="mushroom">+1🍄(1🧂)</button>' +
            '<button class="dock-btn subtle" data-act="follow-pass">' + t('Pass', '跳过') + '</button>' +
          '</div></div>';
      }

      return (
        '<div class="right-column">' +
          renderChefSummaryPanel(viewIdx, false) +
          '<div class="hand-box">' +
            '<div class="hand-head">' +
              '<span>🃏 ' + (state.mode === '1p'
                ? t('Your Multi-Use Hand (' + p.hand.length + '/2)', '你的手牌 · 一卡三用（' + p.hand.length + '/2）')
                : (state.lang === 'zh' ? chefLabelZh(state, viewIdx) + ' 手牌' : chefLabelEn(state, viewIdx) + ' Hand')) +
              '</span>' +
              '<small>' + t('①Prep · ②Gear · ③Dish', '①备菜·②厨具·③名菜') + '</small>' +
            '</div>' +
            '<div class="hand-cards-stack">' + handCardsHtml + '</div>' +
          '</div>' +
          dockHtml +
        '</div>'
      );
    }

    function renderLeftSidebar() {
      var rivalIdx = state.mode === '1p' ? 1 : (1 - (getActingPlayer(state) || 0));
      var p0 = state.players[0];
      var p1 = state.players[1];

      var recentLogs = state.logs.slice(-8).reverse().map(function (item) {
        return '<div class="log-entry tone-' + item.tone + '"><span class="log-r">R' + item.round + '</span> ' +
          t(item.en, item.zh) + '</div>';
      }).join('');

      return (
        '<div class="left-column">' +
          renderChefSummaryPanel(rivalIdx, true) +
          '<div class="milestones-card">' +
            '<div class="milestones-title">🏆 ' + t('Star Milestones (Race to 18★)', '三大冲星里程碑（满18★平权终局）') + '</div>' +
            '<div class="ms-row">' +
              '<span>🥇 ' + t('1st 5°–7° Dish (+1★ ea)', '首道黄金菜 (+1★/人)') + '</span>' +
              '<b>' + (p0.firstDishDone ? '🔴✓ ' : '🔴○ ') + (p1.firstDishDone ? '🔵✓' : '🔵○') + '</b>' +
            '</div>' +
            '<div class="ms-row">' +
              '<span>🥈 ' + t('Dual Gear w/ ≥1 Stamp (+2★+1🃏)', '有章首达双厨具 (+2★摸1牌)') + '</span>' +
              '<b>' + (state.dualGearClaimedBy === 0 ? '🔴+2★' : (state.dualGearClaimedBy === 1 ? '🔵+2★' : t('Open!', '待争夺'))) + '</b>' +
            '</div>' +
            '<div class="ms-row">' +
              '<span>👑 ' + t('3 Cuisine Stamps (+3★)', '集满三系章 (+3★)') + '</span>' +
              '<b>' + (p0.threeStampsDone ? '🔴✓ ' : '') + (p1.threeStampsDone ? '🔵✓' : (!p0.threeStampsDone ? t('3/4 Types', '集3种即得') : '')) + '</b>' +
            '</div>' +
          '</div>' +
          '<div class="bistro-log-box">' +
            '<div class="log-head">' +
              '<span>📜 ' + t('Live Bistro Kitchen Log', '后厨实时战报') + '</span>' +
              '<button class="link-mini-btn" data-act="new-game">↻ ' + t('Restart', '重开一局') + '</button>' +
            '</div>' +
            '<div class="log-list">' + recentLogs + '</div>' +
          '</div>' +
        '</div>'
      );
    }

    function renderUpsellTrilogyBlock(compact) {
      var mon = getMonetization();
      var prod = (mon.products && mon.products.pnpTrilogyBundle) || DEFAULT_MONETIZATION.products.pnpTrilogyBundle;
      var priceStr = state.lang === 'zh' ? (prod.priceCny + ' / ' + prod.priceUsd) : (prod.priceUsd || '$7.99');
      var samples = getSampleLinks();
      var checkoutUrl = getBundleCheckoutUrl();
      var tipUrl = getTipUrl();

      var affItems = ((mon.affiliates && mon.affiliates.items) || []).filter(function (it) {
        return it.category === 'print-craft';
      }).slice(0, 2);

      var affHtml = '';
      if (!compact && affItems.length) {
        affHtml = '<div class="funnel-supplies">' +
          '<span>✂️ ' + t('Recommended DIY Print Gear:', '实测省钱打印耗材推荐：') + '</span> ' +
          affItems.map(function (it) {
            return '<a href="' + it.url + '" target="_blank" rel="noopener sponsored">' + t(it.titleEn, it.titleZh) + ' ↗</a>';
          }).join(' · ') +
        '</div>';
      }

      return (
        '<div class="trilogy-upsell-card">' +
          '<div class="trilogy-headline">' +
            t(
              'Loved the duel? Print all 3 Tactile 2-Player Tabletop Games at Home (A4 + US Letter + Low-Ink Trilogy Bundle — ' + (prod.priceUsd || '$7.99') + ')',
              '喜欢这场料理对决？把全套 3 款双人桌面策略桌游打印回家对战！（A4 + 美信双尺寸 + 省墨版三部曲合集包 — ' + priceStr + '）'
            ) +
          '</div>' +
          '<p class="trilogy-sub">' +
            t(
              'Cut straight along wide 1.8mm white gutters in 5 minutes — play screen-free at cafés, date nights, or family game nights!',
              '仅需 3 页纸 + 1 颗六面骰，1.8mm 纯白宽刀道一刀直裁，周末情侣聚会、亲子桌游与咖啡馆双人对弈神器！'
            ) +
          '</p>' +
          '<div class="trilogy-grid-3">' +
            '<div class="trilogy-item">' +
              '<div class="trilogy-thumb">' + TRILOGY_SVGS.starChef + '</div>' +
              '<strong>' + t('Star Chef Showdown', '《星厨对决》') + '</strong>' +
              '<span>' + t('8-Seat Rondel × 21° Wok Push-Luck', '八方回转吧台 × 21点控温博弈') + '</span>' +
              '<a class="sample-link" href="' + samples.starChef + '" target="_blank" rel="noopener">📄 ' + t('Free Sample PDF', '免费水印试阅 PDF') + '</a>' +
            '</div>' +
            '<div class="trilogy-item">' +
              '<div class="trilogy-thumb">' + TRILOGY_SVGS.woodland + '</div>' +
              '<strong>' + t('Woodland Seasons', '《四季森友》') + '</strong>' +
              '<span>' + t('Seasonal Forest Wheel × Cozy Engine', '四季森林转盘 × 松果提灯构筑') + '</span>' +
              '<a class="sample-link" href="' + samples.woodland + '" target="_blank" rel="noopener">📄 ' + t('Free Sample PDF', '免费水印试阅 PDF') + '</a>' +
            '</div>' +
            '<div class="trilogy-item">' +
              '<div class="trilogy-thumb">' + TRILOGY_SVGS.cloudspire + '</div>' +
              '<strong>' + t('Cloudspire Alchemy', '《云塔炼金》') + '</strong>' +
              '<span>' + t('Elemental Transmutation × Sky Duel', '元素魔药炼成 × 云端秘塔对决') + '</span>' +
              '<a class="sample-link" href="' + samples.cloudspire + '" target="_blank" rel="noopener">📄 ' + t('Free Sample PDF', '免费水印试阅 PDF') + '</a>' +
            '</div>' +
          '</div>' +
          '<div class="trilogy-cta-row">' +
            (checkoutUrl
              ? ('<a class="cta-bundle-btn" href="' + checkoutUrl + '" target="_blank" rel="noopener">' +
                  '🖨️ ' + t('Get Complete 3-Game Print & Play Bundle (' + (prod.priceUsd || '$7.99') + ')', '立即解锁 3 款桌游完整高清打印合集包（' + priceStr + '）') +
                '</a>')
              : '') +
            '<a class="cta-secondary-btn" href="' + samples.catalog + '" target="_blank" rel="noopener">' +
              '📚 ' + t('All 7 Free Previews', '查看全7作免费试阅页') +
            '</a>' +
            '<a class="cta-tip-btn" href="' + tipUrl + '" data-craftleaf-tip="1" target="_blank" rel="noopener">' +
              '☕ ' + t('Tip Jar', '微信赞赏作者') +
            '</a>' +
          '</div>' +
          affHtml +
        '</div>'
      );
    }

    function renderModal() {
      if (!ui.activeModal) return '';

      if (ui.activeModal === 'card' && ui.inspectedCardId) {
        var c = CARD_BY_ID[ui.inspectedCardId];
        return (
          '<div class="modal-backdrop" data-act="close-modal">' +
            '<div class="modal-sheet card-zoom-sheet" onclick="event.stopPropagation()">' +
              '<div class="modal-head">' +
                '<h3>🔎 ' + c.code + ' · ' + t(c.nameEn, c.nameZh) + '</h3>' +
                '<button class="icon-close" data-act="close-modal">✕</button>' +
              '</div>' +
              '<div class="zoom-card-body">' +
                renderDishCard(c.id, 'inspect') +
                '<div class="zoom-card-notes">' +
                  '<p><b>① ' + t('Discard to Prep (Step 2):', '弃牌备菜（第2步）：') + '</b> ' + t(c.prepTextEn, c.prepTextZh) + '</p>' +
                  '<p><b>② ' + t('Equip as Kitchen Gear (Step 2 · Free empty / 1🧂 swap):', '横置当主动厨具（第2步 · 空位免费/替旧1🧂）：') + '</b> ' + t(c.gearNameEn, c.gearNameZh) + ' — ' + t(c.gearDescEn, c.gearDescZh) + '</p>' +
                  '<p><b>③ ' + t('Cook as Signature Dish (Step 3B):', '开火烹饪名菜（第3步B）：') + '</b> ' + t(c.dishBonusEn, c.dishBonusZh) + '</p>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>'
        );
      }

      if (ui.activeModal === 'rules') {
        return (
          '<div class="modal-backdrop" data-act="close-modal">' +
            '<div class="modal-sheet rules-sheet" onclick="event.stopPropagation()">' +
              '<div class="modal-head">' +
                '<h3>📖 ' + t('60-Second How to Play — Star Chef Showdown', '60秒极速上手指南 —— 《星厨对决》') + '</h3>' +
                '<button class="icon-close" data-act="close-modal">✕</button>' +
              '</div>' +
              '<div class="rules-grid-4">' +
                '<div class="rule-step-card"><b>1. ' + t('Clockwise Bistro Rondel', '顺时针八方吧台走位') + '</b><p>' +
                  t('Move 1 or 2 seats clockwise for FREE (+1🧂 per extra step) to collect Wagyu 🥩, Lobster 🦐, Truffle 🍄, Spice 🧂, Ice 🧊, & Menu Cards. Landing on your rival triggers a Bump (rival draws 1 free card)!',
                    '每回合先顺时针走 1~2 步免费（每多走1步付1🧂），领取对应档口的食材筹码与手牌。停在对手同格触发【挤位】（对手免费摸1张牌）！') +
                '</p></div>' +
                '<div class="rule-step-card"><b>2. ' + t('Multi-Use Cards (Hand ≤ 2)', '一卡三用闭环（手牌上限2）') + '</b><p>' +
                  t('Every card works 3 ways: ① Discard in Step 2 for instant Prep tokens; ② Or Equip in Step 2 as permanent Kitchen Gear (empty slot free, 1🧂 to swap; 1st to 2 gear scores +2★ & Draw 1!); ③ Still Cook in Step 3!',
                    '每张名菜卡兼具三种用途：①第2步弃置换取备菜筹码；②或第2步免费装空位厨具（替旧付1🧂，率先满2件独占+2★并摸1牌，第3步照常可掌勺）；③凑齐配方开火冲星！') +
                '</p></div>' +
                '<div class="rule-step-card"><b>3. ' + t('1° Start · Blackjack Wok Heat', '1°起锅 · 21点式添柴控温') + '</b><p>' +
                  t('Every dish starts at 1° with a free Blazing Die (+1~6° → 0% first-roll bust!). Plate at 5°–6° for Golden ★ + 1🧂 Spice (+2★ at Seat ⑧!), hit exact 7° for Master Chef ★ + keep 1 ingredient, or bust at 8°+ (save with 🧊 Ice -2°)!',
                    '统一 1° 起锅，首投免费猛火骰（1~6°）绝不爆锅！5°~6°拿黄金星并领1🧂回锅香料（⑧品鉴铃起锅额外+2★），恰好7°拿极品高星并留1份食材，8°+超温可用🧊救锅冰(-2°)或砂锅救回！') +
                '</p></div>' +
                '<div class="rule-step-card"><b>4. ' + t('Follow & 18★ Equal Endgame', '回合外跟随与 18★ 平权终局') + '</b><p>' +
                  t('If the active chef doesn’t cook, the other chef may pay 1🧂 to Follow (+1 Ingredient or Draw 1). Collect 3 distinct Cuisine Stamps (🔥💧🌿⚡) for +3★! Reaching 18★ triggers Equal-Turns Endgame!',
                    '若主动方本回合未开火，另一人可付1🧂发动【跟随】（摸1牌或拿1食材）。集满3种不同流派章立即+3★！任一主厨达18★触发平权终局（P1触发则P2补完本轮）！') +
                '</p></div>' +
              '</div>' +
              '<div class="modal-foot-bar">' +
                '<button class="cta-bundle-btn" data-act="close-modal">🍳 ' + t('Got It — Back to the Bistro!', '明白啦 —— 回到料理吧台！') + '</button>' +
              '</div>' +
            '</div>' +
          '</div>'
        );
      }

      if (ui.activeModal === 'bundle') {
        return (
          '<div class="modal-backdrop" data-act="close-modal">' +
            '<div class="modal-sheet bundle-sheet" onclick="event.stopPropagation()">' +
              '<div class="modal-head">' +
                '<h3>🖨️ ' + t('Print & Play Tabletop Trilogy Bundle', '原创双人策略桌游 · 打印即玩三部曲合集包') + '</h3>' +
                '<button class="icon-close" data-act="close-modal">✕</button>' +
              '</div>' +
              renderUpsellTrilogyBlock(false) +
            '</div>' +
          '</div>'
        );
      }

      if (ui.activeModal === 'victory' && state.phase === 'GAME_OVER') {
        var p0 = state.players[0];
        var p1 = state.players[1];
        var titleTxt = state.winner === 'tie'
          ? t('🏆 Shared Master Chef Crown!', '🏆 平分秋色 · 共享厨神桂冠！')
          : (state.mode === '1p'
              ? (state.winner === 0 ? t('🏆 Victory! You Outcooked Sous-Chef AI!', '🏆 恭喜获胜！你击败了蓝带 AI 副厨！')
                                    : t('👨‍🍳 Sous-Chef AI Takes the Dish! Rematch?', '👨‍🍳 蓝带 AI 副厨险胜一筹！再来一局？'))
              : (state.lang === 'zh' ? '🏆 ' + chefLabelZh(state, state.winner) + ' 夺得料理王！' : '🏆 ' + chefLabelEn(state, state.winner) + ' Wins!'));

        return (
          '<div class="modal-backdrop" data-act="close-modal">' +
            '<div class="modal-sheet victory-sheet" onclick="event.stopPropagation()">' +
              '<div class="victory-banner">' +
                '<div class="victory-head-top">' +
                  '<h2>' + titleTxt + '</h2>' +
                  '<button class="icon-close light" data-act="close-modal">✕</button>' +
                '</div>' +
                '<p class="victory-sub">' + t(state.winReasonEn, state.winReasonZh) + ' · ' + t('Completed in ' + state.round + ' Rounds', '共激战 ' + state.round + ' 轮') + '</p>' +
                '<div class="scorecard-row">' +
                  '<div class="score-pill p1">' +
                    '<b>' + (state.lang === 'zh' ? chefLabelZh(state, 0) : chefLabelEn(state, 0)) + ': ' + p0.stars + '★</b>' +
                    '<span>' + t('Stamps ' + countStamps(p0) + ' · 7° Perfects ' + p0.perfectDishes, '流派章 ' + countStamps(p0) + ' · 7°极品 ' + p0.perfectDishes + '道') + '</span>' +
                  '</div>' +
                  '<div class="score-pill p2">' +
                    '<b>' + (state.lang === 'zh' ? chefLabelZh(state, 1) : chefLabelEn(state, 1)) + ': ' + p1.stars + '★</b>' +
                    '<span>' + t('Stamps ' + countStamps(p1) + ' · 7° Perfects ' + p1.perfectDishes, '流派章 ' + countStamps(p1) + ' · 7°极品 ' + p1.perfectDishes + '道') + '</span>' +
                  '</div>' +
                '</div>' +
                '<div class="rematch-row">' +
                  '<button class="rematch-btn" data-act="new-game">🍳 ' + t('Play Instant Rematch', '立即再来一局') + '</button>' +
                  '<button class="rematch-btn alt" data-act="switch-mode">' +
                    (state.mode === '1p' ? '👥 ' + t('Try 2P Pass & Play', '切换本地双人对战') : '🤖 ' + t('Play vs. Sous-Chef AI', '切换挑战 AI 副厨')) +
                  '</button>' +
                '</div>' +
              '</div>' +
              renderUpsellTrilogyBlock(true) +
            '</div>' +
          '</div>'
        );
      }

      return '';
    }

    function render() {
      var mon = getMonetization();
      var prod = (mon.products && mon.products.pnpTrilogyBundle) || DEFAULT_MONETIZATION.products.pnpTrilogyBundle;
      var priceTag = state.lang === 'zh' ? (prod.priceCny || '¥19.9') : (prod.priceUsd || '$7.99');
      var actor = getActingPlayer(state);
      var turnPill = state.phase === 'GAME_OVER'
        ? '<span class="turn-pill over">🏁 ' + t('Final Score', '终局结算') + ' · <button class="inline-btn" data-act="open-victory">' + t('Scorecard', '查看战绩') + '</button></span>'
        : '<span class="turn-pill p' + (actor + 1) + '">' +
            t('Round ' + state.round + ' · ', '第' + state.round + '轮 · ') +
            (state.lang === 'zh' ? chefLabelZh(state, actor) : chefLabelEn(state, actor)) +
          '</span>';

      appRoot.innerHTML =
        '<div class="bistro-shell">' +
          '<header class="bistro-topbar">' +
            '<div class="brand-cluster">' +
              '<span class="brand-logo">🍳 ' + t('Star Chef Showdown', '星厨对决') + '</span>' +
              '<div class="mode-seg" role="group">' +
                '<button class="seg-btn ' + (state.mode === '1p' ? 'active' : '') + '" data-act="set-mode" data-mode="1p">🤖 ' + t('1P vs AI', '单人战AI') + '</button>' +
                '<button class="seg-btn ' + (state.mode === '2p' ? 'active' : '') + '" data-act="set-mode" data-mode="2p">👥 ' + t('2P Local', '本地双人') + '</button>' +
              '</div>' +
            '</div>' +
            '<button class="topbar-upsell-pill" data-act="open-bundle">' +
              '🖨️ ' + t('Loved the duel? Print all 3 Tabletop Games (' + priceTag + ')', '意犹未尽？打印全套 3 款实体桌游回家（' + priceTag + '）') + ' ➔' +
            '</button>' +
            '<div class="toolbar-cluster">' +
              '<button class="tool-btn" data-act="open-rules">📖 ' + t('Rules', '规则') + '</button>' +
              '<button class="tool-btn" data-act="toggle-mute">' + (BistroAudio.isMuted() ? '🔇' : '🔊') + '</button>' +
              '<button class="tool-btn lang-btn" data-act="toggle-lang">' + (state.lang === 'zh' ? 'EN' : '中文') + '</button>' +
              '<button class="tool-btn" data-act="fullscreen" title="Fullscreen">⛶</button>' +
            '</div>' +
          '</header>' +
          '<div class="coach-banner">' +
            turnPill +
            (ui.showCoach
              ? '<div class="coach-text">' + getCoachMessage() + '</div>' +
                '<button class="coach-hide" data-act="toggle-coach" title="' + t('Hide tips', '收起提示') + '">✕</button>'
              : '<div class="coach-text muted-tip">' +
                  (state.turnContext.canBorrowOpponentGear ? t('✨ Seat ⑥ Active: You may borrow 1 Rival Kitchen Gear this turn!', '✨ ⑥号香料坊生效：本回掌勺可借用对手1件厨具！') : '') +
                '</div>' +
                '<button class="coach-hide" data-act="toggle-coach">' + t('💡 Tips', '💡 提示') + '</button>'
            ) +
          '</div>' +
          '<main class="tabletop-grid">' +
            renderLeftSidebar() +
            renderCenterStage() +
            renderRightControlDock() +
          '</main>' +
          renderModal() +
        '</div>';
    }

    // Delegated click handler on appRoot
    appRoot.addEventListener('click', function (ev) {
      var inspectBtn = ev.target.closest('[data-inspect-btn]');
      if (inspectBtn) {
        ev.stopPropagation();
        ui.inspectedCardId = Number(inspectBtn.getAttribute('data-inspect-btn'));
        ui.activeModal = 'card';
        render();
        return;
      }

      var btn = ev.target.closest('[data-act]');
      if (!btn) return;
      var act = btn.getAttribute('data-act');

      if (act === 'close-modal') {
        ui.activeModal = null;
        render();
      } else if (act === 'open-rules') {
        ui.activeModal = 'rules';
        render();
      } else if (act === 'open-bundle') {
        ui.activeModal = 'bundle';
        render();
      } else if (act === 'open-victory') {
        ui.activeModal = 'victory';
        render();
      } else if (act === 'toggle-lang') {
        state.lang = state.lang === 'zh' ? 'en' : 'zh';
        safeStorageSet('starchef_lang', state.lang);
        render();
      } else if (act === 'toggle-mute') {
        BistroAudio.toggleMute();
        render();
      } else if (act === 'toggle-coach') {
        ui.showCoach = !ui.showCoach;
        safeStorageSet('starchef_coach', ui.showCoach ? '1' : '0');
        render();
      } else if (act === 'fullscreen') {
        var docEl = document.documentElement;
        if (!document.fullscreenElement && docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(function () {});
        } else if (document.exitFullscreen) {
          document.exitFullscreen().catch(function () {});
        }
      } else if (act === 'set-mode') {
        var newMode = btn.getAttribute('data-mode') === '2p' ? '2p' : '1p';
        if (newMode !== state.mode) {
          state = createGame({ mode: newMode, lang: state.lang });
          ui.activeModal = null;
          BistroAudio.step();
          render();
          scheduleAIIfNeeded();
        }
      } else if (act === 'switch-mode') {
        var toggledMode = state.mode === '1p' ? '2p' : '1p';
        state = createGame({ mode: toggledMode, lang: state.lang });
        ui.activeModal = null;
        BistroAudio.step();
        render();
        scheduleAIIfNeeded();
      } else if (act === 'new-game') {
        state = createGame({ mode: state.mode, lang: state.lang });
        ui.activeModal = null;
        BistroAudio.step();
        render();
        scheduleAIIfNeeded();
      } else if (act === 'move-seat') {
        dispatchWithSound({ type: 'MOVE_RONDEL', steps: Number(btn.getAttribute('data-steps')) });
      } else if (act === 'prep-card') {
        dispatchWithSound({ type: 'PREP_CARD', cardId: Number(btn.getAttribute('data-cid')) });
      } else if (act === 'skip-prep') {
        dispatchWithSound({ type: 'SKIP_PREP' });
      } else if (act === 'equip-card') {
        var cid = Number(btn.getAttribute('data-cid'));
        dispatchWithSound({ type: 'EQUIP_GEAR', cardId: cid });
      } else if (act === 'cook-menu') {
        dispatchWithSound({ type: 'START_COOK', source: 'menu', cardId: Number(btn.getAttribute('data-cid')) });
      } else if (act === 'cook-hand') {
        dispatchWithSound({ type: 'START_COOK', source: 'hand', cardId: Number(btn.getAttribute('data-cid')) });
      } else if (act === 'restock-draw') {
        dispatchWithSound({ type: 'RESTOCK', mode: 'DRAW' });
      } else if (act === 'restock-ing') {
        dispatchWithSound({ type: 'RESTOCK', mode: 'ING', ing: btn.getAttribute('data-ing') });
      } else if (act === 'wok-blazing') {
        dispatchWithSound({ type: 'WOK_ROLL_BLAZING' });
      } else if (act === 'wok-simmer') {
        dispatchWithSound({ type: 'WOK_ROLL_SIMMER' });
      } else if (act === 'wok-plate') {
        dispatchWithSound({ type: 'WOK_PLATE' });
      } else if (act === 'wok-bust') {
        dispatchWithSound({ type: 'WOK_ACCEPT_BUST' });
      } else if (act === 'wok-ice') {
        dispatchWithSound({ type: 'WOK_USE_ICE' });
      } else if (act === 'wok-gear') {
        dispatchWithSound({
          type: 'WOK_USE_GEAR',
          gearId: Number(btn.getAttribute('data-gid')),
          amount: btn.getAttribute('data-amt') ? Number(btn.getAttribute('data-amt')) : undefined,
          adj: btn.getAttribute('data-adj') ? Number(btn.getAttribute('data-adj')) : undefined
        });
      } else if (act === 'follow-draw') {
        dispatchWithSound({ type: 'DO_FOLLOW', mode: 'DRAW' });
      } else if (act === 'follow-ing') {
        dispatchWithSound({ type: 'DO_FOLLOW', mode: 'ING', ing: btn.getAttribute('data-ing') });
      } else if (act === 'follow-pass') {
        dispatchWithSound({ type: 'PASS_FOLLOW' });
      } else if (act === 'pick-menu') {
        dispatchWithSound({ type: 'CHOOSE_OPEN_MENU', cardId: Number(btn.getAttribute('data-cid')) });
      } else if (act === 'discard-draw') {
        dispatchWithSound({ type: 'CHOOSE_DISCARD_FOR_DRAW', cardId: Number(btn.getAttribute('data-cid')) });
      } else if (act === 'skip-bump-draw') {
        dispatchWithSound({ type: 'CHOOSE_DISCARD_FOR_DRAW', skipDraw: true });
      } else if (act === 'pick-any') {
        dispatchWithSound({ type: 'CHOOSE_ANY_ING', ing: btn.getAttribute('data-ing') });
      } else if (act === 'pick-kept') {
        dispatchWithSound({ type: 'CHOOSE_KEPT_ING', ing: btn.getAttribute('data-ing') });
      }
    });

    render();
    scheduleAIIfNeeded();

    root.__STARCHEF_INSTANCE__ = {
      getState: function () { return state; },
      render: render
    };
  }

  /* ==========================================================================
   * 11. EXPORTS (Browser Global + Headless jsc / CommonJS)
   * ========================================================================== */
  var StarChefEngine = {
    CARDS: CARDS,
    CARD_BY_ID: CARD_BY_ID,
    RONDEL_SEATS: RONDEL_SEATS,
    CUISINES: CUISINES,
    SVG_ICONS: SVG_ICONS,
    TRILOGY_SVGS: TRILOGY_SVGS,
    createRNG: createRNG,
    createGame: createGame,
    applyAction: applyAction,
    chooseAIAction: chooseAIAction,
    getActingPlayer: getActingPlayer,
    getCookOptionsForCard: getCookOptionsForCard,
    getAvailableWokActions: getAvailableWokActions,
    countAllCards: countAllCards,
    countStamps: countStamps,
    countRemainingResources: countRemainingResources,
    safeStorageGet: safeStorageGet,
    safeStorageSet: safeStorageSet,
    initBrowserUI: initBrowserUI
  };

  root.StarChefEngine = StarChefEngine;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = StarChefEngine;
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initBrowserUI);
    } else {
      initBrowserUI();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
