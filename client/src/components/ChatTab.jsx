import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export default function ChatTab() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `👋 <strong>Welcome Functional Consultant!</strong> I am your SAP S/4HANA & ECC 6.0 Enterprise Copilot.<br><br>Ask me anything about <strong>SPRO customizing</strong>, <strong>VKOA SD-FI revenue account determination</strong>, <strong>OBYC MM account determination</strong>, <strong>SAP production errors (OB52, F5 063, M8 008)</strong>, or <strong>ACDOCA Universal Journal tables & HANA SQL</strong>.`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const presets = [
    'How to configure SD-FI Revenue Account Determination (VKOA)?',
    'Explain OBYC Automatic Posting for Goods Receipt (BSX/WRX)',
    'What is ACDOCA table in S/4HANA vs BSEG in ECC?',
    'How to resolve posting period closed error in OB52?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const q = textToSend || input;
    if (!q.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: 'user', text: `<strong>You:</strong> ${q}` }]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage(q);
      setMessages((prev) => [...prev, { sender: 'bot', text: res.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '<strong>⚠️ Error:</strong> Unable to reach SAP Copilot backend.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass chat-box">
      <div
        style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} style={{ color: 'var(--color-cyan)' }} />
          <h3 style={{ fontSize: '1.05rem', color: 'var(--color-cyan)' }}>AI SAP Knowledge Assistant</h3>
        </div>
        <span className="badge badge-cyan">S/4HANA 2023 & ECC 6.0 (EHP 8)</span>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`msg ${msg.sender === 'user' ? 'msg-user' : 'msg-bot'}`}
            dangerouslySetInnerHTML={{ __html: msg.text }}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem 1.5rem', overflowX: 'auto' }}>
        {presets.map((preset, idx) => (
          <button key={idx} className="chip" onClick={() => handleSend(preset)}>
            {preset.slice(0, 36)}...
          </button>
        ))}
      </div>

      <div className="chat-input-bar">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your SAP functional question (e.g. SPRO path for VKOA, OBYC transaction keys)..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{ flex: 1 }}
        />
        <button className="btn" onClick={() => handleSend()} disabled={loading}>
          <Send size={16} />
          <span>{loading ? 'Thinking...' : 'Ask Copilot'}</span>
        </button>
      </div>
    </div>
  );
}
