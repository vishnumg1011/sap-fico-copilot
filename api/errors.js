export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

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

  res.status(200).json(errorDatabase);
}
