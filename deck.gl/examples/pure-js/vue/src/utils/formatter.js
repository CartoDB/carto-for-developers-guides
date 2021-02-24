export function currencyFormatter(value) {
  return {
    prefix: '$',
    value: Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(isNaN(value) ? 0 : value),
  };
}

export function numberFormatter(value) {
  return Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
}
