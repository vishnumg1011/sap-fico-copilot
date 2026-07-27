import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';
import { Send, Sparkles, Mic, MicOff, Volume2, VolumeX, Database } from 'lucide-react';

export default function ChatTab() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `👋 <strong>Welcome Functional Consultant!</strong> I am your Vector RAG Grounded SAP S/4HANA & ECC 6.0 Enterprise Copilot.<br><br>Ask me anything about <strong>SPRO customizing</strong>, <strong>VKOA SD-FI revenue account determination</strong>, <strong>OBYC MM account determination</strong>, <strong>SAP production errors (OB52, F5 063, M8 008)</strong>, or <strong>ACDOCA Universal Journal tables & HANA SQL</strong>.`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const presets = [
    'How to configure SD-FI Revenue Account Determination (VKOA)?',
    'Explain OBYC Automatic Posting for Goods Receipt (BSX/WRX)',
    'What is ACDOCA table in S/4HANA vs BSEG in ECC?',
    'How to resolve posting period closed error in OB52?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        setInput(transcript);
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Voice Speech Recognition is not supported in this browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSpeechOutput = (text, idx) => {
    if (!('speechSynthesis' in window)) {
      alert('Text to speech is not supported in this browser.');
      return;
    }

    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);

    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (textToSend) => {
    const q = textToSend || input;
    if (!q.trim() || loading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setMessages((prev) => [...prev, { sender: 'user', text: `<strong>You:</strong> ${q}` }]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage(q);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: res.answer, ragRetrieved: res.ragRetrieved }
      ]);
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
          <h3 style={{ fontSize: '1.05rem', color: 'var(--color-cyan)' }}>AI Vector RAG Grounded SAP Assistant</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isListening && (
            <span className="badge badge-amber" style={{ animation: 'pulse 1.5s infinite' }}>
              🎙️ Listening...
            </span>
          )}
          <span className="badge badge-emerald">🔍 Vector RAG Engine Active</span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start', gap: '0.3rem' }}>
            <div
              className={`msg ${msg.sender === 'user' ? 'msg-user' : 'msg-bot'}`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
            {msg.sender === 'bot' && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginLeft: '0.5rem' }}>
                {msg.ragRetrieved && (
                  <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                    <Database size={10} style={{ marginRight: '0.2rem' }} /> Grounded by Vector RAG
                  </span>
                )}
                <button
                  onClick={() => handleSpeechOutput(msg.text, idx)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: speakingIdx === idx ? 'var(--color-cyan)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  {speakingIdx === idx ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  <span>{speakingIdx === idx ? 'Stop' : 'Read Aloud'}</span>
                </button>
              </div>
            )}
          </div>
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
        <button
          className={`btn ${isListening ? 'btn-mic-active' : ''}`}
          onClick={toggleListening}
          style={{
            background: isListening ? 'rgba(255, 179, 0, 0.25)' : 'rgba(255,255,255,0.06)',
            color: isListening ? 'var(--color-amber)' : '#fff',
            border: isListening ? '1px solid var(--color-amber)' : '1px solid var(--border-color)'
          }}
          title={isListening ? 'Stop Voice Input' : 'Start Voice Input (Speak your question)'}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? 'Listening... Speak your SAP question now' : 'Ask or speak your SAP question (Vector RAG grounded)...'}
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
