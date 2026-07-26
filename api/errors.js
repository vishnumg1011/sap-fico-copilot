export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const errorDatabase = [
    {
      id: 'OB52_PERIOD_CLOSED',
      module: 'FI',
      code: 'F5 063 / F5 201',
      title: 'Posting Period Closed (OB52)',
      spro: 'SPRO -> Financial Accounting -> Document -> Posting Periods -> Open and Close Posting Periods',
      fix: 'Open T-Code OB52, find posting period variant, update open fiscal period to current month/year, and ensure account types + and S are open.'
    },
    {
      id: 'VKOA_DETERMINATION_MISSING',
      module: 'SD',
      code: 'VKOA 001 / VF 051',
      title: 'Revenue Account Determination Missing (VKOA)',
      spro: 'SPRO -> SD -> Basic Functions -> Account Assignment -> Revenue Account Determination',
      fix: 'Execute VKOA, select Table 001 (Cust.Grp/MaterialGrp/AcctKey), and insert missing Sales Org, Account Key (ERL/ERS) & G/L Account entry.'
    },
    {
      id: 'OBYC_AUTOMATIC_POSTING',
      module: 'MM',
      code: 'M8 008 / BSX / WRX',
      title: 'MM Automatic Posting Missing (OBYC)',
      spro: 'SPRO -> MM -> Valuation and Account Assignment -> Account Determination -> Configure Automatic Postings',
      fix: 'Execute OBYC, double-click transaction BSX/WRX/GBB, select Chart of Accounts INT, and assign G/L account for Valuation Class.'
    },
    {
      id: 'AA_DEPRECIATION_RUN',
      module: 'AA',
      code: 'AA 698 / AA 688',
      title: 'Asset Depreciation Not Posted for Period',
      spro: 'SPRO -> Financial Accounting -> Asset Accounting -> Integration with General Ledger -> Post Depreciation to General Ledger',
      fix: 'Run T-Code AFAB (Depreciation Post Run) in Planned or Repeat mode for the preceding fiscal period before closing period in FI.'
    },
    {
      id: 'CO_COST_CENTER_BLOCKED',
      module: 'CO',
      code: 'KS 002 / KM 183',
      title: 'Cost Center Blocked for Primary Postings',
      spro: 'SPRO -> Controlling -> Cost Center Accounting -> Master Data -> Cost Centers -> Define Cost Centers',
      fix: 'Run T-Code KS02 (Change Cost Center), navigate to Control Tab, and uncheck "Actual primary costs" or "Actual secondary costs" block boxes.'
    },
    {
      id: 'TAX_CODE_MISSING',
      module: 'FI',
      code: 'FF 753 / FS 201',
      title: 'Tax Code Not Defined in Country / Company Code',
      spro: 'SPRO -> Financial Accounting -> Financial Accounting Global Settings -> Tax on Sales/Purchases -> Calculation -> Define Tax Codes',
      fix: 'Execute T-Code FTXP, enter Country (e.g. US), tax code (e.g. V1/V0), and assign tax percentage or verify tax indicator in FTXP.'
    },
    {
      id: 'CREDIT_LIMIT_EXCEEDED',
      module: 'SD',
      code: 'FD 150 / FCO 004',
      title: 'Customer Credit Limit Exceeded (FSCM)',
      spro: 'SPRO -> Financial Supply Chain Management -> Credit Management -> Master Data -> Credit Limit',
      fix: 'Execute T-Code UKM_BP or VK33 / FD32, inspect credit exposure vs credit limit, or run VKM3 to release blocked sales document.'
    },
    {
      id: 'TOLERANCE_LIMIT_EXCEEDED',
      module: 'MM',
      code: 'M8 082 / M8 084',
      title: 'Invoice Price Variance Exceeds Tolerance (MIRO)',
      spro: 'SPRO -> Materials Management -> Logistics Invoice Verification -> Invoice Verification -> Set Tolerance Limits',
      fix: 'Execute T-Code OMRH / OMRJ, review tolerance key PP (Price Variance) or VP (Moving Average Price), and adjust percentage threshold.'
    },
    {
      id: 'DOCUMENT_NUMBER_EXHAUSTED',
      module: 'FI',
      code: 'F5 151 / F5 152',
      title: 'Document Number Range Full / Exhausted',
      spro: 'SPRO -> Financial Accounting -> Financial Accounting Global Settings -> Document -> Document Number Ranges',
      fix: 'Run T-Code FBN1 for FI documents or VN01 for SD documents, locate Number Range Interval, and extend To Number or change interval.'
    },
    {
      id: 'EXCHANGE_RATE_MISSING',
      module: 'FI',
      code: 'SG 105 / F5 222',
      title: 'Foreign Exchange Rate Not Found (OB08)',
      spro: 'SPRO -> SAP NetWeaver -> General Settings -> Currencies -> Enter Exchange Rates',
      fix: 'Execute T-Code OB08, enter missing Exchange Rate Type (M/EURX), From/To currency pair, valid From Date, and conversion rate.'
    }
  ];

  res.status(200).json(errorDatabase);
}
