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
              content: `You are a friendly, warm, and highly encouraging Senior SAP S/4HANA & ECC 6.0 Lead Functional Consultant Copilot!
Your personality is approachable, helpful, conversational, and mixed-friendly: you make complex SAP concepts easy to understand while delivering exact technical accuracy.
When answering:
1. Greet the user warmly and enthusiastically.
2. Provide exact SPRO Customizing navigation paths (e.g. SPRO -> Financial Accounting -> ...).
3. Include relevant T-Codes (e.g. FS00, FB50, VKOA, OBYC, OB52, SE16N), S/4HANA tables (ACDOCA, BKPF, BSEG, VBRK), and Accounting Keys/Posting Keys.
4. Conclude with an encouraging, friendly follow-up question or offer to help further!
Use clean HTML formatting like <strong>, <code>, <br>, <ul>, <li>, and <pre>.`
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

  // Friendly Fallback Knowledge Engine
  const q = question.toLowerCase().trim();
  let fallbackAnswer = "";

  if (q === 'hi' || q === 'hello' || q === 'hey' || q.includes('who are you')) {
    fallbackAnswer = `👋 <strong>Hello there! Great to meet you!</strong> 😊<br><br>I am your friendly <strong>SAP FICO & SD Copilot</strong>. I'm here to help you navigate SPRO customizing, resolve error codes, simulate VKOA/OBYC account determination, or generate RICEF specs!<br><br>How can I assist you on your SAP journey today? Feel free to type or use voice chat! 🎙️`;
  } else if (q.includes('thank') || q.includes('thanks')) {
    fallbackAnswer = `🌟 <strong>You're very welcome!</strong> Happy to help anytime! 😊<br><br>Let me know if you have more questions about SAP S/4HANA, T-Codes, or customizing! Have a fantastic day! 🚀`;
  } else if (q.includes('vkoa') || q.includes('revenue account')) {
    fallbackAnswer = `😊 <strong>No problem at all! Let's break down SD-FI Revenue Account Determination (VKOA) together:</strong><br><br>
<strong>SPRO Path:</strong> <code>SPRO -> Sales and Distribution -> Basic Functions -> Account Assignment/Costing -> Revenue Account Determination -> Assign G/L Accounts</code><br><br>
<strong>Key Determination Fields (Table C001):</strong>
<ul>
  <li><strong>Application:</strong> V (Sales & Distribution)</li>
  <li><strong>Condition Type:</strong> KOFI (Account Determination)</li>
  <li><strong>Chart of Accounts:</strong> INT / CAUS</li>
  <li><strong>Sales Org:</strong> 1000</li>
  <li><strong>Customer Acct Group:</strong> 01 (Domestic)</li>
  <li><strong>Account Key:</strong> ERL (Sales Revenue) ➡️ G/L 400000</li>
</ul>
<strong>Resulting Posting:</strong> Billing Document (VF01) automatically posts Debit Customer (PK 01) & Credit Revenue (PK 50).<br><br>Need me to simulate a specific billing line for you? Just let me know! 🚀`;
  } else if (q.includes('obyc') || q.includes('goods receipt') || q.includes('inventory')) {
    fallbackAnswer = `📦 <strong>Great question! MM-FI Automatic Posting (OBYC) is easy once you see the pattern:</strong><br><br>
<strong>SPRO Path:</strong> <code>SPRO -> Materials Management -> Valuation and Account Assignment -> Account Determination -> Configure Automatic Postings</code><br><br>
<strong>Key Transaction Keys to Remember:</strong>
<ul>
  <li><code>BSX</code> - Inventory Posting (Debited on Goods Receipt MVT 101)</li>
  <li><code>WRX</code> - GR/IR Clearing Account (Credited on Goods Receipt)</li>
  <li><code>GBB</code> - Offsetting Entry for Inventory Postings (COGS / Consumption)</li>
  <li><code>PRD</code> - Price Differences</li>
</ul>
Would you like to test an OBYC simulation in our simulator tab? 😊`;
  } else if (q.includes('ob52') || q.includes('period closed') || q.includes('f5 063')) {
    fallbackAnswer = `⚠️ <strong>Don't worry! OB52 Posting Period errors are super quick to fix:</strong><br><br>
<strong>Steps to resolve F5 063:</strong>
<ol>
  <li>Open T-Code <strong>OB52</strong> (or SPRO -> Financial Accounting -> Document -> Posting Periods -> Open and Close Posting Periods).</li>
  <li>Find your Posting Period Variant (e.g. 1000).</li>
  <li>Update <strong>From Period 1</strong> to current month (e.g., 7 / 2026).</li>
  <li>Ensure Account Types <code>+</code> and <code>S</code> are open.</li>
  <li>Save and re-try your posting!</li>
</ol>
Need help with any other error code? I'm right here! 😊`;
  } else {
    fallbackAnswer = `💡 <strong>Happy to help!</strong><br><br>For your query <em>"${question}"</em>, here are recommended T-Codes: <strong>FS00</strong> (GL Master), <strong>FB50</strong> (GL Postings), <strong>VKOA</strong> (SD Revenue), or <strong>OBYC</strong> (MM Postings)!<br><br>Feel free to ask another question or click any preset below! 😊`;
  }

  res.status(200).json({ answer: fallbackAnswer, timestamp: new Date().toISOString() });
}
