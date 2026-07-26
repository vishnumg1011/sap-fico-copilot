export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
  let debitPk = '89'; // Goods Receipt Inventory Debit
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

  const sproPath = `SPRO -> Materials Management -> Valuation and Account Assignment -> Account Determination -> Account Determination Without Wizard -> Configure Automatic Postings (T-Code: OBYC)`;
  const conditionRecord = `KTOPL | TransKey | ValClass ==> G/L ACCOUNT\n${(coa || 'INT').padEnd(5)} | ${(transactionKey || 'BSX').padEnd(8)} | ${(valuationClass || '3000').padEnd(8)} ==> ${transactionKey === 'GBB' ? offsettingAccount : (transactionKey === 'WRX' ? clearingAccount : inventoryAccount)}`;

  const journalEntry = {
    debit: { pk: debitPk, account: debitAccount, amount: lineAmount },
    credit: { pk: creditPk, account: creditAccount, amount: lineAmount }
  };

  res.status(200).json({ sproPath, conditionRecord, journalEntry });
}
