export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { title, type, tcode, tables } = req.body;

  const specMarkdown =
`# FUNCTIONAL SPECIFICATION (RICEF: ${(type || 'Report').toUpperCase()})
Title: ${title || 'Custom S/4HANA FI Revenue & Accounts Receivable Aging Report'}
Target T-Code: ${tcode || 'ZFI_REV_AGING'}
Database Tables: ${tables || 'ACDOCA, BKPF, BSEG, VBRK, KNA1'}

1. Objective: Provide custom analytical report for S/4HANA finance team.
2. Logic: Query BKPF for document header, join ACDOCA for G/L line items, link VBRK for SD invoice metadata.
3. Output: Standard ALV Grid display with export options.`;

  res.status(200).json({ markdown: specMarkdown });
}
