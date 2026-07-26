const express = require('express');
const router = express.Router();

// 1. AI Knowledge Assistant Chat API (Friendly Tone)
router.post('/chat', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required' });

  const openRouterKey = process.env.OPENROUTER_API_KEY;

  if (openRouterKey) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterKey}`,
          "HTTP-Referer": "https://sap-fico-copilot.vercel.app",
          "X-Title": "SAP FICO Copilot",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `You are a friendly, warm, encouraging Senior SAP Lead Functional Consultant Copilot! Respond warmly, simplify complex SAP topics, and provide exact SPRO paths, T-Codes, and table details.`
            },
            { role: "user", content: question }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage = data.choices?.[0]?.message?.content;
        if (aiMessage) {
          const formatted = aiMessage
            .replace(/```markdown/g, '<pre>')
            .replace(/```sql/g, '<pre>')
            .replace(/```abap/g, '<pre>')
            .replace(/```/g, '</pre>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
          return res.json({ answer: formatted, timestamp: new Date().toISOString() });
        }
      }
    } catch (err) {
      console.error("Local server OpenRouter fetch error:", err);
    }
  }

  const q = question.toLowerCase().trim();
  let response = '';

  if (q === 'hi' || q === 'hello' || q === 'hey' || q.includes('who are you')) {
    response = `👋 <strong>Hello there! Great to meet you!</strong> 😊<br><br>I am your friendly <strong>SAP FICO & SD Copilot</strong>. I'm here to help you navigate SPRO customizing, resolve error codes, simulate VKOA/OBYC account determination, or generate RICEF specs!<br><br>How can I assist you today? 😊`;
  } else if (q.includes('vkoa') || q.includes('revenue')) {
    response = `<strong>🔄 SD-FI Account Determination (VKOA):</strong><br>Nav Path: <code>SPRO -> Sales & Distribution -> Basic Functions -> Account Assignment -> Revenue Account Determination -> Assign G/L Accounts</code><br>Key Parameters: Application V, Chart of Accounts, Sales Org, Cust. Acct Grp, Mat. Acct Grp, Account Key (ERL/ERS). 😊`;
  } else if (q.includes('obyc') || q.includes('goods receipt') || q.includes('bsx')) {
    response = `<strong>📦 MM-FI Account Determination (OBYC):</strong><br>Key Posting Transactions: <code>BSX</code> (Inventory Posting), <code>WRX</code> (GR/IR Clearing Account), <code>GBB</code> (Inventory Offsetting/COGS). 😊`;
  } else if (q.includes('ob52') || q.includes('period')) {
    response = `<strong>⚠️ OB52 Posting Period Error:</strong><br>Run T-Code <strong>OB52</strong>, locate your Posting Period Variant, update From Period 1 to current period (e.g. 07/2026), and verify account types '+' and 'S' are open. 😊`;
  } else {
    response = `<strong>💡 SAP Copilot Response:</strong><br>For your query <em>"${question}"</em>, explore core T-Codes: <strong>FS00</strong> (GL Master), <strong>FB50</strong> (GL Postings), <strong>VKOA</strong> (SD Revenue), <strong>OBYC</strong> (MM Postings)! 😊`;
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
    debit: { pk: '01', account: 'Customer Accounts Receivable', amount: lineAmount },
    credit: { pk: '50', account: glAccount, amount: lineAmount }
  };

  res.json({ conditionRecord, journalEntry });
});

