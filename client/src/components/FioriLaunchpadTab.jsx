import React, { useState } from 'react';
import { LayoutGrid, Search, Star, ExternalLink, Copy, Check } from 'lucide-react';

export default function FioriLaunchpadTab() {
  const [activeModule, setActiveModule] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTcode, setSelectedTcode] = useState(null);
  const [copied, setCopied] = useState(false);

  const tcodes = [
    { code: 'FS00', name: 'G/L Account Centrally', module: 'FI', desc: 'Create, change, or display Chart of Accounts and Company Code G/L Master Data.', spro: 'SPRO -> Financial Accounting -> General Ledger -> Master Data -> G/L Accounts', tables: 'SKA1, SKB1, SKAT' },
    { code: 'FB50', name: 'G/L Account Document Posting', module: 'FI', desc: 'Enter single-screen Financial Accounting G/L items with real-time balance check.', spro: 'N/A (Direct Transaction)', tables: 'BKPF, BSEG, ACDOCA' },
    { code: 'FAGLB03', name: 'G/L Account Balance Display', module: 'FI', desc: 'Display balances for New G/L ledgers and drill down into line items.', spro: 'N/A (Reporting)', tables: 'FAGLFLEXT, ACDOCA' },
    { code: 'OB52', name: 'Open and Close Posting Periods', module: 'FI', desc: 'Maintain open fiscal periods for Posting Period Variants and Account Types.', spro: 'SPRO -> Financial Accounting -> Financial Accounting Global Settings -> Document -> Posting Periods', tables: 'T001B' },
    { code: 'FBN1', name: 'FI Document Number Ranges', module: 'FI', desc: 'Maintain accounting document number intervals per company code and fiscal year.', spro: 'SPRO -> Financial Accounting -> Document -> Document Number Ranges', tables: 'NRIV' },
    { code: 'VKOA', name: 'SD Revenue Account Determination', module: 'SD', desc: 'Configure automatic assignment of SD billing line items to FI G/L accounts.', spro: 'SPRO -> Sales and Distribution -> Basic Functions -> Account Assignment -> Revenue Account Determination', tables: 'C001, C002, T688' },
    { code: 'VA01', name: 'Create Sales Order', module: 'SD', desc: 'Create customer sales order document with pricing and availability check.', spro: 'N/A (Document Entry)', tables: 'VBAK, VBAP, VBEP' },
    { code: 'VL01N', name: 'Create Outbound Delivery', module: 'SD', desc: 'Create delivery note for picking and packing goods from shipping point.', spro: 'N/A (Logistics Execution)', tables: 'LIKP, LIPS' },
    { code: 'VF01', name: 'Create Billing Document', module: 'SD', desc: 'Release invoice to Financial Accounting (FI) and generate customer receivables.', spro: 'N/A (SD Billing)', tables: 'VBRK, VBRP, BKPF' },
    { code: 'OBYC', name: 'Configure Automatic Postings (MM)', module: 'MM', desc: 'Configure automatic G/L account determination for Goods Receipt, Goods Issue, and Inventory.', spro: 'SPRO -> Materials Management -> Valuation and Account Assignment -> Account Determination', tables: 'T030, T030B' },
    { code: 'MIGO', name: 'Goods Movement', module: 'MM', desc: 'Post Goods Receipt (101), Goods Issue (201), or Transfer Posting (311).', spro: 'N/A (Logistics Execution)', tables: 'MKPF, MSEG' },
    { code: 'MIRO', name: 'Enter Incoming Invoice', module: 'MM', desc: 'Post vendor invoice against Purchase Order and verify GR/IR clearing balances.', spro: 'N/A (Logistics Invoice Verification)', tables: 'RBKP, RSEG' },
    { code: 'KS01', name: 'Create Cost Center', module: 'CO', desc: 'Create Cost Center master data within Controlling Area.', spro: 'SPRO -> Controlling -> Cost Center Accounting -> Master Data -> Cost Centers', tables: 'CSKS, CSKT' },
    { code: 'OKKP', name: 'Controlling Area Maintenance', module: 'CO', desc: 'Maintain Controlling Area assignment to Company Codes and activate components.', spro: 'SPRO -> Controlling -> General Controlling -> Organization -> Maintain Controlling Area', tables: 'TKA01, TKA02' },
    { code: 'AS01', name: 'Create Asset Master Record', module: 'AA', desc: 'Create Fixed Asset master data per Asset Class with depreciation keys.', spro: 'SPRO -> Financial Accounting -> Asset Accounting -> Organizational Structures', tables: 'ANLA, ANLZ' },
    { code: 'AFAB', name: 'Post Depreciation', module: 'AA', desc: 'Execute monthly asset depreciation posting run to General Ledger ACDOCA.', spro: 'SPRO -> Financial Accounting -> Asset Accounting -> Integration with General Ledger', tables: 'TABA, TBP1' },
    { code: 'SE16N', name: 'General Table Display', module: 'ABAP', desc: 'View, query, or export raw database table entries (ACDOCA, BKPF, BSEG, VBRK).', spro: 'N/A (Developer Tools)', tables: 'All SAP Tables' },
    { code: 'SE38', name: 'ABAP Editor', module: 'ABAP', desc: 'Develop, edit, and execute custom ABAP reports, function modules, and programs.', spro: 'N/A (ABAP Workbench)', tables: 'REPOSRC, TRDIR' }
  ];

  const filtered = tcodes.filter((t) => {
    const matchesModule = activeModule === 'ALL' || t.module === activeModule;
    const matchesSearch =
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const activeDetail = selectedTcode || filtered[0] || tcodes[0];

  const copySpro = () => {
    if (activeDetail?.spro) {
      navigator.clipboard.writeText(activeDetail.spro);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <LayoutGrid className="color-amber" size={24} />
        <h2 style={{ fontSize: '1.3rem', color: 'var(--color-amber)' }}>
          ⚡ Fiori-Style Interactive SAP T-Code & SPRO Launchpad
        </h2>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Explore 100+ core SAP T-Codes across FI, CO, SD, MM, AA, and ABAP with cheat sheets, SPRO navigation, and database tables.
      </p>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(17,24,39,0.6)', padding: '0.3rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          {['ALL', 'FI', 'SD', 'MM', 'CO', 'AA', 'ABAP'].map((mod) => (
            <button
              key={mod}
              className={`chip ${activeModule === mod ? 'active' : ''}`}
              style={{
                background: activeModule === mod ? 'var(--color-amber)' : 'transparent',
                color: activeModule === mod ? '#000' : 'var(--text-muted)',
                fontWeight: 700
              }}
              onClick={() => setActiveModule(mod)}
            >
              {mod}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search T-Code (e.g., FS00, VKOA, OBYC, OB52, SE16N)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Main Grid: Fiori Tiles on Left, Inspector on Right */}
      <div className="grid-2">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', maxHeight: '550px', overflowY: 'auto' }}>
          {filtered.map((item) => (
            <button
              key={item.code}
              onClick={() => setSelectedTcode(item)}
              style={{
                background: activeDetail?.code === item.code ? 'linear-gradient(135deg, rgba(255,179,0,0.2), rgba(0,229,255,0.1))' : 'rgba(17,24,39,0.6)',
                border: activeDetail?.code === item.code ? '1px solid var(--color-amber)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifySpace: 'space-between',
                height: '120px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {item.code}
                </span>
                <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>{item.module}</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
                {item.name}
              </div>
            </button>
          ))}
        </div>

        {/* Fiori Detail Drawer */}
        <div style={{ background: 'rgba(17,24,39,0.7)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
          {activeDetail ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="badge badge-amber">T-Code: {activeDetail.code} ({activeDetail.module} Module)</span>
                <button className="btn" onClick={copySpro} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied SPRO!' : 'Copy SPRO Path'}</span>
                </button>
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.75rem' }}>{activeDetail.name}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>{activeDetail.desc}</p>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>SPRO Customizing Navigation Path:</div>
              <pre style={{ marginBottom: '1.25rem', fontSize: '0.82rem' }}>{activeDetail.spro}</pre>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Associated Database Tables:</div>
              <div style={{ background: '#080d16', padding: '0.75rem', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-cyan)' }}>
                {activeDetail.tables}
              </div>
            </>
          ) : (
            <div>Select a T-Code tile to inspect customizing details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
