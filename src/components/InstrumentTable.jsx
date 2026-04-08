import React from 'react';
import { instruments } from '../data/instruments';
import { formatPercent } from '../utils/format';

export default function InstrumentTable() {
  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'very-low': return 'var(--risk-vlow-bg)';
      case 'low': return 'var(--risk-low-bg)';
      case 'moderate': return 'var(--risk-mod-bg)';
      case 'high': return 'var(--risk-high-bg)';
      default: return 'var(--surface-light)';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'very-low': return 'var(--risk-vlow-text)';
      case 'low': return 'var(--risk-low-text)';
      case 'moderate': return 'var(--risk-mod-text)';
      case 'high': return 'var(--risk-high-text)';
      default: return '#fff';
    }
  };

  return (
    <div className="glass card overflow-hidden">
      <h3 className="text-lg font-bold p-6 border-b border-slate-700/50">
        Investment Instruments Comparison
      </h3>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Category</th>
              <th>Risk Level</th>
              <th>ROI (Min-Max)</th>
              <th>Liquidity</th>
            </tr>
          </thead>
          <tbody>
            {instruments.map(i => (
              <tr key={i.id} className="hover:bg-slate-700/20 transition-colors">
                <td>
                  <div className="font-semibold">{i.name}</div>
                  <div className="text-xs text-slate-500 bn">{i.namebn}</div>
                </td>
                <td>
                  <span className="capitalize text-slate-400">{i.category}</span>
                </td>
                <td>
                  <span 
                    className="badge" 
                    style={{ backgroundColor: getRiskBadge(i.riskLevel), color: getRiskColor(i.riskLevel) }}
                  >
                    {i.riskLevel.replace('-', ' ')}
                  </span>
                </td>
                <td className="font-mono text-emerald-400 font-bold">
                  {i.roiLabel}
                </td>
                <td className="text-slate-400">
                  {i.liquidityLabel}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
