export const sapKnowledgeChunks = [
  {
    id: 'vkoa_sd_fi_determination',
    category: 'SD-FI Integration',
    tcodes: ['VKOA', 'VF01', 'VF02'],
    tables: ['C001', 'C002', 'VBRK', 'VBRP', 'ACDOCA'],
    content: `SD-FI Revenue Account Determination (VKOA):
SPRO Navigation Path: SPRO -> Sales and Distribution -> Basic Functions -> Account Assignment/Costing -> Revenue Account Determination -> Assign G/L Accounts.
Table Access Sequence:
- Table 001: Cust.Grp/MaterialGrp/AcctKey (Application V, Chart of Accounts INT/CAUS, Sales Org 1000, Cust Acct Grp 01 Domestic, Mat Acct Grp 01, Account Key ERL Revenue -> G/L 400000).
- Table 002: Cust.Grp/AcctKey.
- Account Key ERS maps to Sales Cash Discounts (G/L 410000).
- Account Key MWS maps to Output Sales Tax Payable (G/L 175000).
Accounting Entry: Billing Document (VF01) automatically posts Debit Customer A/R (PK 01) and Credit Revenue (PK 50).`
  },
  {
    id: 'obyc_mm_fi_determination',
    category: 'MM-FI Integration',
    tcodes: ['OBYC', 'MIGO', 'MIRO'],
    tables: ['T030', 'T030B', 'MKPF', 'MSEG', 'ACDOCA'],
    content: `MM-FI Automatic Account Assignment (OBYC):
SPRO Navigation Path: SPRO -> Materials Management -> Valuation and Account Assignment -> Account Determination -> Account Determination Without Wizard -> Configure Automatic Postings.
Key Transaction / Event Keys (KTOSL):
- BSX: Inventory Posting (Debited on Goods Receipt MVT 101 for Valuation Class 3000 Raw Materials -> G/L 300000).
- WRX: GR/IR Clearing Account (Credited on Goods Receipt -> G/L 211100).
- GBB: Offsetting Entry for Inventory Posting (VBR: Consumption Raw Materials G/L 500000, VAX: COGS Finished Goods G/L 600000).
- PRD: Price Differences (Variance between PO price and Material Moving Average/Standard Price -> G/L 520000).`
  },
  {
    id: 'ob52_posting_periods',
    category: 'FI General Ledger',
    tcodes: ['OB52', 'FB50', 'MIRO'],
    tables: ['T001B'],
    content: `OB52 Posting Period Maintenance & Error Resolution (F5 063 / F5 201):
SPRO Navigation Path: SPRO -> Financial Accounting -> Financial Accounting Global Settings -> Document -> Posting Periods -> Open and Close Posting Periods.
Resolution Steps for 'Posting Period is Not Open':
1. Execute T-Code OB52.
2. Locate Posting Period Variant (e.g. 1000).
3. Update From Period 1 to current fiscal period/year.
4. Ensure Account Type '+' (Valid for all account types) and Account Type 'S' (G/L accounts) are open.
5. Save transport request and re-post document.`
  },
  {
    id: 'acdoca_universal_journal',
    category: 'S/4HANA Architecture',
    tcodes: ['SE16N', 'SE16H', 'FAGLB03'],
    tables: ['ACDOCA', 'BKPF', 'BSEG', 'COEP'],
    content: `S/4HANA Universal Journal (ACDOCA) Single Source of Truth:
ACDOCA combines legacy separate tables BSEG (FI), COEP (Controlling), ANEP (Asset Accounting), and MLIT (Material Ledger) into a single line item repository with 300+ fields.
Key Link Fields:
- Header Link: BKPF-AWKEY = VBRK-VBELN (Links SD Billing Invoice to FI Header).
- Line Item Link: ACDOCA-BELNR = BKPF-BELNR and ACDOCA-GJAHR = BKPF-GJAHR.
- Key Columns: RCLNT (Client), RLDNR (Ledger 0L), RBUKRS (Company Code), GJAHR (Fiscal Year), BELNR (Doc No), DOCLN (Line Item), RACCT (G/L Acct), PRCTR (Profit Center), KOSTL (Cost Center), HSL (Local Currency Amount).`
  },
  {
    id: 'abap_s4hana_code_conversion',
    category: 'ABAP Development',
    tcodes: ['SE38', 'SE80', 'ST05'],
    tables: ['ACDOCA', 'BSEG'],
    content: `S/4HANA ABAP OpenSQL & CDS View Conversion Rules:
Legacy ECC 6.0 code reading cluster table BSEG should be rewritten to query ACDOCA for column-store performance.
Best Practices:
1. Avoid SELECT * on ACDOCA; explicitly list columns (RBUKRS, BELNR, GJAHR, DOCLN, RACCT, HSL, PRCTR).
2. Always filter by RLDNR = '0L' (Leading Ledger).
3. Use ABAP OpenSQL Host Variables (@DATA(lt_acdoca)).`
  },
  {
    id: 'asset_accounting_afab_depreciation',
    category: 'Asset Accounting',
    tcodes: ['AFAB', 'AS01', 'AW01N'],
    tables: ['ANLA', 'ANEP', 'ACDOCA'],
    content: `Asset Accounting Depreciation Post Run Error (AA 698 / AA 688):
SPRO Navigation Path: SPRO -> Financial Accounting -> Asset Accounting -> Integration with General Ledger -> Post Depreciation to General Ledger.
Resolution Steps:
1. Execute T-Code AFAB (Depreciation Post Run).
2. Select Fiscal Year and Period, run in Planned or Repeat mode.
3. Verify ACDOCA asset depreciation postings prior to period closing.`
  }
];
