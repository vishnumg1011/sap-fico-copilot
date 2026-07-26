import React from 'react';
import { MessageSquare, RefreshCw, ShoppingCart, FileText, Stethoscope, Table, Calculator } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'chat', label: 'AI Copilot Assistant', icon: MessageSquare, badge: 'AI Live' },
    { id: 'vkoa', label: 'FI-SD VKOA Simulator', icon: RefreshCw },
    { id: 'obyc', label: 'MM-FI OBYC Simulator', icon: ShoppingCart, badge: 'New' },
    { id: 'spec', label: 'RICEF Spec Studio', icon: FileText },
    { id: 'errors', label: 'Error Diagnostics', icon: Stethoscope, badge: '10+ Errors' },
    { id: 'tables', label: 'HANA SQL & ACDOCA', icon: Table },
    { id: 'roi', label: 'ROI Calculator', icon: Calculator, badge: '$1M Value' }
  ];

  return (
    <header>
      <div className="brand">
        <div className="logo">💎</div>
        <div>
          <div className="brand-title">
            SAP FICO & SD Copilot <span className="badge badge-cyan" style={{ marginLeft: '0.4rem' }}>Enterprise SaaS</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            AI-Powered Functional Consulting, Account Determination & HANA Analytics Platform
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
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`badge ${tab.id === 'roi' ? 'badge-amber' : tab.id === 'obyc' ? 'badge-emerald' : 'badge-cyan'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', marginLeft: '0.2rem' }}>
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
