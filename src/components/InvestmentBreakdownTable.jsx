import React from 'react';
import { formatBDT } from '../utils/format';
import { Receipt } from 'lucide-react';
import PortfolioScoreCards from './PortfolioScoreCards';
import AllocationDonut from './AllocationDonut';
import BucketCards from './BucketCards';
import IncomeTimeline from './IncomeTimeline';
import PortfolioInsights from './PortfolioInsights';

export default function InvestmentBreakdownTable({ allocations, computed, portfolioItems, onRemove, portfolioScores }) {
  const scores = portfolioScores;
  if (!scores) return null;

  return (
    <div className="portfolio-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* ─── Header ─── */}
      <div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.03em' }}>
          {scores.isCustom ? 'My Portfolio Dashboard' : 'Portfolio Breakdown'}
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 4 }}>
          {scores.isCustom
            ? 'Your custom-selected instruments with projected returns'
            : 'Simulated allocation based on your risk profile'
          }
        </p>
      </div>

      {/* ─── Tax Rebate Banner ─── */}
      {scores.estimatedRebate > 0 && (
        <div className="tax-rebate-banner">
          <Receipt size={18} style={{ color: '#34d399' }} />
          <span className="tax-rebate-label">Estimated Annual Tax Rebate</span>
          <span className="tax-rebate-value">{formatBDT(scores.estimatedRebate)}</span>
        </div>
      )}

      {/* ─── Section 1: Score Cards ─── */}
      <PortfolioScoreCards scores={scores} />

      {/* ─── Section 2: Allocation Donut + Bucket Cards ─── */}
      <div className="donut-buckets-row">
        <div className="donut-col">
          <AllocationDonut bucketAmounts={computed.bucketAmounts} totalAmount={scores.totalInvested} />
        </div>
        <div className="buckets-col">
          <BucketCards scores={scores} onRemove={onRemove} />
        </div>
      </div>

      {/* ─── Section 3: Income Timeline ─── */}
      <IncomeTimeline scores={scores} />

      {/* ─── Section 4: Smart Insights ─── */}
      <PortfolioInsights scores={scores} allocations={allocations} />
    </div>
  );
}
