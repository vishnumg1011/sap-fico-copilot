export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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

  res.status(200).json({ conditionRecord, journalEntry });
}
