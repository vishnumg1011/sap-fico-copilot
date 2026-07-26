import React, { useState, useEffect } from 'react';
import { generateSpec } from '../services/api';
import { Copy, Check } from 'lucide-react';

export default function SpecTab() {
  const [title, setTitle] = useState('Custom S/4HANA FI Revenue & Accounts Receivable Aging Report');
  const [type, setType] = useState('Report');
  const [tcode, setTcode] = useState('ZFI_REV_AGING');
  const [tables, setTables] = useState('ACDOCA, BKPF, BSEG, VBRK, KNA1');
  const [markdown, setMarkdown] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchPreview = async () => {
    try {
      const res = await generateSpec({ title, type, tcode, tables });
      setMarkdown(res.markdown);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPreview();
  }, [title, type, tcode, tables]);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', color: 'var(--color-cyan)' }}>📝 RICEF Functional Specification Builder</h2>
        <button className="btn" onClick={handleCopy}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Functional Spec Markdown'}</span>
        </button>
      </div>

      <div className="grid-2">
        <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Spec Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', marginTop: '0.3rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>RICEF Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%', marginTop: '0.3rem' }}>
              <option value="Report">Report (ALV Display)</option>
              <option value="Enhancement">Enhancement (BAdI / User Exit)</option>
              <option value="Interface">Interface (API / OData)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target T-Code</label>
            <input
              type="text"
              value={tcode}
              onChange={(e) => setTcode(e.target.value)}
              style={{ width: '100%', marginTop: '0.3rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Database Tables</label>
            <input
              type="text"
              value={tables}
              onChange={(e) => setTables(e.target.value)}
              style={{ width: '100%', marginTop: '0.3rem' }}
            />
          </div>
        </div>

        <div style={{ background: '#060911', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', maxHeight: '500px', overflowY: 'auto' }}>
          <pre>{markdown}</pre>
        </div>
      </div>
    </div>
  );
}
