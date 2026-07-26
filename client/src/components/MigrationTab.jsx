import React, { useState } from 'react';
import { Rocket, CheckSquare, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function MigrationTab() {
  const [checks, setChecks] = useState([
    { id: 'new_gl', label: 'New G/L Accounting Activated (Parallel Ledgers 0L/1L)', checked: true, points: 25 },
    { id: 'bp_cvi', label: 'Business Partner (BP) Customer-Vendor Integration (CVI_COCKPIT)', checked: true, points: 25 },
    { id: 'mat_ledger', label: 'Material Ledger Activated for Actual Costing', checked: false, points: 20 },
    { id: 'acdoca_prep', label: 'ACDOCA Migration Preparation & Custom Code Scanned (FINS_MIG)', checked: false, points: 15 },
    { id: 'asset_acct', label: 'New Asset Accounting (FI-AA) Configured', checked: true, points: 15 }
  ]);

  const toggleCheck = (id) => {
    setChecks(checks.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const score = checks.reduce((acc, c) => c.checked ? acc + c.points : acc, 0);

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <Rocket className="color-cyan" size={24} />
        <h2 style={{ fontSize: '1.3rem', color: 'var(--color-cyan)' }}>
          🚀 S/4HANA Migration & Readiness Evaluator
        </h2>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Evaluate ECC 6.0 system readiness for S/4HANA financial migration & ACDOCA Universal Journal conversion.
      </p>

      <div className="grid-2">
        <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-cyan)', marginBottom: '1rem' }}>
            S/4HANA Functional Prerequisites Checklist
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {checks.map((item) => (
              <label
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem',
                  borderRadius: '8px',
                  background: item.checked ? 'rgba(0, 230, 118, 0.08)' : 'rgba(255,255,255,0.03)',
                  border: item.checked ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleCheck(item.id)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ fontSize: '0.9rem', color: '#fff' }}>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-emerald)', marginBottom: '0.75rem' }}>
              System Readiness Score
            </h3>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: score >= 70 ? 'var(--color-emerald)' : 'var(--color-amber)' }}>
              {score} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ 100%</span>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: score >= 70 ? 'var(--color-emerald)' : 'var(--color-amber)' }}>
              {score >= 70 ? '🟢 System Ready for S/4HANA Brownfield/Greenfield Migration!' : '⚠️ Attention: Complete missing prerequisites before FINS_MIG execution.'}
            </div>
          </div>

          <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-cyan)', marginBottom: '0.75rem' }}>
              Key S/4HANA Migration T-Codes
            </h3>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
              <li><code>CVI_COCKPIT</code> - Customer/Vendor Integration to Business Partner</li>
              <li><code>FINS_MIG</code> - S/4HANA Financial Data Migration Cockpit</li>
              <li><code>FINS_MIG_MONITOR</code> - Monitor ACDOCA Data Partitioning & Postings</li>
              <li><code>AFAB</code> - Post Asset Depreciation prior to period balance migration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
