export const fmtPrice = (n: number | undefined, decimals = 2) =>
  n != null ? n.toFixed(decimals) : '—';

export const fmtChange = (n: number | null | undefined, suffix = '') => {
  if (n == null) return '—';
  return (n >= 0 ? '+' : '') + n.toFixed(2) + suffix;
};

export const fmtMarketCap = (millions: number | null | undefined): string => {
  if (millions == null) return '—';
  if (millions >= 1_000_000) return `$${(millions / 1_000_000).toFixed(2)}T`;
  if (millions >= 1_000)     return `$${(millions / 1_000).toFixed(2)}B`;
  return `$${millions.toFixed(0)}M`;
};

export const changeColor = (n: number | null | undefined) => {
  if (n == null) return 'text-gray-400';
  return n >= 0 ? 'text-green-500' : 'text-red-500';
};
