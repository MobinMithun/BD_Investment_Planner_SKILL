import React from 'react';
import { Lightbulb, Target, Shield, TrendingUp, Banknote, AlertTriangle } from 'lucide-react';

const GUIDELINES = [
  {
    title: 'Build an Emergency Fund First',
    titleBn: 'প্রথমে জরুরি তহবিল গড়ুন',
    content: 'Keep 6 months of living expenses in liquid assets (savings account or T-Bills) before committing to long-term instruments like Sanchaypatra or the stock market.',
    icon: <Shield size={20} aria-hidden="true" />,
    accent: '#3b82f6',
  },
  {
    title: 'Prioritize Government Bonds',
    titleBn: 'সরকারি বন্ডকে প্রাধান্য দিন',
    content: 'Sanchaypatra offers ~11% guaranteed return with tax rebate eligibility. It should form the backbone of any conservative Bangladeshi portfolio.',
    icon: <Target size={20} aria-hidden="true" />,
    accent: '#10b981',
  },
  {
    title: 'Understand Risk vs Reward',
    titleBn: 'ঝুঁকি বনাম পুরস্কার বুঝুন',
    content: 'DSE stocks can be volatile short-term but historically outperform inflation over 10+ years. Balance growth assets with fixed-income instruments.',
    icon: <TrendingUp size={20} aria-hidden="true" />,
    accent: '#6366f1',
  },
  {
    title: 'Maximize Tax Rebates',
    titleBn: 'কর রেয়াত সর্বাধিক করুন',
    content: 'Invest up to ৳15 Lakh in rebate-eligible instruments (Sanchaypatra, DPS, listed MFs). A 15% rebate means ৳2.25L back in your pocket each year.',
    icon: <Banknote size={20} aria-hidden="true" />,
    accent: '#f59e0b',
  },
  {
    title: 'Diversify, Don\'t Concentrate',
    titleBn: 'বৈচিত্র্য আনুন, কেন্দ্রীভূত করবেন না',
    content: 'The "25/25/25/25" rule splits your capital across High Risk, Moderate, Low Risk, and Cash. This limits downside while keeping growth potential.',
    icon: <Lightbulb size={20} aria-hidden="true" />,
    accent: '#ec4899',
  },
  {
    title: 'Beware of Inflation Erosion',
    titleBn: 'মুদ্রাস্ফীতি ক্ষয় থেকে সাবধান',
    content: 'Bangladesh inflation ran 9-10% in recent years. If your portfolio returns less than inflation, your purchasing power shrinks even with "positive" returns.',
    icon: <AlertTriangle size={20} aria-hidden="true" />,
    accent: '#ef4444',
  },
];

export default function GuidelineDetail() {
  return (
    <div role="region" aria-label="Investment guidelines">

      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h3 className="text-lg font-bold flex items-center gap-2">
          <div style={{ width: 4, height: 24, background: '#ec4899', borderRadius: 999 }} aria-hidden="true" />
          Investment Guidelines for Bangladesh
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 4 }}>
          Practical strategies for Bangladeshi retail investors
        </p>
      </div>

      {/* Card grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
        {GUIDELINES.map((g, idx) => (
          <article
            key={idx}
            className="glass"
            style={{
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
              transition: 'transform var(--transition-slow), box-shadow var(--transition-slow)',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Accent glow at top */}
            <div
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: 2,
                background: `linear-gradient(90deg, ${g.accent}, transparent)`,
                opacity: 0.7,
              }}
              aria-hidden="true"
            />

            {/* Icon */}
            <div
              style={{
                width: 40, height: 40,
                borderRadius: 10,
                background: `${g.accent}15`,
                border: `1px solid ${g.accent}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: g.accent,
                flexShrink: 0,
              }}
            >
              {g.icon}
            </div>

            {/* Text */}
            <div>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                {g.title}
              </h4>
              <p className="bn" style={{ fontSize: 'var(--text-xs)', color: g.accent, fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                {g.titleBn}
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {g.content}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
