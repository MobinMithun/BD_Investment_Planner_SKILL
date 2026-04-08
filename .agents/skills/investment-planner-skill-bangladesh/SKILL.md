---
name: bd-investment-planner
description: >
  Build, render, or update the Bangladesh Investment Planner — an interactive financial simulation website or web widget for Bangladeshi investors. Use this skill whenever the user asks to build, improve, extend, or redesign the Bangladesh investment simulator, portfolio planner, ROI calculator, or any investment comparison tool tailored to Bangladesh (covering instruments like Sanchaypatra, FDR, DSE stocks, mutual funds, T-bonds, iFarmer, WeGro, gold, REITs, DPS, or tax rebate planning). Also trigger this skill when the user asks to add new instruments, update ROI rates, change the UI/UX, add charts, generate a downloadable plan, or integrate new data into the planner. If the user mentions "investment dashboard", "BD finance tool", "taka calculator", or "financial plan for Bangladesh", use this skill immediately.
---

# Bangladesh Investment Planner — Build & Design Skill

A production skill for building, extending, and maintaining the interactive Bangladesh Investment Simulation website. Covers full-stack architecture, UI component design, data models, prompt engineering for AI-powered advice, and deployment.

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Data Model](#2-data-model)
3. [UI Component Map](#3-ui-component-map)
4. [AI Integration Layer](#4-ai-integration-layer)
5. [Feature Modules](#5-feature-modules)
6. [Design System](#6-design-system)
7. [Build Instructions](#7-build-instructions)
8. [Extension Guide](#8-extension-guide)
9. [Prompt Templates](#9-prompt-templates)
10. [Deployment](#10-deployment)

---

## 1. System Architecture

```
bd-investment-planner/
├── index.html                  # Shell / entry point
├── app.js                      # Main React app root
├── styles/
│   ├── tokens.css              # Design tokens (colors, spacing, radius)
│   └── components.css          # Shared component styles
├── data/
│   ├── instruments.js          # All investment instrument definitions
│   ├── tax-rules.js            # Tax rebate rules (FY-year stamped)
│   └── profiles.js             # Preset allocation profiles
├── components/
│   ├── AmountInput.jsx         # Taka amount + currency input
│   ├── AllocationSliders.jsx   # 4-bucket drag sliders
│   ├── InstrumentTable.jsx     # Risk/ROI comparison table
│   ├── TaxRebateTable.jsx      # Tax rebate guide table
│   ├── BreakdownTable.jsx      # Per-instrument allocation breakdown
│   ├── ROIChart.jsx            # 5-year Chart.js projection
│   ├── LiquidityMap.jsx        # Tier-based liquidity visualization
│   ├── PlanCards.jsx           # Strategic plan cards (Jewish/Conservative/etc)
│   ├── MetricSummary.jsx       # KPI cards (total invested, avg ROI, etc.)
│   ├── AIAdvisor.jsx           # Claude API-powered advice panel
│   └── ExportPanel.jsx         # PDF / CSV export
├── hooks/
│   ├── usePortfolio.js         # Core state: amounts, allocations, ROI
│   ├── useAIAdvice.js          # Anthropic API hook
│   └── useTaxCalc.js           # Tax rebate computation
├── utils/
│   ├── roi.js                  # ROI projection math
│   ├── format.js               # Currency, percent, number formatters
│   └── export.js               # PDF/CSV generation
└── api/
    └── advisor.js              # Server-side proxy for Anthropic API calls
```

**Tech stack:**
- React 18 (functional components + hooks)
- Chart.js 4 for ROI projections
- Vite for build
- Anthropic Claude API for AI advice (claude-sonnet-4-20250514)
- jsPDF + html2canvas for PDF export
- Tailwind CSS (utility layer only) + custom CSS tokens

---

## 2. Data Model

### Instrument Schema (`data/instruments.js`)

```javascript
{
  id: "sanchaypatra-5yr",
  name: "Sanchaypatra (5-year)",
  namebn: "সঞ্চয়পত্র (৫ বছর)",
  category: "low",            // "high" | "moderate" | "low" | "cash"
  riskLevel: "very-low",      // very-low | low | moderate | high | very-high
  roiMin: 0.1128,
  roiMax: 0.1128,
  roiLabel: "11.28%",
  liquidityTier: "long",      // instant | short | medium | long
  liquidityLabel: "> 1 year",
  taxRebate: true,
  taxRebateRate: 0.15,
  taxRebateMax: 225000,       // BDT
  taxRebateNote: "15% rebate on investment; interest tax-exempt up to threshold",
  minInvestment: 10000,
  minLabel: "৳10,000",
  horizon: "5 years",
  issuedBy: "Bangladesh Bank / Government",
  notes: "Highest guaranteed safe return in Bangladesh. Prioritize.",
  tags: ["guaranteed", "government", "tax-rebate", "safe"]
}
```

### Portfolio State Schema

```javascript
{
  totalAmount: 500000,          // BDT
  allocations: {
    high: 25,                   // percent
    moderate: 25,
    low: 25,
    cash: 25
  },
  profile: "balanced",          // balanced | conservative | aggressive | jewish | custom
  selectedInstruments: {        // user can override default instrument picks per bucket
    high: ["dse-bluechip", "ifarmer"],
    moderate: ["mutual-growth", "gold"],
    low: ["sanchaypatra-5yr", "fdr-1yr"],
    cash: ["tbill-91d", "dps"]
  },
  computed: {
    bucketAmounts: { high, moderate, low, cash },
    instrumentAmounts: { [instrumentId]: amount },
    monthlyROI: number,
    yearlyROI: number,
    avgROIPercent: number,
    taxRebateTotal: number,
    projections: { yr1, yr2, yr3, yr4, yr5 }
  }
}
```

### Allocation Profiles (`data/profiles.js`)

```javascript
{
  balanced:     { high: 25, moderate: 25, low: 25, cash: 25 },
  conservative: { high: 10, moderate: 20, low: 50, cash: 20 },
  aggressive:   { high: 40, moderate: 30, low: 20, cash: 10 },
  jewish:       { high: 25, moderate: 25, low: 25, cash: 25 },
  // jewish plan maps differently: real assets / business / safe / liquid
  retirement:   { high: 5,  moderate: 15, low: 60, cash: 20 },
  youngPro:     { high: 35, moderate: 35, low: 20, cash: 10 }
}
```

---

## 3. UI Component Map

### Page Layout (top-to-bottom)

```
[Header: Logo + tagline]
[AmountInput + ProfileSelector]
[AllocationSliders + AllocationBar]
[MetricSummary: 4 KPI cards]
  ↓ tabs: Overview | Breakdown | Tax | Strategy | AI Advice
[Tab: Overview]
  └── InstrumentTable (full comparison)
[Tab: Breakdown]
  └── BreakdownTable (your money, split per instrument)
  └── ROIChart (5-year projection lines)
[Tab: Tax]
  └── TaxRebateTable
  └── TaxSummaryCard (your estimated rebate)
[Tab: Strategy]
  └── PlanCards (4 strategy cards)
  └── LiquidityMap (tier table)
[Tab: AI Advice]
  └── AIAdvisor (Claude-powered personalized advice)
[ExportPanel: Download PDF / CSV]
[Footer: Disclaimer]
```

### Key Component Behaviors

**AmountInput**: Accepts raw number input in BDT. Formats with commas on blur. Triggers full recompute on change. Presets: ৳1L, ৳5L, ৳10L, ৳25L, ৳50L, ৳1Cr buttons.

**AllocationSliders**: 4 sliders that auto-normalize to 100% — when one increases, others decrease proportionally from largest bucket first.

**InstrumentTable**: Sortable by ROI, risk, liquidity. Filterable by category. Color-coded risk badges. Clicking a row opens a detail drawer with full instrument info.

**ROIChart**: Line chart. X-axis: Yr 1–5. Y-axis: portfolio value in BDT. One line per selected instrument. Hover tooltip shows exact value. Toggle lines via legend checkboxes.

**AIAdvisor**: Text prompt field + submit. Sends user's portfolio state + question to Claude API. Streams response. Suggested questions displayed as chips.

---

## 4. AI Integration Layer

### API Hook (`hooks/useAIAdvice.js`)

```javascript
async function getAdvice(portfolioState, userQuestion) {
  const systemPrompt = buildSystemPrompt(portfolioState);
  const response = await fetch('/api/advisor', {
    method: 'POST',
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userQuestion }]
    })
  });
  // Stream response to UI
}
```

### System Prompt Template (see Section 9 for full prompt)

The AI advisor receives:
- Full portfolio allocation as JSON
- Total investment amount
- Selected instruments
- Computed ROI metrics
- Tax rebate eligibility
- User's risk profile label

### Suggested Questions (rendered as chips)

- "Is my allocation right for my age?"
- "How can I maximize my tax rebate?"
- "What if BDT depreciates 10% this year?"
- "Should I move more into Sanchaypatra?"
- "Compare my portfolio to the Jewish 25/25/25/25 plan"
- "What's my inflation-adjusted real return?"

---

## 5. Feature Modules

### Module A: ROI Calculator

**Inputs**: Amount, allocation %, instrument ROI rates
**Formula**:
```
yearlyROI = Σ (instrumentAmount × instrumentROI)
monthlyROI = yearlyROI / 12
avgROIPercent = yearlyROI / totalAmount × 100
projection[yr] = Σ (instrumentAmount × (1 + roi)^yr)
```

### Module B: Tax Rebate Engine (`hooks/useTaxCalc.js`)

**Rules (FY 2024–25)**:
- Sanchaypatra: 15% rebate on invested amount (max rebate ৳2,25,000)
- DPS: 15% rebate (max ৳1,20,000/yr investment eligible)
- Mutual fund (listed ICB): 10% rebate (max ৳50,000 investment)
- Life insurance: 10% on premium (varies)
- DSE capital gains: first ৳50L exempt for individual investors
- Total rebate ceiling: 20% of income OR ৳1 crore invested, whichever is lower

**Output**: Estimated total tax rebate in BDT given user's instrument mix.

### Module C: Liquidity Scoring

Each portfolio gets a liquidity score (0–100):
- Instant tier (savings, T-bill): weight 1.0
- Short tier (stocks, MF): weight 0.7
- Medium tier (iFarmer, DPS): weight 0.4
- Long tier (Sanchaypatra, BGTB): weight 0.1

`liquidityScore = Σ (bucketPct × tierWeight)`

Display as gauge: Poor / Fair / Good / Excellent

### Module D: Inflation Adjustment

Bangladesh CPI inflation (current default: 9.5%). Show real return:
`realReturn = nominalROI - inflationRate`

Flag any instrument with negative real return in red.

### Module E: PDF Export

Uses html2canvas + jsPDF. Exports:
- Portfolio summary page
- Full allocation breakdown table
- 5-year projection chart (as image)
- Tax rebate summary
- Personalized AI advice (last response)

---

## 6. Design System

### Color Tokens

```css
:root {
  /* Risk badges */
  --risk-high-bg: #FCEBEB;
  --risk-high-text: #A32D2D;
  --risk-mod-bg: #FAEEDA;
  --risk-mod-text: #854F0B;
  --risk-low-bg: #EAF3DE;
  --risk-low-text: #3B6D11;
  --risk-vlow-bg: #E1F5EE;
  --risk-vlow-text: #0F6E56;

  /* Bucket colors */
  --bucket-high: #E24B4A;
  --bucket-mod: #EF9F27;
  --bucket-low: #639922;
  --bucket-cash: #378ADD;

  /* Chart palette */
  --chart-1: #E24B4A;
  --chart-2: #EF9F27;
  --chart-3: #639922;
  --chart-4: #378ADD;
  --chart-5: #7F77DD;

  /* Typography */
  --font-primary: 'Hind Siliguri', 'Inter', sans-serif; /* supports Bengali */
  --font-mono: 'JetBrains Mono', monospace;
}
```

### Typography

- Use **Hind Siliguri** for Bengali numeral/text compatibility
- h1: 28px / 500
- h2: 20px / 500
- Body: 15px / 400 / line-height 1.7
- Table cells: 13px
- Badge/label: 11px / 500 / uppercase

### Responsive Breakpoints

- Mobile: < 540px → single column, stacked sliders
- Tablet: 540–900px → 2-col metric grid, full tables scroll
- Desktop: > 900px → full layout

### Bangladesh UX Considerations

- Always show currency as ৳ (Bengali Taka sign), not BDT
- Use South Asian number formatting: ১,০০,০০০ (lakh system) with English numerals (1,00,000) as default, toggle for Bangla numerals
- Date format: DD/MM/YYYY
- Fiscal year label: "FY 2024-25" not "2024-2025"

---

## 7. Build Instructions

### Setup

```bash
npm create vite@latest bd-investment-planner -- --template react
cd bd-investment-planner
npm install chart.js react-chartjs-2 jspdf html2canvas
npm install -D tailwindcss postcss autoprefixer
```

### Run Dev

```bash
npm run dev
```

### Environment Variables

```env
VITE_ANTHROPIC_API_KEY=sk-ant-...   # Only for local dev (use server proxy in prod)
VITE_INFLATION_RATE=0.095
VITE_FISCAL_YEAR=2024-25
```

### API Proxy (production)

Never expose the Anthropic key client-side. Use a minimal Express/Next.js proxy:

```javascript
// api/advisor.js (Next.js API route or Express endpoint)
export default async function handler(req, res) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.json(data);
}
```

---

## 8. Extension Guide

### Adding a New Instrument

1. Add entry to `data/instruments.js` following the schema in Section 2
2. Assign it to a `category` bucket (`high | moderate | low | cash`)
3. Set `liquidityTier`, `roiMin`, `roiMax`, `taxRebate` fields
4. If it has a unique tax rule, add to `data/tax-rules.js`
5. Add to the default `selectedInstruments` for the appropriate profile if it's a top pick

### Adding a New Profile

1. Add to `data/profiles.js` with 4 allocation percentages summing to 100
2. Add a display name and description to `ProfileSelector` component
3. If it has a custom instrument mapping (like Jewish plan), add to `profiles.js` instrument overrides

### Updating Tax Rules (new fiscal year)

1. Update `data/tax-rules.js` with new rates
2. Update `VITE_FISCAL_YEAR` in `.env`
3. The `TaxRebateTable` and `useTaxCalc` hook read from this file

### Adding Currency Scenario (BDT depreciation)

Add a scenario slider:
```javascript
// In usePortfolio.js
const adjustedROI = (nominalROI - inflationRate) * (1 - bdtDepreciationRate);
```

---

## 9. Prompt Templates

### Master AI Advisor System Prompt

```
You are an expert Bangladeshi personal finance advisor with deep knowledge of:
- Bangladesh Securities and Exchange Commission (BSEC) regulations
- National Savings Directorate instruments (Sanchaypatra, Prize Bond, etc.)
- DSE and CSE stock market dynamics
- Bangladesh Bank monetary policy and interest rate environment
- NBR tax rules for individual investors (FY {{fiscalYear}})
- Emerging fintech: iFarmer, WeGro, bKash savings, Nagad savings

The user's current portfolio:
- Total investment: ৳{{totalAmount}}
- Risk profile: {{profileName}}
- Allocation: High {{high}}% | Moderate {{moderate}}% | Low {{low}}% | Cash {{cash}}%
- Selected instruments: {{instrumentList}}
- Expected yearly ROI: {{avgROI}}%
- Monthly return: ৳{{monthlyROI}}
- Estimated tax rebate: ৳{{taxRebate}}
- Liquidity score: {{liquidityScore}}/100

Rules for your response:
1. Always give advice in the Bangladesh context — do not reference foreign instruments unless asked.
2. Be specific: name exact instruments (e.g., "5-year Sanchaypatra" not just "savings bonds").
3. Always mention tax implications where relevant.
4. Flag any concentration risk if >50% is in a single instrument or bucket.
5. Use ৳ for taka amounts, format in lakh/crore system (e.g., ৳5 lakh, ৳1 crore).
6. Be encouraging but honest about risks, especially for DSE small-caps and agri-fintech platforms.
7. Keep responses under 300 words unless asked for a detailed plan.
8. End every response with one actionable next step.
```

### PDF Summary Prompt

```
Generate a 3-paragraph investment summary for this Bangladesh portfolio.
Para 1: Portfolio overview (allocation, ROI, total invested).
Para 2: Strengths and risks of the current mix.
Para 3: Top 3 specific action items with expected impact.
Be concise, professional. Use ৳ for taka. FY {{fiscalYear}} tax rules apply.
Portfolio: {{portfolioJSON}}
```

---

## 10. Deployment

### Recommended Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Vercel / Netlify | Free tier, instant deploy, env vars |
| API proxy | Vercel API routes | Co-located, serverless |
| CDN | Cloudflare | Free, fast in Bangladesh |
| Domain | .com.bd or .xyz | .com.bd for local trust |

### Performance for Bangladesh

- Lazy-load Chart.js (it's 200kb)
- Cache instrument data in localStorage (stale-while-revalidate)
- Use Bangla font subset (only needed glyphs)
- Target < 3s LCP on 4G mobile (dominant connection in BD)

### Analytics

Track: amount entered, profile selected, AI advice triggered, PDF downloaded, tab switches. Use Plausible (privacy-friendly) or Google Analytics.

---

## Quick Reference: ROI Rates (FY 2024-25)

| Instrument | ROI | Tax Rebate | Liquidity |
|---|---|---|---|
| Sanchaypatra 5yr | 11.28% | Yes (15%) | Low |
| Sanchaypatra 3yr | 11.04% | Yes (15%) | Low |
| Wage Earner Bond | 12.00% | Yes | Low |
| BGTB (10yr) | 10.50% | Partial | Medium |
| T-bill (91d) | 8.50% | No | High |
| Bank FDR (1yr) | 7-9% | No | Low |
| DPS | 6-8% | Yes (15%) | Medium |
| DSE Blue Chip | 15-25%* | Gains exempt | Medium |
| Mutual Fund | 10-18%* | Partial | Medium |
| Gold | 8-15%* | No | Medium |
| iFarmer | 12-18%* | No | Low |
| WeGro | 12-20%* | No | Low |

*Variable / market-dependent. Asterisked rates are historical averages, not guarantees.

---

*Last updated: April 2026 | Rates subject to Bangladesh Bank / NBR policy changes*
*Always verify current rates at bb.org.bd and nbr.gov.bd before production deployment.*
