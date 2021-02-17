export function currencyFormatter(value: number) {
  return {
    prefix: '$',
    value: Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(isNaN(value) ? 0 : value)
  };
}