---
name: bd-investment-planner
description: Build, render, or update the Bangladesh Investment Planner — an interactive financial simulation website for Bangladeshi investors. Covers Sanchaypatra, FDR, DSE stocks, mutual funds, T-bonds, iFarmer, WeGro, gold, REITs, DPS, and tax rebate planning. Trigger when users ask to create an investment dashboard, BD finance tool, taka calculator, ROI simulator, portfolio planner, or financial plan for Bangladesh.
---

# Bangladesh Investment Planner — Skill

A production skill for building, extending, and maintaining an interactive Bangladesh Investment Simulation website. Covers full-stack architecture, UI component design, data models, scoring engines, and deployment.

---

## When to Use This Skill

Activate this skill when the user asks to:
- Build, improve, extend, or redesign a Bangladesh investment simulator
- Create a portfolio planner, ROI calculator, or investment comparison tool for Bangladesh
- Add new instruments, update ROI rates, change UI/UX, add charts
- Generate a downloadable investment plan or integrate new financial data
- Create a "taka calculator", "investment dashboard", "BD finance tool", or "financial plan for Bangladesh"

---

## Project Structure

```
bd-investment-planner/
├── index.html                  # Shell / entry point
├── vite.config.js              # Vite build config
├── package.json                # Dependencies
├── SKILL.md                    # This file — skill definition
├── README.md                   # Project documentation
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Root component with tab navigation
│   ├── components/
│   │   ├── AmountInput.jsx             # BDT amount input + risk profile selector
│   │   ├── AllocationSliders.jsx       # 4-bucket allocation sliders (High/Mod/Low/Cash)
│   │   ├── MetricSummary.jsx           # KPI cards: Avg ROI, Yearly/Monthly Return, 5-Year Value
│   │   ├── ROIChart.jsx                # Chart.js 5-year growth projection
│   │   ├── PortfolioScoreCards.jsx     # 5 scored gauges: Diversification, Income, Tax, Liquidity, Grade
│   │   ├── AllocationDonut.jsx         # CSS conic-gradient donut chart
│   │   ├── BucketCards.jsx             # List-view table of portfolio buckets with instruments
│   │   ├── IncomeTimeline.jsx          # Bar chart: passive income projection Year 0→5
│   │   ├── PortfolioInsights.jsx       # Auto-generated smart tips based on allocation
│   │   ├── InvestmentUniverseTable.jsx # Full instrument comparison table (filterable/sortable)
│   │   ├── InvestmentBreakdownTable.jsx# Dashboard composer (ScoreCards + Donut + Buckets + Timeline + Insights)
│   │   ├── TaxRebateTable.jsx          # Tax rebate eligibility guide
│   │   ├── LiquidityTierMap.jsx        # Liquidity tier reference table
│   │   ├── GuidelineDetail.jsx         # Investment education content
│   │   ├── AIAdvisor.jsx               # AI-powered advice panel (Claude)
│   │   ├── MoneyBackground.jsx         # Animated particle background
│   │   └── MusicPlayer.jsx             # Mic beat sync visualizer
│   ├── hooks/
│   │   ├── usePortfolio.js     # Core state: amounts, allocations, ROI, portfolioScores
│   │   └── useTaxCalc.js       # Tax rebate computation
│   ├── data/
│   │   ├── instruments.js      # 17 BD investment instruments with ROI, risk, liquidity, tax data
│   │   ├── tax-rules.js        # FY 2024-25 tax rebate rules
│   │   └── profiles.js         # 6 preset allocation profiles
│   ├── utils/
│   │   └── format.js           # BDT formatting (lakh/crore system)
│   └── styles/
│       ├── tokens.css          # Design tokens (colors, spacing, typography, glassmorphism)
│       └── components.css      # Shared component styles + dashboard styles
└── media/                      # Screenshots and assets
```

---

## Quick Start

```bash
npm install
npm run dev     # → http://localhost:5173
npm run build   # Production build in dist/
npm run preview # Preview production build
```

---

## Core Concepts

### 4-Bucket Allocation Model

Every portfolio is split into 4 risk buckets:

