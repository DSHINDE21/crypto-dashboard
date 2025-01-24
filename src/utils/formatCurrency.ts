const formatCurrency = (
  amount: number,
  currency: 'USD' | 'INR' = 'USD',
): string => {
  if (!amount) {
    return '-';
  }
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const formatter = new Intl.NumberFormat('en-IN', options); // 'en-IN' for INR format, 'en-US' can be used for USD formatting
  return formatter.format(amount);
};

export { formatCurrency };
