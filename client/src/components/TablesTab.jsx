import React, { useState, useEffect } from 'react';
import { fetchAcdocaInfo } from '../services/api';

export default function TablesTab() {
  const [acdocaData, setAcdocaData] = useState(null);

  useEffect(() => {
    fetchAcdocaInfo().then(setAcdocaData).catch(console.error);
  }, []);

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--color-cyan)' }}>
        📊 S/4HANA Universal Journal (ACDOCA) Explorer
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Explore technical table structures and join key links between FI, CO, and SD.
      </p>

      <div className="grid-2">
        <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-cyan)', marginBottom: '0.5rem' }}>
            Table ACDOCA (Universal Journal)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Single source of truth line item repository combining General Ledger, Controlling, Asset Accounting, and Material Ledger.
          </p>

          {acdocaData && acdocaData.fields ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.4rem', textAlign: 'left' }}>FIELD</th>
                  <th style={{ padding: '0.4rem', textAlign: 'left' }}>DESCRIPTION</th>
                  <th style={{ padding: '0.4rem', textAlign: 'left' }}>TYPE</th>
                </tr>
              </thead>
              <tbody>
                {acdocaData.fields.map((f, i) => (
                  <tr key={i}>
                    <td style={{ padding: '0.4rem', color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>{f.name}</td>
                    <td style={{ padding: '0.4rem' }}>{f.label}</td>
                    <td style={{ padding: '0.4rem' }}>{f.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>Loading ACDOCA fields schema...</div>
          )}
        </div>

        <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-emerald)', marginBottom: '1rem' }}>
            FI-SD Table Key Mapping Link
          </h3>
          <pre>{acdocaData ? acdocaData.mappingFlow : 'Loading key mapping link...'}</pre>
        </div>
      </div>
    </div>
  );
}
