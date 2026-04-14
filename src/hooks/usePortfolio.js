import { useState, useMemo, useEffect } from 'react';
import { instruments } from '../data/instruments';
import { profiles } from '../data/profiles';

const RISK_SCORES = { 'very-high': 5, high: 4, moderate: 3, low: 2, 'very-low': 1 };
const LIQUIDITY_SCORES = { high: 3, medium: 2, low: 1 };

export function usePortfolio() {
  const [totalAmount, setTotalAmount] = useState(500000);
  const [profileId, setProfileId] = useState('balanced');
  const [allocations, setAllocations] = useState({
    high: 25,
    moderate: 25,
    low: 25,
    cash: 25
  });

  const [portfolioItems, setPortfolioItems] = useState([]);

  const addPortfolioItem = (instrumentId, amount) => {
    setPortfolioItems(prev => [...prev, { id: Date.now().toString(), instrumentId, amount }]);
  };

  const removePortfolioItem = (id) => {
    setPortfolioItems(prev => prev.filter(item => item.id !== id));
  };


  // When profile changes, update allocations
  useEffect(() => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setAllocations(profile.allocations);
    }
  }, [profileId]);

  const computed = useMemo(() => {
    const bucketAmounts = {
      high: (totalAmount * allocations.high) / 100,
      moderate: (totalAmount * allocations.moderate) / 100,
      low: (totalAmount * allocations.low) / 100,
      cash: (totalAmount * allocations.cash) / 100
    };

    // Pick representative instruments for each bucket to calculate average ROI
    // Use roiMax (expected return) — roiMin can be negative for high-risk instruments
    const bucketInstruments = {
      high: instruments.filter(i => i.category === 'high'),
      moderate: instruments.filter(i => i.category === 'moderate'),
      low: instruments.filter(i => i.category === 'low'),
      cash: instruments.filter(i => i.category === 'cash')
    };

    const bucketROI = {
      high: bucketInstruments.high.length > 0
        ? Math.max(0.05, bucketInstruments.high[0].roiMax)
        : 0.15,
      moderate: bucketInstruments.moderate.length > 0
        ? Math.max(0.05, bucketInstruments.moderate[0].roiMax)
        : 0.10,
      low: bucketInstruments.low.length > 0
        ? bucketInstruments.low[0].roiMax
        : 0.11,
      cash: bucketInstruments.cash.length > 0
        ? bucketInstruments.cash[0].roiMax
        : 0.08
    };

    const yearlyROI =
      (bucketAmounts.high * bucketROI.high) +
      (bucketAmounts.moderate * bucketROI.moderate) +
      (bucketAmounts.low * bucketROI.low) +
      (bucketAmounts.cash * bucketROI.cash);

    const avgROIPercent = (yearlyROI / totalAmount) * 100;
    const monthlyROI = yearlyROI / 12;

    // Generate 5-year projections
    const projections = [];
    for (let yr = 0; yr <= 5; yr++) {
      projections.push({
        year: yr,
        value: totalAmount * Math.pow(1 + (yearlyROI / totalAmount), yr)
      });
    }

    return {
      bucketAmounts,
      yearlyROI,
      monthlyROI,
      avgROIPercent,
      projections
    };
  }, [totalAmount, allocations]);

  // ─── Portfolio Scoring (for the new breakdown dashboard) ───
  const portfolioScores = useMemo(() => {
    const isCustom = portfolioItems && portfolioItems.length > 0;

    // Build rows from custom items or simulated buckets
    let rows = [];
    if (isCustom) {
      rows = portfolioItems.map(item => {
        const inst = instruments.find(i => i.id === item.instrumentId);
        if (!inst) return null;
        return { inst, amount: item.amount, id: item.id };
      }).filter(Boolean);
    } else {
      ['high', 'moderate', 'low', 'cash'].forEach(bucketKey => {
        const amt = computed.bucketAmounts[bucketKey] || 0;
        if (amt <= 0) return;
        const bucketInsts = instruments.filter(i => i.category === bucketKey).slice(0, 2);
        const splitAmt = amt / bucketInsts.length;
        bucketInsts.forEach(inst => {
          rows.push({ inst, amount: splitAmt });
        });
      });
    }

    const totalInvested = rows.reduce((s, r) => s + r.amount, 0);
    if (totalInvested === 0) return null;

    // 1. Diversification Score (0-100)
    // Penalizes over-concentration in one bucket
    const bucketTotals = { high: 0, moderate: 0, low: 0, cash: 0 };
    rows.forEach(r => { bucketTotals[r.inst.category] = (bucketTotals[r.inst.category] || 0) + r.amount; });
    const bucketPcts = Object.values(bucketTotals).map(v => v / totalInvested);
    const activeBuckets = bucketPcts.filter(p => p > 0).length;
    // Ideal: 25% each. Use entropy-based scoring.
    const idealPct = 1 / 4;
    let deviation = 0;
    bucketPcts.forEach(p => {
      if (p > 0) deviation += Math.abs(p - idealPct);
    });
    // Max possible deviation is ~1.5 (all in one bucket), 0 is perfectly balanced
    const diversificationScore = Math.max(0, Math.min(100, Math.round((1 - deviation / 0.75) * 100)));

    // 2. Income Strength (0-100)
    // Threshold: ৳25,000/month = "comfortable"
    const incomeThreshold = 25000;
    const totalYearly = rows.reduce((s, r) => s + (r.amount * r.inst.roiMax), 0);
    const totalMonthly = totalYearly / 12;
    const incomeScore = Math.min(100, Math.round((totalMonthly / incomeThreshold) * 100));

    // 3. Tax Efficiency (0-100)
    // % of portfolio in tax-rebate-eligible instruments
    let taxEligibleAmount = 0;
    rows.forEach(r => {
      if (r.inst.taxRebate === 'yes' || r.inst.taxRebate === 'partial') {
        taxEligibleAmount += r.amount;
      }
    });
    const taxEfficiencyScore = Math.round((taxEligibleAmount / totalInvested) * 100);

    // 4. Liquidity Health (0-100)
    // Weighted: high=full points, medium=half, low=none
    let liquidityWeighted = 0;
    rows.forEach(r => {
      const lScore = LIQUIDITY_SCORES[r.inst.liquidityTier] || 1;
      liquidityWeighted += r.amount * (lScore / 3);
    });
    const liquidityHealthScore = Math.round((liquidityWeighted / totalInvested) * 100);

    // 5. Risk-Adjusted Return Grade
    // ROI max / risk score. Higher = better return per unit of risk.
    let riskWeightedReturn = 0;
    let totalRiskWeight = 0;
    rows.forEach(r => {
      const rScore = RISK_SCORES[r.inst.riskLevel] || 3;
      riskWeightedReturn += (r.inst.roiMax / rScore) * r.amount;
      totalRiskWeight += r.amount;
    });
    const riskAdjustedRatio = totalRiskWeight > 0 ? riskWeightedReturn / totalRiskWeight : 0;
    // Grade scale: A+ (>0.08), A (>0.06), A- (>0.05), B+ (>0.04), B (>0.03), B- (>0.02), C (>0.015), D (<=0.015)
    let grade, gradeColor;
    if (riskAdjustedRatio > 0.08) { grade = 'A+'; gradeColor = '#10b981'; }
    else if (riskAdjustedRatio > 0.06) { grade = 'A'; gradeColor = '#10b981'; }
    else if (riskAdjustedRatio > 0.05) { grade = 'A-'; gradeColor = '#34d399'; }
    else if (riskAdjustedRatio > 0.04) { grade = 'B+'; gradeColor = '#22c55e'; }
    else if (riskAdjustedRatio > 0.03) { grade = 'B'; gradeColor = '#f59e0b'; }
    else if (riskAdjustedRatio > 0.02) { grade = 'B-'; gradeColor = '#f59e0b'; }
    else if (riskAdjustedRatio > 0.015) { grade = 'C'; gradeColor = '#f97316'; }
    else { grade = 'D'; gradeColor = '#ef4444'; }

    // Estimated tax rebate total
    const estimatedRebate = rows.reduce((s, r) => {
      if (r.inst.taxRebate === 'yes') return s + r.amount * 0.15;
      if (r.inst.taxRebate === 'partial') return s + r.amount * 0.10;
      return s;
    }, 0);

    return {
      diversificationScore,
      incomeScore,
      incomeMonthly: totalMonthly,
      taxEfficiencyScore,
      liquidityHealthScore,
      grade,
      gradeColor,
      riskAdjustedRatio,
      totalInvested,
      totalYearly,
      totalMonthly,
      estimatedRebate,
      bucketTotals,
      rows,
      isCustom
    };
  }, [totalAmount, allocations, computed, portfolioItems]);

  const updateAllocation = (bucket, value) => {
    // Basic normalization: adjust others to keep sum 100
    // In a real app, this would be more sophisticated
    const diff = value - allocations[bucket];
    const otherBuckets = Object.keys(allocations).filter(b => b !== bucket);

    const newAllocations = { ...allocations, [bucket]: value };

    // Distribute diff inversely to others
    const totalOther = otherBuckets.reduce((sum, b) => sum + allocations[b], 0);
    if (totalOther > 0) {
      otherBuckets.forEach(b => {
        const share = allocations[b] / totalOther;
        newAllocations[b] = Math.max(0, allocations[b] - (diff * share));
      });
    } else {
      // If others are 0, distribute equally
      const share = diff / otherBuckets.length;
      otherBuckets.forEach(b => {
        newAllocations[b] = Math.max(0, allocations[b] - share);
      });
    }

    // Ensure sum is 100 (floating point fix)
    const finalSum = Object.values(newAllocations).reduce((s, v) => s + v, 0);
    if (finalSum !== 100) {
      newAllocations[otherBuckets[0]] += (100 - finalSum);
    }

    setAllocations(newAllocations);
    setProfileId('custom');
  };

  return {
    totalAmount,
    setTotalAmount,
    profileId,
    setProfileId,
    allocations,
    updateAllocation,
    computed,
    portfolioScores,
    portfolioItems,
    addPortfolioItem,
    removePortfolioItem
  };
}