| Bucket | Color | Instruments | Typical Allocation |
|---|---|---|---|
| **High Risk** | Red (#ef4444) | DSE stocks, crypto, agritech | 10-45% |
| **Moderate** | Amber (#f59e0b) | Gold, mutual funds | 15-35% |
| **Low Risk** | Green (#10b981) | Sanchaypatra, DPS, FDR | 15-60% |
| **Liquid** | Blue (#3b82f6) | T-Bills, cash equivalents | 10-25% |

### 6 Risk Profiles

| Profile | High | Moderate | Low | Cash |
|---|---|---|---|---|
| **Balanced** | 25% | 25% | 25% | 25% |
| **Conservative** | 10% | 20% | 50% | 20% |
| **Aggressive** | 45% | 30% | 15% | 10% |
| **Jewish 25/25/25/25** | 25% | 25% | 25% | 25% |
| **Young Professional** | 40% | 35% | 15% | 10% |
| **Post-Retirement** | 5% | 15% | 60% | 20% |

### Portfolio Scoring Engine (5 Scores)

Computed in `usePortfolio.js` from allocation data:

1. **Diversification Score** (0-100): Entropy-based. Penalizes over-concentration in one bucket. Ideal = 25% each.
2. **Income Strength** (0-100): Monthly ROI vs ৳25K/mo comfort threshold.
3. **Tax Efficiency** (0-100): % of portfolio in tax-rebate-eligible instruments.
4. **Liquidity Health** (0-100): Weighted by liquidity tier (high=1.0, medium=0.67, low=0.33).
5. **Risk-Adjusted Grade** (A+ to D): `Σ(ROI_max / risk_score × amount) / totalInvested`. Higher = better return per unit of risk.

### ROI Calculation

```javascript
yearlyROI = Σ (bucketAmount × bucketROI)
monthlyROI = yearlyROI / 12
avgROIPercent = (yearlyROI / totalAmount) × 100
projection[yr] = totalAmount × (1 + yearlyROI/totalAmount)^yr
```

**Important:** Use `roiMax` (expected return) for projections. `roiMin` can be negative for high-risk instruments (small-cap stocks) and should only be shown as risk context, never used in base projections.

---

## Data Models

### Instrument Schema

```javascript
{
  id: "sanchaypatra-5yr",
  name: "Sanchaypatra (5yr)",
  namebn: "সঞ্চয়পত্র (৫ বছর)",
  category: "low",              // "high" | "moderate" | "low" | "cash"
  riskLevel: "very-low",        // very-low | low | moderate | high | very-high
  roiMin: 0.1128,               // worst-case (can be negative for high-risk)
  roiMax: 0.1128,               // expected return — use this for projections
  roiLabel: "11.28%",
  liquidityTier: "low",         // high | medium | low
  liquidityLabel: "Long (> 1 yr)",
  taxRebate: "yes",             // "yes" | "partial" | "no"
  minInvestment: 10000,
  minLabel: "৳10,000",
  horizon: "5 years",
  issuedBy: "Government of Bangladesh",
  notes: "Description for expanded row",
  tags: ["guaranteed", "government", "safe"]
}
```

### Tax Rules (FY 2024-25)

```javascript
{
  fiscalYear: "2024-25",
  rebateRate: 0.15,                              // 15% standard rebate
  maxInvestableForRebateRatio: 0.20,             // 20% of total income
  ceilingAmount: 10000000,                       // ৳1 Crore ceiling
  instruments: {
    sanchaypatra: { rebateRate: 0.15, maxRebate: 225000 },
    dps: { rebateRate: 0.15, maxEligibleInvestment: 120000 },
    mutualFund: { rebateRate: 0.10, maxEligibleInvestment: 50000 },
    stocks: { exemption: 5000000 }               // ৳50L capital gains exempt
  }
}
```

---

## Design System

### Visual Style
- **Dark glassmorphism** theme with emerald (#10b981) primary accent
- Background: `#070d1a` with radial gradient overlays
- Cards: `backdrop-filter: blur(16px)` with `rgba(30,41,59,0.7)` background
- Border: `rgba(255,255,255,0.08)`, shadow: `0 8px 32px rgba(0,0,0,0.37)`

### Typography
- Font: IBM Plex Sans (English) + Hind Siliguri (Bengali)
- Numbers: `font-variant-numeric: tabular-nums` for stable display
- Currency: `formatBDT()` uses South Asian lakh/crore system (৳5 Lakh, ৳1.5 Crore)

### Responsive Grid
- 12-column CSS grid layout
- Desktop: 4-col score cards, 2-col bucket cards, 6-col timeline bars
- Tablet (< 1024px): 3-col scores, single-column donut+buckets
- Mobile (< 768px): 2-col scores, stacked buckets, 3-col timeline

---

## Extension Guide

### Adding a New Instrument

1. Add entry to `src/data/instruments.js` following the schema above
2. Assign correct `category` bucket (`high | moderate | low | cash`)
3. Set `liquidityTier`, `roiMin`, `roiMax`, `taxRebate` fields
4. If it has a unique tax rule, add to `src/data/tax-rules.js`

### Adding a New Profile

1. Add to `src/data/profiles.js` with 4 allocation percentages (must sum to 100)
2. Add display name, Bengali name, and description

### Updating Tax Rules

1. Update `src/data/tax-rules.js` with new rates
2. The `useTaxCalc` hook and `TaxRebateTable` read from this file

### Adding a New Score

1. Add computation to `portfolioScores` in `src/hooks/usePortfolio.js`
2. Add config entry to `SCORE_CONFIG` array in `PortfolioScoreCards.jsx`
3. Style the gauge (SVG donut or custom component)

---

## Component Quick Reference

| Component | Input Props | Renders |
|---|---|---|
| `AmountInput` | totalAmount, setTotalAmount, profileId, setProfileId | Number input + profile dropdown + presets |
| `AllocationSliders` | allocations, updateAllocation, bucketAmounts | 4 range sliders with live amounts |
| `MetricSummary` | computed | 4 KPI cards (Avg ROI, Yearly, Monthly, 5-Year) |
| `ROIChart` | projections | Chart.js line chart with area fill |
| `PortfolioScoreCards` | scores | 5 donut gauge cards + grade badge |
| `AllocationDonut` | bucketAmounts, totalAmount | CSS conic-gradient ring chart + legend |
| `BucketCards` | scores, onRemove | List-view table with expandable bucket groups |
| `IncomeTimeline` | scores | Bar chart: Year 0→5 passive income |
| `PortfolioInsights` | scores, allocations | Auto-generated tips based on allocation analysis |
| `InvestmentBreakdownTable` | scores, computed, allocations, portfolioItems, onRemove | Dashboard composer |
| `InvestmentUniverseTable` | onAdd | Filterable/sortable instrument table |
| `TaxRebateTable` | estimatedRebate | Tax rebate eligibility guide |
| `AIAdvisor` | (listens to ai-prompt event) | Chat interface for financial advice |
| `MoneyBackground` | (none) | Animated floating currency particles |
| `MusicPlayer` | (none) | Mic beat sync toggle |

---

## Key Files to Edit

| Task | File |
|---|---|
| Change ROI rates | `src/data/instruments.js` |
| Add/remove instruments | `src/data/instruments.js` |
| Update tax rules | `src/data/tax-rules.js` |
| Add a profile | `src/data/profiles.js` |
| Modify scoring logic | `src/hooks/usePortfolio.js` (portfolioScores useMemo) |
| Change UI colors | `src/styles/tokens.css` |
| Add a component | `src/components/` + import in `App.jsx` |
| Add dashboard section | `src/components/InvestmentBreakdownTable.jsx` |

---

## ROI Rates Reference (FY 2024-25)

| Instrument | ROI | Tax Rebate | Liquidity |
|---|---|---|---|
| Sanchaypatra 5yr | 11.28% | Yes (15%) | Low |
| Sanchaypatra 3yr | 11.04% | Yes (15%) | Low |
| Wage Earner Bond | 12.00% | Yes | Low |
| BGTB Treasury Bond | 8.5-10.5% | No | Low |
| T-bill (91d) | 8-9% | No | High |
| Bank FDR (1yr) | 7-9.5% | No | Medium |
| DPS | 6.5-8.5% | Yes (15%) | Medium |
| Gold (physical) | 8-12% | No | High |
| Gold (digital/ETF) | 9-13% | No | High |
| DSE Blue Chip | 10-16% | Partial | High |
| DSE Small Cap | 15-35% | Partial | High |
| Mutual Fund (growth) | 12-22% | Yes | Medium |
| Mutual Fund (dividend) | 8-14% | Yes | Medium |
| iFarmer | 14-20% | No | Medium |
| WeGro | 15-22% | No | Medium |
| REIT | 8-12% | No | Low |
| Startup/Angel | -100% to 200%+ | No | Low |

---

*Last updated: April 2026 | Verify current rates at bb.org.bd and nbr.gov.bd*
