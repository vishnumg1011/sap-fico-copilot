import React, { useState, useEffect } from 'react';
import { simulateObyc } from '../services/api';
import { ShoppingCart, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ObycTab() {
  const [coa, setCoa] = useState('INT');
  const [valuationClass, setValuationClass] = useState('3000');
  const [transactionKey, setTransactionKey] = useState('WRX');
  const [movementType, setMovementType] = useState('101');
  const [amount, setAmount] = useState('25000');
  const [simulation, setSimulation] = useState(null);

  const runSimulation = async () => {
    try {
      const res = await simulateObyc({
        coa,
        valuationClass,
        transactionKey,
        movementType,
        amount
      });
      setSimulation(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [coa, valuationClass, transactionKey, movementType, amount]);

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <ShoppingCart className="color-emerald" size={24} />
        <h2 style={{ fontSize: '1.3rem', color: 'var(--color-emerald)' }}>
          📦 MM-FI Automatic Posting Simulator (T-Code: OBYC)
        </h2>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Simulate Materials Management (Goods Receipt, Goods Issue, Invoice Receipt) automatic General Ledger postings.
      </p>

      <div className="grid-2">
        <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-emerald)' }}>
            1. MM-FI Customizing Parameters
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Chart of Accounts (KTOPL)</label>
              <select value={coa} onChange={(e) => setCoa(e.target.value)} style={{ width: '100%', marginTop: '0.3rem' }}>
                <option value="INT">INT - International Chart of Accounts</option>
                <option value="CAUS">CAUS - US Chart of Accounts</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Valuation Class (BKLAS)</label>
              <select value={valuationClass} onChange={(e) => setValuationClass(e.target.value)} style={{ width: '100%', marginTop: '0.3rem' }}>
                <option value="3000">3000 - Raw Materials (ROH)</option>
                <option value="7920">7920 - Finished Goods (FERT)</option>
                <option value="3050">3050 - Packaging Materials (VERP)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Transaction / Event Key (KTOSL)</label>
              <select value={transactionKey} onChange={(e) => setTransactionKey(e.target.value)} style={{ width: '100%', marginTop: '0.3rem' }}>
                <option value="WRX">WRX - GR/IR Clearing Account (Goods/Invoice Receipt)</option>
                <option value="BSX">BSX - Inventory Posting</option>
                <option value="GBB">GBB - Offset Entry for Inventory Posting (Consumption/COGS)</option>
                <option value="PRD">PRD - Price Difference Account</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Movement Type (BWART)</label>
              <select value={movementType} onChange={(e) => setMovementType(e.target.value)} style={{ width: '100%', marginTop: '0.3rem' }}>
                <option value="101">101 - Goods Receipt for Purchase Order</option>
                <option value="201">201 - Goods Issue for Cost Center</option>
                <option value="261">261 - Goods Issue for Order</option>
                <option value="601">601 - Goods Issue for Delivery (Sales Order)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Transaction Amount ($)</label>
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
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--color-cyan)' }}>
              2. OBYC Account Determination Matrix
            </h3>
            <pre>{simulation ? simulation.conditionRecord : 'Calculating determination...'}</pre>
          </div>

          <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#fff' }}>
              3. Automatic FI Accounting Document Generated
            </h3>
            {simulation && simulation.journalEntry ? (
              <div style={{ background: '#080d16', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.4rem 0' }}>
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
                    padding: '0.4rem 0',
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
