import React, { useMemo } from 'react';
import { formatBDT } from '../utils/format';

const BUCKETS = [
  { key: 'high', label: 'High Risk', color: '#ef4444', sub: 'Stocks & Crypto' },
  { key: 'moderate', label: 'Moderate', color: '#f59e0b', sub: 'Gold & Mutual Funds' },
  { key: 'low', label: 'Low Risk', color: '#10b981', sub: 'Sanchaypatra & DPS' },
  { key: 'cash', label: 'Liquid', color: '#3b82f6', sub: 'T-Bills & Cash' },
];

export default function AllocationDonut({ bucketAmounts, totalAmount }) {
  const segments = useMemo(() => {
    const total = Object.values(bucketAmounts).reduce((s, v) => s + v, 0);
    if (total === 0) return [];

    let cumulative = 0;
    const parts = [];
    BUCKETS.forEach(b => {
      const pct = (bucketAmounts[b.key] || 0) / total;
      if (pct > 0) {
        parts.push({ ...b, pct, amount: bucketAmounts[b.key], start: cumulative });
        cumulative += pct;
      }
    });
    return parts;
  }, [bucketAmounts, totalAmount]);

  // Build conic-gradient string
  const gradientStr = useMemo(() => {
    if (segments.length === 0) return 'rgba(255,255,255,0.05) 0% 100%';
    return segments.map((s, i) => {
      const startPct = s.start * 100;
      const endPct = (s.start + s.pct) * 100;
      return `${s.color} ${startPct}% ${endPct}%`;
    }).join(', ');
  }, [segments]);

  const total = Object.values(bucketAmounts).reduce((s, v) => s + v, 0);

  return (
    <div className="glass card" role="region" aria-label="Portfolio allocation donut chart">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
        <div style={{ width: 4, height: 24, background: 'var(--secondary)', borderRadius: 999 }} />
        Allocation Breakdown
      </h3>

      <div className="donut-layout">
        {/* Donut ring */}
        <div className="donut-ring" style={{ background: `conic-gradient(${gradientStr})` }}>
          <div className="donut-hole">
            <span className="donut-total">{formatBDT(total)}</span>
            <span className="donut-label">Total Invested</span>
          </div>
        </div>

        {/* Legend */}
        <div className="donut-legend">
          {segments.map(s => (
            <div key={s.key} className="donut-legend-item">
              <div className="donut-legend-color" style={{ background: s.color }} />
              <div className="donut-legend-text">
                <span className="donut-legend-label">{s.label}</span>
                <span className="donut-legend-sub">{s.sub}</span>
              </div>
              <div className="donut-legend-value">
                <span className="donut-legend-pct">{(s.pct * 100).toFixed(0)}%</span>
                <span className="donut-legend-amt">{formatBDT(s.amount)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
