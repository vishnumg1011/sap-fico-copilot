import React from 'react';
import { MessageSquare, RefreshCw, ShoppingCart, FileText, Stethoscope, Table, Calculator, Code, Rocket, GitBranch } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'chat', label: 'AI Voice & Copilot', icon: MessageSquare, badge: 'Voice' },
    { id: 'vkoa', label: 'VKOA (SD-FI)', icon: RefreshCw },
    { id: 'obyc', label: 'OBYC (MM-FI)', icon: ShoppingCart },
    { id: 'abap', label: 'ABAP Converter', icon: Code, badge: 'CDS View' },
    { id: 'migration', label: 'S/4HANA Readiness', icon: Rocket, badge: 'Migration' },
    { id: 'spro', label: 'SPRO & TR Log', icon: GitBranch },
    { id: 'spec', label: 'RICEF Studio', icon: FileText },
    { id: 'errors', label: 'Diagnostics', icon: Stethoscope },
    { id: 'tables', label: 'ACDOCA SQL', icon: Table },
    { id: 'roi', label: 'ROI Calculator', icon: Calculator, badge: '$1M Value' }
  ];

  return (
    <header>
      <div className="brand">
        <div className="logo">💎</div>
        <div>
          <div className="brand-title">
            SAP FICO & SD Copilot <span className="badge badge-cyan" style={{ marginLeft: '0.4rem' }}>Enterprise SaaS v2.0</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            AI Voice, ABAP Converter, S/4HANA Migration & Account Determination Suite
          </div>
        </div>
      </div>
      <nav id="nav">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`badge ${tab.id === 'roi' ? 'badge-amber' : tab.id === 'abap' ? 'badge-emerald' : 'badge-cyan'}`} style={{ fontSize: '0.62rem', padding: '0.08rem 0.35rem', marginLeft: '0.15rem' }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
