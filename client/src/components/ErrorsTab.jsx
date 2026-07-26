import React, { useState, useEffect } from 'react';
import { fetchErrors } from '../services/api';

export default function ErrorsTab() {
  const [errors, setErrors] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    fetchErrors().then(setErrors).catch(console.error);
  }, []);

  const activeError = errors[selectedIdx];

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--color-amber)' }}>
        🩺 SAP Error Diagnostics & SPRO Guide
      </h2>

      <div className="grid-2">
        <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--color-amber)' }}>Select SAP Error Code</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {errors.map((err, idx) => (
              <button
                key={err.id}
                style={{
                  textAlign: 'left',
                  background: selectedIdx === idx ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: selectedIdx === idx ? '1px solid var(--color-cyan)' : '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedIdx(idx)}
              >
                <strong style={{ color: 'var(--color-cyan)' }}>{err.code}</strong> - {err.title}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(17,24,39,0.7)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
          {activeError ? (
            <>
              <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>
                {activeError.code}
              </span>
              <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.75rem' }}>{activeError.title}</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>SPRO Path:</div>
              <pre style={{ marginBottom: '1rem' }}>{activeError.spro}</pre>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Resolution Step:</div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem' }}>
                {activeError.fix}
              </div>
            </>
          ) : (
            <div>Loading error diagnostic details...</div>
          )}
        </div>
      </div>
    </div>
  );
}
