import React from 'react';
import { taxRules } from '../data/tax-rules';
import { formatBDT } from '../utils/format';
import { ShieldAlert, BadgeCheck, ArrowRight } from 'lucide-react';

const REBATE_ROWS = [
  {
    instrument: 'Sanchaypatra',
    instrumentBn: 'সঞ্চয়পত্র',
    rate: '15%',
    rateColor: 'var(--primary)',
    limit: 'Max rebate ৳2,25,000',
    highlight: true,
  },
  {
    instrument: 'DPS (Bank/FI)',
    instrumentBn: 'ডিপিএস',
    rate: '15%',
    rateColor: 'var(--primary)',
    limit: 'Max investment ৳1,20,000/yr',
  },
  {
    instrument: 'Listed Mutual Funds',
    instrumentBn: 'মিউচুয়াল ফান্ড',
    rate: '10%',
    rateColor: 'var(--accent)',
    limit: '10% of investment',
  },
  {
    instrument: 'DSE Stock Market',
    instrumentBn: 'পুঁজিবাজার',
    rate: 'Tax Exempt',
    rateColor: 'var(--secondary)',
    limit: 'First ৳50L capital gains exempt',
  },
];

export default function TaxRebateTable({ estimatedRebate }) {
  return (
    <div className="glass card" role="region" aria-label="Tax rebate guide">

      {/* ── Header row ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <div style={{ width: 4, height: 24, background: 'var(--accent)', borderRadius: 999 }} aria-hidden="true" />
            Tax Rebate Guide
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 4 }}>
            FY {taxRules.fiscalYear} · Based on NBR regulations
          </p>
        </div>

        {/* Rebate highlight badge */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.08)',
            padding: '0.875rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            textAlign: 'right',
            minWidth: 180,
          }}
          aria-label={`Estimated annual tax rebate: ${formatBDT(estimatedRebate)}`}
        >
          <span style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            Estimated Rebate
          </span>
          <span className="tnum" style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
            {formatBDT(estimatedRebate)}
          </span>
          <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
            per year
          </span>
        </div>
      </div>

      {/* ── NBR Notice ── */}
      <div
        style={{
          background: 'rgba(245, 158, 11, 0.06)',
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(245, 158, 11, 0.15)',
          marginBottom: 'var(--space-6)',
        }}
        role="alert"
      >
        <div className="flex gap-3" style={{ alignItems: 'flex-start' }}>
          <ShieldAlert size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
          <div>
            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
              Important NBR Rule
            </p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Total rebate cannot exceed <strong>20% of taxable income</strong> or <strong>৳1 Crore invested</strong> — whichever is lower.
              Consult a tax advisor for your exact eligibility.
            </p>
          </div>
        </div>
      </div>

      {/* ── Rebate Grid (cards instead of plain table for mobile friendliness) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        {REBATE_ROWS.map((row, idx) => (
          <div
            key={idx}
            style={{
              background: row.highlight ? 'rgba(16, 185, 129, 0.05)' : 'rgba(0,0,0,0.15)',
              border: `1px solid ${row.highlight ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)'}`,
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4) var(--space-6)',
              transition: 'border-color var(--transition-fast), background var(--transition-fast)',
            }}
          >
            <div className="flex justify-between items-start" style={{ marginBottom: 'var(--space-3)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {row.instrument}
                </div>
                <div className="bn" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                  {row.instrumentBn}
                </div>
              </div>
              {row.highlight && (
                <BadgeCheck size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} aria-label="Recommended" />
              )}
            </div>

            <div className="flex justify-between items-end">
              <span className="tnum" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: row.rateColor }}>
                {row.rate}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textAlign: 'right', maxWidth: '55%' }}>
                {row.limit}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
