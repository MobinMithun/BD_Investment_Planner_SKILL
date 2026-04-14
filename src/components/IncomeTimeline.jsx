import React, { useState } from 'react';
import { formatBDT } from '../utils/format';
import { Calendar, TrendingUp } from 'lucide-react';

export default function IncomeTimeline({ scores }) {
  const [mode, setMode] = useState('monthly'); // 'monthly' | 'yearly'

  if (!scores) return null;

  const { totalInvested, totalYearly } = scores;
  const avgROI = totalInvested > 0 ? totalYearly / totalInvested : 0;

  // Project income over time with compounding
  const timeline = [];
  for (let yr = 0; yr <= 5; yr++) {
    const compoundedValue = totalInvested * Math.pow(1 + avgROI, yr);
    const yearlyIncome = compoundedValue * avgROI;
    const monthlyIncome = yearlyIncome / 12;
    timeline.push({
      year: yr,
      label: yr === 0 ? 'Today' : yr === 1 ? 'Year 1' : `Year ${yr}`,
      monthly: monthlyIncome,
      yearly: yearlyIncome,
      totalValue: compoundedValue,
    });
  }

  // Find max for bar scaling
  const maxMonthly = Math.max(...timeline.map(t => t.monthly), 1);

  return (
    <div className="glass card" role="region" aria-label="Passive income timeline">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <div style={{ width: 4, height: 24, background: '#f59e0b', borderRadius: 999 }} />
          <Calendar size={18} style={{ color: '#f59e0b' }} aria-hidden="true" />
          Passive Income Projection
        </h3>
        {/* Toggle */}
        <div
          className="timeline-toggle"
          role="tablist"
          aria-label="Income display mode"
        >
          <button
            role="tab"
            aria-selected={mode === 'monthly'}
            onClick={() => setMode('monthly')}
            className={`timeline-toggle-btn ${mode === 'monthly' ? 'active' : ''}`}
          >
            Monthly
          </button>
          <button
            role="tab"
            aria-selected={mode === 'yearly'}
            onClick={() => setMode('yearly')}
            className={`timeline-toggle-btn ${mode === 'yearly' ? 'active' : ''}`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Timeline bars */}
      <div className="timeline-bars">
        {timeline.map((t, idx) => {
          const value = mode === 'monthly' ? t.monthly : t.yearly;
          const barHeight = (value / (mode === 'monthly' ? maxMonthly : maxMonthly * 12)) * 100;
          const isLast = idx === timeline.length - 1;

          return (
            <div key={idx} className="timeline-bar-item">
              {/* Value label */}
              <span
                className="timeline-bar-value"
                style={{ color: isLast ? '#10b981' : 'var(--text-primary)' }}
              >
                {formatBDT(value)}
              </span>
              {/* Bar */}
              <div className="timeline-bar-track">
                <div
                  className="timeline-bar-fill"
                  style={{
                    height: `${Math.max(barHeight, 4)}%`,
                    background: isLast
                      ? 'linear-gradient(to top, #10b981, #34d399)'
                      : `linear-gradient(to top, rgba(16,185,129,0.3), rgba(16,185,129,0.6))`,
                  }}
                />
              </div>
              {/* Year label */}
              <span
                className="timeline-bar-label"
                style={{ color: isLast ? '#10b981' : 'var(--text-tertiary)' }}
              >
                {t.label}
              </span>
              {/* Sub value */}
              <span className="timeline-bar-sub">
                {mode === 'monthly' ? formatBDT(t.yearly) + '/yr' : formatBDT(t.monthly) + '/mo'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Growth summary */}
      <div className="timeline-summary-row">
        <div className="timeline-summary-item">
          <span className="timeline-summary-label">Current Principal</span>
          <span className="timeline-summary-value">{formatBDT(totalInvested)}</span>
        </div>
        <div className="timeline-summary-item" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }}>
          <span className="timeline-summary-label">5-Year Total Income</span>
          <span className="timeline-summary-value" style={{ color: '#10b981' }}>
            {formatBDT(timeline.reduce((s, t) => s + t.yearly, 0))}
          </span>
        </div>
        <div className="timeline-summary-item">
          <span className="timeline-summary-label">
            <TrendingUp size={12} style={{ display: 'inline', marginRight: 2 }} />
            Effective ROI
          </span>
          <span className="timeline-summary-value">{(avgROI * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
