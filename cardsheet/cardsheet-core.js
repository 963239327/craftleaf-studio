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
    renderTuckboxSvg: renderTuckboxSvg
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.CardSheetCore;
  }
})(typeof window !== 'undefined' ? window : globalThis);
