import { useMemo } from 'react';
import { taxRules } from '../data/tax-rules';
import { instruments } from '../data/instruments';

export function useTaxCalc(totalAmount, allocations) {
  const estimatedRebate = useMemo(() => {
    let totalEligibleInvestment = 0;

    // Calculate eligible investment per instrument category
    const bucketAmounts = {
      high: (totalAmount * allocations.high) / 100,
      moderate: (totalAmount * allocations.moderate) / 100,
      low: (totalAmount * allocations.low) / 100,
      cash: (totalAmount * allocations.cash) / 100
    };

    // Low risk usually maps to Sanchaypatra
    const sanchaypatraInvested = bucketAmounts.low;
    totalEligibleInvestment += Math.min(sanchaypatraInvested, taxRules.instruments.sanchaypatra.maxRebate / taxRules.instruments.sanchaypatra.rebateRate);

    // Moderate usually maps to DPS or Gold (Gold no rebate)
    const dpsInvested = bucketAmounts.moderate * 0.5; // Assume 50% of moderate goes to DPS
    totalEligibleInvestment += Math.min(dpsInvested, taxRules.instruments.dps.maxEligibleInvestment);

    // High risk maps to Stocks
    const stocksInvested = bucketAmounts.high;
    // For stocks, it's 10% rebate on listed ICB funds, but for simplicity we consider a general rebate 
    // based on total eligible investment ceiling
    totalEligibleInvestment += stocksInvested;

    // Ceiling: 20% of income (we'll assume a fixed income for now or just the 1Cr limit)
    const finalEligible = Math.min(totalEligibleInvestment, taxRules.ceilingAmount);
    const rebate = finalEligible * taxRules.rebateRate;

    return Math.floor(rebate);
  }, [totalAmount, allocations]);

  return { estimatedRebate };
}
