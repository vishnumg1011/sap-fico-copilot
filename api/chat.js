export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
              content: `You are an expert Senior SAP S/4HANA & ECC 6.0 Lead Functional & Technical Consultant specializing in FICO (Financial Accounting & Controlling), SD (Sales & Distribution), and MM (Materials Management).
Provide accurate, structured, and professional answers for SAP queries. Include:
1. Exact SPRO Customizing navigation paths (e.g. SPRO -> Financial Accounting -> ...).
2. Key T-Codes (e.g., FS00, FB50, VKOA, OBYC, OB52, SE16N, FAGLB03).
3. Relevant S/4HANA tables (ACDOCA, BKPF, BSEG, VBRK, EKKO, KNA1).
4. Accounting Posting Keys (01 Debit Customer, 50 Credit Revenue, 89 Goods Issue, 31 Vendor Credit, etc.) and Journal Entry flow.
Format your responses nicely with HTML tags like <strong>, <code>, <br>, <ul>, <li>, and <pre> for code snippets.`
            },
            {
              role: "user",
              content: question
            }
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
          return res.status(200).json({ answer: formatted, timestamp: new Date().toISOString() });
        }
      }
    } catch (err) {
      console.error("OpenRouter fetch error:", err);
    }
  }

  // Fallback intelligent knowledge engine
  const q = question.toLowerCase();
  let fallbackAnswer = "";

  if (q.includes('vkoa') || q.includes('revenue account')) {
    fallbackAnswer = `<strong>🔄 SD-FI Account Determination (VKOA):</strong><br>
<strong>SPRO Path:</strong> <code>SPRO -> Sales and Distribution -> Basic Functions -> Account Assignment/Costing -> Revenue Account Determination -> Assign G/L Accounts</code><br><br>
<strong>Key Determination Table Access Sequence (Tables 001 - 005):</strong>
<ul>
  <li><strong>Application:</strong> V (Sales/Distribution)</li>
  <li><strong>Condition Type:</strong> KOFI (Account Determination) / KOFK (with CO)</li>
  <li><strong>Chart of Accounts:</strong> INT / CAUS</li>
  <li><strong>Sales Org:</strong> 1000 / 2000</li>
  <li><strong>Cust. Acct Assign Group:</strong> 01 (Domestic) / 02 (Export)</li>
  <li><strong>Mat. Acct Assign Group:</strong> 01 (Trading Goods) / 02 (Finished Goods)</li>
  <li><strong>Account Key:</strong> ERL (Revenue), ERS (Discounts), MWS (Output Tax)</li>
</ul>
<strong>Resulting Posting:</strong> Billing Document (VF01) automatically posts Debit Customer (PK 01) and Credit Revenue G/L Account (PK 50).`;
  } else if (q.includes('obyc') || q.includes('goods receipt') || q.includes('inventory')) {
    fallbackAnswer = `<strong>📦 MM-FI Account Determination (OBYC):</strong><br>
<strong>SPRO Path:</strong> <code>SPRO -> Materials Management -> Valuation and Account Assignment -> Account Determination -> Account Determination Without Wizard -> Configure Automatic Postings</code><br><br>
<strong>Key Transaction Keys:</strong>
<ul>
  <li><code>BSX</code> - Inventory Posting (Debited on Goods Receipt MVT 101)</li>
  <li><code>WRX</code> - GR/IR Clearing Account (Credited on GR, Debited on IR in MIRO)</li>
  <li><code>GBB</code> - Offsetting Entry for Inventory Postings (VBR: Goods Issue for Sales, VAX: Goods Issue w/o Account Assignment, ZZZ: Scrapping)</li>
  <li><code>PRD</code> - Price Differences (Variance between PO price and Material Moving Average/Standard Price)</li>
  <li><code>UMB</code> - Gain/Loss from Revaluation (T-Code MR21)</li>
</ul>`;
  } else if (q.includes('ob52') || q.includes('period closed') || q.includes('f5 063')) {
    fallbackAnswer = `<strong>⚠️ OB52 Posting Period Maintenance:</strong><br>
<strong>Error Code:</strong> F5 063 / F5 201 "Posting period 0XX is not open"<br><br>
<strong>Resolution Steps:</strong>
<ol>
  <li>Execute T-Code <strong>OB52</strong> (or SPRO -> Financial Accounting -> Financial Accounting Global Settings -> Document -> Posting Periods -> Open and Close Posting Periods).</li>
  <li>Locate your Posting Period Variant (e.g. 1000).</li>
  <li>Update <strong>From Period 1</strong> to current month (e.g., 7 / 2026).</li>
  <li>Ensure Account Type <code>+</code> (Valid for all account types) and Account Type <code>S</code> (G/L accounts) have open period ranges.</li>
  <li>Save transport request and re-run posting (T-Code FB50 / MIRO / VF01).</li>
</ol>`;
  } else if (q.includes('acdoca') || q.includes('universal journal') || q.includes('s/4hana')) {
    fallbackAnswer = `<strong>📊 Universal Journal (ACDOCA) Architecture in S/4HANA:</strong><br>
S/4HANA merges traditional separate SAP tables into a single line-item table <code>ACDOCA</code>:<br>
<ul>
  <li><strong>Replaced / Combined Tables:</strong> BSEG (FI), COEP (Controlling), ANEP (Asset Accounting), MLIT (Material Ledger), FAGLLEX (New G/L Totals).</li>
  <li><strong>Key Fields:</strong> <code>RCLNT</code> (Client), <code>RLDNR</code> (Ledger 0L), <code>BUKRS</code> (Company Code), <code>GJAHR</code> (Fiscal Year), <code>BELNR</code> (Doc No), <code>DOCLN</code> (Line item), <code>RACCT</code> (G/L Acct), <code>PRCTR</code> (Profit Center), <code>HSL</code> (Amount in Local Curr).</li>
  <li><strong>Header Table:</strong> <code>BKPF</code> (Accounting Document Header) links to <code>ACDOCA</code> via BELNR & GJAHR.</li>
</ul>`;
  } else {
    fallbackAnswer = `<strong>💡 SAP Copilot Functional Guidance:</strong><br>
For query: <em>"${question}"</em><br><br>
<strong>Recommended Next Steps:</strong>
<ul>
  <li>Check master data via <strong>FS00</strong> (G/L Master), <strong>BP</strong> (Business Partner / Customer / Vendor), or <strong>MM03</strong> (Material Master).</li>
  <li>Verify configuration in <strong>SPRO</strong> or direct T-Codes: <strong>VKOA</strong> (SD Revenue), <strong>OBYC</strong> (MM Postings), <strong>OB52</strong> (Posting Periods), <strong>OKKP</strong> (Controlling Area).</li>
  <li>Inspect table line items via <strong>SE16N</strong> / <strong>SE16H</strong> on tables <code>ACDOCA</code>, <code>BKPF</code>, <code>BSEG</code>, <code>VBRK</code>, or <code>EKKO</code>.</li>
</ul>`;
  }

  res.status(200).json({ answer: fallbackAnswer, timestamp: new Date().toISOString() });
}
