import React from 'react';
import { instruments } from '../data/instruments';

const RISK_STYLES = {
  'very-low': { bg: 'var(--risk-vlow-bg)', text: 'var(--risk-vlow-text)' },
  'low':      { bg: 'var(--risk-low-bg)',  text: 'var(--risk-low-text)' },
  'moderate': { bg: 'var(--risk-mod-bg)',  text: 'var(--risk-mod-text)' },
  'high':     { bg: 'var(--risk-high-bg)', text: 'var(--risk-high-text)' },
};

const LIQUIDITY_BARS = {
  'very-high': 5,
  'high': 4,
  'moderate': 3,
  'low': 2,
  'very-low': 1,
};

function LiquidityIndicator({ level }) {
  const bars = LIQUIDITY_BARS[level] || 3;
  return (
    <div className="flex items-center gap-1" aria-label={`Liquidity: ${level?.replace('-', ' ')}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: 10 + i * 2,
            borderRadius: 2,
            background: i < bars ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
            transition: 'background var(--transition-fast)',
          }}
        />
      ))}
      <span style={{ marginLeft: 6, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
        {level?.replace('-', ' ')}
      </span>
    </div>
  );
}

export default function InstrumentTable() {
  return (
    <div className="glass card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--glass-border)' }}>
        <h3 className="text-lg font-bold flex items-center gap-2">
          <div style={{ width: 4, height: 24, background: 'var(--secondary)', borderRadius: 999 }} aria-hidden="true" />
          Investment Instruments Comparison
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 4 }}>
          Compare returns, risk, and liquidity across Bangladeshi instruments
        </p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table" role="table" aria-label="Investment instruments comparison table">
          <thead>
            <tr>
              <th scope="col">Instrument</th>
              <th scope="col">Category</th>
              <th scope="col">Risk Level</th>
              <th scope="col">ROI (Min–Max)</th>
              <th scope="col">Liquidity</th>
            </tr>
          </thead>
          <tbody>
            {instruments.map(instr => {
              const risk = RISK_STYLES[instr.riskLevel] || { bg: 'var(--surface-light)', text: '#fff' };
              return (
                <tr key={instr.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{instr.name}</div>
                    {instr.namebn && (
                      <div className="bn" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                        {instr.namebn}
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{instr.category}</span>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{ backgroundColor: risk.bg, color: risk.text }}
                      aria-label={`Risk: ${instr.riskLevel?.replace('-', ' ')}`}
                    >
                      {instr.riskLevel?.replace('-', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className="tnum" style={{ fontWeight: 700, color: 'var(--primary-light)' }}>
                      {instr.roiLabel}
                    </span>
                  </td>
                  <td>
                    <LiquidityIndicator level={instr.liquidityLabel?.toLowerCase()?.replace(' ', '-')} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
