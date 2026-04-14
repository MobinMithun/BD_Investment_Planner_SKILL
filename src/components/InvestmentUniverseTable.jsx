import React, { useState, useMemo } from 'react';
import { instruments } from '../data/instruments';
import { ChevronUp, ChevronDown, ChevronRight, PlusCircle } from 'lucide-react';

const RISK_MAP = {
  'very-low': { label: 'Very Low', color: '#0d9488', bg: 'rgba(13,148,136,0.15)', score: 1 },
  'low': { label: 'Low', color: '#16a34a', bg: 'rgba(22,163,74,0.15)', score: 2 },
  'moderate': { label: 'Moderate', color: '#d97706', bg: 'rgba(217,119,6,0.15)', score: 3 },
  'high': { label: 'High', color: '#dc2626', bg: 'rgba(220,38,38,0.15)', score: 4 },
  'very-high': { label: 'Very High', color: '#991b1b', bg: 'rgba(153,27,27,0.15)', score: 5 }
};

const LIQUIDITY_MAP = {
  'high': { label: 'High', color: '#16a34a', bg: 'rgba(22,163,74,0.15)' },
  'medium': { label: 'Medium', color: '#d97706', bg: 'rgba(217,119,6,0.15)' },
  'low': { label: 'Low', color: '#dc2626', bg: 'rgba(220,38,38,0.15)' }
};

const TAX_MAP = {
  'yes': { label: 'Yes ✓', color: '#16a34a', bg: 'rgba(22,163,74,0.15)' },
  'partial': { label: 'Partial', color: '#d97706', bg: 'rgba(217,119,6,0.15)' },
  'no': { label: 'No', color: '#dc2626', bg: 'rgba(220,38,38,0.15)' }
};

