import React from 'react';
import { Shield, Wallet, Receipt, Droplets, TrendingUp } from 'lucide-react';

const SCORE_CONFIG = [
  {
    key: 'diversificationScore',
    label: 'Diversification',
    sub: 'Across risk buckets',
    icon: Shield,
    iconColor: '#8b5cf6',
    iconBg: 'rgba(139,92,246,0.15)',
    threshold: 60,
  },
  {
    key: 'incomeScore',
    label: 'Income Strength',
    sub: 'vs ৳25K/mo target',
    icon: Wallet,
    iconColor: '#10b981',
    iconBg: 'rgba(16,185,129,0.15)',
    threshold: 50,
  },
  {
    key: 'taxEfficiencyScore',
    label: 'Tax Efficiency',
    sub: 'Rebate-eligible %',
    icon: Receipt,
    iconColor: '#f59e0b',
    iconBg: 'rgba(245,158,11,0.15)',
    threshold: 40,
  },
  {
    key: 'liquidityHealthScore',
    label: 'Liquidity Health',
    sub: 'Cash accessibility',
    icon: Droplets,
    iconColor: '#3b82f6',
    iconBg: 'rgba(59,130,246,0.15)',
    threshold: 40,
  },
];

function DonutGauge({ score, size = 72, strokeWidth = 6, color }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(score, 100) / 100) * circumference;

  let strokeColor;
  if (score >= 70) strokeColor = '#10b981';
  else if (score >= 40) strokeColor = '#f59e0b';
  else strokeColor = '#ef4444';

  return (
    <svg width={size} height={size} aria-hidden="true">
      {/* Background ring */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
      />
      {/* Foreground arc */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke={color || strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
      />
      {/* Center text */}
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--text-primary)"
        fontSize={score >= 100 ? 14 : 16}
        fontWeight={700}
        fontFamily="IBM Plex Sans, sans-serif"
      >
        {score}
      </text>
    </svg>
  );
}

function GradeBadge({ grade, color }) {
  return (
    <div
      style={{
        width: 72, height: 72,
        borderRadius: 'var(--radius-lg)',
        background: `${color}18`,
        border: `2px solid ${color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 20px ${color}20`,
      }}
      aria-hidden="true"
    >
      <span style={{ fontSize: '1.75rem', fontWeight: 800, color, letterSpacing: '-0.04em' }}>
        {grade}
      </span>
    </div>
  );
}

export default function PortfolioScoreCards({ scores }) {
  if (!scores) return null;

  return (
    <div className="score-cards-grid" role="region" aria-label="Portfolio health scores">
      {/* Four donut gauge cards */}
      {SCORE_CONFIG.map(cfg => {
        const score = scores[cfg.key];
        const Icon = cfg.icon;
        return (
          <div key={cfg.key} className="glass card score-card">
            <div className="score-card-header">
              <div className="score-card-icon" style={{ background: cfg.iconBg }}>
                <Icon size={18} style={{ color: cfg.iconColor }} />
              </div>
              <div>
                <span className="score-card-label">{cfg.label}</span>
                <span className="score-card-sub">{cfg.sub}</span>
              </div>
            </div>
            <div className="score-card-gauge">
              <DonutGauge score={score} />
            </div>
            {/* Mini bar */}
            <div className="score-card-bar-bg">
              <div
                className="score-card-bar-fill"
                style={{
                  width: `${Math.min(score, 100)}%`,
                  background: score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Risk-Adjusted Grade card */}
      <div className="glass card score-card score-card-grade">
        <div className="score-card-header">
          <div className="score-card-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>
            <TrendingUp size={18} style={{ color: '#10b981' }} />
          </div>
          <div>
            <span className="score-card-label">Risk-Adjusted Grade</span>
            <span className="score-card-sub">Return per unit of risk</span>
          </div>
        </div>
        <div className="score-card-gauge">
          <GradeBadge grade={scores.grade} color={scores.gradeColor} />
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 'var(--space-2)' }}>
          Ratio: {(scores.riskAdjustedRatio * 100).toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
