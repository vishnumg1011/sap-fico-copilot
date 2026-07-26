import React, { useState, useEffect } from 'react';
import { fetchAcdocaInfo } from '../services/api';
import { Table, Database, Copy, Check, Code } from 'lucide-react';

export default function TablesTab() {
  const [acdocaData, setAcdocaData] = useState(null);
  const [activeQueryKey, setActiveQueryKey] = useState('revenueByProfitCenter');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchAcdocaInfo().then(setAcdocaData).catch(console.error);
  }, []);

  const currentQuery = acdocaData?.queries?.[activeQueryKey] || '-- Loading SAP HANA SQL Query...';

  const copyQuery = () => {
    navigator.clipboard.writeText(currentQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <Database className="color-cyan" size={24} />
        <h2 style={{ fontSize: '1.3rem', color: 'var(--color-cyan)' }}>
          📊 S/4HANA Universal Journal (ACDOCA) & HANA SQL Explorer
        </h2>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Single source of truth repository combining FI, CO, AA, and ML with production SAP HANA SQL queries.
      </p>

      <div className="grid-2">
        <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', maxHeight: '550px', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-cyan)', marginBottom: '0.5rem' }}>
            Table ACDOCA Field Schema
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Stores line item details across 300+ fields replacing legacy tables BSEG, COEP, and ANEP.
          </p>

          {acdocaData && acdocaData.fields ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.4rem', textAlign: 'left' }}>FIELD</th>
                  <th style={{ padding: '0.4rem', textAlign: 'left' }}>DESCRIPTION</th>
                  <th style={{ padding: '0.4rem', textAlign: 'left' }}>TYPE</th>
                </tr>
              </thead>
              <tbody>
                {acdocaData.fields.map((f, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '0.4rem', color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>{f.name}</td>
                    <td style={{ padding: '0.4rem' }}>{f.label}</td>
                    <td style={{ padding: '0.4rem', color: 'var(--text-muted)' }}>{f.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>Loading ACDOCA schema...</div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--color-emerald)' }}>
                Production SAP HANA SQL Generator
              </h3>
              <button className="btn" onClick={copyQuery} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied SQL!' : 'Copy SQL'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', overflowX: 'auto' }}>
              <button
                className={`chip ${activeQueryKey === 'revenueByProfitCenter' ? 'active' : ''}`}
                onClick={() => setActiveQueryKey('revenueByProfitCenter')}
              >
                Revenue by Profit Center
              </button>
              <button
                className={`chip ${activeQueryKey === 'sdFiReconciliation' ? 'active' : ''}`}
                onClick={() => setActiveQueryKey('sdFiReconciliation')}
              >
                SD-FI Reconciliation
              </button>
              <button
                className={`chip ${activeQueryKey === 'bsegVsacdocaComparison' ? 'active' : ''}`}
                onClick={() => setActiveQueryKey('bsegVsacdocaComparison')}
              >
                BSEG vs ACDOCA Line Items
              </button>
            </div>

            <pre style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>{currentQuery}</pre>
          </div>

          <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-cyan)', marginBottom: '0.75rem' }}>
              FI-SD Table Key Mapping Link
            </h3>
            <pre style={{ fontSize: '0.82rem' }}>{acdocaData ? acdocaData.mappingFlow : 'Loading key mapping link...'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
