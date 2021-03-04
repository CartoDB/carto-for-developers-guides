export function numberFormatter(value: number) {
  return Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
    // @ts-ignore
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
};
