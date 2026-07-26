import React, { useState, useEffect } from 'react';
import { simulateVkoa } from '../services/api';

export default function VkoaTab() {
  const [coa, setCoa] = useState('INT');
  const [salesOrg, setSalesOrg] = useState('1000');
  const [custGroup, setCustGroup] = useState('01');
  const [accountKey, setAccountKey] = useState('ERL');
  const [amount, setAmount] = useState('10000');

  const [simulation, setSimulation] = useState(null);

  const runSimulation = async () => {
    try {
      const res = await simulateVkoa({
        coa,
        salesOrg,
        custGroup,
        accountKey,
        amount
      });
      setSimulation(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [coa, salesOrg, custGroup, accountKey, amount]);

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--color-cyan)' }}>
        🔄 FI-SD Account Determination Simulator (T-Code: VKOA)
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Simulate how Sales Billing (SD) maps condition keys to G/L Accounts in FI upon invoice release.
      </p>

      <div className="grid-2">
        <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-cyan)' }}>1. VKOA Customizing Parameters</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Chart of Accounts (KTOPL)</label>
              <select value={coa} onChange={(e) => setCoa(e.target.value)} style={{ width: '100%', marginTop: '0.3rem' }}>
                <option value="INT">INT - International Chart of Accounts</option>
                <option value="CAUS">CAUS - US Chart of Accounts</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sales Organization (VKORG)</label>
              <select value={salesOrg} onChange={(e) => setSalesOrg(e.target.value)} style={{ width: '100%', marginTop: '0.3rem' }}>
                <option value="1000">1000 - US Sales Organization</option>
                <option value="2000">2000 - EU Sales Organization</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customer Account Assignment Group (KTGRD)</label>
              <select value={custGroup} onChange={(e) => setCustGroup(e.target.value)} style={{ width: '100%', marginTop: '0.3rem' }}>
                <option value="01">01 - Domestic Customer</option>
                <option value="02">02 - Foreign Customer</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Account Key (KVSL)</label>
              <select value={accountKey} onChange={(e) => setAccountKey(e.target.value)} style={{ width: '100%', marginTop: '0.3rem' }}>
                <option value="ERL">ERL - Sales Revenue</option>
                <option value="ERS">ERS - Sales Discounts</option>
                <option value="MWS">MWS - Output Sales Tax</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Billing Line Amount ($)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ width: '100%', marginTop: '0.3rem' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--color-emerald)' }}>
              2. Condition Table Match (Table C001)
            </h3>
            <pre>{simulation ? simulation.conditionRecord : 'Calculating condition match...'}</pre>
          </div>

          <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#fff' }}>
              3. Generated Accounting Journal Entry
            </h3>
            {simulation && simulation.journalEntry ? (
              <div style={{ background: '#080d16', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.3rem 0' }}>
                  <span>
                    <span className="badge badge-cyan">PK {simulation.journalEntry.debit.pk}</span> {simulation.journalEntry.debit.account}
                  </span>
                  <span style={{ color: 'var(--color-cyan)', fontWeight: 700 }}>
                    ${simulation.journalEntry.debit.amount.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justify: 'space-between',
                    fontSize: '0.85rem',
                    padding: '0.3rem 0',
                    borderTop: '1px dashed rgba(255,255,255,0.1)'
                  }}
                >
                  <span>
                    <span className="badge badge-emerald">PK {simulation.journalEntry.credit.pk}</span> {simulation.journalEntry.credit.account}
                  </span>
                  <span style={{ color: 'var(--color-emerald)', fontWeight: 700 }}>
                    ${simulation.journalEntry.credit.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
