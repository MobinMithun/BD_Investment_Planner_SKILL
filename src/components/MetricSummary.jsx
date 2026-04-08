import React from 'react';
import { formatBDT, formatPercent } from '../utils/format';
import { TrendingUp, Wallet, Landmark, Percent, ArrowUpRight } from 'lucide-react';

export default function MetricSummary({ computed }) {
  const metrics = [
    {
      label: 'Avg Yearly ROI',
      value: `${computed.avgROIPercent.toFixed(2)}%`,
      sub: 'Weighted average across all buckets',
      icon: <Percent className="text-emerald-400" size={18} aria-hidden="true" />,
      accent: '#10b981',
      trend: 'up',
    },
    {
      label: 'Yearly Return',
      value: formatBDT(computed.yearlyROI),
      sub: 'Est. earnings per year',
      icon: <TrendingUp className="text-indigo-400" size={18} aria-hidden="true" />,
      accent: '#6366f1',
      trend: 'up',
    },
    {
      label: 'Monthly Return',
      value: formatBDT(computed.monthlyROI),
      sub: 'Avg. monthly passive income',
      icon: <Landmark className="text-amber-400" size={18} aria-hidden="true" />,
      accent: '#f59e0b',
      trend: 'up',
    },
    {
      label: '5-Year Value',
      value: formatBDT(computed.projections[5]?.value ?? 0),
      sub: 'Projected portfolio growth',
      icon: <Wallet className="text-blue-400" size={18} aria-hidden="true" />,
      accent: '#3b82f6',
      trend: 'up',
    },
  ];

  return (
    <div className="metrics-row" role="region" aria-label="Portfolio key metrics">
      {metrics.map((m, idx) => (
        <div
          key={idx}
          className="glass card metric-card"
          style={{ '--accent-color': m.accent }}
        >
          {/* Top row: label + icon */}
          <div className="flex justify-between items-start mb-2">
            <span className="metric-label">{m.label}</span>
            <div
              className="p-2 rounded-lg"
              style={{ background: `${m.accent}18` }}
            >
              {m.icon}
            </div>
          </div>

          {/* Main value — tabular numbers via CSS class */}
          <span className="metric-value tnum">{m.value}</span>

          {/* Sub text + trend indicator */}
          <div className="flex items-center justify-between mt-2">
            <span className="metric-sub">{m.sub}</span>
            <div className="flex items-center gap-1" style={{ color: m.accent }}>
              <ArrowUpRight size={12} aria-hidden="true" />
              <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>+</span>
            </div>
          </div>

          {/* Animated accent bar at card bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: '2px',
              background: `linear-gradient(90deg, ${m.accent}, transparent)`,
              borderRadius: '0 0 var(--radius-md) var(--radius-md)',
              opacity: 0.6,
            }}
          />
        </div>
      ))}
    </div>
  );
}
