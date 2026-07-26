import React, { useState, useEffect } from 'react';
import { fetchErrors } from '../services/api';
import { Search, Copy, Check, Stethoscope } from 'lucide-react';

export default function ErrorsTab() {
  const [errors, setErrors] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeModule, setActiveModule] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchErrors().then(setErrors).catch(console.error);
  }, []);

  const filteredErrors = errors.filter((err) => {
    const matchesModule = activeModule === 'ALL' || err.module === activeModule;
    const matchesSearch =
      err.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      err.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      err.fix.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const activeError = filteredErrors[selectedIdx] || filteredErrors[0];

  const copySpro = () => {
    if (activeError?.spro) {
      navigator.clipboard.writeText(activeError.spro);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <Stethoscope className="color-amber" size={24} />
        <h2 style={{ fontSize: '1.3rem', color: 'var(--color-amber)' }}>
          🩺 SAP Production Error Diagnostics & SPRO Resolution Guide
        </h2>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Search 10+ real-world SAP production error codes across FI, CO, SD, MM, and Asset Accounting.
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(17,24,39,0.6)', padding: '0.3rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          {['ALL', 'FI', 'SD', 'MM', 'CO', 'AA'].map((mod) => (
            <button
              key={mod}
              className={`chip ${activeModule === mod ? 'active' : ''}`}
              style={{
                background: activeModule === mod ? 'var(--color-amber)' : 'transparent',
                color: activeModule === mod ? '#000' : 'var(--text-muted)',
                fontWeight: 700
              }}
              onClick={() => {
                setActiveModule(mod);
                setSelectedIdx(0);
              }}
            >
              {mod}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search error code (e.g., OB52, F5 063, VKOA, M8 008)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIdx(0);
            }}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div className="grid-2">
        <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', maxHeight: '500px', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--color-amber)' }}>
            Matching Error Diagnostics ({filteredErrors.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {filteredErrors.map((err, idx) => (
              <button
                key={err.id}
                style={{
                  textAlign: 'left',
                  background: (activeError?.id === err.id) ? 'rgba(255, 179, 0, 0.15)' : 'rgba(255,255,255,0.03)',
                  color: '#fff',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: (activeError?.id === err.id) ? '1px solid var(--color-amber)' : '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedIdx(idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <strong style={{ color: 'var(--color-cyan)' }}>{err.code}</strong>
                  <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>{err.module}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{err.title}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(17,24,39,0.7)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
          {activeError ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="badge badge-amber">{activeError.code} ({activeError.module} Module)</span>
                <button className="btn" onClick={copySpro} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied SPRO!' : 'Copy SPRO Path'}</span>
                </button>
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '1rem' }}>{activeError.title}</h3>
              
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Official SPRO Path:</div>
              <pre style={{ marginBottom: '1.25rem', fontSize: '0.82rem' }}>{activeError.spro}</pre>
              
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Resolution & Troubleshooting Action:</div>
              <div style={{ background: 'rgba(0, 230, 118, 0.08)', border: '1px solid rgba(0, 230, 118, 0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#f3f4f6', lineHeight: 1.6 }}>
                {activeError.fix}
              </div>
            </>
          ) : (
            <div>No matching SAP error codes found. Try searching for OB52, VKOA, or OBYC.</div>
          )}
        </div>
      </div>
    </div>
  );
}
