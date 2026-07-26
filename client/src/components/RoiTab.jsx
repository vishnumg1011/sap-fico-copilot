import React, { useState } from 'react';
import { Calculator, DollarSign, Clock, TrendingUp, ShieldCheck } from 'lucide-react';

export default function RoiTab() {
  const [consultantRate, setConsultantRate] = useState(150);
  const [teamSize, setTeamSize] = useState(5);
  const [queriesPerWeek, setQueriesPerWeek] = useState(40);

  const hoursSavedPerQuery = 1.5;
  const weeklyHoursSaved = teamSize * queriesPerWeek * hoursSavedPerQuery;
  const annualHoursSaved = weeklyHoursSaved * 50;
  const annualCostSavings = annualHoursSaved * consultantRate;
  const platformRoiPercentage = Math.round((annualCostSavings / 25000) * 100);

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <Calculator className="color-amber" size={24} />
        <h2 style={{ fontSize: '1.3rem', color: 'var(--color-amber)' }}>
          📈 Enterprise SAP Project ROI & Efficiency Calculator
        </h2>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Quantify annual cost and time savings delivered by SAP AI Copilot for S/4HANA & ECC implementations.
      </p>

      <div className="grid-2">
        <div style={{ background: 'rgba(17,24,39,0.6)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-amber)' }}>
            Project & Team Inputs
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Average Consultant Hourly Rate ($/hr)
              </label>
              <input
                type="number"
                value={consultantRate}
                onChange={(e) => setConsultantRate(Number(e.target.value))}
                style={{ width: '100%', marginTop: '0.3rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Number of SAP Consultants / Developers
              </label>
              <input
                type="number"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                style={{ width: '100%', marginTop: '0.3rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                FICO/SD Customizing Queries per Consultant / Week
              </label>
              <input
                type="number"
                value={queriesPerWeek}
                onChange={(e) => setQueriesPerWeek(Number(e.target.value))}
                style={{ width: '100%', marginTop: '0.3rem' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.1), rgba(0,163,255,0.05))', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-cyan)', fontSize: '0.9rem', fontWeight: 600 }}>
              <Clock size={18} /> Annual Consultant Hours Saved
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.4rem', color: '#fff' }}>
              {annualHoursSaved.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>hrs / yr</span>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, rgba(0,230,118,0.1), rgba(0,229,255,0.05))', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(0,230,118,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-emerald)', fontSize: '0.9rem', fontWeight: 600 }}>
              <DollarSign size={18} /> Projected Annual Cost Savings
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--color-emerald)' }}>
              ${annualCostSavings.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ yr</span>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, rgba(255,179,0,0.1), rgba(255,100,0,0.05))', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,179,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-amber)', fontSize: '0.9rem', fontWeight: 600 }}>
              <TrendingUp size={18} /> Estimated SaaS Investment ROI
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--color-amber)' }}>
              {platformRoiPercentage.toLocaleString()}% ROI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
