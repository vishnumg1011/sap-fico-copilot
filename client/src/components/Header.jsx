import React from 'react';
import { MessageSquare, RefreshCw, ShoppingCart, FileText, Stethoscope, Table, Calculator, Code, Rocket, GitBranch, Layers, LayoutGrid, Network } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'chat', label: 'AI Voice & Copilot', icon: MessageSquare, badge: 'Voice' },
    { id: 'landscape', label: 'Cloud Architecture', icon: Network, badge: 'Cloud' },
    { id: 'flowmap', label: 'Data Flow Map', icon: Layers, badge: 'Visual' },
    { id: 'fiori', label: 'T-Code Launchpad', icon: LayoutGrid },
    { id: 'vkoa', label: 'VKOA (SD-FI)', icon: RefreshCw },
    { id: 'obyc', label: 'OBYC (MM-FI)', icon: ShoppingCart },
    { id: 'abap', label: 'ABAP Converter', icon: Code },
    { id: 'migration', label: 'S/4HANA Readiness', icon: Rocket },
    { id: 'spro', label: 'SPRO & TR Log', icon: GitBranch },
    { id: 'spec', label: 'RICEF Studio', icon: FileText },
    { id: 'errors', label: 'Diagnostics', icon: Stethoscope },
    { id: 'tables', label: 'ACDOCA SQL', icon: Table },
    { id: 'roi', label: 'ROI Calculator', icon: Calculator, badge: '$1M' }
  ];

  return (
    <header>
      <div className="brand">
        <div className="logo">💎</div>
        <div>
          <div className="brand-title">
            SAP FICO & SD Copilot <span className="badge badge-cyan" style={{ marginLeft: '0.4rem' }}>Enterprise SaaS v4.0</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            SAP Hybrid Cloud Architecture, Data Flow Map, Voice & S/4HANA Suite
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
              <Icon size={14} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`badge ${tab.id === 'roi' ? 'badge-amber' : tab.id === 'landscape' ? 'badge-cyan' : 'badge-emerald'}`} style={{ fontSize: '0.58rem', padding: '0.08rem 0.28rem', marginLeft: '0.12rem' }}>
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
