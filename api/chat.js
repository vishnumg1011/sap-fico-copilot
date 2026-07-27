import { searchVectorKnowledge } from './rag/vectorSearch.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required' });

  // 🔍 1. Perform Vector RAG Search
  const retrievedChunks = searchVectorKnowledge(question, 2);
  const ragContextText = retrievedChunks.map((c) => `[Category: ${c.category} | T-Codes: ${c.tcodes.join(', ')}]\n${c.content}`).join('\n\n');

  const openRouterKey = process.env.OPENROUTER_API_KEY;

  if (openRouterKey) {
    try {
      const systemPrompt = `You are a friendly, warm, and highly encouraging Senior SAP S/4HANA & ECC 6.0 Lead Functional Consultant Copilot!
Your personality is approachable, helpful, conversational, and mixed-friendly.
You ground your answers in official SAP knowledge using Vector RAG (Retrieval-Augmented Generation).

${ragContextText ? `RETRIEVED VECTOR SAP KNOWLEDGE CONTEXT:\n${ragContextText}\n\n` : ''}
When answering:
1. Greet the user warmly and enthusiastically.
2. Provide exact SPRO Customizing navigation paths (e.g. SPRO -> Financial Accounting -> ...).
3. Include relevant T-Codes (e.g. FS00, FB50, VKOA, OBYC, OB52, SE16N), S/4HANA tables (ACDOCA, BKPF, BSEG, VBRK), and Accounting Keys/Posting Keys.
4. Conclude with an encouraging, friendly follow-up question!
Use clean HTML formatting like <strong>, <code>, <br>, <ul>, <li>, and <pre>.`;

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
            { role: "system", content: systemPrompt },
            { role: "user", content: question }
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
          return res.status(200).json({
            answer: formatted,
            ragRetrieved: retrievedChunks.length > 0,
            retrievedCount: retrievedChunks.length,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (err) {
      console.error("OpenRouter fetch error:", err);
    }
  }

  // Friendly Fallback Engine
  const q = question.toLowerCase().trim();
  let fallbackAnswer = "";

  if (q === 'hi' || q === 'hello' || q === 'hey' || q.includes('who are you')) {
    fallbackAnswer = `👋 <strong>Hello there! Great to meet you!</strong> 😊<br><br>I am your friendly <strong>SAP FICO & SD Copilot</strong> grounded by Vector RAG knowledge. I'm here to help you navigate SPRO customizing, resolve error codes, simulate VKOA/OBYC account determination, or generate RICEF specs!<br><br>How can I assist you on your SAP journey today? Feel free to type or use voice chat! 🎙️`;
  } else if (retrievedChunks.length > 0) {
    const topChunk = retrievedChunks[0];
    fallbackAnswer = `🔍 <strong>Vector RAG Grounded Answer [${topChunk.category}]:</strong><br><br>${topChunk.content.replace(/\n/g, '<br>')}<br><br>Feel free to ask a follow-up question on this topic! 😊`;
  } else {
    fallbackAnswer = `💡 <strong>Happy to help!</strong><br><br>For your query <em>"${question}"</em>, explore core T-Codes: <strong>FS00</strong> (GL Master), <strong>FB50</strong> (GL Postings), <strong>VKOA</strong> (SD Revenue), or <strong>OBYC</strong> (MM Postings)! 😊`;
  }

  res.status(200).json({
    answer: fallbackAnswer,
    ragRetrieved: retrievedChunks.length > 0,
    retrievedCount: retrievedChunks.length,
    timestamp: new Date().toISOString()
  });
}