// 3. MM-FI OBYC Simulator API
router.post('/obyc/simulate', (req, res) => {
  const { coa, valuationClass, transactionKey, movementType, amount } = req.body;
  const lineAmount = parseFloat(amount) || 0;

  let inventoryAccount = '300000 Raw Material Inventory';
  let clearingAccount = '211100 GR/IR Goods/Invoice Received Clearing';
  let offsettingAccount = '500000 Consumption Raw Materials';
  let priceDiffAccount = '520000 Price Differences - Inventory';

  if (valuationClass === '7920') {
    inventoryAccount = '140000 Finished Goods Inventory';
    offsettingAccount = '600000 Cost of Goods Sold (COGS)';
  } else if (valuationClass === '3050') {
    inventoryAccount = '305000 Packaging Material Inventory';
  }

  let debitAccount = inventoryAccount;
  let creditAccount = clearingAccount;
  let debitPk = '89';
  let creditPk = '50';

  if (transactionKey === 'WRX') {
    debitAccount = inventoryAccount;
    creditAccount = clearingAccount;
    debitPk = '89';
    creditPk = '50';
  } else if (transactionKey === 'GBB') {
    debitAccount = offsettingAccount;
    creditAccount = inventoryAccount;
    debitPk = '40';
    creditPk = '99';
  } else if (transactionKey === 'PRD') {
    debitAccount = priceDiffAccount;
    creditAccount = inventoryAccount;
    debitPk = '40';
    creditPk = '50';
  }

  const sproPath = `SPRO -> Materials Management -> Valuation and Account Assignment -> Account Determination -> Configure Automatic Postings (T-Code: OBYC)`;
  const conditionRecord = `KTOPL | TransKey | ValClass ==> G/L ACCOUNT\n${(coa || 'INT').padEnd(5)} | ${(transactionKey || 'BSX').padEnd(8)} | ${(valuationClass || '3000').padEnd(8)} ==> ${transactionKey === 'GBB' ? offsettingAccount : (transactionKey === 'WRX' ? clearingAccount : inventoryAccount)}`;

  const journalEntry = {
    debit: { pk: debitPk, account: debitAccount, amount: lineAmount },
    credit: { pk: creditPk, account: creditAccount, amount: lineAmount }
  };

  res.json({ sproPath, conditionRecord, journalEntry });
});

// 4. RICEF Specification Generator API
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

// 5. Error Diagnostics DB API
router.get('/errors', (req, res) => {
  const errorDatabase = [
    { id: 'OB52_PERIOD_CLOSED', module: 'FI', code: 'F5 063 / F5 201', title: 'Posting Period Closed (OB52)', spro: 'SPRO -> Financial Accounting -> Document -> Posting Periods -> Open and Close Posting Periods', fix: 'Open T-Code OB52, find posting period variant, update open fiscal period to current month/year.' },
    { id: 'VKOA_DETERMINATION_MISSING', module: 'SD', code: 'VKOA 001 / VF 051', title: 'Revenue Account Determination Missing (VKOA)', spro: 'SPRO -> SD -> Basic Functions -> Account Assignment -> Revenue Account Determination', fix: 'Execute VKOA, select Table 001, add missing Sales Org and Account Key entry.' },
    { id: 'OBYC_AUTOMATIC_POSTING', module: 'MM', code: 'M8 008 / BSX / WRX', title: 'MM Automatic Posting Missing (OBYC)', spro: 'SPRO -> MM -> Valuation and Account Assignment -> Account Determination -> Configure Automatic Postings', fix: 'Execute OBYC, double click BSX/WRX, assign G/L account for Valuation Class.' },
    { id: 'AA_DEPRECIATION_RUN', module: 'AA', code: 'AA 698 / AA 688', title: 'Asset Depreciation Not Posted for Period', spro: 'SPRO -> Financial Accounting -> Asset Accounting -> Integration with General Ledger -> Post Depreciation to General Ledger', fix: 'Run T-Code AFAB (Depreciation Post Run) in Planned or Repeat mode for the preceding fiscal period.' },
    { id: 'CO_COST_CENTER_BLOCKED', module: 'CO', code: 'KS 002 / KM 183', title: 'Cost Center Blocked for Primary Postings', spro: 'SPRO -> Controlling -> Cost Center Accounting -> Master Data -> Cost Centers -> Define Cost Centers', fix: 'Run T-Code KS02, navigate to Control Tab, and uncheck "Actual primary costs" block.' }
  ];
  res.json(errorDatabase);
});

// 6. ACDOCA Universal Journal Explorer API
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
    mappingFlow: `SD Billing Invoice (VBRK-VBELN)\n   |\n   v Links via BKPF-AWKEY = VBRK-VBELN\nFI Header Document (BKPF-BELNR)\n   |\n   v 1-to-Many Line Items\nS/4HANA Universal Journal (ACDOCA-BELNR)`
  });
});

module.exports = router;
