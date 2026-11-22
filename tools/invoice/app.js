/**
 * CraftLeaf No-Signup Freelancer Invoice, Quote & Receipt PDF Studio
 * 100% Client-Side Offline Builder + IndexedDB/localStorage CRM + Pure-JS ISO 18004 QR SVG
 */
(function (root) {
  'use strict';

  var CURRENCIES = {
    USD: { code: 'USD', symbol: '$', decimals: 2, label: 'USD ($)' },
    EUR: { code: 'EUR', symbol: '€', decimals: 2, label: 'EUR (€)' },
    GBP: { code: 'GBP', symbol: '£', decimals: 2, label: 'GBP (£)' },
    CAD: { code: 'CAD', symbol: 'CA$', decimals: 2, label: 'CAD (CA$)' },
    AUD: { code: 'AUD', symbol: 'A$', decimals: 2, label: 'AUD (A$)' },
    JPY: { code: 'JPY', symbol: '¥', decimals: 0, label: 'JPY (¥)' },
    CNY: { code: 'CNY', symbol: '¥', decimals: 2, label: 'CNY (¥)' }
  };

  var TEMPLATES = {
    freelance: {
      id: 'freelance',
      nameEn: 'General Freelancer Invoice',
      nameZh: '通用自由职业项目账单',
      docType: 'invoice',
      docLang: 'en',
      currency: 'USD',
      taxLabel: 'Sales Tax',
      taxRate: 0,
      discountType: 'percent',
      discountValue: 0,
      terms: 'Net 14 Days',
      senderName: 'Northstar Independent Studio',
      senderDetails: 'hello@northstarstudio.example\nSan Francisco, CA · Tax ID: 84-2910482',
      clientName: 'Acme Product Labs Inc.',
      clientDetails: 'billing@acmelabs.example\n548 Market St, Suite 4100\nSan Francisco, CA 94104',
      items: [
        { desc: 'Product Discovery & Architecture Sprint (Week 1)', qty: 1, rate: 1650 },
        { desc: 'Frontend Design System & Responsive UI Delivery', qty: 18, rate: 125 }
      ],
      paymentInfo: 'ACH / Wire: Routing 021000021 · Acct 489201948\nOr pay instantly via card link.',
      notes: 'Thank you for your partnership! Late balances accrue 1.5%/mo after due date.'
    },
    consulting: {
      id: 'consulting',
      nameEn: 'Consulting Hourly Invoice',
      nameZh: '独立顾问按小时计费发票',
      docType: 'invoice',
      docLang: 'en',
      currency: 'USD',
      taxLabel: 'Tax',
      taxRate: 0,
      discountType: 'percent',
      discountValue: 0,
      terms: 'Net 15 Days',
      senderName: 'Elena Vance · Principal Advisory',
      senderDetails: 'elena@vanceadvisory.example\nNew York, NY 10013',
      clientName: 'Meridian FinTech Holdings',
      clientDetails: 'ap@meridianfintech.example\n200 Vesey Street, New York, NY',
      items: [
        { desc: 'Executive Architecture & Security Audit (Hourly Retainer)', qty: 14.5, rate: 220 },
        { desc: 'Board Stakeholder Briefing Deck & Roadmap Workshop', qty: 4, rate: 220 }
      ],
      paymentInfo: 'Wire / Wise USD: Account #9901847261 · Reference Invoice #',
      notes: 'Detailed timesheet log attached upon request.'
    },
    webdev: {
      id: 'webdev',
      nameEn: 'Web Developer Milestone Invoice',
      nameZh: '全栈/前端开发者里程碑账单',
      docType: 'invoice',
      docLang: 'en',
      currency: 'USD',
      taxLabel: 'Tax',
      taxRate: 0,
      discountType: 'fixed',
      discountValue: 200,
      terms: '50% Milestone Delivery — Due in 7 Days',
      senderName: 'PixelForge Web Engineering LLC',
      senderDetails: 'dev@pixelforge.example · GitHub @pixelforge\nAustin, TX 78701',
      clientName: 'Bloom Commerce Co.',
      clientDetails: 'founders@bloomcommerce.example\nAustin, TX',
      items: [
        { desc: 'Full-Stack Storefront Checkout & Stripe Webhook Integration', qty: 1, rate: 3200 },
        { desc: 'Core Web Vitals Optimization (LCP < 1.4s, Lighthouse 99)', qty: 1, rate: 950 },
        { desc: 'Production Deployment & CI/CD Pipeline Handoff', qty: 1, rate: 600 }
      ],
      paymentInfo: 'ACH / Stripe Payment Link · Git repository full transfer upon settlement.',
      notes: 'Includes 14-day post-launch bugfix warranty.'
    },
    design: {
      id: 'design',
      nameEn: 'Graphic / UI-UX Designer Quote',
      nameZh: '视觉与 UI/UX 设计师项目报价单',
      docType: 'quote',
      docLang: 'en',
      currency: 'USD',
      taxLabel: 'Tax',
      taxRate: 0,
      discountType: 'percent',
      discountValue: 5,
      terms: 'Valid for 30 Days · 50% Deposit to Book Start Date',
      senderName: 'Studio Kanso Brand & UI',
      senderDetails: 'hello@studiokanso.example\nSeattle, WA',
      clientName: 'Solstice Roasters Ltd.',
      clientDetails: 'team@solsticeroasters.example\nPortland, OR',
      items: [
        { desc: 'Brand Identity System (Primary Logo, Typography, Color Tokens)', qty: 1, rate: 2400 },
        { desc: 'Packaging Print Die-Lines (3 Coffee Bag SKUs, CMYK Press-Ready)', qty: 3, rate: 450 },
        { desc: 'Figma Component Kit & Social Launch Templates', qty: 1, rate: 850 }
      ],
      paymentInfo: '50% deposit locks production calendar; remaining 50% prior to source vector release.',
      notes: 'Includes 2 rounds of structured design revisions per deliverable.'
    },
    contractor: {
      id: 'contractor',
      nameEn: 'Contractor Paid Receipt',
      nameZh: '独立承包商已收款凭证 (Receipt)',
      docType: 'receipt',
      docLang: 'en',
      currency: 'USD',
      taxLabel: 'Tax',
      taxRate: 0,
      discountType: 'percent',
      discountValue: 0,
      amountPaidOverride: 1850,
      terms: 'Paid in Full',
      senderName: ' Marcus Reed · Independent Contractor',
      senderDetails: 'marcus@reedops.example\nDenver, CO 80202',
      clientName: 'Summit Logistics Group',
      clientDetails: 'finance@summitlogistics.example\nChicago, IL',
      items: [
        { desc: 'Cloud Infrastructure Migration & On-Call Cutover', qty: 1, rate: 1850 }
      ],
      paymentInfo: 'Paid via ACH Bank Transfer · Confirmation #ACH-883920',
      notes: 'Official payment receipt for your tax & accounting records. Balance Due: $0.00.'
    },
    bilingual: {
      id: 'bilingual',
      nameEn: 'Bilingual EN/中文 Commercial Invoice',
      nameZh: '中英双语跨境自由职业/外贸商业发票',
      docType: 'invoice',
      docLang: 'bilingual',
      currency: 'USD',
      taxLabel: 'VAT / 税率',
      taxRate: 0,
      discountType: 'percent',
      discountValue: 0,
      terms: 'Net 7 Days / 见票 7 日内结清',
      senderName: 'Lin Studio Digital Consulting / 林氏数字咨询工作室',
      senderDetails: 'billing@linstudio.example\nHong Kong / Shenzhen · SWIFT: HSBCHKHHHKH',
      clientName: 'Pacific Horizon Trading Co., Ltd.',
      clientDetails: 'accounts@pacifichorizon.example\n120 Robinson Road, Singapore 068913',
      items: [
        { desc: 'Cross-Border Localization & Technical UX Copywriting / 跨境产品双语本地化与交互文案', qty: 1, rate: 1400 },
        { desc: 'Bilingual Design QA & Release Verification (Hours) / 双语多端走查工时', qty: 10, rate: 85 }
      ],
      paymentInfo: 'Beneficiary: Lin Studio · Wise / USD Wire Transfer / PayPal supported.',
      notes: 'Commercial Invoice for Cross-Border Services / 跨境技术服务结算商业账单。'
    },
    photography: {
      id: 'photography',
      nameEn: 'Photography Client Invoice',
      nameZh: '商业与活动摄影师客户结算单',
      docType: 'invoice',
      docLang: 'en',
      currency: 'USD',
      taxLabel: 'Sales Tax',
      taxRate: 8.25,
      discountType: 'fixed',
      discountValue: 0,
      terms: '50% Retainer Paid · Balance Due Prior to Gallery Delivery',
      senderName: 'Clara Day Photography',
      senderDetails: 'clara@claradayphoto.example\nBrooklyn, NY',
      clientName: 'Verve Editorial Events',
      clientDetails: 'events@verveeditorial.example\nNew York, NY',
      items: [
        { desc: 'Full-Day Corporate Summit Coverage (8 Hours On-Site)', qty: 1, rate: 2200 },
        { desc: 'Color Grading & High-Res Retouched Deliverable Set (120 Photos)', qty: 1, rate: 650 },
        { desc: 'Same-Day Press Highlights Rush Turnaround', qty: 1, rate: 350 }
      ],
      paymentInfo: 'Zelle / Venmo Business / Card Payment Link accepted.',
      notes: 'Includes non-exclusive commercial web & press usage license.'
    },
    saas: {
      id: 'saas',
      nameEn: 'Indie SaaS / B2B License Receipt',
      nameZh: '独立软件 SaaS 企业报销发票收据',
      docType: 'receipt',
      docLang: 'en',
      currency: 'EUR',
      taxLabel: 'VAT (Reverse Charge 0%)',
      taxRate: 0,
      discountType: 'percent',
      discountValue: 0,
      amountPaidOverride: 290,
      terms: 'Paid via Card — B2B Annual Team Seat License',
      senderName: 'CraftLeaf Software Tools',
      senderDetails: 'support@craftleaf.example\nAnnual Commercial Software License',
      clientName: 'Nordic Cloud Systems GmbH',
      clientDetails: 'accounting@nordiccloud.example\nFriedrichstr. 114, 10117 Berlin, Germany · VAT ID: DE309481920',
      items: [
        { desc: 'Team Annual Pro License — 10 Developer Seats (12 Months)', qty: 10, rate: 29 }
      ],
      paymentInfo: 'Paid in full — Card ending •••• 4242.',
      notes: 'VAT Reverse Charge applies where eligible. Retain this PDF receipt for corporate expense reimbursement.'
    }
  };

  function resolveTemplateKey(raw) {
    if (!raw) return 'freelance';
    var k = String(raw).toLowerCase().trim();
    return TEMPLATES[k] ? k : 'freelance';
  }

  function roundMoney(n) {
    return Math.round((Number(n) || 0) * 100) / 100;
  }

  /**
   * Pure deterministic invoice math engine (unit-tested in JSC)
   */
  function calculateTotals(data) {
    var items = (data && data.items) || [];
    var subtotal = 0;
    var lineAmounts = [];
    for (var i = 0; i < items.length; i++) {
      var q = Number(items[i].qty) || 0;
      var r = Number(items[i].rate) || 0;
      var amt = roundMoney(q * r);
      lineAmounts.push(amt);
      subtotal = roundMoney(subtotal + amt);
    }

    var discVal = Math.max(0, Number(data && data.discountValue) || 0);
    var discountAmount = 0;
    if ((data && data.discountType) === 'fixed') {
      discountAmount = Math.min(subtotal, roundMoney(discVal));
    } else {
      discountAmount = roundMoney(subtotal * Math.min(100, discVal) / 100);
    }

    var taxableBase = Math.max(0, roundMoney(subtotal - discountAmount));
    var taxRate = Math.max(0, Number(data && data.taxRate) || 0);
    var taxAmount = roundMoney(taxableBase * (taxRate / 100));
    var total = roundMoney(taxableBase + taxAmount);
    var paid = Math.max(0, roundMoney(Number(data && data.amountPaid) || 0));
    var balanceDue = Math.max(0, roundMoney(total - paid));

    return {
      lineAmounts: lineAmounts,
      subtotal: subtotal,
      discountAmount: discountAmount,
      taxableBase: taxableBase,
      taxAmount: taxAmount,
      total: total,
      amountPaid: paid,
      balanceDue: balanceDue
    };
  }

  function formatMoney(amount, currencyCode) {
    var cur = CURRENCIES[currencyCode] || CURRENCIES.USD;
    var val = Number(amount) || 0;
    var fixed = cur.decimals === 0 ? String(Math.round(val)) : val.toFixed(cur.decimals);
    var parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return cur.symbol + parts.join('.');
  }

  function parseNumericAmount(raw) {
    if (typeof raw === 'number') return isFinite(raw) ? raw : 0;
    var cleaned = String(raw == null ? '' : raw).replace(/[^0-9.\-]/g, '');
    var n = parseFloat(cleaned);
    return isFinite(n) ? n : 0;
  }

  function minorScaleForCurrency(currencyCode) {
    var cur = CURRENCIES[String(currencyCode || 'USD').toUpperCase()] || CURRENCIES.USD;
    return cur.decimals === 0 ? 1 : Math.pow(10, cur.decimals);
  }

  function toMinorUnits(amount, currencyCode) {
    var scale = minorScaleForCurrency(currencyCode);
    return Math.round(parseNumericAmount(amount) * scale);
  }

  function fromMinorUnits(minor, currencyCode) {
    var scale = minorScaleForCurrency(currencyCode);
    return minor / scale;
  }

  function normalizeClientKey(name) {
    return String(name == null ? '' : name).trim().replace(/\s+/g, ' ').toLowerCase();
  }

  function normalizeInvoiceKey(invNo) {
    return String(invNo == null ? '' : invNo).trim().replace(/\s+/g, ' ').toUpperCase();
  }

  function parseCsvRowsRfc4180(text) {
    var rows = [];
    var row = [];
    var field = '';
    var inQuotes = false;
    var s = String(text == null ? '' : text).replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
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
      } else if (ch === '"' && field.length === 0) {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(field.trim());
        field = '';
      } else if (ch === '\n') {
        row.push(field.trim());
        if (row.some(function (c) { return c.length > 0; })) rows.push(row);
        row = [];
        field = '';
      } else {
        field += ch;
      }
    }
    if (field.length > 0 || row.length > 0) {
      row.push(field.trim());
      if (row.some(function (c) { return c.length > 0; })) rows.push(row);
    }
    return rows;
  }

  function parseLedgerCsv(csvText) {
    var rows = parseCsvRowsRfc4180(csvText);
    if (rows.length < 2) return [];
    var headers = rows[0].map(function (h) {
      return String(h || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    });
    function idxOf(candidates) {
      for (var i = 0; i < candidates.length; i++) {
        var pos = headers.indexOf(candidates[i]);
        if (pos !== -1) return pos;
      }
      return -1;
    }
    var colInv = idxOf(['invoicenumber', 'invoiceno', 'document', 'docnumber', 'invnumber']);
    var colType = idxOf(['type', 'doctype', 'documenttype']);
    var colStatus = idxOf(['status', 'state']);
    var colIssue = idxOf(['issuedate', 'date']);
    var colDue = idxOf(['duedate', 'due']);
    var colClient = idxOf(['client', 'clientname', 'billto', 'customer']);
    var colCur = idxOf(['currency', 'curr']);
    var colTotal = idxOf(['total', 'invoicetotal', 'amount']);
    var colPaid = idxOf(['amountpaid', 'paid', 'depositpaid']);
    var colBal = idxOf(['balancedue', 'remaining', 'balance']);

    var entries = [];
    for (var r = 1; r < rows.length; r++) {
      var cells = rows[r];
      var clientName = colClient >= 0 ? (cells[colClient] || '') : '';
      var invNo = colInv >= 0 ? (cells[colInv] || '') : '';
      if (!clientName && !invNo) continue;
      var cur = String((colCur >= 0 ? cells[colCur] : 'USD') || 'USD').trim().toUpperCase();
      var totalVal = colTotal >= 0 ? parseNumericAmount(cells[colTotal]) : 0;
      var paidVal = colPaid >= 0 ? parseNumericAmount(cells[colPaid]) : 0;
      var balVal = colBal >= 0 ? parseNumericAmount(cells[colBal]) : Math.max(0, roundMoney(totalVal - paidVal));
      entries.push({
        id: 'csv_row_' + r,
        invNumber: invNo,
        docType: String((colType >= 0 ? cells[colType] : 'invoice') || 'invoice').trim().toLowerCase(),
        status: String((colStatus >= 0 ? cells[colStatus] : 'SENT') || 'SENT').trim().toUpperCase(),
        issueDate: colIssue >= 0 ? (cells[colIssue] || '') : '',
        dueDate: colDue >= 0 ? (cells[colDue] || '') : '',
        clientName: clientName,
        currency: CURRENCIES[cur] ? cur : cur,
        total: totalVal,
        amountPaid: paidVal,
        balanceDue: balVal
      });
    }
    return entries;
  }

  function listStatementClients(entries) {
    var map = {};
    var order = [];
    var list = Array.isArray(entries) ? entries : [];
    for (var i = 0; i < list.length; i++) {
      var e = list[i] || {};
      var rawName = String(e.clientName || '').trim();
      if (!rawName) continue;
      var cKey = normalizeClientKey(rawName);
      var cur = String(e.currency || 'USD').trim().toUpperCase();
      if (!map[cKey]) {
        map[cKey] = {
          clientKey: cKey,
          clientName: rawName,
          clientDetails: (e.snapshot && e.snapshot.clientDetails) || e.clientDetails || '',
          currencies: []
        };
        order.push(cKey);
      } else if (!map[cKey].clientDetails && ((e.snapshot && e.snapshot.clientDetails) || e.clientDetails)) {
        map[cKey].clientDetails = (e.snapshot && e.snapshot.clientDetails) || e.clientDetails || '';
      }
      if (map[cKey].currencies.indexOf(cur) === -1) {
        map[cKey].currencies.push(cur);
      }
    }
    return order.map(function (k) { return map[k]; });
  }

  /**
   * Worked $170.00 Open-Item Client Statement fixture (#71):
   * - INV-2026-104 ($200.00 total, $80.00 paid) -> $120.00 remaining
   * - INV-2026-109 ($50.00 total, $0.00 paid) -> $50.00 remaining
   * - INV-2026-098 ($300.00 PAID settled bill) -> excluded
   * - QUO-2026-012 ($600.00 quote/estimate) -> excluded
   * - INV-2026-110 ($450.00 Nordic Cloud Systems GmbH) -> excluded (other client)
   */
  var SAMPLE_STATEMENT_LEDGER = [
    {
      id: 'demo_104',
      invNumber: 'INV-2026-104',
      docType: 'invoice',
      status: 'SENT',
      issueDate: '2026-10-18',
      dueDate: '2026-11-01',
      clientName: 'Acme Product Labs Inc.',
      clientDetails: 'billing@acmelabs.example\n548 Market St, Suite 4100\nSan Francisco, CA 94104',
      currency: 'USD',
      total: 200.00,
      amountPaid: 80.00,
      balanceDue: 120.00
    },
    {
      id: 'demo_109',
      invNumber: 'INV-2026-109',
      docType: 'invoice',
      status: 'SENT',
      issueDate: '2026-11-05',
      dueDate: '2026-11-19',
      clientName: 'Acme Product Labs Inc.',
      clientDetails: 'billing@acmelabs.example\n548 Market St, Suite 4100\nSan Francisco, CA 94104',
      currency: 'USD',
      total: 50.00,
      amountPaid: 0.00,
      balanceDue: 50.00
    },
    {
      id: 'demo_098_paid',
      invNumber: 'INV-2026-098',
      docType: 'invoice',
      status: 'PAID',
      issueDate: '2026-09-20',
      dueDate: '2026-10-04',
      clientName: 'Acme Product Labs Inc.',
      currency: 'USD',
      total: 300.00,
      amountPaid: 300.00,
      balanceDue: 0.00
    },
    {
      id: 'demo_quo_012',
      invNumber: 'QUO-2026-012',
      docType: 'quote',
      status: 'OPEN',
      issueDate: '2026-11-10',
      dueDate: '2026-12-10',
      clientName: 'Acme Product Labs Inc.',
      currency: 'USD',
      total: 600.00,
      amountPaid: 0.00,
      balanceDue: 600.00
    },
    {
      id: 'demo_other_client',
      invNumber: 'INV-2026-110',
      docType: 'invoice',
      status: 'SENT',
      issueDate: '2026-11-08',
      dueDate: '2026-11-22',
      clientName: 'Nordic Cloud Systems GmbH',
      currency: 'USD',
      total: 450.00,
      amountPaid: 0.00,
      balanceDue: 450.00
    }
  ];

  var SAMPLE_STATEMENT_DUPLICATE_ROW = {
    id: 'demo_104_stale_draft',
    invNumber: 'INV-2026-104',
    docType: 'invoice',
    status: 'SENT',
    issueDate: '2026-10-18',
    dueDate: '2026-11-01',
    clientName: 'Acme Product Labs Inc.',
    currency: 'USD',
    total: 200.00,
    amountPaid: 0.00,
    balanceDue: 200.00
  };

  /**
   * Pure deterministic Open-Item Client Statement engine (#71).
   * - Strictly 1 client + 1 currency (zero cross-client or cross-currency leakage).
   * - Excludes quotes/estimates and settled bills (never mixes settled payments with open debt).
   * - Halts on duplicate saved versions of the same invoice number unless explicitly resolved by buyer.
   */
  function computeOpenItemStatement(entries, opts) {
    opts = opts || {};
    var targetClientKey = normalizeClientKey(opts.clientName);
    var targetCurrency = String(opts.currency || 'USD').trim().toUpperCase();
    var statementDate = String(opts.statementDate || '').trim();
    var resolvedDuplicates = opts.resolvedDuplicates || {};
    var confirmed = Boolean(opts.confirmedBalancesCurrent);

    var excludedCounts = {
      otherClients: 0,
      otherCurrencies: 0,
      quotes: 0,
      settled: 0,
      overpaid: 0,
      resolvedDuplicates: 0
    };
    var missingNumberRows = [];
    var groupsByInvKey = {};
    var invKeyOrder = [];
    var canonicalClientName = String(opts.clientName || '').trim();
    var canonicalClientDetails = '';

    var list = Array.isArray(entries) ? entries : [];
    for (var i = 0; i < list.length; i++) {
      var raw = list[i] || {};
      var rowId = String(raw.id || ('row_' + i));
      var cKey = normalizeClientKey(raw.clientName);
      if (!targetClientKey || cKey !== targetClientKey) {
        excludedCounts.otherClients++;
        continue;
      }
      if (!canonicalClientName && raw.clientName) {
        canonicalClientName = String(raw.clientName).trim();
      }
      if (!canonicalClientDetails && ((raw.snapshot && raw.snapshot.clientDetails) || raw.clientDetails)) {
        canonicalClientDetails = (raw.snapshot && raw.snapshot.clientDetails) || raw.clientDetails || '';
      }

      var rowCur = String(raw.currency || 'USD').trim().toUpperCase();
      if (rowCur !== targetCurrency) {
        excludedCounts.otherCurrencies++;
        continue;
      }

      var dType = String(raw.docType || 'invoice').trim().toLowerCase();
      if (dType === 'quote' || dType === 'estimate' || dType === 'quotation') {
        excludedCounts.quotes++;
        continue;
      }

      var invKey = normalizeInvoiceKey(raw.invNumber);
      var normalizedRow = {
        id: rowId,
        invKey: invKey,
        invNumber: String(raw.invNumber || '').trim(),
        docType: dType,
        status: String(raw.status || 'SENT').trim().toUpperCase(),
        issueDate: String(raw.issueDate || '').trim(),
        dueDate: String(raw.dueDate || '').trim(),
        totalMinor: toMinorUnits(raw.total, targetCurrency),
        paidMinor: toMinorUnits(raw.amountPaid, targetCurrency)
      };

      if (!invKey) {
        missingNumberRows.push(normalizedRow);
        continue;
      }
      if (!groupsByInvKey[invKey]) {
        groupsByInvKey[invKey] = [];
        invKeyOrder.push(invKey);
      }
      groupsByInvKey[invKey].push(normalizedRow);
    }

    var duplicateConflicts = [];
    var deduplicatedRows = [];
    for (var g = 0; g < invKeyOrder.length; g++) {
      var k = invKeyOrder[g];
      var candidates = groupsByInvKey[k];
      if (candidates.length === 1) {
        deduplicatedRows.push(candidates[0]);
      } else {
        var chosenId = resolvedDuplicates[k];
        var matched = null;
        if (chosenId) {
          for (var c = 0; c < candidates.length; c++) {
            if (candidates[c].id === chosenId) {
              matched = candidates[c];
              break;
            }
          }
        }
        if (matched) {
          excludedCounts.resolvedDuplicates += (candidates.length - 1);
          deduplicatedRows.push(matched);
        } else {
          duplicateConflicts.push({
            invKey: k,
            invNumber: candidates[0].invNumber,
            candidates: candidates.map(function (cand) {
              var remMinor = Math.max(0, cand.totalMinor - cand.paidMinor);
              return {
                id: cand.id,
                invNumber: cand.invNumber,
                status: cand.status,
                issueDate: cand.issueDate,
                dueDate: cand.dueDate,
                total: fromMinorUnits(cand.totalMinor, targetCurrency),
                amountPaid: fromMinorUnits(cand.paidMinor, targetCurrency),
                remainingBalance: cand.status === 'PAID' || cand.docType === 'receipt' ? 0 : fromMinorUnits(remMinor, targetCurrency)
              };
            })
          });
        }
      }
    }

    var openItems = [];
    var overpaymentWarnings = [];
    var totalOutstandingMinor = 0;

    for (var j = 0; j < deduplicatedRows.length; j++) {
      var item = deduplicatedRows[j];
      if (item.paidMinor > item.totalMinor) {
        excludedCounts.overpaid++;
        overpaymentWarnings.push({
          invNumber: item.invNumber,
          total: fromMinorUnits(item.totalMinor, targetCurrency),
          amountPaid: fromMinorUnits(item.paidMinor, targetCurrency)
        });
        continue;
      }
      if (item.status === 'PAID' || item.docType === 'receipt') {
        excludedCounts.settled++;
        continue;
      }
      var rem = item.totalMinor - item.paidMinor;
      if (rem <= 0) {
        excludedCounts.settled++;
        continue;
      }
      var isOverdue = Boolean(statementDate && item.dueDate && item.dueDate < statementDate);
      openItems.push({
        id: item.id,
        invNumber: item.invNumber,
        issueDate: item.issueDate,
        dueDate: item.dueDate,
        totalMinor: item.totalMinor,
        paidMinor: item.paidMinor,
        remainingMinor: rem,
        total: fromMinorUnits(item.totalMinor, targetCurrency),
        amountPaid: fromMinorUnits(item.paidMinor, targetCurrency),
        remainingBalance: fromMinorUnits(rem, targetCurrency),
        isOverdue: isOverdue
      });
      totalOutstandingMinor += rem;
    }

    openItems.sort(function (a, b) {
      var da = a.dueDate || '9999-99-99';
      var db = b.dueDate || '9999-99-99';
      if (da !== db) return da < db ? -1 : 1;
      var ia = a.issueDate || '';
      var ib = b.issueDate || '';
      if (ia !== ib) return ia < ib ? -1 : 1;
      return a.invNumber < b.invNumber ? -1 : (a.invNumber > b.invNumber ? 1 : 0);
    });

    var hasStructuralBlocker = missingNumberRows.length > 0 || duplicateConflicts.length > 0;
    var status = 'READY';
    if (missingNumberRows.length > 0) {
      status = 'MISSING_INVOICE_NUMBER';
    } else if (duplicateConflicts.length > 0) {
      status = 'DUPLICATE_INVOICE_CONFLICT';
    } else if (!confirmed) {
      status = 'CONFIRMATION_REQUIRED';
    }

    var effectiveTotalMinor = hasStructuralBlocker ? 0 : totalOutstandingMinor;
    var effectiveTotal = fromMinorUnits(effectiveTotalMinor, targetCurrency);

    return {
      status: status,
      canExport: status === 'READY',
      confirmedBalancesCurrent: confirmed,
      clientName: canonicalClientName,
      clientDetails: canonicalClientDetails,
      currency: targetCurrency,
      statementDate: statementDate,
      openItems: hasStructuralBlocker ? [] : openItems,
      totalOutstandingMinor: effectiveTotalMinor,
      totalOutstanding: effectiveTotal,
      formattedTotalOutstanding: formatMoney(effectiveTotal, targetCurrency),
      excludedCounts: excludedCounts,
      duplicateConflicts: duplicateConflicts,
      missingNumberRows: missingNumberRows,
      overpaymentWarnings: overpaymentWarnings
    };
  }

  function exportStatementCsvString(stmt) {
    if (!stmt || stmt.status === 'DUPLICATE_INVOICE_CONFLICT' || stmt.status === 'MISSING_INVOICE_NUMBER') {
      throw new Error('Cannot export statement while duplicate or missing invoice numbers are unresolved.');
    }
    function csvSafeCell(v) {
      var s = String(v == null ? '' : v);
      if (/^[=+\-@]/.test(s)) s = "'" + s;
      return '"' + s.replace(/"/g, '""') + '"';
    }
    var lines = [
      'StatementDate,Client,Currency,InvoiceNumber,IssueDate,DueDate,InvoiceTotal,AmountPaid,RemainingBalance,Overdue'
    ];
    for (var i = 0; i < stmt.openItems.length; i++) {
      var r = stmt.openItems[i];
      lines.push([
        stmt.statementDate,
        stmt.clientName,
        stmt.currency,
        r.invNumber,
        r.issueDate,
        r.dueDate,
        r.total.toFixed(CURRENCIES[stmt.currency] && CURRENCIES[stmt.currency].decimals === 0 ? 0 : 2),
        r.amountPaid.toFixed(CURRENCIES[stmt.currency] && CURRENCIES[stmt.currency].decimals === 0 ? 0 : 2),
        r.remainingBalance.toFixed(CURRENCIES[stmt.currency] && CURRENCIES[stmt.currency].decimals === 0 ? 0 : 2),
        r.isOverdue ? 'YES' : 'NO'
      ].map(csvSafeCell).join(','));
    }
    lines.push([
      stmt.statementDate,
      stmt.clientName,
      stmt.currency,
      'TOTAL_OUTSTANDING',
      '',
      '',
      '',
      '',
      stmt.totalOutstanding.toFixed(CURRENCIES[stmt.currency] && CURRENCIES[stmt.currency].decimals === 0 ? 0 : 2),
      ''
    ].map(csvSafeCell).join(','));
    return lines.join('\r\n');
  }

  // =========================================================================
  // Pure-JS ISO/IEC 18004 Scannable QR Code Matrix & Vector SVG Generator
  // Supports Versions 1–6 (ECC Level L, Byte Mode, up to 134 UTF-8 bytes)
  // =========================================================================
  var QR_VERSIONS = [
    null,
    { v: 1, size: 21, total: 26, data: 19, ecPerBlock: 7, blocks: 1, align: [] },
    { v: 2, size: 25, total: 44, data: 34, ecPerBlock: 10, blocks: 1, align: [6, 18] },
    { v: 3, size: 29, total: 70, data: 55, ecPerBlock: 15, blocks: 1, align: [6, 22] },
    { v: 4, size: 33, total: 100, data: 80, ecPerBlock: 20, blocks: 1, align: [6, 26] },
    { v: 5, size: 37, total: 134, data: 108, ecPerBlock: 26, blocks: 1, align: [6, 30] },
    { v: 6, size: 41, total: 172, data: 136, ecPerBlock: 18, blocks: 2, align: [6, 34] }
  ];

  var GF_EXP = new Array(512);
  var GF_LOG = new Array(256);
  (function initGF() {
    var x = 1;
    for (var i = 0; i < 255; i++) {
      GF_EXP[i] = x;
      GF_LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (var j = 255; j < 512; j++) {
      GF_EXP[j] = GF_EXP[j - 255];
    }
  })();

  function gfMul(a, b) {
    if (a === 0 || b === 0) return 0;
    return GF_EXP[GF_LOG[a] + GF_LOG[b]];
  }

  function rsGeneratorPoly(degree) {
    var poly = [1];
    for (var i = 0; i < degree; i++) {
      var next = new Array(poly.length + 1).fill(0);
      var factor = GF_EXP[i];
      for (var j = 0; j < poly.length; j++) {
        next[j] ^= poly[j];
        next[j + 1] ^= gfMul(poly[j], factor);
      }
      poly = next;
    }
    return poly;
  }

  function rsComputeRemainder(dataBytes, ecLen) {
    var gen = rsGeneratorPoly(ecLen);
    var rem = new Array(ecLen).fill(0);
    for (var i = 0; i < dataBytes.length; i++) {
      var factor = dataBytes[i] ^ rem[0];
      rem.shift();
      rem.push(0);
      for (var j = 0; j < ecLen; j++) {
        rem[j] ^= gfMul(gen[j + 1], factor);
      }
    }
    return rem;
  }

  function utf8Bytes(str) {
    var out = [];
    var s = String(str || '');
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c < 0x80) {
        out.push(c);
      } else if (c < 0x800) {
        out.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
      } else {
        out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
      }
    }
    return out;
  }

  function generateQRSvg(rawText, fgColor) {
    var bytes = utf8Bytes(String(rawText || '').slice(0, 130));
    if (!bytes.length) return '';
    var spec = null;
    for (var v = 1; v <= 6; v++) {
      if (bytes.length + 2 <= QR_VERSIONS[v].data) {
        spec = QR_VERSIONS[v];
        break;
      }
    }
    if (!spec) spec = QR_VERSIONS[6];

    // Bit buffer: Mode 0100 (Byte) + 8-bit char count + payload + terminator + 0xEC/0x11 pad
    var bits = [];
    function pushBits(val, len) {
      for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
    }
    pushBits(0x4, 4);
    pushBits(bytes.length, 8);
    for (var b = 0; b < bytes.length; b++) pushBits(bytes[b], 8);
    var maxDataBits = spec.data * 8;
    var term = Math.min(4, maxDataBits - bits.length);
    pushBits(0, term);
    while (bits.length % 8 !== 0) bits.push(0);

    var dataWords = [];
    for (var k = 0; k < bits.length; k += 8) {
      var byteVal = 0;
      for (var bit = 0; bit < 8; bit++) byteVal = (byteVal << 1) | bits[k + bit];
      dataWords.push(byteVal);
    }
    var padIdx = 0;
    while (dataWords.length < spec.data) {
      dataWords.push(padIdx % 2 === 0 ? 0xec : 0x11);
      padIdx++;
    }

    // Split into blocks, compute RS ECC, interleave
    var blockDataLen = spec.data / spec.blocks;
    var dataBlocks = [];
    var ecBlocks = [];
    for (var blk = 0; blk < spec.blocks; blk++) {
      var slice = dataWords.slice(blk * blockDataLen, (blk + 1) * blockDataLen);
      dataBlocks.push(slice);
      ecBlocks.push(rsComputeRemainder(slice, spec.ecPerBlock));
    }
    var finalWords = [];
    for (var dIdx = 0; dIdx < blockDataLen; dIdx++) {
      for (var b1 = 0; b1 < spec.blocks; b1++) finalWords.push(dataBlocks[b1][dIdx]);
    }
    for (var eIdx = 0; eIdx < spec.ecPerBlock; eIdx++) {
      for (var b2 = 0; b2 < spec.blocks; b2++) finalWords.push(ecBlocks[b2][eIdx]);
    }

    var allBits = [];
    for (var fw = 0; fw < finalWords.length; fw++) {
      for (var fb = 7; fb >= 0; fb--) allBits.push((finalWords[fw] >>> fb) & 1);
    }
    // Remainder bits for V2-V6 (7 zero bits)
    if (spec.v >= 2) {
      for (var rb = 0; rb < 7; rb++) allBits.push(0);
    }

    var size = spec.size;
    var modules = [];
    var isFunc = [];
    for (var r = 0; r < size; r++) {
      modules.push(new Array(size).fill(0));
      isFunc.push(new Array(size).fill(false));
    }

    function setFunc(x, y, dark) {
      if (x < 0 || y < 0 || x >= size || y >= size) return;
      modules[y][x] = dark ? 1 : 0;
      isFunc[y][x] = true;
    }

    function placeFinder(ox, oy) {
      for (var dy = -1; dy <= 7; dy++) {
        for (var dx = -1; dx <= 7; dx++) {
          var xx = ox + dx, yy = oy + dy;
          var inside = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6;
          var ring = dx === 0 || dx === 6 || dy === 0 || dy === 6;
          var core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
          setFunc(xx, yy, inside && (ring || core));
        }
      }
    }

    placeFinder(0, 0);
    placeFinder(size - 7, 0);
    placeFinder(0, size - 7);

    // Timing patterns
    for (var t = 8; t < size - 8; t++) {
      setFunc(t, 6, t % 2 === 0);
      setFunc(6, t, t % 2 === 0);
    }

    // Alignment patterns
    var al = spec.align;
    for (var ai = 0; ai < al.length; ai++) {
      for (var aj = 0; aj < al.length; aj++) {
        if ((ai === 0 && aj === 0) || (ai === 0 && aj === al.length - 1) || (ai === al.length - 1 && aj === 0)) {
          continue;
        }
        var cx = al[ai], cy = al[aj];
        for (var ady = -2; ady <= 2; ady++) {
          for (var adx = -2; adx <= 2; adx++) {
            setFunc(cx + adx, cy + ady, Math.max(Math.abs(adx), Math.abs(ady)) !== 1);
          }
        }
      }
    }

    // Reserve format info & dark module
    for (var fi = 0; fi < 9; fi++) {
      if (!isFunc[8][fi]) setFunc(fi, 8, false);
      if (!isFunc[fi][8]) setFunc(8, fi, false);
    }
    for (var fj = 0; fj < 8; fj++) {
      setFunc(size - 1 - fj, 8, false);
      setFunc(8, size - 1 - fj, false);
    }
    setFunc(8, size - 8, true);

    // Zigzag upward/downward bit placement with Mask 0 ((row + col) % 2 === 0)
    var bitPtr = 0;
    var upward = true;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < size; vert++) {
        var yy = upward ? (size - 1 - vert) : vert;
        for (var lr = 0; lr < 2; lr++) {
          var xx = right - lr;
          if (!isFunc[yy][xx]) {
            var bitVal = bitPtr < allBits.length ? allBits[bitPtr++] : 0;
            if ((yy + xx) % 2 === 0) bitVal ^= 1;
            modules[yy][xx] = bitVal;
          }
        }
      }
      upward = !upward;
    }

    // Format string for ECC Level L (01) + Mask 0 (000): pre-masked 15-bit BCH = 0x77C4
    var fmtBits = 0x77c4;
    function getFmtBit(idx) { return (fmtBits >>> idx) & 1; }
    var fmtCoords1 = [
      [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
      [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
    ];
    for (var f1 = 0; f1 < 15; f1++) {
      modules[fmtCoords1[f1][1]][fmtCoords1[f1][0]] = getFmtBit(f1);
    }
    for (var f2 = 0; f2 < 7; f2++) {
      modules[size - 1 - f2][8] = getFmtBit(f2);
    }
    for (var f3 = 7; f3 < 15; f3++) {
      modules[8][size - 15 + f3] = getFmtBit(f3);
    }

    var margin = 2;
    var viewSize = size + margin * 2;
    var pathD = '';
    for (var py = 0; py < size; py++) {
      for (var px = 0; px < size; px++) {
        if (modules[py][px]) {
          pathD += 'M' + (px + margin) + ',' + (py + margin) + 'h1v1h-1z';
        }
      }
    }
    var strokeFill = fgColor || '#0f172a';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + viewSize + ' ' + viewSize + '" shape-rendering="crispEdges" role="img" aria-label="Payment QR Code">' +
      '<rect width="' + viewSize + '" height="' + viewSize + '" fill="#ffffff"/>' +
      '<path d="' + pathD + '" fill="' + strokeFill + '"/></svg>';
  }

  var I18N = {
    en: {
      studioHome: '← CraftLeaf Studio',
      appTitle: 'Freelancer Invoice & Receipt PDF Studio',
      privacyBadge: 'No Signup · 100% Local Data',
      idPhotoLink: '← ID Photo 4×6" Studio',
      seoGuidesLink: 'Invoice Templates & Guides',
      unlockBtn: 'Unlock Pro ($9.00)',
      unlockedBtn: 'PRO UNLOCKED ✓',
      tbTemplate: 'Starter:',
      tbPaper: 'Paper:',
      btnPrintPdf: '🖨️ Print / Save Vector PDF',
      secDoc: 'Document Setup',
      lblDocType: 'Document Type',
      optInvoice: 'Invoice',
      optQuote: 'Quotation / Estimate',
      optReceipt: 'Paid Receipt',
      lblDocLang: 'PDF Labels',
      optLangEn: 'English',
      optLangZh: '中文 (Chinese)',
      optLangBi: 'Bilingual (EN + 中文)',
      lblCurrency: 'Currency',
      lblInvNum: 'Document #',
      lblIssueDate: 'Issue Date',
      lblDueDate: 'Due / Valid Date',
      secParties: 'Sender & Client Details',
      lblSenderName: 'Your Name / Business',
      lblSenderDetails: 'Your Email, Address & Tax/EIN ID',
      lblClientName: 'Bill To (Client / Company)',
      lblClientDetails: 'Client Email, Billing Address & VAT/Tax ID',
      secItems: 'Line Items & Tax / Discount Math',
      btnAddItem: '+ Add Line Item',
      lblDiscType: 'Discount Type',
      lblDiscVal: 'Discount Value',
      lblTaxLabel: 'Tax / VAT Label',
      lblTaxRate: 'Tax Rate (%)',
      lblAmtPaid: 'Deposit / Paid Deducted',
      secNotes: 'Payment Instructions, Terms & Notes',
      lblTerms: 'Payment Terms',
      lblPayInfo: 'Bank / Wire / Payment Instructions',
      lblNotes: 'Client Notes / Thank You Message',
      secProBrand: 'Brand Logo, Theme Color, Payment QR & White-Label',
      lblAccent: 'Invoice Accent Theme',
      btnUploadLogo: '🖼️ Upload Logo',
      btnClearLogo: 'Clear',
      chkHideFooter: 'Remove "Generated with CraftLeaf" Footer (White-Label)',
      lblQrUrl: 'Embedded SVG Payment Link / QR URL (Stripe, PayPal, Wise)',
      lblQrCaption: 'QR Callout Label',
      secCrm: 'Local Client & Item CRM Book + CSV Ledger',
      tabClients: 'Clients',
      tabCatalog: 'Item Catalog',
      tabLedger: 'Invoice Ledger',
      tabStatement: 'Open Statement',
      btnSaveClient: '+ Save Current Client',
      btnSaveItem: '+ Save First Line Item',
      btnSaveLedger: '+ Save Invoice to Ledger',
      btnImportLedgerCsv: '📂 Import Ledger CSV',
      btnExportCsv: '⬇ Export Ledger CSV',
      stmtIntro: 'One client + one currency summary of unpaid balances (not a new invoice).',
      btnStmtDemo: '🧪 Load $170 Demo',
      btnStmtDupDemo: '⚠️ Test Duplicate ID',
      lblStmtClient: 'Client',
      lblStmtCurrency: 'Currency',
      lblStmtDate: 'Statement Date',
      chkStmtConfirm: 'I confirm all payments received through the Statement Date are recorded on these open invoices.',
      btnPrintStmt: '🖨️ Print Statement PDF',
      btnExportStmtCsv: '⬇ Statement CSV',
      btnBackToInvoice: '↩ Single Invoice View',
      tipText: 'Get paid faster with zero monthly SaaS fees? Support independent offline software:',
      tipCta: '☕ Support CraftLeaf Studio',
      guidesFooterTitle: 'Free Industry Invoice & Receipt Templates:',
      modalTitle: 'Unlock Freelancer Invoice Studio Pro',
      modalSub: 'One-time $9.00 lifetime unlock — replace $15/mo invoicing subscriptions forever.',
      perk1: 'White-label PDF output (removes "Generated with CraftLeaf Invoice Studio" footer)',
      perk2: 'Local Client & Service Item CRM Book (IndexedDB + localStorage) for 1-click repeat billing',
      perk3: 'Custom Brand Logo upload + custom corporate Accent Color themes',
      perk4: 'Scannable Vector SVG Payment QR Code embedded directly on your invoice',
      perk5: 'Open-Item Repeat-Client Statement PDF/CSV (excludes settled/quotes, flags duplicate IDs) & Tax CSV Export',
      buyKeyBtn: 'Get Instant Pro Key ($9.00) →',
      allAccessLink: 'Or unlock all CraftLeaf tools with All-Access Pass ($19)',
      verifyBtn: 'Activate',
      msgInvalid: 'Invalid or refunded Gumroad License Key (expected XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX).',
      msgSuccess: 'Invoice Studio Pro Unlocked! White-label, CRM, Logo, QR & CSV are now active.'
    },
    zh: {
      studioHome: '← 返回工坊首页',
      appTitle: '免注册自由职业英文/双语发票与收据生成器',
      privacyBadge: '免登录 · 账单数据 100% 存本地',
      idPhotoLink: '← 证件照 4×6 冲印拼版',
      seoGuidesLink: '行业英文账单模板库',
      unlockBtn: '解锁 Pro 专业版 ($9.00 / ¥29.9)',
      unlockedBtn: '已解锁 PRO 专业版 ✓',
      tbTemplate: '行业预设:',
      tbPaper: '纸张尺寸:',
      btnPrintPdf: '🖨️ 导出矢量 PDF / 打印',
      secDoc: '单据类型与币种日期',
      lblDocType: '单据类型',
      optInvoice: '商业发票账单 (INVOICE)',
      optQuote: '项目报价单 (QUOTATION)',
      optReceipt: '已收款收据 (PAID RECEIPT)',
      lblDocLang: '票面语言',
      optLangEn: '纯英文国际标准 (English)',
      optLangZh: '简体中文票面',
      optLangBi: '中英双语对照 (跨境结汇推荐)',
      lblCurrency: '结算币种',
      lblInvNum: '单据编号 #',
      lblIssueDate: '开票日期',
      lblDueDate: '付款截止 / 有效期',
      secParties: '收款方（您）与客户抬头信息',
      lblSenderName: '您的姓名 / 独立工作室名称',
      lblSenderDetails: '邮箱、地址、税号 / SWIFT 信息',
      lblClientName: '客户名称 / 海外甲方公司 (Bill To)',
      lblClientDetails: '客户财务邮箱、公司地址与 VAT 税号',
      secItems: '收费明细、折扣与税率自动核算',
      btnAddItem: '+ 添加收费项目',
      lblDiscType: '折扣方式',
      lblDiscVal: '折扣数值',
      lblTaxLabel: '税项名称 (Tax / VAT)',
      lblTaxRate: '税率 (%)',
      lblAmtPaid: '已付定金 / 已收金额抵扣',
      secNotes: '收款账户说明、账期条款与备注',
      lblTerms: '付款账期条款',
      lblPayInfo: '银行电汇 / Wise / PayPal 收款方式说明',
      lblNotes: '底部感谢语与合同备注',
      secProBrand: '品牌 Logo、主题配色、扫码收款二维码与去水印',
      lblAccent: '票面商务主题色',
      btnUploadLogo: '🖼️ 上传品牌 Logo',
      btnClearLogo: '清除',
      chkHideFooter: '隐藏底部 "Generated with CraftLeaf" 标识（纯白标输出）',
      lblQrUrl: '嵌入票面矢量收款二维码链接 (Stripe / PayPal / Wise 链接)',
      lblQrCaption: '二维码旁提示文案',
      secCrm: '本地客户与项目库 CRM + 年度报税 CSV 账本导出',
      tabClients: '常用客户簿',
      tabCatalog: '常用服务价目',
      tabLedger: '历史账单台账',
      tabStatement: '未结对账单',
      btnSaveClient: '+ 保存当前客户',
      btnSaveItem: '+ 保存首行服务项',
      btnSaveLedger: '+ 归档当前账单至台账',
      btnImportLedgerCsv: '📂 导入台账 CSV',
      btnExportCsv: '⬇ 导出台账 CSV (Excel)',
      stmtIntro: '按单一客户 + 单一币种汇总未结清发票余额（对账摘要，非新开发票）。',
      btnStmtDemo: '🧪 载入 $170 示例',
      btnStmtDupDemo: '⚠️ 测试重号拦截',
      lblStmtClient: '选择客户',
      lblStmtCurrency: '结算币种',
      lblStmtDate: '对账截止日',
      chkStmtConfirm: '我已确认截至对账日收到的款项均已登记，以上各笔待付尾款准确无误。',
      btnPrintStmt: '🖨️ 打印/导出对账单 PDF',
      btnExportStmtCsv: '⬇ 导出对账 CSV',
      btnBackToInvoice: '↩ 返回单张发票视图',
      tipText: '省下了每月 $15 的海外 SaaS 账单软件月费？欢迎支持纯本地独立工具：',
      tipCta: '☕ 赞助支持青叶工坊',
      guidesFooterTitle: '出海自由职业者与独立开发者常用发票模板指南：',
      modalTitle: '解锁自由职业发票工坊 Pro 专业版',
      modalSub: '一次性买断仅 $9.00 (¥29.9) — 永久告别按月扣费的云端记账软件，商业隐私不外泄。',
      perk1: '纯白标商务输出（彻底移除底部 Generated with CraftLeaf 品牌脚标）',
      perk2: '解锁本地 IndexedDB 常用客户簿、服务价目表与历史发票归档管理',
      perk3: '支持上传工作室专属高清 Logo 与自定义品牌主题色',
      perk4: '票面自动生成高清矢量可扫描二维码（附带 Stripe / PayPal 快捷付款引导）',
      perk5: '一键生成单客户未结账单对账单 (Open-Item Statement PDF/CSV，自动剔除已结清/报价单并拦截重复单号) 与年度 CSV 导出',
      buyKeyBtn: '立即获取 Pro 激活码 ($9.00) →',
      allAccessLink: '或入手 $19 工坊全系效率工具通票',
      verifyBtn: '立即激活',
      msgInvalid: 'Gumroad 密钥无效或已退款，请核对订单回执上的 License Key (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)。',
      msgSuccess: 'Pro 专业版已激活！去品牌水印、本地客户 CRM、Logo、矢量收款码与 CSV 导出已全部开启。'
    }
  };

  var DOC_LABELS = {
    en: {
      invoice: 'INVOICE',
      quote: 'QUOTATION',
      receipt: 'PAID RECEIPT',
      docNo: 'Document #',
      issueDate: 'Issue Date',
      dueDate: 'Due Date',
      terms: 'Terms',
      billTo: 'Bill To',
      amountDueBox: 'Balance Due',
      amountPaidBox: 'Total Paid',
      quoteTotalBox: 'Estimated Total',
      colDesc: 'Description',
      colQty: 'Qty / Hrs',
      colRate: 'Unit Rate',
      colAmt: 'Amount',
      subtotal: 'Subtotal',
      discount: 'Discount',
      total: 'Total',
      paid: 'Amount Paid',
      balance: 'Balance Due',
      payHeading: 'Payment Instructions',
      notesHeading: 'Notes & Terms',
      freeFooter: 'Generated with CraftLeaf Invoice Studio · 100% Private Browser PDF'
    },
    zh: {
      invoice: '商业账单 / 发票',
      quote: '项目报价单',
      receipt: '收款收据 (已结清)',
      docNo: '单据编号',
      issueDate: '开票日期',
      dueDate: '截止日期',
      terms: '账期条款',
      billTo: '客户抬头 (Bill To)',
      amountDueBox: '待付总额',
      amountPaidBox: '实收总额',
      quoteTotalBox: '报价总额',
      colDesc: '项目与服务说明',
      colQty: '数量/工时',
      colRate: '单价',
      colAmt: '小计金额',
      subtotal: '项目小计',
      discount: '优惠折扣',
      total: '应收总计',
      paid: '已付抵扣',
      balance: '待结清尾款',
      payHeading: '收款账户与结算说明',
      notesHeading: '备注条款',
      freeFooter: 'Generated with CraftLeaf Invoice Studio · 纯本地隐私安全账单'
    },
    bilingual: {
      invoice: 'COMMERCIAL INVOICE / 商业发票',
      quote: 'QUOTATION / 项目报价单',
      receipt: 'OFFICIAL RECEIPT / 收款收据',
      docNo: 'Invoice # / 编号',
      issueDate: 'Date / 开票日',
      dueDate: 'Due / 截止日',
      terms: 'Terms / 条款',
      billTo: 'Bill To / 客户抬头',
      amountDueBox: 'Balance Due / 待付金额',
      amountPaidBox: 'Total Paid / 已收金额',
      quoteTotalBox: 'Quote Total / 报价总额',
      colDesc: 'Description / 服务项目明细',
      colQty: 'Qty / 数量',
      colRate: 'Rate / 单价',
      colAmt: 'Amount / 金额',
      subtotal: 'Subtotal / 小计',
      discount: 'Discount / 折扣',
      total: 'Total / 总计',
      paid: 'Paid / 已付',
      balance: 'Balance Due / 待付尾款',
      payHeading: 'Payment Instructions / 收款账户信息',
      notesHeading: 'Notes / 备注说明',
      freeFooter: 'Generated with CraftLeaf Invoice Studio · Privacy-First Offline PDF'
    }
  };

  // Expose testable API for JSC verification
  root.InvoiceStudio = {
    CURRENCIES: CURRENCIES,
    TEMPLATES: TEMPLATES,
    resolveTemplateKey: resolveTemplateKey,
    calculateTotals: calculateTotals,
    formatMoney: formatMoney,
    toMinorUnits: toMinorUnits,
    fromMinorUnits: fromMinorUnits,
    parseLedgerCsv: parseLedgerCsv,
    listStatementClients: listStatementClients,
    computeOpenItemStatement: computeOpenItemStatement,
    exportStatementCsvString: exportStatementCsvString,
    SAMPLE_STATEMENT_LEDGER: SAMPLE_STATEMENT_LEDGER,
    SAMPLE_STATEMENT_DUPLICATE_ROW: SAMPLE_STATEMENT_DUPLICATE_ROW,
    generateQRSvg: generateQRSvg
  };

  if (typeof document === 'undefined') {
    return;
  }

  // =========================================================================
  // Dual-Persisted CRM Storage (IndexedDB + localStorage mirror)
  // =========================================================================
  var CRM_LS_KEY = 'craftleaf_invoice_crm_v1';
  var DRAFT_LS_KEY = 'craftleaf_invoice_draft_v1';

  var crmData = {
    clients: [
      { id: 'c_demo1', name: 'Acme Product Labs Inc.', details: 'billing@acmelabs.example\n548 Market St, San Francisco, CA 94104' },
      { id: 'c_demo2', name: 'Nordic Cloud Systems GmbH', details: 'accounting@nordiccloud.example\nFriedrichstr. 114, Berlin · VAT: DE309481920' }
    ],
    catalog: [
      { id: 'i_demo1', desc: 'Senior Architecture & Product Engineering (Hourly)', qty: 10, rate: 150 },
      { id: 'i_demo2', desc: 'UI/UX Design Sprint & Figma Design System', qty: 1, rate: 1800 }
    ],
    ledger: []
  };

  function openCrmDb(cb) {
    if (typeof indexedDB === 'undefined') { cb(null); return; }
    if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
      cb(null);
      return;
    }
    var settled = false;
    function finish(db) {
      if (settled) return;
      settled = true;
      cb(db);
    }
    try {
      var req = indexedDB.open('CraftLeafInvoiceCRM', 1);
      req.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains('kv')) {
          db.createObjectStore('kv');
        }
      };
      req.onsuccess = function (e) { finish(e.target.result); };
      req.onerror = function () { finish(null); };
      req.onblocked = function () { finish(null); };
      setTimeout(function () { finish(null); }, 400);
    } catch (_e) {
      finish(null);
    }
  }

  function persistCrm() {
    var raw = JSON.stringify(crmData);
    try { localStorage.setItem(CRM_LS_KEY, raw); } catch (_e) {}
    openCrmDb(function (db) {
      if (!db) return;
      try {
        var tx = db.transaction('kv', 'readwrite');
        tx.objectStore('kv').put(crmData, 'crm_bundle');
      } catch (_e2) {}
    });
  }

  function loadCrm(done) {
    try {
      var saved = localStorage.getItem(CRM_LS_KEY);
      if (saved) {
        var parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.clients)) crmData = parsed;
      }
    } catch (_e) {}
    openCrmDb(function (db) {
      if (!db) { done(); return; }
      try {
        var tx = db.transaction('kv', 'readonly');
        var getReq = tx.objectStore('kv').get('crm_bundle');
        getReq.onsuccess = function () {
          if (getReq.result && Array.isArray(getReq.result.clients)) {
            crmData = getReq.result;
          }
          done();
        };
        getReq.onerror = function () { done(); };
      } catch (_e2) {
        done();
      }
    });
  }

  // =========================================================================
  // Browser App State & Live Preview Rendering
  // =========================================================================
  var todayIso = new Date().toISOString().slice(0, 10);
  var dueIso = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);

  var state = {
    lang: 'en',
    templateKey: 'freelance',
    paper: 'a4',
    crmTab: 'clients',
    previewMode: 'invoice',
    stmt: {
      useDemo: true,
      includeDupDemo: false,
      clientName: 'Acme Product Labs Inc.',
      currency: 'USD',
      statementDate: todayIso,
      resolvedDuplicates: {},
      confirmedBalancesCurrent: false
    },
    doc: {
      docType: 'invoice',
      docLang: 'en',
      currency: 'USD',
      invNumber: 'INV-2026-042',
      issueDate: todayIso,
      dueDate: dueIso,
      senderName: '',
      senderDetails: '',
      clientName: '',
      clientDetails: '',
      items: [],
      discountType: 'percent',
      discountValue: 0,
      taxLabel: 'Sales Tax',
      taxRate: 0,
      amountPaid: 0,
      terms: 'Net 14 Days',
      paymentInfo: '',
      notes: '',
      accentColor: '#1e3a8a',
      logoDataUrl: '',
      hideFooter: true,
      qrUrl: 'https://963239327.github.io/craftleaf-studio/',
      qrCaption: 'Scan QR or visit payment link to pay online'
    }
  };

  function $(id) { return document.getElementById(id); }

  function isPro() {
    return !!(root.CraftLeafSDK && root.CraftLeafSDK.isUnlocked('invoicePro', 'INVPRO'));
  }

  function applyTemplateToDoc(tplKey) {
    var t = TEMPLATES[resolveTemplateKey(tplKey)];
    state.templateKey = t.id;
    state.doc.docType = t.docType;
    state.doc.docLang = t.docLang;
    state.doc.currency = t.currency;
    state.doc.taxLabel = t.taxLabel;
    state.doc.taxRate = t.taxRate;
    state.doc.discountType = t.discountType;
    state.doc.discountValue = t.discountValue;
    state.doc.amountPaid = t.amountPaidOverride || 0;
    state.doc.terms = t.terms;
    state.doc.senderName = t.senderName;
    state.doc.senderDetails = t.senderDetails;
    state.doc.clientName = t.clientName;
    state.doc.clientDetails = t.clientDetails;
    state.doc.paymentInfo = t.paymentInfo;
    state.doc.notes = t.notes;
    state.doc.items = t.items.map(function (it) {
      return { desc: it.desc, qty: it.qty, rate: it.rate };
    });
  }

  function saveDraft() {
    try {
      localStorage.setItem(DRAFT_LS_KEY, JSON.stringify(state.doc));
    } catch (_e) {}
  }

  function syncInputsFromDoc() {
    $('docTypeSelect').value = state.doc.docType;
    $('docLangSelect').value = state.doc.docLang;
    $('currencySelect').value = state.doc.currency;
    $('invNumInput').value = state.doc.invNumber;
    $('issueDateInput').value = state.doc.issueDate;
    $('dueDateInput').value = state.doc.dueDate;
    $('senderNameInput').value = state.doc.senderName;
    $('senderDetailsInput').value = state.doc.senderDetails;
    $('clientNameInput').value = state.doc.clientName;
    $('clientDetailsInput').value = state.doc.clientDetails;
    $('discTypeSelect').value = state.doc.discountType;
    $('discValInput').value = state.doc.discountValue;
    $('taxLabelInput').value = state.doc.taxLabel;
    $('taxRateInput').value = state.doc.taxRate;
    $('amtPaidInput').value = state.doc.amountPaid;
    $('termsInput').value = state.doc.terms;
    $('payInfoInput').value = state.doc.paymentInfo;
    $('notesInput').value = state.doc.notes;
    $('customColorPicker').value = state.doc.accentColor;
    $('hideFooterChk').checked = !!state.doc.hideFooter;
    $('qrUrlInput').value = state.doc.qrUrl || '';
    $('qrCaptionInput').value = state.doc.qrCaption || '';
    renderLineItemEditors();
  }

  function renderLineItemEditors() {
    var list = $('lineItemsList');
    list.innerHTML = '';
    var totals = calculateTotals(state.doc);
    state.doc.items.forEach(function (it, idx) {
      var row = document.createElement('div');
      row.className = 'line-item-editor-row';

      var descInp = document.createElement('input');
      descInp.type = 'text';
      descInp.className = 'input';
      descInp.placeholder = state.lang === 'zh' ? '服务描述 / 项目明细' : 'Service or Deliverable Description';
      descInp.value = it.desc;
      descInp.addEventListener('input', function (e) {
        state.doc.items[idx].desc = e.target.value;
        updateInvoicePreview();
      });

      var qtyInp = document.createElement('input');
      qtyInp.type = 'number';
      qtyInp.step = 'any';
      qtyInp.min = '0';
      qtyInp.className = 'input';
      qtyInp.title = 'Qty';
      qtyInp.value = it.qty;
      qtyInp.addEventListener('input', function (e) {
        state.doc.items[idx].qty = Number(e.target.value) || 0;
        amtChip.textContent = formatMoney(roundMoney(state.doc.items[idx].qty * state.doc.items[idx].rate), state.doc.currency);
        updateInvoicePreview();
      });

      var rateInp = document.createElement('input');
      rateInp.type = 'number';
      rateInp.step = 'any';
      rateInp.min = '0';
      rateInp.className = 'input';
      rateInp.title = 'Rate';
      rateInp.value = it.rate;
      rateInp.addEventListener('input', function (e) {
        state.doc.items[idx].rate = Number(e.target.value) || 0;
        amtChip.textContent = formatMoney(roundMoney(state.doc.items[idx].qty * state.doc.items[idx].rate), state.doc.currency);
        updateInvoicePreview();
      });

      var amtChip = document.createElement('div');
      amtChip.className = 'line-amt-chip';
      amtChip.textContent = formatMoney(totals.lineAmounts[idx] || 0, state.doc.currency);

      var delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'icon-del-btn';
      delBtn.textContent = '×';
      delBtn.title = 'Remove';
      delBtn.addEventListener('click', function () {
        if (state.doc.items.length <= 1) {
          state.doc.items[0] = { desc: '', qty: 1, rate: 0 };
        } else {
          state.doc.items.splice(idx, 1);
        }
        renderLineItemEditors();
        updateInvoicePreview();
      });

      row.appendChild(descInp);
      row.appendChild(qtyInp);
      row.appendChild(rateInp);
      row.appendChild(amtChip);
      row.appendChild(delBtn);
      list.appendChild(row);
    });
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getActiveStatementEntries() {
    if (!state.stmt.useDemo && crmData.ledger.length > 0) {
      return crmData.ledger;
    }
    var base = SAMPLE_STATEMENT_LEDGER.slice();
    if (state.stmt.includeDupDemo) {
      base.push(SAMPLE_STATEMENT_DUPLICATE_ROW);
    }
    return base;
  }

  function renderStatementPaperDom(paperEl) {
    var unlocked = isPro();
    var d = state.doc;
    var effectiveAccent = unlocked ? (d.accentColor || '#1e3a8a') : '#1e3a8a';
    paperEl.style.setProperty('--inv-accent', effectiveAccent);
    paperEl.classList.toggle('paper-letter', state.paper === 'letter');
    while (paperEl.firstChild) paperEl.removeChild(paperEl.firstChild);

    var stmt = computeOpenItemStatement(getActiveStatementEntries(), {
      clientName: state.stmt.clientName,
      currency: state.stmt.currency,
      statementDate: state.stmt.statementDate || todayIso,
      resolvedDuplicates: state.stmt.resolvedDuplicates,
      confirmedBalancesCurrent: state.stmt.confirmedBalancesCurrent
    });

    var isZh = d.docLang === 'zh';
    var isBi = d.docLang === 'bilingual';
    var headingText = isBi ? 'STATEMENT OF OPEN INVOICES / 未结账单对账单' : (isZh ? '客户未结账单对账单' : 'STATEMENT OF OPEN INVOICES');
    var noticeText = isBi
      ? 'Summary of open & partially paid invoices only (NOT a new invoice). Settled bills and estimates are omitted. / 仅汇总当前未结清发票尾款（非新开发票），已结清账单与报价单已自动剔除。'
      : (isZh
        ? '本单据为未结清账单余额对账摘要（非新开发票），请按下方原发票编号核对付款；已结清账单与报价单不在此列。'
        : 'Open-Item Account Summary (NOT a new invoice) — Please remit referencing the original invoice numbers below. Settled bills and estimates are omitted.');

    var topWrap = document.createElement('div');

    // Header
    var header = document.createElement('div');
    header.className = 'inv-header';
    var brandBox = document.createElement('div');
    brandBox.className = 'inv-brand-box';
    if (unlocked && d.logoDataUrl) {
      var logoImg = document.createElement('img');
      logoImg.className = 'inv-logo-img';
      logoImg.src = d.logoDataUrl;
      logoImg.alt = 'Brand Logo';
      logoImg.style.maxHeight = '54px';
      brandBox.appendChild(logoImg);
    }
    var senderH2 = document.createElement('h2');
    senderH2.className = 'inv-sender-name';
    senderH2.textContent = d.senderName || 'Northstar Independent Studio';
    brandBox.appendChild(senderH2);
    var senderPre = document.createElement('div');
    senderPre.className = 'inv-preline';
    senderPre.textContent = d.senderDetails || '';
    brandBox.appendChild(senderPre);

    var metaBox = document.createElement('div');
    metaBox.className = 'inv-doc-meta';
    var badge = document.createElement('div');
    badge.className = 'inv-doc-badge';
    badge.style.fontSize = '21px';
    badge.textContent = headingText;
    metaBox.appendChild(badge);

    var metaGrid = document.createElement('div');
    metaGrid.className = 'inv-meta-grid';
    function addMetaPair(lbl, val) {
      var s1 = document.createElement('span');
      s1.className = 'inv-meta-label';
      s1.textContent = lbl;
      var s2 = document.createElement('span');
      s2.className = 'inv-meta-val';
      s2.textContent = val;
      metaGrid.appendChild(s1);
      metaGrid.appendChild(s2);
    }
    addMetaPair(isZh ? '对账日期:' : 'Statement Date:', stmt.statementDate || todayIso);
    addMetaPair(isZh ? '结算币种:' : 'Currency:', stmt.currency);
    addMetaPair(isZh ? '未结笔数:' : 'Open Invoices:', String(stmt.openItems.length));
    addMetaPair(isZh ? '数据来源:' : 'Source:', state.stmt.useDemo ? 'Worked Example ($170 Demo)' : 'Local Studio Ledger');
    metaBox.appendChild(metaGrid);

    header.appendChild(brandBox);
    header.appendChild(metaBox);
    topWrap.appendChild(header);

    var noticeDiv = document.createElement('div');
    noticeDiv.className = 'inv-stmt-notice';
    noticeDiv.textContent = noticeText;
    topWrap.appendChild(noticeDiv);

    // Parties & Total Outstanding Box
    var parties = document.createElement('div');
    parties.className = 'inv-parties';
    var clientCol = document.createElement('div');
    var kicker1 = document.createElement('div');
    kicker1.className = 'inv-section-kicker';
    kicker1.textContent = isZh ? '对账客户 (Statement For)' : 'Statement For (Single Client)';
    var cNameEl = document.createElement('div');
    cNameEl.className = 'inv-client-name';
    cNameEl.textContent = stmt.clientName || 'Select a Client';
    var cDetEl = document.createElement('div');
    cDetEl.className = 'inv-preline';
    cDetEl.textContent = stmt.clientDetails || '';
    clientCol.appendChild(kicker1);
    clientCol.appendChild(cNameEl);
    clientCol.appendChild(cDetEl);

    var sumHighlight = document.createElement('div');
    sumHighlight.className = 'inv-summary-highlight';
    var kicker2 = document.createElement('div');
    kicker2.className = 'inv-section-kicker';
    kicker2.style.marginBottom = '2px';
    kicker2.textContent = isZh ? '当前未结总额' : 'Total Outstanding';
    var hiAmt = document.createElement('div');
    hiAmt.className = 'inv-highlight-amt';
    hiAmt.textContent = (stmt.status === 'DUPLICATE_INVOICE_CONFLICT' || stmt.status === 'MISSING_INVOICE_NUMBER')
      ? (isZh ? '⚠️ 需先消除重号' : '⚠️ Resolve Conflict')
      : stmt.formattedTotalOutstanding;
    var hiSub = document.createElement('div');
    hiSub.style.fontSize = '11.5px';
    hiSub.style.color = '#64748b';
    hiSub.style.marginTop = '2px';
    hiSub.textContent = stmt.confirmedBalancesCurrent
      ? (isZh ? '✓ 已确认截至对账日收款已入账' : '✓ Balances confirmed current by sender')
      : (isZh ? '待勾选确认收款余额后方可打印导出' : 'Pending sender balance confirmation checkbox');
    sumHighlight.appendChild(kicker2);
    sumHighlight.appendChild(hiAmt);
    sumHighlight.appendChild(hiSub);

    parties.appendChild(clientCol);
    parties.appendChild(sumHighlight);
    topWrap.appendChild(parties);

    // Table or Conflict Alert
    if (stmt.status === 'DUPLICATE_INVOICE_CONFLICT' || stmt.status === 'MISSING_INVOICE_NUMBER') {
      var warnBox = document.createElement('div');
      warnBox.className = 'stmt-conflict-box';
      warnBox.textContent = stmt.status === 'MISSING_INVOICE_NUMBER'
        ? 'Action required: One or more invoices for this client have a blank Invoice #. Assign unique invoice numbers before issuing a statement.'
        : 'Action required: Multiple saved versions exist for Invoice ' + stmt.duplicateConflicts.map(function (d) { return d.invNumber; }).join(', ') + '. Resolve which version is current in the left panel so no invoice is counted twice.';
      topWrap.appendChild(warnBox);
    } else {
      var tbl = document.createElement('table');
      tbl.className = 'inv-table';
      var thead = document.createElement('thead');
      var hr = document.createElement('tr');
      var cols = isZh
        ? [['原发票编号', ''], ['开票日期', ''], ['到期日', ''], ['发票总额', 'num'], ['已付金额', 'num'], ['待付尾款', 'num']]
        : [['Invoice #', ''], ['Issue Date', ''], ['Due Date', ''], ['Invoice Total', 'num'], ['Paid to Date', 'num'], ['Remaining Balance', 'num']];
      for (var hc = 0; hc < cols.length; hc++) {
        var th = document.createElement('th');
        th.textContent = cols[hc][0];
        if (cols[hc][1]) th.className = cols[hc][1];
        hr.appendChild(th);
      }
      thead.appendChild(hr);
      tbl.appendChild(thead);

      var tbody = document.createElement('tbody');
      if (stmt.openItems.length === 0) {
        var emptyTr = document.createElement('tr');
        var emptyTd = document.createElement('td');
        emptyTd.colSpan = 6;
        emptyTd.style.textAlign = 'center';
        emptyTd.style.color = '#64748b';
        emptyTd.textContent = isZh ? '当前客户在该币种下无未结清账单（余额 $0.00）。' : 'No unpaid invoices for this client and currency ($0.00 outstanding).';
        emptyTr.appendChild(emptyTd);
        tbody.appendChild(emptyTr);
      } else {
        for (var rIdx = 0; rIdx < stmt.openItems.length; rIdx++) {
          var rowItem = stmt.openItems[rIdx];
          var tr = document.createElement('tr');

          var tdInv = document.createElement('td');
          var stInv = document.createElement('strong');
          stInv.textContent = rowItem.invNumber;
          tdInv.appendChild(stInv);
          if (rowItem.isOverdue) {
            var ov = document.createElement('span');
            ov.className = 'inv-overdue-pill';
            ov.textContent = isZh ? '逾期' : 'Past Due';
            tdInv.appendChild(ov);
          }

          var tdIssue = document.createElement('td');
          tdIssue.textContent = rowItem.issueDate || '—';

          var tdDue = document.createElement('td');
          tdDue.textContent = rowItem.dueDate || '—';

          var tdTot = document.createElement('td');
          tdTot.className = 'num';
          tdTot.textContent = formatMoney(rowItem.total, stmt.currency);

          var tdPaid = document.createElement('td');
          tdPaid.className = 'num';
          tdPaid.textContent = formatMoney(rowItem.amountPaid, stmt.currency);

          var tdRem = document.createElement('td');
          tdRem.className = 'num';
          var stRem = document.createElement('strong');
          stRem.textContent = formatMoney(rowItem.remainingBalance, stmt.currency);
          tdRem.appendChild(stRem);

          tr.appendChild(tdInv);
          tr.appendChild(tdIssue);
          tr.appendChild(tdDue);
          tr.appendChild(tdTot);
          tr.appendChild(tdPaid);
          tr.appendChild(tdRem);
          tbody.appendChild(tr);
        }
      }
      tbl.appendChild(tbody);
      topWrap.appendChild(tbl);

      var totWrap = document.createElement('div');
      totWrap.className = 'inv-totals-wrap';
      var totBox = document.createElement('div');
      totBox.className = 'inv-totals-box';
      var totRow = document.createElement('div');
      totRow.className = 'inv-tot-row grand';
      var lblSpan = document.createElement('span');
      lblSpan.textContent = isZh ? '未结清应付合计' : 'Total Outstanding';
      var valSpan = document.createElement('span');
      valSpan.textContent = stmt.formattedTotalOutstanding;
      totRow.appendChild(lblSpan);
      totRow.appendChild(valSpan);
      totBox.appendChild(totRow);
      totWrap.appendChild(totBox);
      topWrap.appendChild(totWrap);
    }

    var botWrap = document.createElement('div');
    var botGrid = document.createElement('div');
    botGrid.className = 'inv-bottom-grid';
    var notesCol = document.createElement('div');
    notesCol.className = 'inv-notes-col';
    if (d.paymentInfo) {
      var pk = document.createElement('div');
      pk.className = 'inv-section-kicker';
      pk.textContent = isZh ? '收款账户与汇款说明' : 'Remittance & Payment Instructions';
      var pp = document.createElement('div');
      pp.className = 'inv-preline';
      pp.style.marginBottom = '10px';
      pp.textContent = d.paymentInfo;
      notesCol.appendChild(pk);
      notesCol.appendChild(pp);
    }
    botGrid.appendChild(notesCol);
    botWrap.appendChild(botGrid);

    if (!unlocked || !d.hideFooter) {
      var ftr = document.createElement('div');
      ftr.className = 'inv-footer-brand';
      ftr.textContent = (DOC_LABELS[d.docLang] || DOC_LABELS.en).freeFooter;
      botWrap.appendChild(ftr);
    }

    paperEl.appendChild(topWrap);
    paperEl.appendChild(botWrap);
  }

  function updateInvoicePreview() {
    if (state.previewMode === 'statement') {
      renderStatementPaperDom($('invoicePaper'));
      return;
    }
    var unlocked = isPro();
    var d = state.doc;
    var labels = DOC_LABELS[d.docLang] || DOC_LABELS.en;
    var totals = calculateTotals(d);
    var paperEl = $('invoicePaper');

    var effectiveAccent = unlocked ? (d.accentColor || '#1e3a8a') : '#1e3a8a';
    paperEl.style.setProperty('--inv-accent', effectiveAccent);
    paperEl.classList.toggle('paper-letter', state.paper === 'letter');

    var docHeading = labels[d.docType] || labels.invoice;
    var logoHtml = (unlocked && d.logoDataUrl)
      ? '<img class="inv-logo-img" src="' + escapeHtml(d.logoDataUrl) + '" alt="Brand Logo" style="max-height:54px;" />'
      : '';

    var highlightTitle = d.docType === 'receipt' ? labels.amountPaidBox : (d.docType === 'quote' ? labels.quoteTotalBox : labels.amountDueBox);
    var highlightValue = d.docType === 'receipt'
      ? formatMoney(totals.amountPaid > 0 ? totals.amountPaid : totals.total, d.currency)
      : (d.docType === 'quote' ? formatMoney(totals.total, d.currency) : formatMoney(totals.balanceDue, d.currency));

    var rowsHtml = '';
    for (var i = 0; i < d.items.length; i++) {
      var it = d.items[i];
      rowsHtml += '<tr>' +
        '<td><strong>' + escapeHtml(it.desc || '—') + '</strong></td>' +
        '<td class="num">' + escapeHtml(it.qty) + '</td>' +
        '<td class="num">' + escapeHtml(formatMoney(it.rate, d.currency)) + '</td>' +
        '<td class="num"><strong>' + escapeHtml(formatMoney(totals.lineAmounts[i], d.currency)) + '</strong></td>' +
        '</tr>';
    }

    var totalsRowsHtml = '<div class="inv-tot-row"><span>' + escapeHtml(labels.subtotal) + '</span><span>' + formatMoney(totals.subtotal, d.currency) + '</span></div>';
    if (totals.discountAmount > 0) {
      var discSuffix = d.discountType === 'percent' ? ' (' + d.discountValue + '%)' : '';
      totalsRowsHtml += '<div class="inv-tot-row"><span>' + escapeHtml(labels.discount + discSuffix) + '</span><span>-' + formatMoney(totals.discountAmount, d.currency) + '</span></div>';
    }
    if (Number(d.taxRate) > 0 || (d.taxLabel && d.taxLabel.indexOf('Reverse') !== -1)) {
      totalsRowsHtml += '<div class="inv-tot-row"><span>' + escapeHtml((d.taxLabel || 'Tax') + ' (' + (Number(d.taxRate) || 0) + '%)') + '</span><span>' + formatMoney(totals.taxAmount, d.currency) + '</span></div>';
    }
    totalsRowsHtml += '<div class="inv-tot-row grand"><span>' + escapeHtml(labels.total) + '</span><span>' + formatMoney(totals.total, d.currency) + '</span></div>';
    if (totals.amountPaid > 0 || d.docType === 'receipt') {
      totalsRowsHtml += '<div class="inv-tot-row"><span>' + escapeHtml(labels.paid) + '</span><span>-' + formatMoney(totals.amountPaid, d.currency) + '</span></div>';
      totalsRowsHtml += '<div class="inv-tot-row balance"><span>' + escapeHtml(labels.balance) + '</span><span>' + formatMoney(totals.balanceDue, d.currency) + '</span></div>';
    }

    var qrHtml = '';
    if (unlocked && d.qrUrl && d.qrUrl.trim().length > 0) {
      var svgMarkup = generateQRSvg(d.qrUrl.trim(), effectiveAccent);
      if (svgMarkup) {
        qrHtml = '<div class="inv-qr-box">' +
          '<div class="inv-qr-svg-wrap">' + svgMarkup + '</div>' +
          '<div class="inv-qr-caption"><strong style="display:block;color:#0f172a;margin-bottom:3px;">' + escapeHtml(d.qrCaption || 'Scan to Pay Online') + '</strong>' +
          '<span>' + escapeHtml(d.qrUrl.trim()) + '</span></div></div>';
      }
    }

    var showCraftLeafFooter = !unlocked || !d.hideFooter;
    var footerHtml = showCraftLeafFooter
      ? '<div class="inv-footer-brand">' + escapeHtml(labels.freeFooter) + '</div>'
      : '';

    paperEl.innerHTML =
      '<div>' +
        '<div class="inv-header">' +
          '<div class="inv-brand-box">' +
            logoHtml +
            '<h2 class="inv-sender-name">' + escapeHtml(d.senderName || 'Your Studio / Name') + '</h2>' +
            '<div class="inv-preline">' + escapeHtml(d.senderDetails) + '</div>' +
          '</div>' +
          '<div class="inv-doc-meta">' +
            '<div class="inv-doc-badge">' + escapeHtml(docHeading) + '</div>' +
            '<div class="inv-meta-grid">' +
              '<span class="inv-meta-label">' + escapeHtml(labels.docNo) + ':</span><span class="inv-meta-val">' + escapeHtml(d.invNumber) + '</span>' +
              '<span class="inv-meta-label">' + escapeHtml(labels.issueDate) + ':</span><span class="inv-meta-val">' + escapeHtml(d.issueDate) + '</span>' +
              '<span class="inv-meta-label">' + escapeHtml(labels.dueDate) + ':</span><span class="inv-meta-val">' + escapeHtml(d.dueDate) + '</span>' +
              '<span class="inv-meta-label">' + escapeHtml(labels.terms) + ':</span><span class="inv-meta-val">' + escapeHtml(d.terms) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="inv-parties">' +
          '<div>' +
            '<div class="inv-section-kicker">' + escapeHtml(labels.billTo) + '</div>' +
            '<div class="inv-client-name">' + escapeHtml(d.clientName || 'Client Name') + '</div>' +
            '<div class="inv-preline">' + escapeHtml(d.clientDetails) + '</div>' +
          '</div>' +
          '<div class="inv-summary-highlight">' +
            '<div class="inv-section-kicker" style="margin-bottom:2px;">' + escapeHtml(highlightTitle) + '</div>' +
            '<div class="inv-highlight-amt">' + escapeHtml(highlightValue) + '</div>' +
            '<div style="font-size:11.5px;color:#64748b;margin-top:2px;">' + escapeHtml(d.currency + ' · ' + d.terms) + '</div>' +
          '</div>' +
        '</div>' +

        '<table class="inv-table">' +
          '<thead><tr>' +
            '<th>' + escapeHtml(labels.colDesc) + '</th>' +
            '<th class="num" style="width:88px;">' + escapeHtml(labels.colQty) + '</th>' +
            '<th class="num" style="width:116px;">' + escapeHtml(labels.colRate) + '</th>' +
            '<th class="num" style="width:124px;">' + escapeHtml(labels.colAmt) + '</th>' +
          '</tr></thead>' +
          '<tbody>' + rowsHtml + '</tbody>' +
        '</table>' +

        '<div class="inv-totals-wrap"><div class="inv-totals-box">' + totalsRowsHtml + '</div></div>' +
      '</div>' +

      '<div>' +
        '<div class="inv-bottom-grid">' +
          '<div class="inv-notes-col">' +
            (d.paymentInfo ? '<div class="inv-section-kicker">' + escapeHtml(labels.payHeading) + '</div><div class="inv-preline" style="margin-bottom:10px;">' + escapeHtml(d.paymentInfo) + '</div>' : '') +
            (d.notes ? '<div class="inv-section-kicker">' + escapeHtml(labels.notesHeading) + '</div><div class="inv-preline">' + escapeHtml(d.notes) + '</div>' : '') +
          '</div>' +
          qrHtml +
        '</div>' +
        footerHtml +
      '</div>';

    saveDraft();
  }

  function syncStatementControls() {
    var entries = getActiveStatementEntries();
    var clients = listStatementClients(entries);
    var clientSel = $('stmtClientSelect');
    var curSel = $('stmtCurrencySelect');
    if (!clientSel || !curSel) return;

    while (clientSel.firstChild) clientSel.removeChild(clientSel.firstChild);
    if (!clients.length) {
      var emptyOpt = document.createElement('option');
      emptyOpt.value = '';
      emptyOpt.textContent = state.lang === 'zh' ? '暂无台账客户' : 'No clients in ledger';
      clientSel.appendChild(emptyOpt);
    } else {
      var foundClient = null;
      for (var i = 0; i < clients.length; i++) {
        if (normalizeClientKey(clients[i].clientName) === normalizeClientKey(state.stmt.clientName)) {
          foundClient = clients[i];
          break;
        }
      }
      if (!foundClient) {
        foundClient = clients[0];
        state.stmt.clientName = foundClient.clientName;
      }
      for (var c = 0; c < clients.length; c++) {
        var opt = document.createElement('option');
        opt.value = clients[c].clientName;
        opt.textContent = clients[c].clientName;
        if (normalizeClientKey(clients[c].clientName) === foundClient.clientKey) opt.selected = true;
        clientSel.appendChild(opt);
      }

      while (curSel.firstChild) curSel.removeChild(curSel.firstChild);
      var availCurs = foundClient.currencies.length ? foundClient.currencies : ['USD'];
      if (availCurs.indexOf(state.stmt.currency) === -1) {
        state.stmt.currency = availCurs[0];
      }
      for (var k = 0; k < availCurs.length; k++) {
        var cOpt = document.createElement('option');
        cOpt.value = availCurs[k];
        cOpt.textContent = (CURRENCIES[availCurs[k]] && CURRENCIES[availCurs[k]].label) || availCurs[k];
        if (availCurs[k] === state.stmt.currency) cOpt.selected = true;
        curSel.appendChild(cOpt);
      }
    }

    if ($('stmtDateInput')) $('stmtDateInput').value = state.stmt.statementDate || todayIso;
    if ($('stmtConfirmBalancesChk')) $('stmtConfirmBalancesChk').checked = !!state.stmt.confirmedBalancesCurrent;

    var stmt = computeOpenItemStatement(entries, {
      clientName: state.stmt.clientName,
      currency: state.stmt.currency,
      statementDate: state.stmt.statementDate || todayIso,
      resolvedDuplicates: state.stmt.resolvedDuplicates,
      confirmedBalancesCurrent: state.stmt.confirmedBalancesCurrent
    });

    var exclEl = $('stmtExcludedBanner');
    if (exclEl) {
      var ex = stmt.excludedCounts;
      exclEl.textContent = state.lang === 'zh'
        ? ('自动隔离与过滤：已结清 ' + ex.settled + ' 笔 · 报价单 ' + ex.quotes + ' 笔 · 其他客户 ' + ex.otherClients + ' 笔' + (state.stmt.useDemo ? '（当前展示 $170 演示数据）' : '（本地台账）'))
        : ('Auto-excluded: ' + ex.settled + ' settled · ' + ex.quotes + ' quote(s) · ' + ex.otherClients + ' other-client bill(s)' + (state.stmt.useDemo ? ' ($170 worked demo active)' : ' (your local ledger)'));
    }

    var confBox = $('stmtConflictBox');
    if (confBox) {
      while (confBox.firstChild) confBox.removeChild(confBox.firstChild);
      if (stmt.duplicateConflicts.length > 0) {
        confBox.style.display = 'block';
        var title = document.createElement('strong');
        title.textContent = state.lang === 'zh'
          ? '⚠️ 检测到重复发票编号（必须由您指定保留哪一版，禁止重复累加）：'
          : '⚠️ Duplicate saved versions detected (pick 1 authoritative record so it is never counted twice):';
        confBox.appendChild(title);

        stmt.duplicateConflicts.forEach(function (dup) {
          dup.candidates.forEach(function (cand) {
            var optRow = document.createElement('div');
            optRow.className = 'stmt-conflict-option';
            var desc = document.createElement('span');
            desc.textContent = cand.invNumber + ' · ' + cand.status + ' · Paid ' + formatMoney(cand.amountPaid, stmt.currency) + ' / Rem ' + formatMoney(cand.remainingBalance, stmt.currency);
            var pickBtn = document.createElement('button');
            pickBtn.type = 'button';
            pickBtn.className = 'btn btn-xs btn-primary';
            pickBtn.textContent = state.lang === 'zh' ? '以此版为准' : 'Use This Version';
            pickBtn.addEventListener('click', function () {
              state.stmt.resolvedDuplicates[dup.invKey] = cand.id;
              syncStatementControls();
              updateInvoicePreview();
            });
            optRow.appendChild(desc);
            optRow.appendChild(pickBtn);
            confBox.appendChild(optRow);
          });
        });
      } else {
        confBox.style.display = 'none';
      }
    }
  }

  function renderCrmPanel() {
    var listEl = $('crmSavedList');
    listEl.innerHTML = '';
    var unlocked = isPro();

    $('crmTabClients').classList.toggle('active', state.crmTab === 'clients');
    $('crmTabCatalog').classList.toggle('active', state.crmTab === 'catalog');
    $('crmTabLedger').classList.toggle('active', state.crmTab === 'ledger');
    if ($('crmTabStatement')) $('crmTabStatement').classList.toggle('active', state.crmTab === 'statement');

    $('crmActionsClients').style.display = state.crmTab === 'clients' ? 'flex' : 'none';
    $('crmActionsCatalog').style.display = state.crmTab === 'catalog' ? 'flex' : 'none';
    $('crmActionsLedger').style.display = state.crmTab === 'ledger' ? 'flex' : 'none';
    if ($('crmStatementPane')) $('crmStatementPane').style.display = state.crmTab === 'statement' ? 'block' : 'none';
    listEl.style.display = state.crmTab === 'statement' ? 'none' : 'flex';

    if (state.crmTab === 'statement') {
      if (!state.stmt.useDemo && !crmData.ledger.length) {
        state.stmt.useDemo = true;
      } else if (unlocked && crmData.ledger.length > 0 && state.stmt.useDemo === undefined) {
        state.stmt.useDemo = false;
      }
      syncStatementControls();
      return;
    }

    if (state.crmTab === 'clients') {
      crmData.clients.forEach(function (c, idx) {
        var row = document.createElement('div');
        row.className = 'crm-row';
        row.innerHTML = '<div class="crm-row-meta"><span class="crm-row-title">' + escapeHtml(c.name) + '</span>' +
          '<span class="crm-row-sub">' + escapeHtml((c.details || '').split('\n')[0]) + '</span></div>';
        var btns = document.createElement('div');
        btns.style.display = 'flex';
        btns.style.gap = '4px';

        var loadB = document.createElement('button');
        loadB.type = 'button';
        loadB.className = 'btn btn-xs';
        loadB.textContent = unlocked ? (state.lang === 'zh' ? '填入' : 'Fill') : '🔒 Pro';
        loadB.addEventListener('click', function () {
          if (!isPro()) { openUnlockModal(); return; }
          state.doc.clientName = c.name;
          state.doc.clientDetails = c.details;
          syncInputsFromDoc();
          updateInvoicePreview();
        });

        var delB = document.createElement('button');
        delB.type = 'button';
        delB.className = 'icon-del-btn';
        delB.textContent = '×';
        delB.addEventListener('click', function () {
          if (!isPro()) { openUnlockModal(); return; }
          crmData.clients.splice(idx, 1);
          persistCrm();
          renderCrmPanel();
        });
        btns.appendChild(loadB);
        btns.appendChild(delB);
        row.appendChild(btns);
        listEl.appendChild(row);
      });
    } else if (state.crmTab === 'catalog') {
      crmData.catalog.forEach(function (it, idx) {
        var row = document.createElement('div');
        row.className = 'crm-row';
        row.innerHTML = '<div class="crm-row-meta"><span class="crm-row-title">' + escapeHtml(it.desc) + '</span>' +
          '<span class="crm-row-sub">' + escapeHtml(it.qty + ' × ' + it.rate) + '</span></div>';
        var btns = document.createElement('div');
        btns.style.display = 'flex';
        btns.style.gap = '4px';

        var insB = document.createElement('button');
        insB.type = 'button';
        insB.className = 'btn btn-xs';
        insB.textContent = unlocked ? (state.lang === 'zh' ? '+ 插入' : '+ Insert') : '🔒 Pro';
        insB.addEventListener('click', function () {
          if (!isPro()) { openUnlockModal(); return; }
          state.doc.items.push({ desc: it.desc, qty: it.qty, rate: it.rate });
          renderLineItemEditors();
          updateInvoicePreview();
        });

        var delB = document.createElement('button');
        delB.type = 'button';
        delB.className = 'icon-del-btn';
        delB.textContent = '×';
        delB.addEventListener('click', function () {
          if (!isPro()) { openUnlockModal(); return; }
          crmData.catalog.splice(idx, 1);
          persistCrm();
          renderCrmPanel();
        });
        btns.appendChild(insB);
        btns.appendChild(delB);
        row.appendChild(btns);
        listEl.appendChild(row);
      });
    } else {
      if (!crmData.ledger.length) {
        var empty = document.createElement('div');
        empty.style.fontSize = '12px';
        empty.style.color = '#64748b';
        empty.style.padding = '6px';
        empty.textContent = state.lang === 'zh'
          ? '暂无归档发票，点击上方按钮可将当前账单存入本地历史台账。'
          : 'No saved ledger entries yet — click "+ Save Invoice to Ledger" above to track billing.';
        listEl.appendChild(empty);
      }
      crmData.ledger.forEach(function (entry, idx) {
        var row = document.createElement('div');
        row.className = 'crm-row';
        row.innerHTML = '<div class="crm-row-meta"><span class="crm-row-title">' + escapeHtml(entry.invNumber + ' · ' + entry.clientName) + '</span>' +
          '<span class="crm-row-sub">' + escapeHtml(entry.issueDate + ' · ' + formatMoney(entry.total, entry.currency) + ' · [' + entry.status + ']') + '</span></div>';
        var btns = document.createElement('div');
        btns.style.display = 'flex';
        btns.style.gap = '4px';

        var loadB = document.createElement('button');
        loadB.type = 'button';
        loadB.className = 'btn btn-xs';
        loadB.textContent = state.lang === 'zh' ? '载入' : 'Load';
        loadB.addEventListener('click', function () {
          if (!isPro()) { openUnlockModal(); return; }
          if (entry.snapshot) {
            state.doc = JSON.parse(JSON.stringify(entry.snapshot));
            syncInputsFromDoc();
            updateInvoicePreview();
          }
        });

        var statusB = document.createElement('button');
        statusB.type = 'button';
        statusB.className = 'btn btn-xs';
        statusB.textContent = entry.status === 'PAID' ? '✓ Paid' : 'Mark Paid';
        statusB.addEventListener('click', function () {
          if (!isPro()) { openUnlockModal(); return; }
          entry.status = entry.status === 'PAID' ? 'SENT' : 'PAID';
          persistCrm();
          renderCrmPanel();
        });

        var delLedgerB = document.createElement('button');
        delLedgerB.type = 'button';
        delLedgerB.className = 'icon-del-btn';
        delLedgerB.textContent = '×';
        delLedgerB.addEventListener('click', function () {
          if (!isPro()) { openUnlockModal(); return; }
          crmData.ledger.splice(idx, 1);
          persistCrm();
          renderCrmPanel();
        });

        btns.appendChild(loadB);
        btns.appendChild(statusB);
        btns.appendChild(delLedgerB);
        row.appendChild(btns);
        listEl.appendChild(row);
      });
    }
  }

  function exportLedgerCsv() {
    if (!isPro()) {
      openUnlockModal();
      return;
    }
    var rows = [];
    if (crmData.ledger.length > 0) {
      rows = crmData.ledger;
    } else {
      var tot = calculateTotals(state.doc);
      rows = [{
        invNumber: state.doc.invNumber,
        docType: state.doc.docType,
        status: state.doc.docType === 'receipt' ? 'PAID' : 'OPEN',
        issueDate: state.doc.issueDate,
        dueDate: state.doc.dueDate,
        clientName: state.doc.clientName,
        currency: state.doc.currency,
        subtotal: tot.subtotal,
        discount: tot.discountAmount,
        tax: tot.taxAmount,
        total: tot.total,
        amountPaid: tot.amountPaid,
        balanceDue: tot.balanceDue
      }];
    }
    function csvCell(v) {
      var s = String(v == null ? '' : v).replace(/"/g, '""');
      return '"' + s + '"';
    }
    var lines = ['InvoiceNumber,Type,Status,IssueDate,DueDate,Client,Currency,Subtotal,Discount,Tax,Total,AmountPaid,BalanceDue'];
    rows.forEach(function (r) {
      lines.push([
        r.invNumber, r.docType, r.status, r.issueDate, r.dueDate, r.clientName,
        r.currency, r.subtotal, r.discount, r.tax, r.total, r.amountPaid, r.balanceDue
      ].map(csvCell).join(','));
    });
    var blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'craftleaf-invoice-ledger-' + todayIso + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function updateProUI() {
    var unlocked = isPro();
    var dict = I18N[state.lang];
    var topBtn = $('openProModalBtn');
    topBtn.textContent = unlocked ? dict.unlockedBtn : dict.unlockBtn;
    topBtn.classList.toggle('unlocked', unlocked);

    var cfg = (root.CRAFTLEAF_MONETIZATION && root.CRAFTLEAF_MONETIZATION.products) || {};
    var invCfg = cfg.invoicePro || {};
    var allCfg = cfg.allAccessPass || {};
    var buyEl = $('buyProCta');
    if (buyEl) {
      var targetInvUrl = state.lang === 'zh' ? String(invCfg.checkoutUrlZh || '').trim() : String(invCfg.checkoutUrlEn || '').trim();
      if (targetInvUrl) {
        buyEl.href = targetInvUrl;
        buyEl.style.display = '';
      } else {
        buyEl.style.display = 'none';
      }
    }
    var allEl = $('buyAllAccessCta');
    if (allEl) {
      var targetAllUrl = state.lang === 'zh' ? String(allCfg.checkoutUrlZh || '').trim() : String(allCfg.checkoutUrlEn || '').trim();
      if (targetAllUrl) {
        allEl.href = targetAllUrl;
        allEl.style.display = '';
      } else {
        allEl.style.display = 'none';
      }
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
      var k = nodes[i].getAttribute('data-i18n');
      if (dict[k]) nodes[i].textContent = dict[k];
    }
    $('langToggleBtn').textContent = state.lang === 'zh' ? 'English / EN' : '中文 / EN';

    // Populate template selector
    var tplSel = $('templateSelect');
    tplSel.innerHTML = '';
    Object.keys(TEMPLATES).forEach(function (tk) {
      var opt = document.createElement('option');
      opt.value = tk;
      opt.textContent = state.lang === 'zh' ? TEMPLATES[tk].nameZh : TEMPLATES[tk].nameEn;
      if (tk === state.templateKey) opt.selected = true;
      tplSel.appendChild(opt);
    });

    if (root.CraftLeafSDK && typeof root.CraftLeafSDK.renderAffiliateBar === 'function') {
      root.CraftLeafSDK.renderAffiliateBar($('invoiceAffiliateMount'), 'print-craft', state.lang);
    }

    updateProUI();
    renderLineItemEditors();
    renderCrmPanel();
    updateInvoicePreview();
  }

  function openUnlockModal() {
    $('proModal').classList.add('open');
    $('licenseMsg').textContent = '';
    $('licenseMsg').className = 'modal-msg';
    setTimeout(function () { $('licenseKeyInput').focus(); }, 50);
  }

  function closeUnlockModal() {
    $('proModal').classList.remove('open');
  }

  function prepareVectorPrint() {
    var pageStyle = $('dynamicInvoicePageStyle');
    if (!pageStyle) {
      pageStyle = document.createElement('style');
      pageStyle.id = 'dynamicInvoicePageStyle';
      document.head.appendChild(pageStyle);
    }
    var sizeCss = state.paper === 'letter' ? 'letter portrait' : 'A4 portrait';
    pageStyle.textContent = '@media print { @page { size: ' + sizeCss + '; margin: 10mm; } }';
    document.body.classList.add('print-invoice-only');
  }

  function triggerStatementPrint() {
    if (!state.stmt.useDemo && !isPro()) {
      openUnlockModal();
      return;
    }
    var stmt = computeOpenItemStatement(getActiveStatementEntries(), {
      clientName: state.stmt.clientName,
      currency: state.stmt.currency,
      statementDate: state.stmt.statementDate || todayIso,
      resolvedDuplicates: state.stmt.resolvedDuplicates,
      confirmedBalancesCurrent: state.stmt.confirmedBalancesCurrent
    });
    if (stmt.status === 'DUPLICATE_INVOICE_CONFLICT' || stmt.status === 'MISSING_INVOICE_NUMBER') {
      alert(state.lang === 'zh'
        ? '存在重复或缺失的发票编号，请先在左侧面板选择保留版本后再打印对账单。'
        : 'Please resolve duplicate or missing invoice numbers in the Open Statement panel before printing.');
      return;
    }
    if (!stmt.confirmedBalancesCurrent) {
      alert(state.lang === 'zh'
        ? '请先勾选“我已确认截至对账日收到的款项均已登记”，再打印或导出未结对账单。'
        : 'Please check the confirmation box verifying all payments through the Statement Date are recorded before printing.');
      return;
    }
    if (!isPro()) {
      openUnlockModal();
      return;
    }
    prepareVectorPrint();
    window.print();
  }

  function exportOpenStatementCsvAction() {
    if (!isPro()) {
      openUnlockModal();
      return;
    }
    var stmt = computeOpenItemStatement(getActiveStatementEntries(), {
      clientName: state.stmt.clientName,
      currency: state.stmt.currency,
      statementDate: state.stmt.statementDate || todayIso,
      resolvedDuplicates: state.stmt.resolvedDuplicates,
      confirmedBalancesCurrent: state.stmt.confirmedBalancesCurrent
    });
    if (stmt.status === 'DUPLICATE_INVOICE_CONFLICT' || stmt.status === 'MISSING_INVOICE_NUMBER') {
      alert(state.lang === 'zh' ? '请先消除重复发票编号冲突。' : 'Please resolve duplicate invoice numbers first.');
      return;
    }
    if (!stmt.confirmedBalancesCurrent) {
      alert(state.lang === 'zh' ? '请先勾选余额确认框。' : 'Please confirm balances are current first.');
      return;
    }
    var csvOut = exportStatementCsvString(stmt);
    var blob = new Blob(['\uFEFF' + csvOut], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    var safeSlug = String(stmt.clientName || 'client').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'client';
    a.download = 'open-item-statement-' + safeSlug + '-' + stmt.currency.toLowerCase() + '-' + (stmt.statementDate || todayIso) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function triggerVectorPrint() {
    if (state.previewMode === 'statement') {
      triggerStatementPrint();
      return;
    }
    prepareVectorPrint();
    window.print();
    if (typeof window !== 'undefined' && window.CraftLeafSDK && window.CraftLeafSDK.showValueMomentPrompt && !isPro()) {
      window.CraftLeafSDK.showValueMomentPrompt({
        lang: state.lang,
        titleZh: '🧾 矢量商业 PDF 已就绪（100% 本地隐私生成）！',
        titleEn: '🧾 Crisp Vector Invoice PDF Ready (100% Local)!',
        bodyZh: '需要本地保存多位常客抬头、去页脚品牌白标或内嵌收款二维码？一次买断终身解锁 Invoice Pro！',
        bodyEn: 'Save recurring client profiles locally, remove footer branding & embed payment QR codes with Invoice Pro!',
        proUrl: 'https://stardustdemo.gumroad.com/l/invoice-studio-pro?wanted=true',
        proLabelZh: '✨ 解锁白标+客户库 ($9)',
        proLabelEn: '✨ Unlock CRM Pro ($9)'
      });
    }
  }

  function init() {
    var hasUrlTemplate = false;
    var startInStatementMode = false;
    try {
      var params = new URLSearchParams(window.location.search || '');
      if (params.get('template')) {
        state.templateKey = resolveTemplateKey(params.get('template'));
        hasUrlTemplate = true;
      }
      if (params.get('mode') === 'statement') {
        startInStatementMode = true;
      }
      var savedLang = localStorage.getItem('craftleaf_lang');
      if (params.get('lang') === 'zh' || params.get('lang') === 'en') {
        state.lang = params.get('lang');
      } else if (savedLang === 'zh' || savedLang === 'en') {
        state.lang = savedLang;
      }
    } catch (_e) {}

    // Populate currency options
    var curSel = $('currencySelect');
    Object.keys(CURRENCIES).forEach(function (ck) {
      var opt = document.createElement('option');
      opt.value = ck;
      opt.textContent = CURRENCIES[ck].label;
      curSel.appendChild(opt);
    });

    applyTemplateToDoc(state.templateKey);

    // Restore user draft if no explicit ?template= deep-link override
    if (!hasUrlTemplate) {
      try {
        var rawDraft = localStorage.getItem(DRAFT_LS_KEY);
        if (rawDraft) {
          var parsed = JSON.parse(rawDraft);
          if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
            state.doc = Object.assign(state.doc, parsed);
          }
        }
      } catch (_e2) {}
    }

    // Bind events
    $('langToggleBtn').addEventListener('click', function () {
      state.lang = state.lang === 'en' ? 'zh' : 'en';
      try { localStorage.setItem('craftleaf_lang', state.lang); } catch (_e) {}
      applyLanguage();
    });

    $('templateSelect').addEventListener('change', function (e) {
      applyTemplateToDoc(e.target.value);
      syncInputsFromDoc();
      updateInvoicePreview();
    });

    $('paperSelect').addEventListener('change', function (e) {
      state.paper = e.target.value === 'letter' ? 'letter' : 'a4';
      updateInvoicePreview();
    });

    $('printPdfBtn').addEventListener('click', triggerVectorPrint);
    window.addEventListener('beforeprint', prepareVectorPrint);
    window.addEventListener('afterprint', function () {
      document.body.classList.remove('print-invoice-only');
    });

    function bindField(elId, prop, isNum) {
      $(elId).addEventListener('input', function (e) {
        state.doc[prop] = isNum ? (Number(e.target.value) || 0) : e.target.value;
        if (prop === 'currency') renderLineItemEditors();
        updateInvoicePreview();
      });
    }

    bindField('docTypeSelect', 'docType', false);
    bindField('docLangSelect', 'docLang', false);
    bindField('currencySelect', 'currency', false);
    bindField('invNumInput', 'invNumber', false);
    bindField('issueDateInput', 'issueDate', false);
    bindField('dueDateInput', 'dueDate', false);
    bindField('senderNameInput', 'senderName', false);
    bindField('senderDetailsInput', 'senderDetails', false);
    bindField('clientNameInput', 'clientName', false);
    bindField('clientDetailsInput', 'clientDetails', false);
    bindField('discTypeSelect', 'discountType', false);
    bindField('discValInput', 'discountValue', true);
    bindField('taxLabelInput', 'taxLabel', false);
    bindField('taxRateInput', 'taxRate', true);
    bindField('amtPaidInput', 'amountPaid', true);
    bindField('termsInput', 'terms', false);
    bindField('payInfoInput', 'paymentInfo', false);
    bindField('notesInput', 'notes', false);

    $('addItemBtn').addEventListener('click', function () {
      state.doc.items.push({ desc: 'Additional Consulting / Deliverable', qty: 1, rate: 100 });
      renderLineItemEditors();
      updateInvoicePreview();
    });

    // Pro Branding & QR bindings (gated smoothly with modal prompt)
    var dots = document.querySelectorAll('.accent-dot');
    for (var d = 0; d < dots.length; d++) {
      dots[d].addEventListener('click', function (ev) {
        if (!isPro()) { openUnlockModal(); return; }
        var col = ev.currentTarget.getAttribute('data-color') || '#1e3a8a';
        state.doc.accentColor = col;
        $('customColorPicker').value = col;
        for (var j = 0; j < dots.length; j++) {
          dots[j].classList.toggle('active', dots[j].getAttribute('data-color') === col);
        }
        updateInvoicePreview();
      });
    }

    $('customColorPicker').addEventListener('input', function (e) {
      if (!isPro()) { openUnlockModal(); return; }
      state.doc.accentColor = e.target.value;
      updateInvoicePreview();
    });

    var logoFile = $('logoFileInput');
    $('uploadLogoBtn').addEventListener('click', function () {
      if (!isPro()) { openUnlockModal(); return; }
      logoFile.click();
    });
    logoFile.addEventListener('change', function (e) {
      if (!e.target.files || !e.target.files[0]) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        state.doc.logoDataUrl = ev.target.result;
        updateInvoicePreview();
      };
      reader.readAsDataURL(e.target.files[0]);
    });
    $('clearLogoBtn').addEventListener('click', function () {
      state.doc.logoDataUrl = '';
      updateInvoicePreview();
    });

    $('hideFooterChk').addEventListener('change', function (e) {
      if (!isPro()) {
        e.target.checked = false;
        openUnlockModal();
        return;
      }
      state.doc.hideFooter = e.target.checked;
      updateInvoicePreview();
    });

    $('qrUrlInput').addEventListener('focus', function () {
      if (!isPro()) openUnlockModal();
    });
    bindField('qrUrlInput', 'qrUrl', false);
    bindField('qrCaptionInput', 'qrCaption', false);

    // CRM Tabs & Actions
    $('crmTabClients').addEventListener('click', function () { state.crmTab = 'clients'; state.previewMode = 'invoice'; renderCrmPanel(); updateInvoicePreview(); });
    $('crmTabCatalog').addEventListener('click', function () { state.crmTab = 'catalog'; state.previewMode = 'invoice'; renderCrmPanel(); updateInvoicePreview(); });
    $('crmTabLedger').addEventListener('click', function () { state.crmTab = 'ledger'; state.previewMode = 'invoice'; renderCrmPanel(); updateInvoicePreview(); });
    if ($('crmTabStatement')) {
      $('crmTabStatement').addEventListener('click', function () {
        state.crmTab = 'statement';
        state.previewMode = 'statement';
        if (isPro() && crmData.ledger.length > 0) {
          state.stmt.useDemo = false;
        }
        renderCrmPanel();
        updateInvoicePreview();
      });
    }

    if ($('loadStmtDemoBtn')) {
      $('loadStmtDemoBtn').addEventListener('click', function () {
        state.stmt.useDemo = true;
        state.stmt.includeDupDemo = false;
        state.stmt.resolvedDuplicates = {};
        state.stmt.clientName = 'Acme Product Labs Inc.';
        state.stmt.currency = 'USD';
        state.previewMode = 'statement';
        syncStatementControls();
        updateInvoicePreview();
      });
    }
    if ($('toggleStmtDupDemoBtn')) {
      $('toggleStmtDupDemoBtn').addEventListener('click', function () {
        state.stmt.useDemo = true;
        state.stmt.includeDupDemo = !state.stmt.includeDupDemo;
        state.stmt.resolvedDuplicates = {};
        state.stmt.clientName = 'Acme Product Labs Inc.';
        state.stmt.currency = 'USD';
        state.previewMode = 'statement';
        syncStatementControls();
        updateInvoicePreview();
      });
    }
    if ($('stmtClientSelect')) {
      $('stmtClientSelect').addEventListener('change', function (e) {
        state.stmt.clientName = e.target.value;
        state.stmt.confirmedBalancesCurrent = false;
        syncStatementControls();
        updateInvoicePreview();
      });
    }
    if ($('stmtCurrencySelect')) {
      $('stmtCurrencySelect').addEventListener('change', function (e) {
        state.stmt.currency = e.target.value;
        state.stmt.confirmedBalancesCurrent = false;
        syncStatementControls();
        updateInvoicePreview();
      });
    }
    if ($('stmtDateInput')) {
      $('stmtDateInput').addEventListener('input', function (e) {
        state.stmt.statementDate = e.target.value || todayIso;
        syncStatementControls();
        updateInvoicePreview();
      });
    }
    if ($('stmtConfirmBalancesChk')) {
      $('stmtConfirmBalancesChk').addEventListener('change', function (e) {
        state.stmt.confirmedBalancesCurrent = !!e.target.checked;
        updateInvoicePreview();
      });
    }
    if ($('printStmtPdfBtn')) $('printStmtPdfBtn').addEventListener('click', triggerStatementPrint);
    if ($('exportStmtCsvBtn')) $('exportStmtCsvBtn').addEventListener('click', exportOpenStatementCsvAction);
    if ($('backToInvoiceViewBtn')) {
      $('backToInvoiceViewBtn').addEventListener('click', function () {
        state.previewMode = 'invoice';
        state.crmTab = 'ledger';
        renderCrmPanel();
        updateInvoicePreview();
      });
    }

    if ($('importLedgerCsvBtn') && $('ledgerCsvFileInput')) {
      $('importLedgerCsvBtn').addEventListener('click', function () {
        if (!isPro()) { openUnlockModal(); return; }
        $('ledgerCsvFileInput').click();
      });
      $('ledgerCsvFileInput').addEventListener('change', function (e) {
        if (!e.target.files || !e.target.files[0]) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
          var imported = parseLedgerCsv(String(ev.target.result || ''));
          if (imported.length > 0) {
            crmData.ledger = imported.concat(crmData.ledger);
            persistCrm();
            state.stmt.useDemo = false;
            state.stmt.resolvedDuplicates = {};
            state.crmTab = 'statement';
            state.previewMode = 'statement';
            renderCrmPanel();
            updateInvoicePreview();
          }
          e.target.value = '';
        };
        reader.readAsText(e.target.files[0]);
      });
    }

    $('saveClientBtn').addEventListener('click', function () {
      if (!isPro()) { openUnlockModal(); return; }
      if (!state.doc.clientName.trim()) return;
      crmData.clients.unshift({
        id: 'c_' + Date.now(),
        name: state.doc.clientName.trim(),
        details: state.doc.clientDetails
      });
      persistCrm();
      renderCrmPanel();
    });

    $('saveCatalogItemBtn').addEventListener('click', function () {
      if (!isPro()) { openUnlockModal(); return; }
      var first = state.doc.items[0];
      if (!first || !first.desc) return;
      crmData.catalog.unshift({
        id: 'i_' + Date.now(),
        desc: first.desc,
        qty: first.qty,
        rate: first.rate
      });
      persistCrm();
      renderCrmPanel();
    });

    $('saveLedgerBtn').addEventListener('click', function () {
      if (!isPro()) { openUnlockModal(); return; }
      var tot = calculateTotals(state.doc);
      crmData.ledger.unshift({
        id: 'inv_' + Date.now(),
        invNumber: state.doc.invNumber,
        docType: state.doc.docType,
        status: state.doc.docType === 'receipt' ? 'PAID' : 'SENT',
        issueDate: state.doc.issueDate,
        dueDate: state.doc.dueDate,
        clientName: state.doc.clientName || 'Client',
        currency: state.doc.currency,
        subtotal: tot.subtotal,
        discount: tot.discountAmount,
        tax: tot.taxAmount,
        total: tot.total,
        amountPaid: tot.amountPaid,
        balanceDue: tot.balanceDue,
        snapshot: JSON.parse(JSON.stringify(state.doc))
      });
      persistCrm();
      state.crmTab = 'ledger';
      renderCrmPanel();
    });

    $('exportCsvBtn').addEventListener('click', exportLedgerCsv);

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
      var res = await root.CraftLeafSDK.verifyLicense('invoicePro', raw);
      if (res && res.valid) {
        state.doc.hideFooter = true;
        $('hideFooterChk').checked = true;
        msgEl.textContent = dict.msgSuccess;
        msgEl.className = 'modal-msg ok';
        updateProUI();
        renderCrmPanel();
        updateInvoicePreview();
        setTimeout(closeUnlockModal, 1100);
      } else if (res && res.reason === 'network_error') {
        msgEl.textContent = state.lang === 'zh' ? '网络连接失败，请联网后验证 Gumroad 许可证密钥。' : 'Network unreachable — please connect to verify your Gumroad license key.';
        msgEl.className = 'modal-msg err';
      } else {
        msgEl.textContent = dict.msgInvalid;
        msgEl.className = 'modal-msg err';
      }
    });

    if (typeof root.addEventListener === 'function') {
      root.addEventListener('craftleaf:license-updated', function () {
        if (isPro()) {
          state.doc.hideFooter = true;
          if ($('hideFooterChk')) $('hideFooterChk').checked = true;
        }
        updateProUI();
        renderCrmPanel();
        updateInvoicePreview();
      });
    }

    if (window.location.hash === '#unlock-pro' && !isPro()) {
      openUnlockModal();
    }

    syncInputsFromDoc();
    applyLanguage();
    loadCrm(function () {
      if (startInStatementMode) {
        state.crmTab = 'statement';
        state.previewMode = 'statement';
        state.stmt.useDemo = !(isPro() && crmData.ledger.length > 0);
      }
      renderCrmPanel();
      updateInvoicePreview();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : globalThis);
