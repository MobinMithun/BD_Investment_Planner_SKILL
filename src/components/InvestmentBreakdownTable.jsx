import React, { useMemo } from 'react';
import { instruments } from '../data/instruments';

const BUCKET_COLORS = {
  high: '#E24B4A',
  moderate: '#EF9F27',
  low: '#639922',
  cash: '#378ADD'
};

const BUCKET_LABELS = {
  high: 'High',
  moderate: 'Moderate',
  low: 'Low',
  cash: 'Cash'
};

export default function InvestmentBreakdownTable({ allocations, computed, portfolioItems, onRemove }) {
  // Generate rows
  const rows = useMemo(() => {
    if (portfolioItems && portfolioItems.length > 0) {
      return portfolioItems.map(item => {
        const inst = instruments.find(i => i.id === item.instrumentId);
        if (!inst) return null;
        const amount = item.amount;
        const roi = inst.roiMax;
        const yearly = amount * roi;
        const monthly = yearly / 12;
        const value5yr = amount * Math.pow(1 + roi, 5);
        let estimatedRebate = 0;
        if (inst.taxRebate === 'yes' || inst.taxRebate === 'partial') {
          estimatedRebate = amount * 0.15;
        }
        return {
          id: item.id,
          bucketKey: inst.category,
          instrumentName: inst.name,
          amount,
          roi,
          monthly,
          yearly,
          estimatedRebate,
          value5yr,
          taxRebate: inst.taxRebate,
          isCustom: true
        };
      }).filter(Boolean);
    }

    let result = [];
    ['high', 'moderate', 'low', 'cash'].forEach(bucketKey => {
      const amountForBucket = computed.bucketAmounts[bucketKey] || 0;
      if (amountForBucket <= 0) return;
      
      const bucketInstruments = instruments.filter(i => i.category === bucketKey).slice(0, 2);
      if (bucketInstruments.length === 0) return;

      const splitAmount = amountForBucket / bucketInstruments.length;

      bucketInstruments.forEach(inst => {
        const roi = inst.roiMax; // Use max or avg, we will use max to match universe sorting 
        const yearly = splitAmount * roi;
        const monthly = yearly / 12;
        const value5yr = splitAmount * Math.pow(1 + roi, 5);
        
        let estimatedRebate = 0;
        if (inst.taxRebate === 'yes' || inst.taxRebate === 'partial') {
          estimatedRebate = splitAmount * 0.15; // Rough estimate of 15% allowance 
        }

        result.push({
          bucketKey,
          instrumentName: inst.name,
          amount: splitAmount,
          roi,
          monthly,
          yearly,
          estimatedRebate,
          value5yr,
          taxRebate: inst.taxRebate
        });
      });
    });
    return result;
  }, [allocations, computed, portfolioItems]);

  // Aggregate totals
  const totals = useMemo(() => {
    return rows.reduce((acc, row) => {
      acc.amount += row.amount;
      acc.yearly += row.yearly;
      acc.monthly += row.monthly;
      acc.rebate += row.estimatedRebate;
      acc.value5yr += row.value5yr;
      return acc;
    }, { amount: 0, yearly: 0, monthly: 0, rebate: 0, value5yr: 0 });
  }, [rows]);

  const avgROI = totals.amount > 0 ? (totals.yearly / totals.amount) * 100 : 0;

  const formatBDT = (val) => '৳' + Math.round(val).toLocaleString('en-IN');

  return (
    <div className="glass-panel" style={{ marginTop: 'var(--space-6)' }}>
      <header style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-tertiary)', marginBottom: 'var(--space-4)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          {portfolioItems && portfolioItems.length > 0 ? "My Custom Portfolio Breakdown" : "Your Investment Breakdown (Simulated)"}
        </h2>
        {portfolioItems && portfolioItems.length > 0 && (
          <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Showing the projected total for your specifically added instruments.
          </p>
        )}
        {totals.rebate > 0 && (
          <div style={{ marginTop: 'var(--space-4)', background: 'rgba(22,163,74,0.1)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(22,163,74,0.3)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 600 }}>Estimated total tax rebate:</span>
            <span style={{ fontSize: '16px', color: '#34d399', fontWeight: 700 }}>{formatBDT(totals.rebate)}</span>
          </div>
        )}
      </header>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr>
              <th style={{ padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--border-tertiary)' }}>Bucket</th>
              <th style={{ padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--border-tertiary)' }}>Instrument</th>
              <th style={{ padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--border-tertiary)' }}>Amount (৳)</th>
              <th style={{ padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--border-tertiary)' }}>ROI %</th>
              <th style={{ padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--border-tertiary)' }}>Monthly Return (৳)</th>
              <th style={{ padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--border-tertiary)' }}>Yearly Return (৳)</th>
              <th style={{ padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--border-tertiary)' }}>Tax Rebate Eligible</th>
              <th style={{ padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--border-tertiary)' }}>5yr Value (৳)</th>
              <th style={{ padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--border-tertiary)' }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr 
                key={idx}
                style={{ borderBottom: '0.5px solid var(--border-tertiary)', transition: 'background 0.2s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 8px', fontSize: '13px', color: BUCKET_COLORS[row.bucketKey], fontWeight: 700, borderLeft: `4px solid ${BUCKET_COLORS[row.bucketKey]}` }}>
                  {BUCKET_LABELS[row.bucketKey]}
                </td>
                <td style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {row.instrumentName}
                </td>
                <td style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--text-primary)' }}>
                  {formatBDT(row.amount)}
                </td>
                <td style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {(row.roi * 100).toFixed(2)}%
                </td>
                <td style={{ padding: '12px 8px', fontSize: '13px', color: '#10b981', fontWeight: 700 }}>
                  {formatBDT(row.monthly)}
                </td>
                <td style={{ padding: '12px 8px', fontSize: '13px', color: '#10b981', fontWeight: 700 }}>
                  {formatBDT(row.yearly)}
                </td>
                <td style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--text-primary)' }}>
                  {(row.taxRebate === 'yes' || row.taxRebate === 'partial') ? (
                    <span style={{ color: '#10b981', fontWeight: 600 }}>Yes ({formatBDT(row.estimatedRebate)})</span>
                  ) : (
                    <span style={{ color: '#ef4444' }}>No</span>
                  )}
                </td>
                <td style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {formatBDT(row.value5yr)}
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                  {row.isCustom && (
                    <button 
                      onClick={() => onRemove && onRemove(row.id)}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.7 }}
                      title="Remove instrument"
                    >
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            ))}
            
            {/* FOOTER TOTALS */}
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid var(--border-secondary)' }}>
              <td colSpan={2} style={{ padding: '16px 8px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 800 }}>
                Total Projection
              </td>
              <td style={{ padding: '16px 8px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 700 }}>
                {formatBDT(totals.amount)}
              </td>
              <td style={{ padding: '16px 8px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 700 }}>
                {avgROI.toFixed(1)}%
              </td>
              <td style={{ padding: '16px 8px', fontSize: '13px', color: '#10b981', fontWeight: 700 }}>
                {formatBDT(totals.monthly)}
              </td>
              <td style={{ padding: '16px 8px', fontSize: '13px', color: '#10b981', fontWeight: 700 }}>
                {formatBDT(totals.yearly)}
              </td>
              <td style={{ padding: '16px 8px', fontSize: '13px', color: '#10b981', fontWeight: 700 }}>
                {formatBDT(totals.rebate)}
              </td>
              <td style={{ padding: '16px 8px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 800 }}>
                {formatBDT(totals.value5yr)}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
