export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required' });

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

  res.status(200).json({ answer: response, timestamp: new Date().toISOString() });
}