export default function InvestmentUniverseTable({ onAdd }) {
  const [sortConfig, setSortConfig] = useState({ key: 'roiMax', direction: 'desc' });
  const [riskFilter, setRiskFilter] = useState('All');
  const [liquidityFilter, setLiquidityFilter] = useState('All');
  const [taxRebateOnly, setTaxRebateOnly] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [addAmount, setAddAmount] = useState('');

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <span style={{ width: 14, display: 'inline-block' }} />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  // Find best risk-adjusted item for highlight globally (not filtered)
  const bestRiskAdjustedId = useMemo(() => {
    let bestId = instruments[0]?.id;
    let highestRatio = -999;
    instruments.forEach(inst => {
      const score = RISK_MAP[inst.riskLevel]?.score || 1;
      const ratio = inst.roiMax / score;
      if (ratio > highestRatio) {
        highestRatio = ratio;
        bestId = inst.id;
      }
    });
    return bestId;
  }, []);

  const filteredAndSorted = useMemo(() => {
    let filtered = instruments;
    
    // Filters
    if (riskFilter !== 'All') {
      const rKey = riskFilter === 'High Risk' ? ['high', 'very-high'] :
                   riskFilter === 'Moderate' ? ['moderate'] :
                   riskFilter === 'Low Risk' ? ['low', 'very-low'] :
                   riskFilter === 'Cash' ? ['cash'] : [];
      filtered = filtered.filter(i => rKey.includes(i.riskLevel) || (riskFilter === 'Cash' && i.category === 'cash'));
    }
    
    if (liquidityFilter !== 'All') {
      const lKey = liquidityFilter.toLowerCase();
      filtered = filtered.filter(i => i.liquidityTier === lKey);
    }
    
    if (taxRebateOnly) {
      filtered = filtered.filter(i => i.taxRebate === 'yes' || i.taxRebate === 'partial');
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      // Handle special sorts
      if (sortConfig.key === 'riskScore') {
        aVal = RISK_MAP[a.riskLevel]?.score || 0;
        bVal = RISK_MAP[b.riskLevel]?.score || 0;
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  }, [sortConfig, riskFilter, liquidityFilter, taxRebateOnly]);

  const handleAddToPortfolio = (inst) => {
    const defaultBucket = inst.category === 'cash' ? 'cash' : inst.category || 'moderate';
    window.dispatchEvent(new CustomEvent('ai-prompt', { 
      detail: `Switch the ${defaultBucket} bucket instrument to ${inst.name}` 
    }));
  };

  return (
    <div className="glass-panel" style={{ marginTop: 'var(--space-6)' }}>
      <header style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-tertiary)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Investment Universe: Risk & Return Comparison
        </h2>
        
        {/* Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
          {/* Row 1: Risk */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', width: 80 }}>Risk:</span>
            {['All', 'High Risk', 'Moderate', 'Low Risk', 'Cash'].map(opt => (
              <button 
                key={opt}
                onClick={() => setRiskFilter(opt)}
                style={{
                  background: riskFilter === opt ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: `1px solid ${riskFilter === opt ? 'rgba(255,255,255,0.2)' : 'var(--border-tertiary)'}`,
                  color: riskFilter === opt ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  cursor: 'pointer'
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Row 2: Liquidity */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', width: 80 }}>Liquidity:</span>
            {['All', 'High', 'Medium', 'Low'].map(opt => (
              <button 
                key={opt}
                onClick={() => setLiquidityFilter(opt)}
                style={{
                  background: liquidityFilter === opt ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: `1px solid ${liquidityFilter === opt ? 'rgba(255,255,255,0.2)' : 'var(--border-tertiary)'}`,
                  color: liquidityFilter === opt ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  cursor: 'pointer'
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Row 3: Tax */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', marginTop: 'var(--space-1)' }}>
            <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={taxRebateOnly} 
                onChange={(e) => setTaxRebateOnly(e.target.checked)} 
                style={{ accentColor: 'var(--primary)' }}
              />
              Show tax-rebate eligible instruments only
            </label>
          </div>
        </div>
      </header>

      <div style={{ overflowX: 'auto', marginTop: 'var(--space-4)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr>
              <th onClick={() => requestSort('name')} style={{ cursor: 'pointer', padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--border-tertiary)' }}>
                Instrument {getSortIcon('name')}
              </th>
              <th onClick={() => requestSort('riskScore')} style={{ cursor: 'pointer', padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--border-tertiary)' }}>
                Risk Level {getSortIcon('riskScore')}
              </th>
              <th onClick={() => requestSort('roiMax')} style={{ cursor: 'pointer', padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--border-tertiary)' }}>
                Expected ROI (yr) {getSortIcon('roiMax')}
              </th>
              <th onClick={() => requestSort('liquidityTier')} style={{ cursor: 'pointer', padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--border-tertiary)' }}>
                Liquidity {getSortIcon('liquidityTier')}
              </th>
              <th onClick={() => requestSort('taxRebate')} style={{ cursor: 'pointer', padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--border-tertiary)' }}>
                Tax Rebate {getSortIcon('taxRebate')}
              </th>
              <th onClick={() => requestSort('minInvestment')} style={{ cursor: 'pointer', padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--border-tertiary)' }}>
                Min Amount (৳) {getSortIcon('minInvestment')}
              </th>
              <th onClick={() => requestSort('horizon')} style={{ cursor: 'pointer', padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--border-tertiary)' }}>
                Horizon {getSortIcon('horizon')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map(inst => {
              const rStyle = RISK_MAP[inst.riskLevel] || RISK_MAP['moderate'];
              const lStyle = LIQUIDITY_MAP[inst.liquidityTier] || LIQUIDITY_MAP['medium'];
              const tStyle = TAX_MAP[inst.taxRebate] || TAX_MAP['no'];
              
              const isBest = inst.id === bestRiskAdjustedId;
              const isExpanded = expandedId === inst.id;

              return (
                <React.Fragment key={inst.id}>
                  {/* MAIN ROW */}
                  <tr 
                    onClick={() => setExpandedId(isExpanded ? null : inst.id)}
                    style={{ 
                      borderBottom: '0.5px solid var(--border-tertiary)',
                      background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent'}
                  >
                    <td style={{ 
                      padding: '12px 8px', 
                      fontSize: '13px', 
                      color: 'var(--text-primary)', 
                      fontWeight: isBest ? 700 : 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderLeft: isBest ? '3px solid #10b981' : '3px solid transparent'
                    }}>
                      <ChevronRight size={14} style={{ color: 'var(--text-tertiary)', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{inst.name}</span>
                        {isBest && <span style={{ fontSize: '10px', color: '#10b981', marginTop: '-2px' }}>Best Risk-Adjusted</span>}
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ background: rStyle.bg, color: rStyle.color, padding: '2px 6px', borderRadius: 'var(--radius-md)', fontSize: '11px', fontWeight: 600 }}>
                        {rStyle.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {inst.roiLabel}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ background: lStyle.bg, color: lStyle.color, padding: '2px 6px', borderRadius: 'var(--radius-md)', fontSize: '11px', fontWeight: 600 }}>
                        {lStyle.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ background: tStyle.bg, color: tStyle.color, padding: '2px 6px', borderRadius: 'var(--radius-md)', fontSize: '11px', fontWeight: 600 }}>
                        {tStyle.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {inst.minLabel}
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {inst.horizon}
                    </td>
                  </tr>

                  {/* EXPANDED DETAILS */}
                  {isExpanded && (
                    <tr style={{ background: 'rgba(0,0,0,0.1)' }}>
                      <td colSpan={7} style={{ padding: 'var(--space-4)', borderBottom: '0.5px solid var(--border-tertiary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                          <div>
                            <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>{inst.name} ({inst.namebn})</h4>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px 0' }}><strong>Issuer:</strong> {inst.issuedBy}</p>
                            <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', margin: '0 0 12px 0', maxWidth: '600px', lineHeight: 1.4 }}>{inst.notes}</p>
                            
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {inst.tags?.map(t => (
                                <span key={t} style={{ fontSize: '10px', background: 'var(--surface)', color: 'var(--text-tertiary)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-tertiary)' }}>#{t}</span>
                              ))}
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Amount ৳:</label>
                              <input 
                                type="number" 
                                min={inst.minInvestment}
                                placeholder={inst.minInvestment.toString()}
                                value={addAmount}
                                onChange={(e) => setAddAmount(e.target.value)}
                                style={{
                                  background: 'rgba(255,255,255,0.05)',
                                  border: '1px solid var(--border-secondary)',
                                  color: 'var(--text-primary)',
                                  padding: '6px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  width: '100px',
                                  outline: 'none',
                                  fontSize: '13px'
                                }}
                              />
                            </div>
                            <button 
                              onClick={() => {
                                const amountToUse = addAmount ? Number(addAmount) : inst.minInvestment;
                                if (onAdd) {
                                  onAdd(inst.id, amountToUse);
                                  setExpandedId(null);
                                  setAddAmount('');
                                } else {
                                  handleAddToPortfolio(inst);
                                }
                              }}
                              style={{ 
                                display: 'flex', alignItems: 'center', gap: '6px', 
                                background: 'var(--primary)', color: '#000', 
                                border: 'none', padding: '6px 12px', 
                                borderRadius: 'var(--radius-md)', fontSize: '12px', fontWeight: 600,
                                cursor: 'pointer', flexShrink: 0
                              }}
                            >
                              <PlusCircle size={14} />
                              Add to my portfolio
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            {filteredAndSorted.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '13px' }}>
                  No instruments match your selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
