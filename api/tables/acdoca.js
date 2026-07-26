export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const queries = {
    revenueByProfitCenter: `-- SAP HANA SQL: Real-Time Revenue Analysis by Profit Center (ACDOCA)
SELECT 
    a.bukrs AS company_code,
    a.prctr AS profit_center,
    a.racct AS gl_account,
    SUM(a.hsl) AS total_local_amount,
    a.rwcur AS currency
FROM acdoca AS a
WHERE a.rldnr = '0L'                  -- Leading Ledger
  AND a.gjahr = '2026'                 -- Fiscal Year
  AND a.racct BETWEEN '400000' AND '499999' -- Revenue G/L Range
GROUP BY a.bukrs, a.prctr, a.racct, a.rwcur
ORDER BY total_local_amount DESC;`,

    sdFiReconciliation: `-- SAP S/4HANA SQL: SD Invoice (VBRK) to ACDOCA Universal Journal Reconciliation
SELECT 
    v.vbeln AS sd_billing_doc,
    v.fkdat AS billing_date,
    v.kunrg AS payer,
    b.belnr AS fi_doc_number,
    a.racct AS gl_account,
    a.hsl   AS amount_local_currency
FROM vbrk AS v
INNER JOIN bkpf AS b ON b.awkey = v.vbeln AND b.awsys = ''
INNER JOIN acdoca AS a ON a.rbukrs = b.bukrs AND a.gjahr = b.gjahr AND a.belnr = b.belnr
WHERE a.rldnr = '0L';`,

    bsegVsacdocaComparison: `-- SAP S/4HANA SQL: BSEG Entry vs ACDOCA Line Item Breakdown
SELECT 
    a.belnr,
    a.docln,
    a.racct,
    a.anln1 AS asset_number,
    a.kostl AS cost_center,
    a.prctr AS profit_center,
    a.hsl   AS amount
FROM acdoca AS a
WHERE a.rbukrs = '1000' AND a.gjahr = '2026' AND a.belnr = '1400000001';`
  };

  res.status(200).json({
    tableName: 'ACDOCA',
    description: 'S/4HANA Universal Journal Line Items Repository (Single Source of Truth)',
    fields: [
      { name: 'RCLNT', label: 'Client Number', type: 'CLNT 3' },
      { name: 'RLDNR', label: 'Ledger (0L = Leading)', type: 'CHAR 2' },
      { name: 'RBUKRS', label: 'Company Code', type: 'CHAR 4' },
      { name: 'GJAHR', label: 'Fiscal Year', type: 'NUMC 4' },
      { name: 'BELNR', label: 'Accounting Document Number', type: 'CHAR 10' },
      { name: 'DOCLN', label: 'Six-Digit Line Item Number', type: 'CHAR 6' },
      { name: 'RACCT', label: 'G/L Account Number', type: 'CHAR 10' },
      { name: 'PRCTR', label: 'Profit Center', type: 'CHAR 10' },
      { name: 'KOSTL', label: 'Cost Center', type: 'CHAR 10' },
      { name: 'ANLN1', label: 'Main Asset Number', type: 'CHAR 12' },
      { name: 'MATNR', label: 'Material Number', type: 'CHAR 18' },
      { name: 'WERKS', label: 'Plant', type: 'CHAR 4' },
      { name: 'HSL', label: 'Amount in Company Code Currency', type: 'CURR 23,2' },
      { name: 'KSL', label: 'Amount in Global Group Currency', type: 'CURR 23,2' }
    ],
    mappingFlow: `SD Billing Invoice (VBRK-VBELN)
   │
   ▼ Links via BKPF-AWKEY = VBRK-VBELN
FI Header Document (BKPF-BELNR)
   │
   ▼ 1-to-Many Line Items (Real-Time FI/CO/AA Integration)
S/4HANA Universal Journal (ACDOCA-BELNR)`,
    queries
  });
}
