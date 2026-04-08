export const taxRules = {
  fiscalYear: "2024-25",
  rebateRate: 0.15,
  maxInvestableForRebateRatio: 0.20, // 20% of total income
  ceilingAmount: 10000000,           // ৳1 Crore
  instruments: {
    "sanchaypatra": {
      rebateRate: 0.15,
      maxRebate: 225000,
      note: "15% rebate on investment up to threshold"
    },
    "dps": {
      rebateRate: 0.15,
      maxEligibleInvestment: 120000,
      note: "Max ৳1,20,000 eligible per year"
    },
    "mutual-fund": {
      rebateRate: 0.10,
      maxEligibleInvestment: 50000,
      note: "10% rebate on listed ICB funds"
    },
    "stocks": {
      exemption: 5000000, // ৳50L exempt for capital gains
      note: "Capital gains up to ৳50L are tax-exempt for individuals"
    }
  }
};
