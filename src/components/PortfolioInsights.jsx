import React, { useMemo } from 'react';
import { Lightbulb, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

const ICON_MAP = {
  tip: { icon: Lightbulb, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
  warning: { icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)' },
  good: { icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
};

export default function PortfolioInsights({ scores, allocations }) {
  const insights = useMemo(() => {
    if (!scores) return [];
    const tips = [];

    const {
      diversificationScore,
      incomeScore,
      taxEfficiencyScore,
      liquidityHealthScore,
      bucketTotals,
      totalInvested,
      estimatedRebate,
      rows,
    } = scores;

    const pct = (key) => totalInvested > 0 ? ((bucketTotals[key] || 0) / totalInvested) * 100 : 0;

    // ─── Diversification insights ───
    if (diversificationScore < 40) {
      tips.push({
        type: 'warning',
        text: 'Your portfolio is heavily concentrated in one risk bucket. Consider spreading across at least 3 buckets for better diversification.',
      });
    } else if (diversificationScore >= 70) {
      tips.push({
        type: 'good',
        text: 'Well diversified! Your allocation spans multiple risk buckets, reducing concentration risk.',
      });
    }

    // ─── Income insights ───
    if (incomeScore < 30) {
      const monthlyEst = scores.incomeMonthly;
      tips.push({
        type: 'tip',
        text: `Your estimated monthly income is ৳${Math.round(monthlyEst).toLocaleString()}. To reach ৳25K/mo, consider increasing allocation to higher-ROI instruments like Mutual Funds or Sanchaypatra.`,
        action: 'Increase Moderate/Low allocation',
      });
    } else if (incomeScore >= 80) {
      tips.push({
        type: 'good',
        text: `Strong income generation! You're on track for ৳${Math.round(scores.incomeMonthly).toLocaleString()}/month in passive income.`,
      });
    }

    // ─── Tax insights ───
    if (taxEfficiencyScore < 30) {
      tips.push({
        type: 'warning',
        text: `Only ${taxEfficiencyScore}% of your portfolio is in tax-rebate-eligible instruments. You could save up to ৳${Math.round(estimatedRebate).toLocaleString()} in taxes by increasing DPS or Sanchaypatra allocation.`,
        action: 'Add DPS or Sanchaypatra for 15% rebate',
      });
    } else if (taxEfficiencyScore >= 60) {
      tips.push({
        type: 'good',
        text: `Good tax planning! ${taxEfficiencyScore}% of your portfolio qualifies for tax rebates — estimated savings: ৳${Math.round(estimatedRebate).toLocaleString()}/yr.`,
      });
    }

    // ─── Liquidity insights ───
    if (liquidityHealthScore < 25) {
      tips.push({
        type: 'warning',
        text: 'Very low liquidity! Most of your money is locked in long-term instruments. Keep at least 15-20% in cash/T-Bills for emergencies.',
        action: 'Move 15%+ to Liquid bucket',
      });
    } else if (liquidityHealthScore >= 50) {
      tips.push({
        type: 'good',
        text: 'Healthy liquidity! You have good access to cash when needed.',
      });
    }

    // ─── Bucket-specific tips ───
    if (pct('high') > 50) {
      tips.push({
        type: 'warning',
        text: `${pct('high').toFixed(0)}% in High Risk — significant exposure to market volatility. Consider capping at 30-40% unless you have a long time horizon.`,
      });
    }
    if (pct('cash') > 40) {
      tips.push({
        type: 'tip',
        text: `${pct('cash').toFixed(0)}% in cash is earning lower returns. Even moving half to Low Risk (Sanchaypatra) could boost yearly income by ~৳${Math.round((bucketTotals.cash * 0.5 * 0.11)).toLocaleString()}.`,
        action: 'Shift some cash to Sanchaypatra',
      });
    }
    if (pct('low') > 70) {
      tips.push({
        type: 'tip',
        text: 'Very conservative allocation. While safe, inflation may erode real returns. Consider 15-20% in Moderate (Gold/Mutual Funds) for inflation hedging.',
        action: 'Add 15% to Moderate bucket',
      });
    }

    // ─── Gold exposure check ───
    const hasGold = rows.some(r => r.inst.name.toLowerCase().includes('gold'));
    if (!hasGold && totalInvested > 200000) {
      tips.push({
        type: 'tip',
        text: 'No gold exposure in your portfolio. Gold is a traditional inflation hedge in Bangladesh and provides diversification benefits.',
        action: 'Consider 5-10% in Gold ETF',
      });
    }

    // ─── Agritech alternative ───
    const hasAgri = rows.some(r => r.inst.tags?.includes('agritech'));
    if (!hasAgri && totalInvested > 500000) {
      tips.push({
        type: 'tip',
        text: 'You might explore agritech platforms like iFarmer (14-20% ROI) for alternative diversification beyond traditional instruments.',
      });
    }

    // If no tips, add a positive default
    if (tips.length === 0) {
      tips.push({
        type: 'good',
        text: 'Your portfolio looks balanced. Keep monitoring and rebalancing quarterly for optimal performance.',
      });
    }

    return tips;
  }, [scores, allocations]);

  if (insights.length === 0) return null;

  return (
    <div className="glass card" role="region" aria-label="Portfolio insights and recommendations">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
        <Lightbulb className="text-amber-400" size={20} aria-hidden="true" />
        Smart Insights & Recommendations
      </h3>

      <div className="insights-list" role="list">
        {insights.map((insight, idx) => {
          const config = ICON_MAP[insight.type];
          const Icon = config.icon;
          return (
            <div
              key={idx}
              className="insight-item"
              style={{
                background: config.bg,
                border: `1px solid ${config.border}`,
              }}
              role="listitem"
            >
              <div className="insight-icon-wrap">
                <Icon size={16} style={{ color: config.color }} />
              </div>
              <div className="insight-content">
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {insight.text}
                </p>
                {insight.action && (
                  <button className="insight-action-btn" style={{ color: config.color }}>
                    <ArrowRight size={12} />
                    {insight.action}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
