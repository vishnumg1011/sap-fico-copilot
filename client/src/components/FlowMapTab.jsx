import React, { useState } from 'react';
import { ArrowRight, Layers, Database, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

export default function FlowMapTab() {
  const [selectedNodeId, setSelectedNodeId] = useState('vf01');

  const nodes = [
    {
      id: 'va01',
      step: '1. Sales Order',
      tcode: 'VA01 / VA02',
      module: 'SD',
      tables: 'VBAK (Header), VBAP (Items)',
      desc: 'Customer places sales order for goods/services.',
      linkKey: 'VBAK-VBELN -> Sales Order Number',
      accounting: 'No financial accounting document posted at sales order creation.'
    },
    {
      id: 'vl01n',
      step: '2. Outbound Delivery',
      tcode: 'VL01N / VL02N',
      module: 'SD',
      tables: 'LIKP (Delivery Header), LIPS (Delivery Items)',
      desc: 'Shipping point creates delivery note and picks material from warehouse.',
      linkKey: 'LIKP-VBELN -> Delivery Document Number',
      accounting: 'Delivery creation generates picking/packing status.'
    },
    {
      id: 'mvt601',
      step: '3. Goods Issue (GI)',
      tcode: 'VL02N (Post GI) / MIGO',
      module: 'MM-FI',
      tables: 'MKPF (Material Header), MSEG (Material Items)',
      desc: 'Post Goods Issue reduces physical inventory stock balance.',
      linkKey: 'MKPF-MBLNR -> Material Document Number (Determines OBYC GBB/BSX)',
      accounting: 'Debit: Cost of Goods Sold (PK 40 - G/L 500000)\nCredit: Inventory Account (PK 99 - G/L 300000)'
    },
    {
      id: 'vf01',
      step: '4. Billing Document',
      tcode: 'VF01 / VF02',
      module: 'SD-FI',
      tables: 'VBRK (Billing Header), VBRP (Billing Items)',
      desc: 'Generates customer invoice and triggers automatic VKOA revenue account determination.',
      linkKey: 'BKPF-AWKEY = VBRK-VBELN (Reference Key Link)',
      accounting: 'Debit: Customer A/R Account (PK 01 - Customer Master)\nCredit: Sales Revenue (PK 50 - G/L 400000 via VKOA)'
    },
    {
      id: 'bkpf',
      step: '5. FI Document Header',
      tcode: 'FB03 / FB50',
      module: 'FI',
      tables: 'BKPF (Accounting Header)',
      desc: 'Financial accounting header document containing posting date, period, and currency.',
      linkKey: 'BKPF-BELNR + BKPF-GJAHR (Accounting Document Key)',
      accounting: 'Header record containing Document Status, Currency Rate, and Reference Key.'
    },
    {
      id: 'acdoca',
      step: '6. Universal Journal Line',
      tcode: 'SE16N / FAGLB03',
      module: 'S/4HANA',
      tables: 'ACDOCA (Universal Journal Repository)',
      desc: 'Single source of truth storing real-time line items across FI, CO, AA, and ML.',
      linkKey: 'ACDOCA-BELNR = BKPF-BELNR (Line Item DOCLN 000001...)',
      accounting: 'Combines General Ledger, Profit Center (PRCTR), Cost Center (KOSTL), and Segment in 300+ fields.'
    }
  ];

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[3];

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <Layers className="color-cyan" size={24} />
        <h2 style={{ fontSize: '1.3rem', color: 'var(--color-cyan)' }}>
          🌐 Interactive Visual SAP Data Flow & Lifecycle Node Map
        </h2>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Click any node in the Order-to-Cash (O2C) document flow to inspect underlying database tables, key joins, and accounting journal entries.
      </p>

      {/* Visual Flow Pipeline */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.75rem' }}>
        {nodes.map((node, i) => (
          <React.Fragment key={node.id}>
            <button
              onClick={() => setSelectedNodeId(node.id)}
              style={{
                flex: 1,
                minWidth: '160px',
                padding: '1rem 0.85rem',
                borderRadius: '12px',
                background: selectedNodeId === node.id ? 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,163,255,0.1))' : 'rgba(17,24,39,0.6)',
                border: selectedNodeId === node.id ? '1px solid var(--color-cyan)' : '1px solid var(--border-color)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                boxShadow: selectedNodeId === node.id ? '0 0 15px rgba(0,229,255,0.2)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{node.module}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{node.tcode.split(' ')[0]}</span>
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: selectedNodeId === node.id ? '#fff' : 'var(--text-main)' }}>
                {node.step}
              </div>
            </button>
            {i < nodes.length - 1 && (
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-cyan)', opacity: 0.6 }}>
                <ChevronRight size={20} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Node Inspector Drawer */}
      <div className="grid-2">
        <div style={{ background: 'rgba(17,24,39,0.7)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="badge badge-cyan">{activeNode.module} Module Process</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>T-Code: {activeNode.tcode}</span>
          </div>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.75rem' }}>{activeNode.step}</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>{activeNode.desc}</p>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Database Tables Involved:</div>
          <div style={{ background: '#080d16', padding: '0.75rem 1rem', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-cyan)', marginBottom: '1rem' }}>
            {activeNode.tables}
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Document Key Linking Logic:</div>
          <div style={{ background: '#080d16', padding: '0.75rem 1rem', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#a7f3d0' }}>
            {activeNode.linkKey}
          </div>
        </div>

        <div style={{ background: 'rgba(17,24,39,0.7)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-emerald)', marginBottom: '0.75rem' }}>
            Financial Accounting & Journal Entry Mechanics
          </h3>
          <pre style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#f3f4f6' }}>{activeNode.accounting}</pre>

          <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '8px', background: 'rgba(0,229,255,0.05)', border: '1px dashed rgba(0,229,255,0.2)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-cyan)', marginBottom: '0.3rem' }}>
              💡 SAP S/4HANA Architecture Insight:
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              In S/4HANA, when invoice <code>{activeNode.id.toUpperCase()}</code> releases to accounting, ACDOCA inserts real-time line items linked directly to SD billing doc header via <code>BKPF-AWKEY</code>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
