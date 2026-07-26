export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  res.status(200).json({
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
}
