import React, { useState } from 'react';
import { formatBDT } from '../utils/format';
import { Receipt, Clock, Shield } from 'lucide-react';

const BUCKET_META = {
  high: { label: 'High Risk', color: '#ef4444', sub: 'Stocks, Crypto' },
  moderate: { label: 'Moderate', color: '#f59e0b', sub: 'Gold, Mutual Funds' },
  low: { label: 'Low Risk', color: '#10b981', sub: 'Sanchaypatra, DPS' },
  cash: { label: 'Liquid', color: '#3b82f6', sub: 'T-Bills, Cash' },
};

const RISK_BADGE = {
  'very-high': { label: 'Very High', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  'high': { label: 'High', color: '#fca5a5', bg: 'rgba(252,165,165,0.12)' },
  'moderate': { label: 'Moderate', color: '#fcd34d', bg: 'rgba(252,211,77,0.12)' },
  'low': { label: 'Low', color: '#6ee7b7', bg: 'rgba(110,231,183,0.12)' },
  'very-low': { label: 'Very Low', color: '#5eead4', bg: 'rgba(94,234,212,0.12)' },
};

function Badge({ icon: Icon, label, color, bg }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '2px 6px', borderRadius: 'var(--radius-sm)',
      background: bg, color, fontSize: '0.6rem', fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      {Icon && <Icon size={10} />}
      {label}
    </span>
  );
}

