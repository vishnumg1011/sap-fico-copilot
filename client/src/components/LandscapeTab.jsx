import React, { useState } from 'react';
import { Network, Server, Cloud, ShieldCheck, Cpu, ArrowRightLeft, Radio } from 'lucide-react';

export default function LandscapeTab() {
  const [selectedSystemId, setSelectedSystemId] = useState('s4hana');

  const systems = [
    {
      id: 's4hana',
      name: 'SAP S/4HANA Private Cloud',
      role: 'Core ERP & Universal Journal Engine',
      type: 'Core Backend',
      protocol: 'OData v4 / RFC / ABAP CDS Views',
      auth: 'SAML 2.0 / Principal Propagation',
      latency: '12ms',
      status: 'ONLINE',
      desc: 'Central digital core hosting ACDOCA, BKPF, BSEG, VBRK, and SPRO customizing rules.',
      tables: 'ACDOCA, BKPF, BSEG, VKOA (C001), OBYC (T030)'
    },
    {
      id: 'btp',
      name: 'SAP Business Technology Platform (BTP)',
      role: 'Extension Suite & AI Runtime',
      type: 'PaaS Middleware',
      protocol: 'REST API / Kyma Runtime / Node.js',
      auth: 'OAuth 2.0 / SAP XSUAA',
      latency: '24ms',
      status: 'ONLINE',
      desc: 'Extension platform hosting side-by-side extensions, Node.js microservices, and AI Copilot models.',
      tables: 'CAP Services, HANA Cloud Schemas'
    },
    {
      id: 'cpi',
      name: 'SAP CPI (Cloud Integration / Integration Suite)',
      role: 'Integration Gateway & Middleware',
      type: 'Integration Hub',
      protocol: 'IDoc / SOAP / HTTPS / SFTP / OData',
      auth: 'Client Certificates / OAuth 2.0',
      latency: '18ms',
      status: 'ONLINE',
      desc: 'Connects S/4HANA core with third-party CRM, HR, Banking, and Supply Chain applications.',
      tables: 'iDoc Schemas, EDIFACT, XML Payloads'
    },
    {
      id: 'sac',
      name: 'SAP Analytics Cloud (SAC)',
      role: 'Executive Analytics & BI Dashboards',
      type: 'SaaS Analytics',
      protocol: 'Live HANA Direct Query / INA Protocol',
      auth: 'SSO / Identity Authentication Service (IAS)',
      latency: '35ms',
      status: 'ONLINE',
      desc: 'Real-time financial reporting, profit center variance analysis, and cash flow planning directly from ACDOCA.',
      tables: 'CDS Views: C_FinancialStatementAnalysis'
    },
    {
      id: 'thirdparty',
      name: 'Non-SAP Enterprise Systems',
      role: 'CRM & Supply Chain Integration',
      type: 'External Systems',
      protocol: 'REST / Webhooks / JSON APIs',
      auth: 'API Keys / OAuth 2.0 Bearer Tokens',
      latency: '45ms',
      status: 'ONLINE',
      desc: 'External enterprise software (Salesforce, Workday, ServiceNow) feeding billing & procurement events.',
      tables: 'JSON Data Models, Customer Master Interfaces'
    }
  ];

  const activeSystem = systems.find((s) => s.id === selectedSystemId) || systems[0];

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <Network className="color-cyan" size={24} />
        <h2 style={{ fontSize: '1.3rem', color: 'var(--color-cyan)' }}>
          🌐 Interactive SAP Cloud Landscape & Infrastructure Architecture Map
        </h2>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Explore enterprise SAP hybrid cloud infrastructure, BTP integration suite, protocols, and security tokens.
      </p>

      {/* Visual Infrastructure Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {systems.map((sys) => (
          <button
            key={sys.id}
            onClick={() => setSelectedSystemId(sys.id)}
            style={{
              background: selectedSystemId === sys.id ? 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,163,255,0.1))' : 'rgba(17,24,39,0.6)',
              border: selectedSystemId === sys.id ? '1px solid var(--color-cyan)' : '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '1.25rem',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.25 ease',
              boxShadow: selectedSystemId === sys.id ? '0 0 20px rgba(0,229,255,0.25)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '145px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{sys.type}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-emerald)', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                {sys.status}
              </span>
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: selectedSystemId === sys.id ? '#fff' : 'var(--text-main)', marginBottom: '0.2rem' }}>
                {sys.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{sys.role}</div>
            </div>
          </button>
        ))}
      </div>

      {/* System Inspector Panel */}
      <div className="grid-2">
        <div style={{ background: 'rgba(17,24,39,0.7)', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--border-glow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="badge badge-cyan">{activeSystem.type}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-emerald)', fontFamily: 'var(--font-mono)' }}>⚡ Latency: {activeSystem.latency}</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.75rem' }}>{activeSystem.name}</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>{activeSystem.desc}</p>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Connectivity & Protocols:</div>
          <div style={{ background: '#080d16', padding: '0.75rem 1rem', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-cyan)', marginBottom: '1rem' }}>
            {activeSystem.protocol}
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Security & Authentication Scheme:</div>
          <div style={{ background: '#080d16', padding: '0.75rem 1rem', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#a7f3d0' }}>
            {activeSystem.auth}
          </div>
        </div>

        <div style={{ background: 'rgba(17,24,39,0.7)', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-emerald)', marginBottom: '0.75rem' }}>
              Data Storage & Interface Models
            </h3>
            <div style={{ background: '#080d16', padding: '1rem', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
              {activeSystem.tables}
            </div>
          </div>

          <div style={{ padding: '1rem', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(0,229,255,0.08), rgba(0,163,255,0.03))', border: '1px dashed rgba(0,229,255,0.3)' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-cyan)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} /> Enterprise Security Compliance:
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              All integration endpoints enforce TLS 1.3 encryption, Principal Propagation, and zero-trust IAM policy checks.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
