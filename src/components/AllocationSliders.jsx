import React from 'react';
import { formatBDT } from '../utils/format';

export default function AllocationSliders({ allocations, updateAllocation, bucketAmounts }) {
  const total = Object.values(allocations).reduce((a, b) => a + b, 0);
  const isValid = Math.round(total) === 100;

  const buckets = [
    {
      id: 'high',
      label: 'High Risk',
      sublabel: 'Stocks & Crypto',
      color: 'var(--bucket-high)',
      hint: 'DSE equities, growth funds',
    },
    {
      id: 'moderate',
      label: 'Moderate',
      sublabel: 'Gold & Mutual Funds',
      color: 'var(--bucket-mod)',
      hint: 'Gold ETF, diversified MFs',
    },
    {
      id: 'low',
      label: 'Low Risk',
      sublabel: 'Sanchaypatra & DPS',
      color: 'var(--bucket-low)',
      hint: 'Govt. savings, fixed income',
    },
    {
      id: 'cash',
      label: 'Liquid',
      sublabel: 'T-Bills & Cash',
      color: 'var(--bucket-cash)',
      hint: 'Emergency reserve, T-Bills',
    },
  ];

  return (
    <div className="glass card h-full">

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <div style={{ width: 4, height: 24, background: 'var(--primary)', borderRadius: 999 }} />
          Portfolio Allocation
        </h3>
        {/* Total indicator */}
        <div
          style={{
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            background: isValid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${isValid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            color: isValid ? 'var(--primary)' : 'var(--error)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            transition: 'all var(--transition-base)',
          }}
          aria-live="polite"
          aria-label={`Total allocation: ${total.toFixed(0)}%`}
        >
          {total.toFixed(0)}%
        </div>
      </div>

      <div className="slider-group" role="group" aria-label="Risk bucket allocation sliders">
        {buckets.map(b => (
          <div key={b.id} className="slider-item">
            <div className="slider-header">
              <div>
                <span className="slider-label">{b.label}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginLeft: '0.5rem' }}>
                  {b.sublabel}
                </span>
              </div>
              <span className="slider-percent" style={{ color: b.color }}>
                {allocations[b.id].toFixed(0)}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={allocations[b.id]}
              onChange={(e) => updateAllocation(b.id, Number(e.target.value))}
              aria-label={`${b.label} allocation: ${allocations[b.id].toFixed(0)}%`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(allocations[b.id])}
              style={{
                background: `linear-gradient(to right, ${b.color} ${allocations[b.id]}%, rgba(255,255,255,0.08) ${allocations[b.id]}%)`,
              }}
            />

            <div className="flex justify-between items-center" style={{ marginTop: '2px' }}>
              <span className="slider-amount" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>
                {b.hint}
              </span>
              <span className="slider-amount tnum" style={{ color: b.color }}>
                {formatBDT(bucketAmounts[b.id])}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary row */}
      <div
        style={{
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.25)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total Allocated
            </span>
            {!isValid && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--error)', marginTop: 2 }}>
                Adjust sliders to reach 100%
              </p>
            )}
          </div>
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: isValid ? 'var(--primary)' : 'var(--error)', fontVariantNumeric: 'tabular-nums' }}>
            {total.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}
