/**
 * CardSheet & Flashcard Print Layout Studio — Pure Mathematical & Parser Core
 * 100% Client-Side, Zero Dependencies, Compatible with Browser & macOS JavaScriptCore (jsc).
 */
(function (root) {
  'use strict';

  var MM_PER_INCH = 25.4;
  var DPI_EXPORT = 300;
  var PX_PER_MM_300 = DPI_EXPORT / MM_PER_INCH; // 11.811023622...

  var PAPERS = {
    a4: {
      id: 'a4',
      nameEn: 'ISO A4 (210 × 297 mm)',
      nameZh: '国际标准 A4 (210 × 297 mm)',
      widthMm: 210.0,
      heightMm: 297.0,
      cssSizePortrait: '210mm 297mm',
      cssSizeLandscape: '297mm 210mm'
    },
    letter: {
      id: 'letter',
      nameEn: 'US Letter (8.5 × 11 in / 215.9 × 279.4 mm)',
      nameZh: '美标 US Letter (8.5 × 11 英寸 / 215.9 × 279.4 mm)',
      widthMm: 215.9,
      heightMm: 279.4,
      cssSizePortrait: '8.5in 11in',
      cssSizeLandscape: '11in 8.5in'
    }
  };

  var PRESETS = {
    poker: {
      id: 'poker',
      nameEn: 'Poker / TCG Card (63.5 × 88.9 mm · 9/sheet)',
      nameZh: '标准扑克 / 桌游卡牌 (63.5 × 88.9 mm · 9张/页)',
      descEn: '2.5 × 3.5 in — Magic, Pokémon, PnP board games, D&D spell cards',
      descZh: '2.5 × 3.5 英寸 — 万智牌、宝可梦、PnP 桌游、跑团法术卡标准尺寸',
      widthMm: 63.5,
      heightMm: 88.9,
      defaultOrientation: 'portrait',
      defaultGapMm: 0,
      defaultBleedMm: 0,
      defaultSafeMarginMm: 5.0,
      cornerRadiusMm: 3.0,
      recommendedSample: 'pnp'
    },
    bridge: {
      id: 'bridge',
      nameEn: 'Bridge / Euro Boardgame Card (57 × 87 mm · 9/sheet)',
      nameZh: '桥牌 / 德式桌游卡牌 (57 × 87 mm · 9张/页)',
      descEn: '2.25 × 3.43 in — Classic trick-taking & Euro strategy decks',
      descZh: '2.25 × 3.43 英寸 — 传统桥牌与德式策略桌游常用窄版尺寸',
      widthMm: 57.0,
      heightMm: 87.0,
      defaultOrientation: 'portrait',
      defaultGapMm: 0,
      defaultBleedMm: 0,
      defaultSafeMarginMm: 6.0,
      cornerRadiusMm: 2.8,
      recommendedSample: 'pnp'
    },
    'mini-euro': {
      id: 'mini-euro',
      nameEn: 'Mini Euro Tabletop Card (44 × 68 mm · 12–16/sheet)',
      nameZh: 'Mini Euro 迷你桌游卡 (44 × 68 mm · 12–16张/页)',
      descEn: 'Compact item, resource, and status cards for board games',
      descZh: '桌游装备卡、资源卡、状态标记迷你卡（极省卡纸）',
      widthMm: 44.0,
      heightMm: 68.0,
      defaultOrientation: 'portrait',
      defaultGapMm: 0,
      defaultBleedMm: 0,
      defaultSafeMarginMm: 6.0,
      cornerRadiusMm: 2.2,
      recommendedSample: 'pnp'
    },
    'flashcard-a7': {
      id: 'flashcard-a7',
      nameEn: 'Vocabulary Study Flashcard A7 (74 × 105 mm · 4–8/sheet)',
      nameZh: '单词记忆闪卡 A7 (74 × 105 mm · 4–8张/页)',
      descEn: 'Pocket study cards for languages, exams, definitions & formulas (0mm margin = 8/sheet on A4)',
      descZh: '考研/雅思/日语背诵闪卡黄金掌中尺寸（0边距横排8张/页，常规留白4张/页）',
      widthMm: 74.0,
      heightMm: 105.0,
      defaultOrientation: 'landscape',
      defaultGapMm: 0,
      defaultBleedMm: 0,
      defaultSafeMarginMm: 0.0,
      cornerRadiusMm: 2.0,
      recommendedSample: 'vocab'
    },
    'flashcard-3x5': {
      id: 'flashcard-3x5',
      nameEn: 'US Study Index Card 3×5" (127 × 76.2 mm · 4/sheet)',
      nameZh: '3×5 英寸宽幅学科闪卡 (127 × 76.2 mm · 4张/页)',
      descEn: '5 × 3 in classic study & lecture revision flashcards (2×2 rotated fit)',
      descZh: '经典 3×5 英寸宽幅知识点卡片（每页 4 张双面精准对齐）',
      widthMm: 76.2,
      heightMm: 127.0,
      defaultOrientation: 'portrait',
      defaultGapMm: 0,
      defaultBleedMm: 0,
      defaultSafeMarginMm: 6.0,
      cornerRadiusMm: 1.5,
      recommendedSample: 'vocab'
    },
    'business-us': {
      id: 'business-us',
      nameEn: 'US Business Card 3.5×2" (88.9 × 50.8 mm · 10/sheet)',
      nameZh: '商务名片 / 展会联系卡 (88.9 × 50.8 mm · 10张/页)',
      descEn: 'Standard 3.5 × 2 in 2×5 sheet layout compatible with Avery 8871 geometry',
      descZh: '标准 2列×5行 每页10张名片排版，零边距共线直刀一裁到底',
      widthMm: 88.9,
      heightMm: 50.8,
      defaultOrientation: 'portrait',
      defaultGapMm: 0,
      defaultBleedMm: 0,
      defaultSafeMarginMm: 6.0,
      cornerRadiusMm: 0,
      recommendedSample: 'business'
    },
    'square-50': {
      id: 'square-50',
      nameEn: 'Square Tile / Sticker (50 × 50 mm · 12–15/sheet)',
      nameZh: '方形地图指示物 / 贴纸 (50 × 50 mm · 12–15张/页)',
      descEn: 'Boardgame map tiles, QR labels, product tags & craft stickers',
      descZh: '桌游方形板块、产品标签贴纸、二维码牌（无间距15张 / 留缝12张）',
      widthMm: 50.0,
      heightMm: 50.0,
      defaultOrientation: 'portrait',
      defaultGapMm: 0,
      defaultBleedMm: 0,
      defaultSafeMarginMm: 8.0,
      cornerRadiusMm: 2.5,
      recommendedSample: 'stickers'
    },
    custom: {
      id: 'custom',
      nameEn: 'Custom Millimeter Size (W × H mm)',
      nameZh: '自定义毫米尺寸 (宽 × 高 mm)',
      descEn: 'Define exact physical card width and height in millimeters',
      descZh: '自由输入任意宽×高毫米数值，自动计算最大拼版行列与共线裁切线',
      widthMm: 63.5,
      heightMm: 88.9,
      defaultOrientation: 'portrait',
      defaultGapMm: 0,
      defaultBleedMm: 0,
      defaultSafeMarginMm: 5.0,
      cornerRadiusMm: 2.5,
      recommendedSample: 'pnp'
    }
  };

  var SAMPLE_DECKS = {
    vocab: {
      id: 'vocab',
      nameEn: 'Bilingual Vocabulary & Memory Deck (9 Cards)',
      nameZh: '高阶双语词汇与记忆科学闪卡示例 (9张)',
      theme: 'study',
      backCrest: '📚 ACTIVE RECALL',
      rawText: [
        'Ephemeral | Lasting for a very short time · 朝生暮死的；转瞬即逝的 ("ephemeral autumn blossoms") | GRE · Adj | ⏳',
        'Spaced Repetition | Reviewing cards at expanding intervals right before forgetting · 间隔重复记忆法 | Learning Science | 🧠',
        'Serendipity | Finding valuable things by fortunate chance · 不期而遇的美好机缘 | High-Freq · Noun | ✨',
        'Ubiquitous | Present, appearing, or found everywhere · 无所不在的；普遍存在的 | Academic · Adj | 🌐',
        'Pragmatic | Dealing with things sensibly and realistically · 务实的；讲求实效的 | Business · Adj | ⚙️',
        '木漏れ日 (Komorebi) | Sunlight filtering through forest leaves · 树叶间隙洒下的斑驳阳光 | JLPT · Culture | 🌿',
        'Feynman Technique | Explain a concept in plain words to expose knowledge gaps · 费曼学习法 | Mental Model | 💡',
        'Resilience | Capacity to recover quickly from difficulties · 心理韧性；抗压恢复力 | Core Vocab | 🛡️',
        'Pareto Principle | 80% of outcomes stem from 20% of vital inputs · 帕累托二八法则 | Economics | 📊'
      ].join('\n')
    },
    pnp: {
      id: 'pnp',
      nameEn: 'Playable PnP Micro-Deck: Relic Duel (9 Cards)',
      nameZh: '可玩微缩桌游示例：遗物对决卡牌组 (9张)',
      theme: 'tabletop',
      backCrest: '⚔️ RELIC DUEL',
      rawText: [
        'Sunforged Aegis | SHIELD +4 · Reflect 1 damage back to attacker. Draw 1 card if at full HP. | Relic · Cost 2 | 🛡️',
        'Chrono Hourglass | ACTION · Take an immediate extra Action Phase; skip Draw at end of turn. | Arcane · Cost 3 | ⌛',
        'Whispering Dagger | STRIKE 3 · Pierces armor. If target played a Spell last turn, deal +2 DMG. | Weapon · Cost 1 | 🗡️',
        'Verdant Elixir | HEAL +4 HP · Cleanse Poison/Burn tokens and gain +1 Energy next round. | Alchemy · Cost 1 | 🧪',
        'Astral Compass | SCOUT · Look at top 3 deck cards: keep 1, discard 1, place 1 on bottom. | Utility · Cost 1 | 🧭',
        'Ember Wyrmling | SUMMON 3/2 · Deals 1 splash damage to all enemy standees on entry. | Companion · Cost 2 | 🐉',
        'Mirror Ward | REACTION · Cancel an incoming targeted Tactic and copy its tag bonus. | Counter · Cost 2 | 🔮',
        'Obsidian Crown | PASSIVE · +1 Hand Limit. Lose 1 HP at start of turn to gain +1 Energy. | Cursed · Cost 2 | 👑',
        'Starfall Nova | ULTIMATE 6 · Deal 6 DMG split freely among foes. Exile after use. | Mythic · Cost 4 | ☄️'
      ].join('\n')
    },
    dnd: {
      id: 'dnd',
      nameEn: '5e Tabletop RPG Spell & Item Reference (9 Cards)',
      nameZh: 'TRPG 跑团法术与魔法物品速查卡 (9张)',
      theme: 'parchment',
      backCrest: '🎲 GRIMOIRE 5E',
      rawText: [
        'Fireball (Lv.3 Evocation) | 150ft · 20ft Sphere · DEX Save · 8d6 Fire DMG (half on save). V, S, M. | 1 Action · Instant | 🔥',
        'Healing Word (Lv.1 Evocation) | 60ft · Visible ally regains 1d4 + Spell Mod HP. Keeps Action free! | 1 Bonus Action | 💚',
        'Misty Step (Lv.2 Conjuration) | Self · Briefly surrounded by silvery mist, teleport up to 30ft to unoccupied spot. | 1 Bonus Action | 🌫️',
        'Counterspell (Lv.3 Abjuration) | 60ft · Interrupt creature casting Lv.3 or lower spell automatically (DC 10+Lv check if higher). | 1 Reaction | ✋',
        'Shield (Lv.1 Abjuration) | Self · +5 AC until start of your next turn & zero damage from Magic Missile. | 1 Reaction | 🛡️',
        'Cloak of Elvenkind | Wondrous (Attune) · Perception checks to see you have Disadvantage; Stealth checks gain Advantage. | Uncommon Gear | 🍃',
        'Bag of Holding | Wondrous · Holds 500 lbs inside 64 cu.ft. space while always weighing 15 lbs. | Uncommon Utility | 🎒',
        'Potion of Superior Healing | Consumable · Drink or administer as Action to restore 8d4 + 8 Hit Points. | Rare Potion | ❤️',
        'Immovable Rod | Rod · Press button as Action to magically fix rod in mid-air (holds up to 8,000 lbs). | Uncommon Rod | 🪄'
      ].join('\n')
    },
    business: {
      id: 'business',
      nameEn: 'Indie Maker & Studio Business Cards (10 Cards)',
      nameZh: '独立创作者与工作室双面名片模板 (10张)',
      theme: 'minimal',
      backCrest: '🌿 CRAFTLEAF STUDIO',
      rawText: [
        'Alex Rivera · Indie Game Designer | craftleaf.studio · alex@craftleaf.studio · Booth #B14 Indie Tabletop Expo | CraftLeaf & Pixel | 🎲 | 10'
      ].join('\n')
    },
    stickers: {
      id: 'stickers',
      nameEn: 'Boardgame Tokens & Craft Stickers (15 Tiles)',
      nameZh: '桌游资源板块与手作标签贴纸 (15枚)',
      theme: 'badge',
      backCrest: '⭐ TOKEN BACK',
      rawText: [
        'Gold Coin +5 | Treasury Reserve · Spend in Market Phase | Currency | 🪙 | 3',
        'Mana Crystal | Channel 1 Arcane Charge | Resource | 💎 | 3',
        'Campfire Safe Zone | Rest here to heal 2 Wounds | Map Tile | 🔥 | 3',
        'Locked Chest | Spend 1 Key or roll 5+ to loot | Dungeon | 📦 | 3',
        'Boss Spawn Portal | Summons Guardian on Round 4 | Hazard | 🌀 | 3'
      ].join('\n')
    }
  };

  function generate54CardBatchSample() {
    var suits = [
      { name: 'Solar Order', icon: '☀️', tag: 'Solar · Vanguard' },
      { name: 'Tide Covenant', icon: '🌊', tag: 'Tide · Control' },
      { name: 'Verdant Wilds', icon: '🌿', tag: 'Verdant · Growth' },
      { name: 'Iron Citadel', icon: '⚙️', tag: 'Citadel · Bastion' }
    ];
    var ranks = [
      ['Scout', 'Cost 1 · Draw 1 card when deployed to flank.'],
      ['Warden', 'Cost 1 · Guard +2 against ranged strikes.'],
      ['Tactician', 'Cost 2 · Shift 1 allied unit 1 zone without spending AP.'],
      ['Artificer', 'Cost 2 · Reduce next Relic activation cost by 1.'],
      ['Invoker', 'Cost 2 · Deal 2 elemental damage across any row.'],
      ['Banneret', 'Cost 3 · Adjacent allies gain +1 Power this round.'],
      ['Chronomancer', 'Cost 3 · Reclaim 1 spent Action card from discard.'],
      ['Valkyrie', 'Cost 3 · Flying Strike 3; ignores terrain penalties.'],
      ['Archmage', 'Cost 4 · Cast 1 Tactic twice without paying extra Energy.'],
      ['Colossus', 'Cost 4 · Siege 5; absorbs up to 3 splash damage.'],
      ['Sovereign', 'Cost 5 · Command: Trigger up to 2 allied abilities.'],
      ['Avatar', 'Cost 5 · Mythic Finisher: +1 Power per Relic controlled.'],
      ['Sanctum', 'Landmark · Generates +1 Faction Energy each upkeep.']
    ];
    var lines = [];
    for (var s = 0; s < suits.length; s++) {
      for (var r = 0; r < ranks.length; r++) {
        lines.push(
          suits[s].name + ' ' + ranks[r][0] + ' #' + (s * 13 + r + 1) +
          ' | ' + ranks[r][1] +
          ' | ' + suits[s].tag +
          ' | ' + suits[s].icon
        );
      }
    }
    lines.push('Grand Astral Nexus #53 | World Event · All players draw 2 & refresh 1 Relic. | Mythic Event | 🌟');
    lines.push('Eclipse Cataclysm #54 | World Event · Flip battlefield polarity & score Control zones. | Finale Event | 🌑');
    return lines.join('\n');
  }

  SAMPLE_DECKS.batch54 = {
    id: 'batch54',
    nameEn: 'Full 54-Card Strategy Deck (6 Sheets Batch Demo)',
    nameZh: '完整 54 张桌游全套卡组（6页自动分页 + 双面镜像演示）',
    theme: 'tabletop',
    backCrest: '🌟 ASTRAL REALMS · 54',
    rawText: generate54CardBatchSample()
  };

  function roundMm(val) {
    return Math.round(Number(val) * 1000) / 1000;
  }

  function clamp(val, min, max) {
    var n = Number(val);
    if (isNaN(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function resolveDeepLinkPreset(queryPreset) {
    var key = String(queryPreset || '').trim().toLowerCase();
    var map = {
      'poker': { presetId: 'poker', sampleDeck: 'pnp' },
      'playing-card': { presetId: 'poker', sampleDeck: 'pnp' },
      'pnp': { presetId: 'poker', sampleDeck: 'pnp' },
      'dnd': { presetId: 'poker', sampleDeck: 'dnd' },
      'rpg': { presetId: 'poker', sampleDeck: 'dnd' },
      'spell': { presetId: 'poker', sampleDeck: 'dnd' },
      'bridge': { presetId: 'bridge', sampleDeck: 'pnp' },
      'mini-euro': { presetId: 'mini-euro', sampleDeck: 'pnp' },
      'mini': { presetId: 'mini-euro', sampleDeck: 'pnp' },
      'flashcard': { presetId: 'flashcard-a7', sampleDeck: 'vocab' },
      'vocab': { presetId: 'flashcard-a7', sampleDeck: 'vocab' },
      'flashcard-a7': { presetId: 'flashcard-a7', sampleDeck: 'vocab' },
      'flashcard-3x5': { presetId: 'flashcard-3x5', sampleDeck: 'vocab' },
      '3x5': { presetId: 'flashcard-3x5', sampleDeck: 'vocab' },
      'business': { presetId: 'business-us', sampleDeck: 'business' },
      'business-us': { presetId: 'business-us', sampleDeck: 'business' },
      'square': { presetId: 'square-50', sampleDeck: 'stickers' },
      'sticker': { presetId: 'square-50', sampleDeck: 'stickers' },
      'square-50': { presetId: 'square-50', sampleDeck: 'stickers' },
      'duplex': { presetId: 'poker', sampleDeck: 'pnp', enableDuplexPreview: true },
      'delta': { presetId: 'poker', sampleDeck: 'pnp', workspaceTab: 'delta', enableDuplexPreview: true },
      'standee': { presetId: 'poker', sampleDeck: 'dnd', workspaceTab: '3d-studio', sub3dMode: 'standee' },
      'tuckbox': { presetId: 'poker', sampleDeck: 'pnp', workspaceTab: '3d-studio', sub3dMode: 'tuckbox' }
    };
    return map[key] || null;
  }

  /**
   * RFC-4180 compliant CSV / delimiter row parser
   */
  function parseDelimitedRows(text, delimiter) {
    var rows = [];
    var row = [];
    var field = '';
    var inQuotes = false;
    var s = String(text || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (inQuotes) {
        if (ch === '"') {
          if (i + 1 < s.length && s[i + 1] === '"') {
            field += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          field += ch;
        }
      } else {
        if (ch === '"' && field.length === 0) {
          inQuotes = true;
        } else if (ch === delimiter) {
          row.push(field.trim());
          field = '';
        } else if (ch === '\n') {
          row.push(field.trim());
          if (row.some(function (c) { return c.length > 0; })) {
            rows.push(row);
          }
          row = [];
          field = '';
        } else {
          field += ch;
        }
      }
    }
    if (field.length > 0 || row.length > 0) {
      row.push(field.trim());
      if (row.some(function (c) { return c.length > 0; })) {
        rows.push(row);
      }
    }
    return rows;
  }

  /**
   * Universal deck parser supporting:
   * - Pipe designer syntax: Front | Back | Tag | Icon | Copies
   * - CSV (with or without headers)
   * - TSV (Anki / Sheets / Excel paste)
   * - JSON array or { cards: [...] }
   */
  function parseDeckInput(rawInput, formatHint) {
    var trimmed = String(rawInput || '').trim();
    if (!trimmed) return [];

    var items = [];
    var hint = String(formatHint || 'auto').toLowerCase();

    // 1. Detect JSON
    if (hint === 'json' || (hint === 'auto' && (trimmed[0] === '[' || trimmed[0] === '{'))) {
      try {
        var parsed = JSON.parse(trimmed);
        var arr = Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.cards) ? parsed.cards : []);
        for (var j = 0; j < arr.length; j++) {
          var obj = arr[j] || {};
          items.push({
            front: String(obj.front || obj.title || obj.term || obj.word || ('Card #' + (j + 1))),
            back: String(obj.back || obj.definition || obj.meaning || obj.effect || obj.description || ''),
            tag: String(obj.tag || obj.category || obj.type || ''),
            icon: String(obj.icon || obj.emoji || ''),
            copies: clamp(parseInt(obj.copies || obj.qty || obj.count || 1, 10) || 1, 1, 200),
            frontImg: obj.frontImg || null,
            backImg: obj.backImg || null
          });
        }
        return expandCardCopies(items);
      } catch (_err) {
        if (hint === 'json') return [];
      }
    }

    // 2. Detect delimiter: Pipe ('|'), Tab ('\t'), or Comma (',')
    var firstLines = trimmed.split(/\r?\n/).filter(function (l) {
      var t = l.trim();
      return t.length > 0 && t[0] !== '#';
    });
    if (!firstLines.length) return [];

    var sampleLine = firstLines[0];
    var delimiter = '|';
    if (hint === 'csv') {
      delimiter = ',';
    } else if (hint === 'tsv') {
      delimiter = '\t';
    } else if (hint === 'pipe') {
      delimiter = '|';
    } else {
      if (sampleLine.indexOf('|') !== -1) {
        delimiter = '|';
      } else if (sampleLine.indexOf('\t') !== -1) {
        delimiter = '\t';
      } else if (sampleLine.indexOf(',') !== -1) {
        delimiter = ',';
      } else {
        delimiter = '|';
      }
    }

    if (delimiter === '|') {
      for (var k = 0; k < firstLines.length; k++) {
        var parts = firstLines[k].split('|').map(function (s) { return s.trim(); });
        if (!parts[0] && !parts[1]) continue;
        items.push({
          front: parts[0] || ('Card #' + (k + 1)),
          back: parts[1] || '',
          tag: parts[2] || '',
          icon: parts[3] || '',
          copies: clamp(parseInt(parts[4] || '1', 10) || 1, 1, 200)
        });
      }
      return expandCardCopies(items);
    }

    var rows = parseDelimitedRows(trimmed, delimiter).filter(function (r) {
      return r.length > 0 && String(r[0] || '')[0] !== '#';
    });
    if (!rows.length) return [];

    // Check if row 0 is a header row
    var headerTokens = rows[0].map(function (h) { return h.toLowerCase().replace(/[^a-z0-9]/g, ''); });
    var knownHeaders = ['front', 'term', 'word', 'question', 'title', 'name', 'back', 'definition', 'answer', 'meaning'];
    var hasHeader = headerTokens.some(function (tok) { return knownHeaders.indexOf(tok) !== -1; }) && rows.length > 1;

    var colMap = { front: 0, back: 1, tag: 2, icon: 3, copies: 4 };
    var startRow = 0;
    if (hasHeader) {
      startRow = 1;
      colMap = { front: -1, back: -1, tag: -1, icon: -1, copies: -1 };
      for (var c = 0; c < headerTokens.length; c++) {
        var ht = headerTokens[c];
        if (colMap.front === -1 && ['front', 'term', 'word', 'question', 'title', 'name', 'hanzi', 'kanji'].indexOf(ht) !== -1) colMap.front = c;
        else if (colMap.back === -1 && ['back', 'definition', 'answer', 'meaning', 'effect', 'text', 'description', 'translation'].indexOf(ht) !== -1) colMap.back = c;
        else if (colMap.tag === -1 && ['tag', 'tags', 'category', 'deck', 'type', 'class', 'level', 'cost'].indexOf(ht) !== -1) colMap.tag = c;
        else if (colMap.icon === -1 && ['icon', 'emoji', 'symbol', 'badge'].indexOf(ht) !== -1) colMap.icon = c;
        else if (colMap.copies === -1 && ['copies', 'qty', 'quantity', 'count'].indexOf(ht) !== -1) colMap.copies = c;
      }
      if (colMap.front === -1) colMap.front = 0;
      if (colMap.back === -1 && rows[0].length > 1) colMap.back = 1;
    }

    for (var rIdx = startRow; rIdx < rows.length; rIdx++) {
      var rRow = rows[rIdx];
      var frontVal = colMap.front >= 0 ? (rRow[colMap.front] || '') : '';
      var backVal = colMap.back >= 0 ? (rRow[colMap.back] || '') : '';
      if (!frontVal && !backVal) continue;
      items.push({
        front: frontVal || ('Card #' + rIdx),
        back: backVal,
        tag: colMap.tag >= 0 ? (rRow[colMap.tag] || '') : '',
        icon: colMap.icon >= 0 ? (rRow[colMap.icon] || '') : '',
        copies: colMap.copies >= 0 ? clamp(parseInt(rRow[colMap.copies] || '1', 10) || 1, 1, 200) : 1
      });
    }

    return expandCardCopies(items);
  }

  function expandCardCopies(items) {
    var expanded = [];
    var maxTotal = 600;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var qty = clamp(it.copies || 1, 1, 200);
      for (var q = 0; q < qty; q++) {
        if (expanded.length >= maxTotal) break;
        expanded.push({
          id: 'card-' + (expanded.length + 1),
          index: expanded.length,
          front: it.front,
          back: it.back,
          tag: it.tag || '',
          icon: it.icon || '',
          frontImg: it.frontImg || null,
          backImg: it.backImg || null
        });
      }
    }
    return expanded;
  }

  function dedupeSortedCoords(coords) {
    var sorted = coords.slice().sort(function (a, b) { return a - b; });
    var out = [];
    for (var i = 0; i < sorted.length; i++) {
      if (out.length === 0 || Math.abs(sorted[i] - out[out.length - 1]) > 0.02) {
        out.push(roundMm(sorted[i]));
      }
    }
    return out;
  }

  /**
   * Compute optimal grid geometry & shared straight-line guillotine cut marks in exact physical mm.
   */
  function computeSheetGrid(opts) {
    opts = opts || {};
    var paper = PAPERS[opts.paperId] || PAPERS.a4;
    var orientation = opts.orientation === 'landscape' ? 'landscape' : 'portrait';
    var paperWMm = orientation === 'landscape' ? paper.heightMm : paper.widthMm;
    var paperHMm = orientation === 'landscape' ? paper.widthMm : paper.heightMm;

    var preset = PRESETS[opts.presetId] || PRESETS.poker;
    var rawCardW = opts.presetId === 'custom' ? clamp(opts.customWMm || 63.5, 15, paperWMm - 4) : preset.widthMm;
    var rawCardH = opts.presetId === 'custom' ? clamp(opts.customHMm || 88.9, 15, paperHMm - 4) : preset.heightMm;
    var rotateCards = Boolean(opts.rotateCards);
    var cardWMm = rotateCards ? rawCardH : rawCardW;
    var cardHMm = rotateCards ? rawCardW : rawCardH;

    var bleedMm = clamp(opts.bleedMm !== undefined ? opts.bleedMm : preset.defaultBleedMm, 0, 5);
    var gapMm = clamp(opts.gapMm !== undefined ? opts.gapMm : preset.defaultGapMm, 0, 15);
    var safeMarginMm = clamp(opts.safeMarginMm !== undefined ? opts.safeMarginMm : preset.defaultSafeMarginMm, 0, 20);

    var cellWMm = cardWMm + 2 * bleedMm;
    var cellHMm = cardHMm + 2 * bleedMm;

    var usableW = Math.max(cellWMm, paperWMm - 2 * safeMarginMm);
    var usableH = Math.max(cellHMm, paperHMm - 2 * safeMarginMm);

    var cols = Math.max(1, Math.floor((usableW + gapMm + 0.001) / (cellWMm + gapMm)));
    var rows = Math.max(1, Math.floor((usableH + gapMm + 0.001) / (cellHMm + gapMm)));

    // Guard physical overflow if safeMarginMm was overridden smaller than card
    while (cols > 1 && (cols * cellWMm + (cols - 1) * gapMm) > paperWMm + 0.001) cols--;
    while (rows > 1 && (rows * cellHMm + (rows - 1) * gapMm) > paperHMm + 0.001) rows--;

    var gridWMm = roundMm(cols * cellWMm + (cols - 1) * gapMm);
    var gridHMm = roundMm(rows * cellHMm + (rows - 1) * gapMm);
    var originXMm = roundMm((paperWMm - gridWMm) / 2.0);
    var originYMm = roundMm((paperHMm - gridHMm) / 2.0);

    var rawX = [];
    var rawY = [];
    for (var c = 0; c < cols; c++) {
      var cellX = originXMm + c * (cellWMm + gapMm);
      var trimLeft = cellX + bleedMm;
      var trimRight = trimLeft + cardWMm;
      rawX.push(trimLeft, trimRight);
    }
    for (var r = 0; r < rows; r++) {
      var cellY = originYMm + r * (cellHMm + gapMm);
      var trimTop = cellY + bleedMm;
      var trimBottom = trimTop + cardHMm;
      rawY.push(trimTop, trimBottom);
    }

    var verticalCutsMm = dedupeSortedCoords(rawX);
    var horizontalCutsMm = dedupeSortedCoords(rawY);

    return {
      paperId: paper.id,
      orientation: orientation,
      paperWMm: paperWMm,
      paperHMm: paperHMm,
      presetId: preset.id,
      cardWMm: roundMm(cardWMm),
      cardHMm: roundMm(cardHMm),
      bleedMm: roundMm(bleedMm),
      gapMm: roundMm(gapMm),
      safeMarginMm: roundMm(safeMarginMm),
      cornerRadiusMm: preset.cornerRadiusMm !== undefined ? preset.cornerRadiusMm : 2.5,
      cellWMm: roundMm(cellWMm),
      cellHMm: roundMm(cellHMm),
      cols: cols,
      rows: rows,
      perSheet: cols * rows,
      gridWMm: gridWMm,
      gridHMm: gridHMm,
      originXMm: originXMm,
      originYMm: originYMm,
      verticalCutsMm: verticalCutsMm,
      horizontalCutsMm: horizontalCutsMm,
      totalGuillotineCuts: verticalCutsMm.length + horizontalCutsMm.length,
      sharedSingleCutMode: (bleedMm === 0 && gapMm === 0)
    };
  }

  /**
   * Compute multi-page front & mirrored duplex back placements with ±X/±Y mm printer offset calibration.
   */
  function computePaginatedSheets(cards, grid, duplexOpts) {
    duplexOpts = duplexOpts || {};
    var list = Array.isArray(cards) ? cards : [];
    var perSheet = Math.max(1, grid.perSheet);
    var totalFrontSheets = Math.max(1, Math.ceil(list.length / perSheet));

    var includeBacks = Boolean(duplexOpts.includeBacks);
    var flipEdge = duplexOpts.flipEdge === 'short' ? 'short' : 'long';
    var offsetXMm = clamp(duplexOpts.offsetXMm || 0, -15, 15);
    var offsetYMm = clamp(duplexOpts.offsetYMm || 0, -15, 15);
    var pageOrder = duplexOpts.pageOrder || 'interleaved'; // 'interleaved' | 'fronts-then-backs'

    var frontPages = [];
    var backPages = [];

    for (var sIdx = 0; sIdx < totalFrontSheets; sIdx++) {
      var chunk = list.slice(sIdx * perSheet, (sIdx + 1) * perSheet);
      var frontSlots = [];
      var backSlots = [];

      for (var i = 0; i < chunk.length; i++) {
        var r = Math.floor(i / grid.cols);
        var c = i % grid.cols;
        var frontCellX = roundMm(grid.originXMm + c * (grid.cellWMm + grid.gapMm));
        var frontCellY = roundMm(grid.originYMm + r * (grid.cellHMm + grid.gapMm));

        frontSlots.push({
          slotIndex: i,
          row: r,
          col: c,
          card: chunk[i],
          cellXMm: frontCellX,
          cellYMm: frontCellY,
          trimXMm: roundMm(frontCellX + grid.bleedMm),
          trimYMm: roundMm(frontCellY + grid.bleedMm),
          rotateDeg: 0
        });

        var backCellX, backCellY, backRotateDeg;
        if (flipEdge === 'long') {
          // Horizontal mirror across vertical centerline x = paperWMm / 2, plus printer feed calibration
          backCellX = roundMm((grid.paperWMm - (frontCellX + grid.cellWMm)) + offsetXMm);
          backCellY = roundMm(frontCellY + offsetYMm);
          backRotateDeg = 0;
        } else {
          // Short-edge flip: vertical mirror across y = paperHMm / 2 + 180 deg rotation + offset
          backCellX = roundMm(frontCellX + offsetXMm);
          backCellY = roundMm((grid.paperHMm - (frontCellY + grid.cellHMm)) + offsetYMm);
          backRotateDeg = 180;
        }

        backSlots.push({
          slotIndex: i,
          row: flipEdge === 'short' ? (grid.rows - 1 - r) : r,
          col: flipEdge === 'long' ? (grid.cols - 1 - c) : c,
          card: chunk[i],
          cellXMm: backCellX,
          cellYMm: backCellY,
          trimXMm: roundMm(backCellX + grid.bleedMm),
          trimYMm: roundMm(backCellY + grid.bleedMm),
          rotateDeg: backRotateDeg,
          uncalibratedCenterXMm: flipEdge === 'long'
            ? roundMm(grid.paperWMm - (frontCellX + grid.cellWMm / 2.0))
            : roundMm(frontCellX + grid.cellWMm / 2.0),
          frontCenterXMm: roundMm(frontCellX + grid.cellWMm / 2.0)
        });
      }

      var frontTargetX = roundMm(grid.paperWMm / 2.0);
      var frontTargetY = roundMm(Math.max(4.2, grid.originYMm / 2.0));

      frontPages.push({
        sheetNumber: sIdx + 1,
        totalFrontSheets: totalFrontSheets,
        side: 'front',
        flipEdge: flipEdge,
        offsetXMm: 0,
        offsetYMm: 0,
        verticalCutsMm: grid.verticalCutsMm,
        horizontalCutsMm: grid.horizontalCutsMm,
        calibrationCrosshair: { xMm: frontTargetX, yMm: frontTargetY },
        slots: frontSlots
      });

      if (includeBacks) {
        var backVertCuts = grid.verticalCutsMm.map(function (x) {
          var mirroredX = flipEdge === 'long' ? (grid.paperWMm - x) : x;
          return roundMm(mirroredX + offsetXMm);
        }).sort(function (a, b) { return a - b; });

        var backHorizCuts = grid.horizontalCutsMm.map(function (y) {
          var mirroredY = flipEdge === 'short' ? (grid.paperHMm - y) : y;
          return roundMm(mirroredY + offsetYMm);
        }).sort(function (a, b) { return a - b; });

        var backTargetX = roundMm((flipEdge === 'long' ? (grid.paperWMm - frontTargetX) : frontTargetX) + offsetXMm);
        var backTargetY = roundMm((flipEdge === 'short' ? (grid.paperHMm - frontTargetY) : frontTargetY) + offsetYMm);

        backPages.push({
          sheetNumber: sIdx + 1,
          totalFrontSheets: totalFrontSheets,
          side: 'back',
          flipEdge: flipEdge,
          offsetXMm: offsetXMm,
          offsetYMm: offsetYMm,
          verticalCutsMm: backVertCuts,
          horizontalCutsMm: backHorizCuts,
          calibrationCrosshair: { xMm: backTargetX, yMm: backTargetY },
          slots: backSlots
        });
      }
    }

    var ordered = [];
    if (!includeBacks) {
      ordered = frontPages;
    } else if (pageOrder === 'fronts-then-backs') {
      ordered = frontPages.concat(backPages);
    } else {
      for (var p = 0; p < frontPages.length; p++) {
        ordered.push(frontPages[p]);
        if (backPages[p]) ordered.push(backPages[p]);
      }
    }

    for (var idx = 0; idx < ordered.length; idx++) {
      ordered[idx].pageIndex = idx;
      ordered[idx].totalPages = ordered.length;
    }
    return ordered;
  }

  /**
   * 3D Folded A-Frame Paper Standee Sheet Layout (Pro Tabletop Mode)
   * Unfolded strip per standee (top to bottom):
   *   [Glue Tab: glueMm] --valley-- [Back Art: bodyHMm (rotated 180°)] --MOUNTAIN TOP-- [Front Art: bodyHMm] --valley-- [Base Flap: baseMm]
   */
  function computeStandeeLayout(cards, opts) {
    opts = opts || {};
    var paper = PAPERS[opts.paperId] || PAPERS.a4;
    var paperWMm = paper.widthMm;
    var paperHMm = paper.heightMm;

    var sizeKey = opts.sizePreset || 'medium';
    var presets = {
      small: { w: 24, h: 36, base: 14, glue: 9, labelEn: 'Small Goblin/Halfling (24×36mm)' },
      medium: { w: 28, h: 46, base: 16, glue: 10, labelEn: 'Medium 1-Inch Grid Hero (28×46mm)' },
      large: { w: 45, h: 62, base: 20, glue: 12, labelEn: 'Large Boss / Mecha (45×62mm)' }
    };
    var sp = presets[sizeKey] || presets.medium;
    var bodyWMm = clamp(opts.widthMm || sp.w, 18, 80);
    var bodyHMm = clamp(opts.heightMm || sp.h, 25, 100);
    var baseMm = clamp(opts.baseMm || sp.base, 10, 30);
    var glueMm = clamp(opts.glueMm || sp.glue, 7, 20);
    var gapMm = clamp(opts.gapMm !== undefined ? opts.gapMm : 4.0, 0, 12);
    var marginMm = 10.0;

    var stripWMm = bodyWMm;
    var stripHMm = roundMm(glueMm + bodyHMm + bodyHMm + baseMm);

    var cols = Math.max(1, Math.floor((paperWMm - 2 * marginMm + gapMm) / (stripWMm + gapMm)));
    var rows = Math.max(1, Math.floor((paperHMm - 2 * marginMm + gapMm) / (stripHMm + gapMm)));
    var perSheet = cols * rows;

    var gridWMm = roundMm(cols * stripWMm + (cols - 1) * gapMm);
    var gridHMm = roundMm(rows * stripHMm + (rows - 1) * gapMm);
    var originXMm = roundMm((paperWMm - gridWMm) / 2.0);
    var originYMm = roundMm((paperHMm - gridHMm) / 2.0);

    var list = (Array.isArray(cards) && cards.length) ? cards : parseDeckInput(SAMPLE_DECKS.dnd.rawText);
    var totalSheets = Math.max(1, Math.ceil(list.length / perSheet));
    var sheets = [];

    for (var s = 0; s < totalSheets; s++) {
      var chunk = list.slice(s * perSheet, (s + 1) * perSheet);
      var slots = [];
      for (var i = 0; i < chunk.length; i++) {
        var r = Math.floor(i / cols);
        var c = i % cols;
        slots.push({
          slotIndex: i,
          xMm: roundMm(originXMm + c * (stripWMm + gapMm)),
          yMm: roundMm(originYMm + r * (stripHMm + gapMm)),
          card: chunk[i]
        });
      }
      sheets.push({
        sheetNumber: s + 1,
        totalSheets: totalSheets,
        paperWMm: paperWMm,
        paperHMm: paperHMm,
        bodyWMm: bodyWMm,
        bodyHMm: bodyHMm,
        baseMm: baseMm,
        glueMm: glueMm,
        stripWMm: stripWMm,
        stripHMm: stripHMm,
        cols: cols,
        rows: rows,
        perSheet: perSheet,
        slots: slots
      });
    }
    return sheets;
  }

  /**
   * 3D Parametric Deck Tuckbox Die-Line Template Generator (1:1 Physical Millimeter SVG Geometry)
   */
  function computeTuckboxGeometry(opts) {
    opts = opts || {};
    var paper = PAPERS[opts.paperId] || PAPERS.a4;
    var cardWMm = clamp(opts.cardWMm || 63.5, 30, 110);
    var cardHMm = clamp(opts.cardHMm || 88.9, 40, 145);
    var cardCount = clamp(opts.cardCount || 54, 10, 150);
    var gsmThicknessMm = clamp(opts.cardThicknessMm || 0.31, 0.18, 0.55);
    var clearanceMm = clamp(opts.clearanceMm !== undefined ? opts.clearanceMm : 2.2, 1.0, 5.0);

    var W = roundMm(cardWMm + clearanceMm);
    var H = roundMm(cardHMm + clearanceMm);
    var D = roundMm(Math.max(8.0, cardCount * gsmThicknessMm + 1.8));
    var glueTab = roundMm(Math.min(13.0, Math.max(9.0, D * 0.72)));
    var tuckFlap = roundMm(Math.min(20.0, Math.max(13.0, W * 0.26)));
    var bottomFlap = roundMm(Math.min(22.0, Math.max(14.0, W * 0.30)));
    var dustFlap = roundMm(Math.min(H * 0.25, D * 0.82 + 4.0));

    // Unfolded net width & height:
    // Horizontal chain: [GlueTab] + [LeftSpine D] + [Back W] + [RightSpine D] + [Front W]
    var netWMm = roundMm(glueTab + D + W + D + W);
    // Vertical chain: [Top Tuck Flap + Top Lid D] + [Body H] + [Bottom Flap]
    var netHMm = roundMm(tuckFlap + D + H + bottomFlap);

    // Check fit in portrait vs landscape on selected paper (allow 6mm printer safe margin)
    var fitsPortrait = (netWMm <= paper.widthMm - 8) && (netHMm <= paper.heightMm - 8);
    var fitsLandscape = (netWMm <= paper.heightMm - 8) && (netHMm <= paper.widthMm - 8);
    var orientation = 'landscape';
    if (fitsPortrait && !fitsLandscape) {
      orientation = 'portrait';
    } else if (!fitsLandscape && !fitsPortrait) {
      // Pick orientation with smaller overflow ratio
      var ratioP = Math.max(netWMm / (paper.widthMm - 8), netHMm / (paper.heightMm - 8));
      var ratioL = Math.max(netWMm / (paper.heightMm - 8), netHMm / (paper.widthMm - 8));
      orientation = ratioL <= ratioP ? 'landscape' : 'portrait';
    }

    var sheetWMm = orientation === 'landscape' ? paper.heightMm : paper.widthMm;
    var sheetHMm = orientation === 'landscape' ? paper.widthMm : paper.heightMm;
    var fitsSingleSheet = (netWMm <= sheetWMm - 6) && (netHMm <= sheetHMm - 6);

    var ox = roundMm((sheetWMm - netWMm) / 2.0);
    var oy = roundMm((sheetHMm - netHMm) / 2.0);

    var xGlue = ox;
    var xLSpine = roundMm(xGlue + glueTab);
    var xBack = roundMm(xLSpine + D);
    var xRSpine = roundMm(xBack + W);
    var xFront = roundMm(xRSpine + D);
    var xEnd = roundMm(xFront + W);

    var yBodyTop = roundMm(oy + tuckFlap + D);
    var yBodyBot = roundMm(yBodyTop + H);
    var yLidTop = roundMm(yBodyTop - D);
    var yTuckTop = oy;
    var yBotEnd = roundMm(yBodyBot + bottomFlap);

    return {
      paperId: paper.id,
      orientation: orientation,
      sheetWMm: sheetWMm,
      sheetHMm: sheetHMm,
      fitsSingleSheet: fitsSingleSheet,
      cardWMm: cardWMm,
      cardHMm: cardHMm,
      cardCount: cardCount,
      boxWMm: W,
      boxHMm: H,
      boxDMm: D,
      glueTabMm: glueTab,
      tuckFlapMm: tuckFlap,
      bottomFlapMm: bottomFlap,
      dustFlapMm: dustFlap,
      netWMm: netWMm,
      netHMm: netHMm,
      coords: {
        xGlue: xGlue,
        xLSpine: xLSpine,
        xBack: xBack,
        xRSpine: xRSpine,
        xFront: xFront,
        xEnd: xEnd,
        yTuckTop: yTuckTop,
        yLidTop: yLidTop,
        yBodyTop: yBodyTop,
        yBodyBot: yBodyBot,
        yBotEnd: yBotEnd
      },
      title: String(opts.title || 'RELIC DUEL'),
      subtitle: String(opts.subtitle || (cardCount + ' Cards · ' + cardWMm + '×' + cardHMm + 'mm'))
    };
  }

  function escapeXml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderTuckboxSvg(geom, lang) {
    var c = geom.coords;
    var W = geom.boxWMm;
    var H = geom.boxHMm;
    var D = geom.boxDMm;
    var df = geom.dustFlapMm;
    var bevel = Math.min(4.5, geom.glueTabMm * 0.45);
    var thumbR = Math.min(8.5, W * 0.16);
    var isZh = lang === 'zh';

    var svg = [];
    svg.push(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + geom.sheetWMm + ' ' + geom.sheetHMm + '" ' +
      'width="' + geom.sheetWMm + 'mm" height="' + geom.sheetHMm + 'mm" style="display:block;background:#ffffff;">'
    );
    svg.push('<defs>');
    svg.push('<pattern id="glueHatch" width="3" height="3" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">');
    svg.push('<line x1="0" y1="0" x2="0" y2="3" stroke="#cbd5e1" stroke-width="0.6" />');
    svg.push('</pattern>');
    svg.push('</defs>');

    // Glue tab fill hatch
    var gluePoly = [
      c.xLSpine + ',' + c.yBodyTop,
      c.xGlue + ',' + (c.yBodyTop + bevel),
      c.xGlue + ',' + (c.yBodyBot - bevel),
      c.xLSpine + ',' + c.yBodyBot
    ].join(' ');
    svg.push('<polygon points="' + gluePoly + '" fill="url(#glueHatch)" stroke="#0f172a" stroke-width="0.35" />');

    // Main panels background tint
    svg.push('<rect x="' + c.xLSpine + '" y="' + c.yBodyTop + '" width="' + (2 * D + 2 * W) + '" height="' + H + '" fill="#f8fafc" stroke="none" />');

    // Top Dust Flaps on Left Spine & Right Spine
    var lDustTop = [
      c.xLSpine + ',' + c.yBodyTop,
      (c.xLSpine + 1.5) + ',' + (c.yBodyTop - df),
      (c.xBack - 1.5) + ',' + (c.yBodyTop - df),
      c.xBack + ',' + c.yBodyTop
    ].join(' ');
    var rDustTop = [
      c.xRSpine + ',' + c.yBodyTop,
      (c.xRSpine + 1.5) + ',' + (c.yBodyTop - df),
      (c.xFront - 1.5) + ',' + (c.yBodyTop - df),
      c.xFront + ',' + c.yBodyTop
    ].join(' ');
    svg.push('<polygon points="' + lDustTop + '" fill="#ffffff" stroke="#0f172a" stroke-width="0.35" />');
    svg.push('<polygon points="' + rDustTop + '" fill="#ffffff" stroke="#0f172a" stroke-width="0.35" />');

    // Bottom Dust Flaps on Left Spine & Right Spine
    var lDustBot = [
      c.xLSpine + ',' + c.yBodyBot,
      (c.xLSpine + 1.5) + ',' + (c.yBodyBot + df),
      (c.xBack - 1.5) + ',' + (c.yBodyBot + df),
      c.xBack + ',' + c.yBodyBot
    ].join(' ');
    var rDustBot = [
      c.xRSpine + ',' + c.yBodyBot,
      (c.xRSpine + 1.5) + ',' + (c.yBodyBot + df),
      (c.xFront - 1.5) + ',' + (c.yBodyBot + df),
      c.xFront + ',' + c.yBodyBot
    ].join(' ');
    svg.push('<polygon points="' + lDustBot + '" fill="#ffffff" stroke="#0f172a" stroke-width="0.35" />');
    svg.push('<polygon points="' + rDustBot + '" fill="#ffffff" stroke="#0f172a" stroke-width="0.35" />');

    // Top Lid + Curved Tuck Flap above Back Panel
    var rCurve = Math.min(7.0, geom.tuckFlapMm * 0.55);
    var topLidPath = [
      'M', c.xBack, c.yBodyTop,
      'L', c.xBack, c.yLidTop,
      'L', (c.xBack + 1.2), (c.yTuckTop + rCurve),
      'Q', (c.xBack + 1.2), c.yTuckTop, (c.xBack + 1.2 + rCurve), c.yTuckTop,
      'L', (c.xRSpine - 1.2 - rCurve), c.yTuckTop,
      'Q', (c.xRSpine - 1.2), c.yTuckTop, (c.xRSpine - 1.2), (c.yTuckTop + rCurve),
      'L', c.xRSpine, c.yLidTop,
      'L', c.xRSpine, c.yBodyTop
    ].join(' ');
    svg.push('<path d="' + topLidPath + '" fill="#ffffff" stroke="#0f172a" stroke-width="0.38" />');

    // Bottom Base Flaps under Back & Front Panels
    var botBackPoly = [
      c.xBack + ',' + c.yBodyBot,
      (c.xBack + 1.5) + ',' + c.yBotEnd,
      (c.xRSpine - 1.5) + ',' + c.yBotEnd,
      c.xRSpine + ',' + c.yBodyBot
    ].join(' ');
    var botFrontPoly = [
      c.xFront + ',' + c.yBodyBot,
      (c.xFront + 1.5) + ',' + (c.yBodyBot + D + 8),
      (c.xEnd - 1.5) + ',' + (c.yBodyBot + D + 8),
      c.xEnd + ',' + c.yBodyBot
    ].join(' ');
    svg.push('<polygon points="' + botBackPoly + '" fill="#ffffff" stroke="#0f172a" stroke-width="0.35" />');
    svg.push('<polygon points="' + botFrontPoly + '" fill="#ffffff" stroke="#0f172a" stroke-width="0.35" />');

    // Front Panel top edge with semicircular Thumb Notch Cutout!
    var frontCenterX = roundMm(c.xFront + W / 2.0);
    var frontOutlinePath = [
      'M', c.xLSpine, c.yBodyTop,
      'L', c.xLSpine, c.yBodyBot,
      'M', c.xFront, c.yBodyTop,
      'L', (frontCenterX - thumbR), c.yBodyTop,
      'A', thumbR, thumbR, '0 0 0', (frontCenterX + thumbR), c.yBodyTop,
      'L', c.xEnd, c.yBodyTop,
      'L', c.xEnd, c.yBodyBot
    ].join(' ');
    svg.push('<path d="' + frontOutlinePath + '" fill="none" stroke="#0f172a" stroke-width="0.4" />');

    // Dashed Valley Fold Lines (#2563eb)
    var foldLines = [
      [c.xLSpine, c.yBodyTop, c.xLSpine, c.yBodyBot],
      [c.xBack, c.yBodyTop, c.xBack, c.yBodyBot],
      [c.xRSpine, c.yBodyTop, c.xRSpine, c.yBodyBot],
      [c.xFront, c.yBodyTop, c.xFront, c.yBodyBot],
      [c.xLSpine, c.yBodyTop, c.xFront, c.yBodyTop],
      [c.xLSpine, c.yBodyBot, c.xEnd, c.yBodyBot],
      [c.xBack, c.yLidTop, c.xRSpine, c.yLidTop],
      [c.xFront, c.yBodyBot + D, c.xEnd, c.yBodyBot + D]
    ];
    for (var f = 0; f < foldLines.length; f++) {
      var fl = foldLines[f];
      svg.push(
        '<line x1="' + fl[0] + '" y1="' + fl[1] + '" x2="' + fl[2] + '" y2="' + fl[3] + '" ' +
        'stroke="#2563eb" stroke-width="0.3" stroke-dasharray="1.8,1.4" />'
      );
    }

    // Front Artwork Frame & Title
    var framePad = 4.0;
    svg.push(
      '<rect x="' + (c.xFront + framePad) + '" y="' + (c.yBodyTop + thumbR + 3) + '" ' +
      'width="' + Math.max(10, W - 2 * framePad) + '" height="' + Math.max(12, H - thumbR - 3 - framePad) + '" ' +
      'rx="2" fill="#ffffff" stroke="#334155" stroke-width="0.35" />'
    );
    svg.push(
      '<text x="' + frontCenterX + '" y="' + roundMm(c.yBodyTop + H * 0.48) + '" ' +
      'font-family="system-ui,-apple-system,sans-serif" font-size="' + Math.min(7.2, W * 0.11) + '" font-weight="800" fill="#0f172a" text-anchor="middle">' +
      escapeXml(geom.title) + '</text>'
    );
    svg.push(
      '<text x="' + frontCenterX + '" y="' + roundMm(c.yBodyTop + H * 0.57) + '" ' +
      'font-family="system-ui,-apple-system,sans-serif" font-size="3.3" font-weight="500" fill="#475569" text-anchor="middle">' +
      escapeXml(geom.subtitle) + '</text>'
    );

    // Back Panel Subtle Emblem
    var backCenterX = roundMm(c.xBack + W / 2.0);
    svg.push(
      '<rect x="' + (c.xBack + framePad) + '" y="' + (c.yBodyTop + framePad) + '" ' +
      'width="' + Math.max(10, W - 2 * framePad) + '" height="' + Math.max(12, H - 2 * framePad) + '" ' +
      'rx="2" fill="none" stroke="#cbd5e1" stroke-width="0.3" />'
    );
    svg.push(
      '<text x="' + backCenterX + '" y="' + roundMm(c.yBodyTop + H * 0.52) + '" ' +
      'font-family="system-ui,-apple-system,sans-serif" font-size="3.4" font-weight="600" fill="#64748b" text-anchor="middle">' +
      escapeXml(geom.title) + ' · ' + geom.boxWMm + '×' + geom.boxHMm + '×' + geom.boxDMm + 'mm</text>'
    );

    // Spine Labels (rotated 90 deg)
    var lSpineCx = roundMm(c.xLSpine + D / 2.0);
    var rSpineCx = roundMm(c.xRSpine + D / 2.0);
    var spineCy = roundMm(c.yBodyTop + H / 2.0);
    var spineFont = Math.min(4.2, D * 0.34);
    svg.push(
      '<text x="' + lSpineCx + '" y="' + spineCy + '" transform="rotate(-90 ' + lSpineCx + ' ' + spineCy + ')" ' +
      'font-family="system-ui,-apple-system,sans-serif" font-size="' + spineFont + '" font-weight="700" fill="#1e293b" text-anchor="middle" dominant-baseline="central">' +
      escapeXml(geom.title) + '</text>'
    );
    svg.push(
      '<text x="' + rSpineCx + '" y="' + spineCy + '" transform="rotate(90 ' + rSpineCx + ' ' + spineCy + ')" ' +
      'font-family="system-ui,-apple-system,sans-serif" font-size="' + spineFont + '" font-weight="700" fill="#1e293b" text-anchor="middle" dominant-baseline="central">' +
      escapeXml(geom.title) + '</text>'
    );

    // Calibration 50mm Scale Bar in bottom-left margin so user can verify 100% Actual Size printing!
    var barX = 8;
    var barY = geom.sheetHMm - 6;
    svg.push('<line x1="' + barX + '" y1="' + barY + '" x2="' + (barX + 50) + '" y2="' + barY + '" stroke="#0f172a" stroke-width="0.4" />');
    svg.push('<line x1="' + barX + '" y1="' + (barY - 1.8) + '" x2="' + barX + '" y2="' + (barY + 1.8) + '" stroke="#0f172a" stroke-width="0.4" />');
    svg.push('<line x1="' + (barX + 50) + '" y1="' + (barY - 1.8) + '" x2="' + (barX + 50) + '" y2="' + (barY + 1.8) + '" stroke="#0f172a" stroke-width="0.4" />');
    svg.push(
      '<text x="' + (barX + 25) + '" y="' + (barY - 2) + '" font-family="system-ui,-apple-system,sans-serif" font-size="2.6" fill="#475569" text-anchor="middle">' +
      (isZh ? '1:1 比例尺核验：此线段打印后应精确为 50.0 mm（请选 100% 实际大小打印）' : '1:1 Scale Check: Measure exactly 50.0 mm (Print at 100% Actual Size) · Solid=Cut, Dashed=Fold') +
      '</text>'
    );

    svg.push('</svg>');
    return svg.join('');
  }

  // =========================================================================
  // Playtest Deck Revision Comparator & Duplex Delta Reprinter (#72)
  // Compares Last Printed vs Next deck by stable card ID, front/back PNG/content
  // fingerprints, and physical copy counts — flagging missing/duplicate IDs.
  // =========================================================================
  var CRC32_TABLE = (function () {
    var tbl = new Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      tbl[n] = c >>> 0;
    }
    return tbl;
  })();

  function padHex8(u32) {
    var h = (u32 >>> 0).toString(16);
    while (h.length < 8) h = '0' + h;
    return h;
  }

  /**
   * Exact byte-level fingerprint (IEEE CRC32 + Adler32 + byte length) for local PNG/art comparison.
   */
  function fingerprintBytesHex(inputBytes) {
    var bytes = inputBytes instanceof Uint8Array ? inputBytes : new Uint8Array(inputBytes || []);
    var crc = 0xffffffff;
    var s1 = 1;
    var s2 = 0;
    for (var i = 0; i < bytes.length; i++) {
      var b = bytes[i] & 0xff;
      crc = CRC32_TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8);
      s1 = (s1 + b) % 65521;
      s2 = (s2 + s1) % 65521;
    }
    var crcFinal = (crc ^ 0xffffffff) >>> 0;
    var adlerFinal = ((s2 << 16) | s1) >>> 0;
    return padHex8(crcFinal) + '-' + padHex8(adlerFinal) + '-' + bytes.length;
  }

  function fingerprintStringHex(str) {
    var s = String(str == null ? '' : str);
    var utf8 = [];
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c < 0x80) utf8.push(c);
      else if (c < 0x800) utf8.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
      else utf8.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    }
    return fingerprintBytesHex(new Uint8Array(utf8));
  }

  function normalizeStableCardId(rawId) {
    return String(rawId == null ? '' : rawId).trim().toLowerCase();
  }

  function normalizeAssetLookupKey(fileName) {
    var base = String(fileName == null ? '' : fileName).trim().replace(/^.*[/\\]/, '');
    return base.toLowerCase();
  }

  var SAMPLE_PLAYTEST_REVISIONS = {
    lastPrintedCsv: [
      'id,name,front,back,copies,tag,icon',
      'lantern,Wayfinder Lantern,"Reveal top 2 tiles; place 1.",Tier I Light · Day Back,2,Relic · 1,🏮',
      'map,Surveyor Map,"Move up to 2 spaces ignoring bog.",Expedition Standard Back,3,Gear · 1,🗺️',
      'compass,Astral Compass,"orient: Peek 1 hazard deck card.",Expedition Standard Back,2,Tool · 1,🧭',
      'flare,Sunflare Vial,"Deal 2 DMG to adjacent shade.",Alchemical Standard Back,1,Consumable · 1,🧪',
      'anchor,Rusted Anchor,"Prevent forced push this round.",Expedition Standard Back,1,Heavy · 2,⚓'
    ].join('\n'),
    nextCsv: [
      'id,name,front,back,copies,tag,icon',
      'compass,Astral Compass,"orient: Peek 1 hazard deck card.",Expedition Standard Back,2,Tool · 1,🧭',
      'lantern,Wayfinder Lantern,"Reveal top 2 tiles; place 1.",Tier II Cursed · Eclipse Back (CHANGED!),2,Relic · 1,🏮',
      'map,Surveyor Map,"Move up to 2 spaces ignoring bog.",Expedition Standard Back,1,Gear · 1,🗺️',
      'flare,Sunflare Vial,"Deal 3 DMG + Reveal 1 shade. (BUFFED)",Alchemical Standard Back,2,Consumable · 1,🧪',
      'grapnel,Skyhook Grapnel,"Leap across 1 chasm space.",Expedition Standard Back,1,New Gear · 2,🪝'
    ].join('\n'),
    ambiguousNextCsv: [
      'id,name,front,back,copies,tag,icon',
      'lantern,Wayfinder Lantern v2A,"Reveal top 2 tiles.",Tier II Eclipse Back,1,Relic,🏮',
      'lantern,Wayfinder Lantern v2B,"Reveal top 3 tiles.",Tier II Eclipse Back,1,Relic,🏮',
      ',Mystery Unnamed Slip,"Gain 1 coin.",Expedition Standard Back,1,Draft,❓'
    ].join('\n')
  };

  /**
   * Parses a revision manifest (CSV / TSV / Pipe / JSON / Array of objects) with strict ID & copy checks.
   * Never guesses missing IDs from row index or card name, and never merges duplicate IDs.
   */
  function parseRevisionManifest(rawInput, opts) {
    opts = opts || {};
    var deckLabel = String(opts.deckLabel || 'deck');
    var imageMap = opts.imageMap || null;
    var strictFiles = Boolean(opts.strictFiles);
    var errors = [];
    var rawRecords = [];

    if (Array.isArray(rawInput)) {
      for (var a = 0; a < rawInput.length; a++) {
        var o = rawInput[a] || {};
        rawRecords.push({
          rowNumber: a + 1,
          id: o.id !== undefined ? o.id : o.cardId,
          name: o.name || o.title || o.front || '',
          front: o.front || '',
          back: o.back || '',
          frontFile: o.frontFile || o.front_file || '',
          backFile: o.backFile || o.back_file || '',
          frontHash: o.frontHash || o.front_hash || '',
          backHash: o.backHash || o.back_hash || '',
          frontImg: o.frontImg || null,
          backImg: o.backImg || null,
          frontImgEl: o.frontImgEl || null,
          backImgEl: o.backImgEl || null,
          copiesRaw: o.copies !== undefined ? o.copies : 1,
          tag: o.tag || '',
          icon: o.icon || ''
        });
      }
    } else {
      var trimmed = String(rawInput == null ? '' : rawInput).trim();
      if (!trimmed) {
        return { ok: true, records: [], byId: {}, order: [], errors: [] };
      }
      if (trimmed[0] === '[' || trimmed[0] === '{') {
        try {
          var parsedJson = JSON.parse(trimmed);
          var arr = Array.isArray(parsedJson) ? parsedJson : (parsedJson && Array.isArray(parsedJson.cards) ? parsedJson.cards : null);
          if (!arr) {
            return {
              ok: false,
              records: [],
              byId: {},
              order: [],
              errors: [{ code: 'INVALID_MANIFEST', deck: deckLabel, rowNumber: 1, message: deckLabel + ': JSON manifest must be an array or { cards: [...] }.' }]
            };
          }
          return parseRevisionManifest(arr, opts);
        } catch (_je) {
          return {
            ok: false,
            records: [],
            byId: {},
            order: [],
            errors: [{ code: 'INVALID_JSON', deck: deckLabel, rowNumber: 1, message: deckLabel + ': Invalid JSON syntax.' }]
          };
        }
      }

      var nonCommentLines = trimmed.split(/\r?\n/).filter(function (l) {
        var t = l.trim();
        return t.length > 0 && t[0] !== '#';
      });
      if (!nonCommentLines.length) {
        return { ok: true, records: [], byId: {}, order: [], errors: [] };
      }
      var first = nonCommentLines[0];
      var delim = first.indexOf('|') !== -1 ? '|' : (first.indexOf('\t') !== -1 ? '\t' : ',');
      var rows = delim === '|'
        ? nonCommentLines.map(function (ln) { return ln.split('|').map(function (c) { return c.trim(); }); })
        : parseDelimitedRows(nonCommentLines.join('\n'), delim);

      var hdrTokens = rows[0].map(function (h) { return String(h || '').toLowerCase().replace(/[^a-z0-9]/g, ''); });
      var hasHeader = hdrTokens.indexOf('id') !== -1 || hdrTokens.indexOf('cardid') !== -1 || hdrTokens.indexOf('copies') !== -1 || hdrTokens.indexOf('frontfile') !== -1;

      if (!hasHeader) {
        errors.push({
          code: 'MISSING_ID_COLUMN',
          deck: deckLabel,
          rowNumber: 1,
          message: deckLabel + ': Manifest header must include a stable "id" (or "card_id") column so card identities are never guessed.'
        });
        return { ok: false, records: [], byId: {}, order: [], errors: errors };
      }

      function findCol(names) {
        for (var n = 0; n < names.length; n++) {
          var p = hdrTokens.indexOf(names[n]);
          if (p !== -1) return p;
        }
        return -1;
      }

      var cId = findCol(['id', 'cardid', 'slug', 'uid']);
      var cName = findCol(['name', 'title', 'cardname']);
      var cFront = findCol(['front', 'fronttext', 'face', 'effect']);
      var cBack = findCol(['back', 'backtext', 'reverse']);
      var cFrontFile = findCol(['frontfile', 'frontpng', 'frontimage', 'frontart']);
      var cBackFile = findCol(['backfile', 'backpng', 'backimage', 'backart']);
      var cFrontHash = findCol(['fronthash', 'frontsha', 'frontcrc']);
      var cBackHash = findCol(['backhash', 'backsha', 'backcrc']);
      var cCopies = findCol(['copies', 'qty', 'count', 'quantity']);
      var cTag = findCol(['tag', 'type', 'category']);
      var cIcon = findCol(['icon', 'emoji']);

      if (cId === -1) {
        errors.push({
          code: 'MISSING_ID_COLUMN',
          deck: deckLabel,
          rowNumber: 1,
          message: deckLabel + ': Missing required "id" column in header.'
        });
        return { ok: false, records: [], byId: {}, order: [], errors: errors };
      }

      for (var r = 1; r < rows.length; r++) {
        var cells = rows[r];
        rawRecords.push({
          rowNumber: r + 1,
          id: cells[cId] !== undefined ? cells[cId] : '',
          name: cName >= 0 ? (cells[cName] || '') : '',
          front: cFront >= 0 ? (cells[cFront] || '') : '',
          back: cBack >= 0 ? (cells[cBack] || '') : '',
          frontFile: cFrontFile >= 0 ? (cells[cFrontFile] || '') : '',
          backFile: cBackFile >= 0 ? (cells[cBackFile] || '') : '',
          frontHash: cFrontHash >= 0 ? (cells[cFrontHash] || '') : '',
          backHash: cBackHash >= 0 ? (cells[cBackHash] || '') : '',
          copiesRaw: cCopies >= 0 && cells[cCopies] !== '' && cells[cCopies] !== undefined ? cells[cCopies] : '1',
          tag: cTag >= 0 ? (cells[cTag] || '') : '',
          icon: cIcon >= 0 ? (cells[cIcon] || '') : ''
        });
      }
    }

    var byId = {};
    var firstSeenRow = {};
    var order = [];
    var normalizedList = [];

    for (var i = 0; i < rawRecords.length; i++) {
      var rec = rawRecords[i];
      var rawIdStr = String(rec.id == null ? '' : rec.id).trim();
      var normId = normalizeStableCardId(rawIdStr);
      if (!normId) {
        errors.push({
          code: 'MISSING_CARD_ID',
          deck: deckLabel,
          rowNumber: rec.rowNumber,
          message: deckLabel + ' row ' + rec.rowNumber + ': Missing card ID (refusing to guess physical card match).'
        });
        continue;
      }

      if (byId[normId]) {
        errors.push({
          code: 'DUPLICATE_CARD_ID',
          deck: deckLabel,
          id: normId,
          rowNumbers: [firstSeenRow[normId], rec.rowNumber],
          message: deckLabel + ': Duplicate card ID "' + rawIdStr + '" on rows ' + firstSeenRow[normId] + ' and ' + rec.rowNumber + '.'
        });
        continue;
      }

      var copiesStr = String(rec.copiesRaw == null ? '1' : rec.copiesRaw).trim();
      var copiesNum = Number(copiesStr);
      if (copiesStr === '' || isNaN(copiesNum) || copiesNum < 0 || Math.floor(copiesNum) !== copiesNum || copiesNum > 200) {
        errors.push({
          code: 'INVALID_COPY_COUNT',
          deck: deckLabel,
          id: normId,
          rowNumber: rec.rowNumber,
          message: deckLabel + ' "' + rawIdStr + '" (row ' + rec.rowNumber + '): Invalid copy count "' + copiesStr + '".'
        });
        continue;
      }

      var fAsset = null;
      var bAsset = null;
      if (rec.frontFile && imageMap) {
        fAsset = imageMap[normalizeAssetLookupKey(rec.frontFile)] || null;
        if (!fAsset && strictFiles) {
          errors.push({
            code: 'MISSING_IMAGE_FILE',
            deck: deckLabel,
            id: normId,
            fileName: rec.frontFile,
            message: deckLabel + ' "' + rawIdStr + '": Front PNG "' + rec.frontFile + '" was not found in loaded folder.'
          });
        }
      }
      if (rec.backFile && imageMap) {
        bAsset = imageMap[normalizeAssetLookupKey(rec.backFile)] || null;
        if (!bAsset && strictFiles) {
          errors.push({
            code: 'MISSING_IMAGE_FILE',
            deck: deckLabel,
            id: normId,
            fileName: rec.backFile,
            message: deckLabel + ' "' + rawIdStr + '": Back PNG "' + rec.backFile + '" was not found in loaded folder.'
          });
        }
      }

      var frontSig = rec.frontHash
        ? ('hash:' + String(rec.frontHash).trim())
        : (fAsset && fAsset.fingerprint
          ? ('img:' + fAsset.fingerprint)
          : ('txt:' + fingerprintStringHex((rec.name || '') + '||' + (rec.front || '') + '||' + (rec.frontFile || '') + '||' + (rec.tag || '') + '||' + (rec.icon || ''))));

      var backSig = rec.backHash
        ? ('hash:' + String(rec.backHash).trim())
        : (bAsset && bAsset.fingerprint
          ? ('img:' + bAsset.fingerprint)
          : ('txt:' + fingerprintStringHex((rec.back || '') + '||' + (rec.backFile || ''))));

      var cleanRec = {
        id: normId,
        displayId: rawIdStr,
        name: String(rec.name || rec.front || rawIdStr).trim(),
        front: String(rec.front || rec.name || rawIdStr).trim(),
        back: String(rec.back || '').trim(),
        frontFile: String(rec.frontFile || '').trim(),
        backFile: String(rec.backFile || '').trim(),
        frontSig: frontSig,
        backSig: backSig,
        frontImg: (fAsset && fAsset.dataUrl) || rec.frontImg || null,
        backImg: (bAsset && bAsset.dataUrl) || rec.backImg || null,
        frontImgEl: (fAsset && fAsset.imgEl) || rec.frontImgEl || null,
        backImgEl: (bAsset && bAsset.imgEl) || rec.backImgEl || null,
        copies: copiesNum,
        tag: String(rec.tag || '').trim(),
        icon: String(rec.icon || '').trim(),
        rowNumber: rec.rowNumber
      };

      byId[normId] = cleanRec;
      firstSeenRow[normId] = rec.rowNumber;
      order.push(normId);
      normalizedList.push(cleanRec);
    }

    return {
      ok: errors.length === 0,
      records: normalizedList,
      byId: byId,
      order: order,
      errors: errors
    };
  }

  /**
   * Compares Last Printed and Next deck revisions:
   * - Back-only change on 2 copies (Lantern): pull 2 old copies + print 2 matched front/back pairs.
   * - Copy reduction 3 -> 1 with no art change (Map): pull 2 copies + print 0.
   * - Row reorder with no art/copy change: pull 0 + print 0.
   * - Duplicate or missing IDs: status = 'AMBIGUOUS_IDS', refuses to guess.
   */
  function comparePlaytestDecks(lastPrintedInput, nextInput, opts) {
    opts = opts || {};
    var lastParsed = parseRevisionManifest(lastPrintedInput, {
      deckLabel: 'Last Printed',
      imageMap: opts.lastImageMap || null,
      strictFiles: Boolean(opts.strictFiles)
    });
    var nextParsed = parseRevisionManifest(nextInput, {
      deckLabel: 'Next Revision',
      imageMap: opts.nextImageMap || null,
      strictFiles: Boolean(opts.strictFiles)
    });

    var allErrors = lastParsed.errors.concat(nextParsed.errors);
    if (allErrors.length > 0) {
      return {
        status: 'AMBIGUOUS_IDS',
        canPrint: false,
        errors: allErrors,
        pullList: [],
        printItems: [],
        printCards: [],
        unchangedItems: [],
        totalOldCopies: 0,
        totalNewCopies: 0,
        totalToPull: 0,
        totalKeepInSleeves: 0,
        totalToPrint: 0
      };
    }

    var seenIds = {};
    var unionIds = [];
    var i;
    for (i = 0; i < nextParsed.order.length; i++) {
      if (!seenIds[nextParsed.order[i]]) {
        seenIds[nextParsed.order[i]] = true;
        unionIds.push(nextParsed.order[i]);
      }
    }
    for (i = 0; i < lastParsed.order.length; i++) {
      if (!seenIds[lastParsed.order[i]]) {
        seenIds[lastParsed.order[i]] = true;
        unionIds.push(lastParsed.order[i]);
      }
    }

    var pullList = [];
    var printItems = [];
    var printCards = [];
    var unchangedItems = [];
    var totalOldCopies = 0;
    var totalNewCopies = 0;
    var totalToPull = 0;
    var totalKeepInSleeves = 0;
    var totalToPrint = 0;

    for (var u = 0; u < unionIds.length; u++) {
      var cid = unionIds[u];
      var oldC = lastParsed.byId[cid] || null;
      var newC = nextParsed.byId[cid] || null;
      var oldQty = oldC ? oldC.copies : 0;
      var newQty = newC ? newC.copies : 0;
      totalOldCopies += oldQty;
      totalNewCopies += newQty;

      if (oldQty === 0 && newQty === 0) continue;

      // Case 1: Removed completely
      if (oldQty > 0 && newQty === 0) {
        pullList.push({
          id: cid,
          displayId: oldC.displayId,
          name: oldC.name,
          oldCopies: oldQty,
          newCopies: 0,
          pullCount: oldQty,
          keepInSleeves: 0,
          printCount: 0,
          reason: 'CARD_REMOVED',
          detail: 'Removed in Next revision — pull all ' + oldQty + ' physical copy/copies from sleeves.'
        });
        totalToPull += oldQty;
        continue;
      }

      // Case 2: Brand-new card
      if (oldQty === 0 && newQty > 0) {
        printItems.push({
          id: cid,
          displayId: newC.displayId,
          name: newC.name,
          oldCopies: 0,
          newCopies: newQty,
          pullCount: 0,
          printCount: newQty,
          reason: 'NEW_CARD',
          detail: 'New card — print ' + newQty + ' matched front/back pair(s).'
        });
        for (var nq = 0; nq < newQty; nq++) {
          printCards.push({
            id: cid + '-copy-' + (nq + 1),
            cardId: newC.displayId,
            index: printCards.length,
            front: newC.front || newC.name,
            back: newC.back,
            tag: (newC.tag ? newC.tag + ' · ' : '') + '[' + newC.displayId + ' NEW]',
            icon: newC.icon,
            frontImg: newC.frontImg,
            backImg: newC.backImg,
            frontImgEl: newC.frontImgEl,
            backImgEl: newC.backImgEl,
            deltaReason: 'NEW_CARD'
          });
        }
        totalToPrint += newQty;
        continue;
      }

      // Case 3: Present in both Last Printed and Next
      var frontChanged = oldC.frontSig !== newC.frontSig;
      var backChanged = oldC.backSig !== newC.backSig;

      if (frontChanged || backChanged) {
        var changeReason = (frontChanged && backChanged)
          ? 'BOTH_SIDES_CHANGED'
          : (backChanged ? 'BACK_ONLY_CHANGED' : 'FRONT_CHANGED');
        var reasonHuman = changeReason === 'BACK_ONLY_CHANGED'
          ? 'Back changed (front unchanged) — pull all ' + oldQty + ' sleeved copy/copies & print ' + newQty + ' matched front/back pair(s).'
          : (changeReason === 'FRONT_CHANGED'
            ? 'Front changed — pull all ' + oldQty + ' old copy/copies & print ' + newQty + ' matched front/back pair(s).'
            : 'Both front & back changed — pull all ' + oldQty + ' old copy/copies & print ' + newQty + ' matched front/back pair(s).');

        pullList.push({
          id: cid,
          displayId: newC.displayId,
          name: newC.name,
          oldCopies: oldQty,
          newCopies: newQty,
          pullCount: oldQty,
          keepInSleeves: 0,
          printCount: newQty,
          reason: changeReason,
          detail: reasonHuman
        });
        printItems.push({
          id: cid,
          displayId: newC.displayId,
          name: newC.name,
          oldCopies: oldQty,
          newCopies: newQty,
          pullCount: oldQty,
          printCount: newQty,
          reason: changeReason,
          detail: reasonHuman
        });
        for (var cq = 0; cq < newQty; cq++) {
          printCards.push({
            id: cid + '-copy-' + (cq + 1),
            cardId: newC.displayId,
            index: printCards.length,
            front: newC.front || newC.name,
            back: newC.back,
            tag: (newC.tag ? newC.tag + ' · ' : '') + '[' + newC.displayId + ']',
            icon: newC.icon,
            frontImg: newC.frontImg,
            backImg: newC.backImg,
            frontImgEl: newC.frontImgEl,
            backImgEl: newC.backImgEl,
            deltaReason: changeReason
          });
        }
        totalToPull += oldQty;
        totalToPrint += newQty;
      } else {
        // Neither front nor back changed! Check physical copy delta:
        if (newQty < oldQty) {
          var pullDiff = oldQty - newQty;
          pullList.push({
            id: cid,
            displayId: newC.displayId,
            name: newC.name,
            oldCopies: oldQty,
            newCopies: newQty,
            pullCount: pullDiff,
            keepInSleeves: newQty,
            printCount: 0,
            reason: 'COPIES_REDUCED',
            detail: 'Copies reduced ' + oldQty + ' → ' + newQty + ' (no art change) — pull ' + pullDiff + ', keep ' + newQty + ' in sleeves, print NONE.'
          });
          totalToPull += pullDiff;
          totalKeepInSleeves += newQty;
        } else if (newQty > oldQty) {
          var addDiff = newQty - oldQty;
          printItems.push({
            id: cid,
            displayId: newC.displayId,
            name: newC.name,
            oldCopies: oldQty,
            newCopies: newQty,
            pullCount: 0,
            printCount: addDiff,
            reason: 'COPIES_ADDED',
            detail: 'Copies increased ' + oldQty + ' → ' + newQty + ' (no art change) — keep ' + oldQty + ' in sleeves, print ' + addDiff + ' extra pair(s).'
          });
          for (var aq = 0; aq < addDiff; aq++) {
            printCards.push({
              id: cid + '-add-' + (aq + 1),
              cardId: newC.displayId,
              index: printCards.length,
              front: newC.front || newC.name,
              back: newC.back,
              tag: (newC.tag ? newC.tag + ' · ' : '') + '[' + newC.displayId + ' +' + addDiff + ']',
              icon: newC.icon,
              frontImg: newC.frontImg,
              backImg: newC.backImg,
              frontImgEl: newC.frontImgEl,
              backImgEl: newC.backImgEl,
              deltaReason: 'COPIES_ADDED'
            });
          }
          totalKeepInSleeves += oldQty;
          totalToPrint += addDiff;
        } else {
          unchangedItems.push({
            id: cid,
            displayId: newC.displayId,
            name: newC.name,
            copies: newQty
          });
          totalKeepInSleeves += newQty;
        }
      }
    }

    return {
      status: 'READY',
      canPrint: printCards.length > 0,
      errors: [],
      pullList: pullList,
      printItems: printItems,
      printCards: printCards,
      unchangedItems: unchangedItems,
      totalOldCopies: totalOldCopies,
      totalNewCopies: totalNewCopies,
      totalToPull: totalToPull,
      totalKeepInSleeves: totalKeepInSleeves,
      totalToPrint: totalToPrint,
      copiesSavedVsFullReprint: Math.max(0, totalNewCopies - totalToPrint)
    };
  }

  function exportPullListTxt(delta) {
    if (!delta || delta.status !== 'READY') {
      throw new Error('Cannot export pull list while manifest has ambiguous or missing IDs.');
    }
    var lines = [
      '=== CRAFTLEAF PLAYTEST SLEEVE PULL & REPLACEMENT CHECKLIST ===',
      'Last Printed Copies: ' + delta.totalOldCopies + '  |  Next Deck Copies: ' + delta.totalNewCopies,
      'Physical Cards to PULL from Sleeves: ' + delta.totalToPull,
      'Untouched Cards Kept in Sleeves: ' + delta.totalKeepInSleeves,
      'Matched Front/Back Pairs to PRINT: ' + delta.totalToPrint + ' (Saved cutting ' + delta.copiesSavedVsFullReprint + ' unchanged cards!)',
      '',
      'STEP 1 — PULL THESE PHYSICAL CARDS FROM YOUR SLEEVED DECK:'
    ];
    if (!delta.pullList.length) {
      lines.push('  (None — keep all existing sleeved cards!)');
    } else {
      for (var i = 0; i < delta.pullList.length; i++) {
        var p = delta.pullList[i];
        lines.push('  [ ] PULL ' + p.pullCount + 'x  [' + p.displayId + '] ' + p.name + '  —  ' + p.detail);
      }
    }
    lines.push('');
    lines.push('STEP 2 — PRINT & SLEEVE THESE REPLACEMENT / NEW DUPLEX PAIRS:');
    if (!delta.printItems.length) {
      lines.push('  (None — zero cards need reprinting!)');
    } else {
      for (var j = 0; j < delta.printItems.length; j++) {
        var pr = delta.printItems[j];
        lines.push('  [ ] PRINT ' + pr.printCount + 'x  [' + pr.displayId + '] ' + pr.name + '  (' + pr.reason + ')');
      }
    }
    return lines.join('\r\n');
  }

  root.CardSheetCore = {
    MM_PER_INCH: MM_PER_INCH,
    DPI_EXPORT: DPI_EXPORT,
    PX_PER_MM_300: PX_PER_MM_300,
    PAPERS: PAPERS,
    PRESETS: PRESETS,
    SAMPLE_DECKS: SAMPLE_DECKS,
    roundMm: roundMm,
    clamp: clamp,
    resolveDeepLinkPreset: resolveDeepLinkPreset,
    parseDelimitedRows: parseDelimitedRows,
    parseDeckInput: parseDeckInput,
    computeSheetGrid: computeSheetGrid,
    computePaginatedSheets: computePaginatedSheets,
    computeStandeeLayout: computeStandeeLayout,
    computeTuckboxGeometry: computeTuckboxGeometry,
    renderTuckboxSvg: renderTuckboxSvg,
    fingerprintBytesHex: fingerprintBytesHex,
    fingerprintStringHex: fingerprintStringHex,
    SAMPLE_PLAYTEST_REVISIONS: SAMPLE_PLAYTEST_REVISIONS,
    parseRevisionManifest: parseRevisionManifest,
    comparePlaytestDecks: comparePlaytestDecks,
    exportPullListTxt: exportPullListTxt
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.CardSheetCore;
  }
})(typeof window !== 'undefined' ? window : globalThis);
