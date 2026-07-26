const express = require('express');
const router = express.Router();

// 1. AI Knowledge Assistant Chat API
router.post('/chat', (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  const q = question.toLowerCase();
  let response = '';

  if (q.includes('vkoa') || q.includes('revenue')) {
    response = `<strong>🔄 SD-FI Account Determination (VKOA):</strong><br>Nav Path: <code>SPRO -> Sales & Distribution -> Basic Functions -> Account Assignment -> Revenue Account Determination -> Assign G/L Accounts</code><br>Key Determination Parameters: Application V, Chart of Accounts, Sales Org, Cust. Acct Grp, Mat. Acct Grp, Account Key (ERL/ERS).`;
  } else if (q.includes('obyc') || q.includes('goods receipt') || q.includes('bsx')) {
    response = `<strong>📦 MM-FI Account Determination (OBYC):</strong><br>Key Posting Transactions: <code>BSX</code> (Inventory Posting), <code>WRX</code> (GR/IR Clearing Account), <code>GBB</code> (Inventory Offsetting/COGS).`;
  } else if (q.includes('ob52') || q.includes('period')) {
    response = `<strong>⚠️ OB52 Posting Period Error:</strong><br>Run T-Code <strong>OB52</strong>, locate your Posting Period Variant, update From Period 1 to current period (e.g. 07/2026), and verify account types '+' and 'S' are open.`;
  } else if (q.includes('acdoca') || q.includes('bseg')) {
    response = `<strong>📊 Universal Journal (ACDOCA):</strong><br>In S/4HANA, <code>ACDOCA</code> merges FI, CO, AA, and ML into a single line item repository. Unlike <code>BSEG</code>, it stores real-time details across 300+ fields.`;
  } else {
    response = `<strong>💡 SAP Copilot Response:</strong><br>For your query <em>"${question}"</em>, explore core T-Codes: <strong>FS00</strong> (GL Master), <strong>FB50</strong> (GL Postings), <strong>VKOA</strong> (SD Revenue), or use the interactive tabs above!`;
  }

  res.json({ answer: response, timestamp: new Date().toISOString() });
});

// 2. FI-SD VKOA Simulator API
router.post('/vkoa/simulate', (req, res) => {
  const { coa, salesOrg, custGroup, accountKey, amount } = req.body;
  const lineAmount = parseFloat(amount) || 0;

  let glAccount = '400000 Domestic Sales Revenue';
  if (accountKey === 'ERS') glAccount = '410000 Sales Cash Discounts';
  if (accountKey === 'MWS') glAccount = '175000 Output Sales Tax Payable';

  const conditionRecord = `APP | KTOPL | VKORG | KTGRD | KVSL ==> G/L ACCOUNT\nV   | ${(coa || 'INT').padEnd(5)} | ${(salesOrg || '1000').padEnd(5)} | ${(custGroup || '01').padEnd(5)} | ${(accountKey || 'ERL').padEnd(4)} ==> ${glAccount}`;

  const journalEntry = {
    debit: {
      pk: '01',
      account: 'Customer Accounts Receivable',
      amount: lineAmount
    },
    credit: {
      pk: '50',
      account: glAccount,
      amount: lineAmount
    }
  };

  res.json({
    conditionRecord,
    journalEntry
  });
});

// 3. RICEF Specification Generator API
router.post('/spec/generate', (req, res) => {
  const { title, type, tcode, tables } = req.body;

  const specMarkdown = 
`# FUNCTIONAL SPECIFICATION (RICEF: ${(type || 'Report').toUpperCase()})
Title: ${title || 'Custom S/4HANA FI Revenue & Accounts Receivable Aging Report'}
Target T-Code: ${tcode || 'ZFI_REV_AGING'}
Database Tables: ${tables || 'ACDOCA, BKPF, BSEG, VBRK, KNA1'}

1. Objective: Provide custom analytical report for S/4HANA finance team.
2. Logic: Query BKPF for document header, join ACDOCA for G/L line items, link VBRK for SD invoice metadata.
3. Output: Standard ALV Grid display with export options.`;

  res.json({ markdown: specMarkdown });
});

// 4. SAP Error Diagnostics DB API
const errorDatabase = [
  {
    id: 'OB52_PERIOD_CLOSED',
    code: 'F5 063 / F5 201',
    title: 'Posting Period Closed (OB52)',
    spro: 'SPRO -> Financial Accounting -> Document -> Posting Periods -> Open and Close Posting Periods',
    fix: 'Open T-Code OB52, find posting period variant, update open fiscal period to 07/2026, and ensure account types + and S are open.'
  },
  {
    id: 'VKOA_DETERMINATION_MISSING',
    code: 'VKOA 001 / VF 051',
    title: 'Revenue Account Determination Missing (VKOA)',
    spro: 'SPRO -> SD -> Basic Functions -> Account Assignment -> Revenue Account Determination',
    fix: 'Execute VKOA, select Table 001 (Cust.Grp/MaterialGrp/AcctKey), and insert missing Sales Org & G/L Account entry.'
  },
  {
    id: 'OBYC_AUTOMATIC_POSTING',
    code: 'M8 008 / BSX / WRX',
    title: 'MM Automatic Posting Missing (OBYC)',
    spro: 'SPRO -> MM -> Valuation and Account Assignment -> Account Determination -> Configure Automatic Postings',
    fix: 'Execute OBYC, double-click transaction BSX/WRX, select Chart of Accounts INT, and assign G/L account for Valuation Class.'
  }
];

router.get('/errors', (req, res) => {
  res.json(errorDatabase);
});

// 5. ACDOCA Universal Journal Explorer API
router.get('/tables/acdoca', (req, res) => {
  res.json({
    tableName: 'ACDOCA',
    description: 'S/4HANA Universal Journal Line Items Repository',
    fields: [
      { name: 'BUKRS', label: 'Company Code', type: 'CHAR 4' },
      { name: 'BELNR', label: 'Accounting Document Number', type: 'CHAR 10' },
      { name: 'GJAHR', label: 'Fiscal Year', type: 'NUMC 4' },
      { name: 'RACCT', label: 'G/L Account Number', type: 'CHAR 10' },
      { name: 'PRCTR', label: 'Profit Center', type: 'CHAR 10' },
      { name: 'HSL', label: 'Amount in Local Currency', type: 'CURR 23,2' }
    ],
    mappingFlow: `SD Billing Invoice (VBRK-VBELN)
   │
   ▼ Links via BKPF-AWKEY = VBRK-VBELN
FI Header Document (BKPF-BELNR)
   │
   ▼ 1-to-Many Line Items
S/4HANA Universal Journal (ACDOCA-BELNR)`
  });
});

module.exports = router;
