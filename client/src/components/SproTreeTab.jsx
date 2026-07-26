import React, { useState } from 'react';
import { GitBranch, FileText, Download, Check, Copy } from 'lucide-react';

export default function SproTreeTab() {
  const [trNumber, setTrNumber] = useState('K9005432');
  const [trDesc, setTrDesc] = useState('VKOA & OBYC Account Determination Customizing');
  const [targetClient, setTargetClient] = useState('100');
  const [owner, setOwner] = useState('VISHNU_SAP');

  const [copied, setCopied] = useState(false);

  const sproSteps = [
    { module: 'FI', path: 'Financial Accounting -> General Ledger -> Master Data -> G/L Accounts -> Define Centrally (FS00)', done: true },
    { module: 'FI', path: 'Financial Accounting Global Settings -> Document -> Open and Close Posting Periods (OB52)', done: true },
    { module: 'SD', path: 'Sales and Distribution -> Basic Functions -> Account Assignment -> Revenue Account Determination (VKOA)', done: true },
    { module: 'MM', path: 'Materials Management -> Valuation and Account Assignment -> Account Determination -> Configure Automatic Postings (OBYC)', done: true },
    { module: 'CO', path: 'Controlling -> Cost Center Accounting -> Master Data -> Cost Centers -> Define Cost Centers (KS01/KS02)', done: false }
  ];

  const trDocText =
`====================================================================
SAP TRANSPORT REQUEST DOCUMENTATION (TR)
====================================================================
Transport Request: ${trNumber}
Target Environment: QA / Prod Client ${targetClient}
Request Owner:     ${owner}
Description:       ${trDesc}

CUSTOMIZING OBJECTS INCLUDED:
1. VKOA - Table C001 (Sales Org / Cust. Group / Acct Key ERL -> G/L 400000)
2. OBYC - Transaction BSX/WRX (Valuation Class 3000 -> G/L 300000/211100)
3. OB52 - Posting Period Variant 1000 Open Range Update

RELEASE CHECKLIST:
[X] Unit Test Sign-off in Dev Client 100
[X] Transport Released via STMS / SE09 / SE10
[ ] Basis Import to QA Client 200 Verification
====================================================================`;

  const handleCopyTr = () => {
    navigator.clipboard.writeText(trDocText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTr = () => {
    const blob = new Blob([trDocText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TR_${trNumber}_Documentation.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <GitBranch className="color-amber" size={24} />
        <h2 style={{ fontSize: '1.3rem', color: 'var(--color-amber)' }}>
          ⚡ Visual SPRO Tree & Transport Request (TR) Generator
        </h2>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Track SPRO Customizing hierarchy and generate formal SAP Transport Request release change logs.
      </p>

      <div className="grid-2">
        <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-amber)', marginBottom: '1rem' }}>
            Interactive SPRO Customizing Hierarchy
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sproSteps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <span className="badge badge-amber">{step.module}</span>
                <span style={{ fontSize: '0.85rem', flex: 1 }}>{step.path}</span>
                <span style={{ fontSize: '0.8rem', color: step.done ? 'var(--color-emerald)' : 'var(--text-muted)' }}>
                  {step.done ? '✓ Configured' : '⏳ Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-glow)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-cyan)' }}>
              Transport Request (TR) Log Builder
            </h3>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button className="btn" onClick={handleDownloadTr} style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid var(--border-color)' }}>
                <Download size={14} />
                <span>Export TXT</span>
              </button>
              <button className="btn" onClick={handleCopyTr} style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied TR!' : 'Copy TR'}</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TR Number (SE09/SE10)</label>
              <input type="text" value={trNumber} onChange={(e) => setTrNumber(e.target.value)} style={{ width: '100%', marginTop: '0.2rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Client</label>
              <input type="text" value={targetClient} onChange={(e) => setTargetClient(e.target.value)} style={{ width: '100%', marginTop: '0.2rem' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TR Description</label>
            <input type="text" value={trDesc} onChange={(e) => setTrDesc(e.target.value)} style={{ width: '100%', marginTop: '0.2rem' }} />
          </div>

          <pre style={{ fontSize: '0.78rem', flex: 1 }}>{trDocText}</pre>
        </div>
      </div>
    </div>
  );
}
