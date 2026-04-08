export const formatBDT = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(amount).replace('BDT', '৳');
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num);
};

export const formatPercent = (num) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(num);
};

// South Asian Lakh/Crore system for display
export const formatLakh = (amount) => {
  if (amount >= 10000000) {
    return `৳${(amount / 10000000).toFixed(2)} Crore`;
  } else if (amount >= 100000) {
    return `৳${(amount / 100000).toFixed(2)} Lakh`;
  }
  return formatBDT(amount);
};
