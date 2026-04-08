import { useState, useMemo, useEffect } from 'react';
import { instruments } from '../data/instruments';
import { profiles } from '../data/profiles';

export function usePortfolio() {
  const [totalAmount, setTotalAmount] = useState(500000);
  const [profileId, setProfileId] = useState('balanced');
  const [allocations, setAllocations] = useState({
    high: 25,
    moderate: 25,
    low: 25,
    cash: 25
  });

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

    // Pick top instruments for each bucket to calculate average ROI
    const bucketROI = {
      high: instruments.filter(i => i.category === 'high')[0]?.roiMin || 0.15,
      moderate: instruments.filter(i => i.category === 'moderate')[0]?.roiMin || 0.10,
      low: instruments.filter(i => i.category === 'low')[0]?.roiMin || 0.11,
      cash: instruments.filter(i => i.category === 'cash')[0]?.roiMin || 0.08
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
    computed
  };
}
