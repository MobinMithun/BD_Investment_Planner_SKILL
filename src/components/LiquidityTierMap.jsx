import React from 'react';

const TIERS = [
  {
    tierName: 'Instant (T+0)',
    badgeColor: 'rgba(74, 222, 128, 0.2)', // green badge
    textColor: '#86efac',
    accessTime: 'Same day',
    instruments: 'Savings account, T-bills, cash, digital gold',
    allocation: '10–25%'
  },
  {
    tierName: 'Short (T+3 to 30d)',
    badgeColor: 'rgba(251, 146, 60, 0.2)', // orange badge
    textColor: '#fdba74',
    accessTime: '3–30 days',
    instruments: 'DSE stocks, mutual funds, FDR (premature)',
    allocation: '20–35%'
  },
  {
    tierName: 'Medium (1–12 mo)',
    badgeColor: 'rgba(163, 230, 53, 0.2)', // lime badge
    textColor: '#d9f99d',
    accessTime: '1–12 months',
    instruments: 'iFarmer, WeGro, DPS (premature penalty)',
    allocation: '15–25%'
  },
  {
    tierName: 'Long (>1 yr)',
    badgeColor: 'rgba(244, 114, 182, 0.2)', // pink badge
    textColor: '#fbcfe8',
    accessTime: '1–5 years',
    instruments: 'Sanchaypatra, BGTB, REIT, physical gold, startup',
    allocation: '20–40%'
  }
];

export default function LiquidityTierMap() {
  return (
    <section className="glass-panel" aria-labelledby="liquidity-tier-heading" style={{ marginTop: 'var(--space-6)' }}>
      <header style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--glass-border)' }}>
        <h2 id="liquidity-tier-heading" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, fontWeight: 700 }}>
          Liquidity Tier Map
        </h2>
      </header>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Tier</th>
              <th style={{ padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Access time</th>
              <th style={{ padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Instruments</th>
              <th style={{ padding: 'var(--space-3) var(--space-2)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Typical allocation</th>
            </tr>
          </thead>
          <tbody>
            {TIERS.map((tier, idx) => (
              <tr key={idx} style={{ borderBottom: idx !== TIERS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <td style={{ padding: 'var(--space-4) var(--space-2)' }}>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: tier.badgeColor,
                    color: tier.textColor,
                    padding: 'var(--space-1) var(--space-2)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                  }}>
                    {tier.tierName}
                  </span>
                </td>
                <td style={{ padding: 'var(--space-4) var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {tier.accessTime}
                </td>
                <td style={{ padding: 'var(--space-4) var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {tier.instruments}
                </td>
                <td style={{ padding: 'var(--space-4) var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {tier.allocation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