export default function BucketCards({ scores, onRemove }) {
  const [expandedBucket, setExpandedBucket] = useState(null);

  if (!scores || !scores.rows || scores.rows.length === 0) return null;

  // Group by bucket
  const grouped = {};
  scores.rows.forEach(r => {
    const key = r.inst.category;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(r);
  });

  const bucketOrder = ['high', 'moderate', 'low', 'cash'];

  return (
    <div className="glass card" role="region" aria-label="Portfolio bucket breakdown">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <div style={{ width: 4, height: 24, background: 'var(--primary)', borderRadius: 999 }} />
          Portfolio Buckets
        </h3>
      </div>

      {/* Single unified table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
          <thead>
            <tr>
              <th style={thStyle}>Bucket</th>
              <th style={thStyle}>Instrument</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>ROI</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Monthly</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Yearly</th>
              <th style={thStyle}>Details</th>
              <th style={thStyle} />
            </tr>
          </thead>
          <tbody>
            {bucketOrder.map(key => {
              const items = grouped[key];
              if (!items) return null;
              const meta = BUCKET_META[key];
              const isExpanded = expandedBucket === key;
              const bucketTotal = items.reduce((s, r) => s + r.amount, 0);
              const bucketMonthly = items.reduce((s, r) => s + (r.amount * r.inst.roiMax / 12), 0);
              const bucketYearly = items.reduce((s, r) => s + (r.amount * r.inst.roiMax), 0);
              const bucket5yr = items.reduce((s, r) => s + (r.amount * Math.pow(1 + r.inst.roiMax, 5)), 0);
              const pctOfTotal = scores.totalInvested > 0 ? (bucketTotal / scores.totalInvested) * 100 : 0;

              return (
                <React.Fragment key={key}>
                  {/* ── Bucket Group Header ── */}
                  <tr
                    onClick={() => setExpandedBucket(isExpanded ? null : key)}
                    style={{
                      background: `${meta.color}08`,
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${meta.color}14`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${meta.color}08`; }}
                  >
                    <td style={{ padding: '12px 10px', borderBottom: `2px solid ${meta.color}30` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="2.5" strokeLinecap="round" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }}>
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <div style={{ width: 4, height: 24, borderRadius: 2, background: meta.color, flexShrink: 0 }} />
                        <div>
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: meta.color }}>{meta.label}</span>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginLeft: 6 }}>{meta.sub}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 10px', borderBottom: `2px solid ${meta.color}30`, fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                      {items.length} instrument{items.length > 1 ? 's' : ''}
                    </td>
                    <td style={{ ...tdRight, borderBottom: `2px solid ${meta.color}30`, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {formatBDT(bucketTotal)}
                    </td>
                    <td style={{ ...tdRight, borderBottom: `2px solid ${meta.color}30`, fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                      {pctOfTotal.toFixed(0)}%
                    </td>
                    <td style={{ ...tdRight, borderBottom: `2px solid ${meta.color}30`, fontWeight: 700, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
                      {formatBDT(bucketMonthly)}
                    </td>
                    <td style={{ ...tdRight, borderBottom: `2px solid ${meta.color}30`, fontWeight: 600, color: '#10b981', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums' }}>
                      {formatBDT(bucketYearly)}
                    </td>
                    <td style={{ padding: '12px 10px', borderBottom: `2px solid ${meta.color}30`, fontSize: 'var(--text-xs)', color: '#34d399', fontWeight: 600 }}>
                      {formatBDT(bucket5yr)} <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>in 5yr</span>
                    </td>
                    <td style={{ padding: '12px 10px', borderBottom: `2px solid ${meta.color}30` }} />
                  </tr>

                  {/* ── Expanded Instrument Rows ── */}
                  {isExpanded && items.map((row, idx) => {
                    const monthlyIncome = row.amount * row.inst.roiMax / 12;
                    const yearlyIncome = row.amount * row.inst.roiMax;
                    const riskBadge = RISK_BADGE[row.inst.riskLevel] || RISK_BADGE.moderate;
                    const isTaxEligible = row.inst.taxRebate === 'yes' || row.inst.taxRebate === 'partial';
                    const liqColor = row.inst.liquidityTier === 'high' ? '#86efac'
                      : row.inst.liquidityTier === 'medium' ? '#fdba74' : '#fbcfe8';
                    const liqBg = row.inst.liquidityTier === 'high' ? 'rgba(134,239,172,0.1)'
                      : row.inst.liquidityTier === 'medium' ? 'rgba(253,186,116,0.1)' : 'rgba(251,207,232,0.1)';

                    return (
                      <tr
                        key={row.id || idx}
                        style={{
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        {/* Bucket indent */}
                        <td style={{ padding: '10px 10px 10px 32px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <div style={{ width: 4, height: 20, borderRadius: 2, background: `${meta.color}40`, marginLeft: 6 }} />
                        </td>
                        {/* Instrument name */}
                        <td style={{ padding: '10px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>
                            {row.inst.name}
                          </span>
                        </td>
                        {/* Amount */}
                        <td style={{ ...tdRight, borderBottom: '1px solid rgba(255,255,255,0.04)', fontVariantNumeric: 'tabular-nums' }}>
                          {formatBDT(row.amount)}
                        </td>
                        {/* ROI */}
                        <td style={{ ...tdRight, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <span style={{
                            fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)',
                            background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: 'var(--radius-sm)',
                          }}>
                            {(row.inst.roiMax * 100).toFixed(1)}%
                          </span>
                        </td>
                        {/* Monthly */}
                        <td style={{ ...tdRight, borderBottom: '1px solid rgba(255,255,255,0.04)', fontWeight: 600, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
                          {formatBDT(monthlyIncome)}
                        </td>
                        {/* Yearly */}
                        <td style={{ ...tdRight, borderBottom: '1px solid rgba(255,255,255,0.04)', fontWeight: 600, color: '#10b981', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums' }}>
                          {formatBDT(yearlyIncome)}
                        </td>
                        {/* Badges */}
                        <td style={{ padding: '10px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            <Badge icon={Shield} label={riskBadge.label} color={riskBadge.color} bg={riskBadge.bg} />
                            <Badge icon={Clock} label={row.inst.liquidityLabel} color={liqColor} bg={liqBg} />
                            {isTaxEligible && (
                              <Badge icon={Receipt} label="Tax ✓" color="#34d399" bg="rgba(52,211,153,0.1)" />
                            )}
                          </div>
                        </td>
                        {/* Remove */}
                        <td style={{ padding: '10px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', textAlign: 'right' }}>
                          {row.id && scores.isCustom && (
                            <button
                              onClick={() => onRemove && onRemove(row.id)}
                              style={{
                                background: 'rgba(239,68,68,0.1)', border: 'none',
                                color: '#ef4444', cursor: 'pointer', width: 24, height: 24,
                                borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11, opacity: 0.6, transition: 'opacity 0.15s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.opacity = 1; }}
                              onMouseLeave={e => { e.currentTarget.style.opacity = 0.6; }}
                              aria-label={`Remove ${row.inst.name}`}
                            >
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  padding: 'var(--space-3) var(--space-2)',
  color: 'var(--text-tertiary)',
  fontSize: '0.65rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  textAlign: 'left',
};

const tdRight = {
  padding: '10px 10px',
  textAlign: 'right',
  fontSize: 'var(--text-xs)',
  color: 'var(--text-secondary)',
};
