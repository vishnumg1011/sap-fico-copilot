import React from 'react';
import { MessageSquare, RefreshCw, FileText, Stethoscope, Table } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'chat', label: 'AI Copilot Assistant', icon: MessageSquare },
    { id: 'vkoa', label: 'FI-SD VKOA Simulator', icon: RefreshCw },
    { id: 'spec', label: 'RICEF Spec Builder', icon: FileText },
    { id: 'errors', label: 'Error Diagnostics', icon: Stethoscope },
    { id: 'tables', label: 'ACDOCA Table Explorer', icon: Table }
  ];

  return (
    <header>
      <div className="brand">
        <div className="logo">💎</div>
        <div>
          <div className="brand-title">SAP FICO & SD Functional Consultant Copilot</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Interactive AI-Guided Enterprise Solution (React + Express.js)
          </div>
        </div>
      </div>
      <nav id="nav">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
