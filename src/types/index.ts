export type AssetType = 'Equity' | 'Bond' | 'Forex';

export interface Security {
  id: number;
  symbol: string;
  name: string;
  assetType: AssetType;
  exchange: string;
  currency: string;
  createdAt: string;
}

export interface Quote {
  currentPrice: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

export interface Metrics {
  ytdReturn: number | null;
  return5D: number | null;
  return13W: number | null;
  return26W: number | null;
  return52W: number | null;
  high52W: number | null;
  low52W: number | null;
  high52WDate: string | null;
  low52WDate: string | null;
}

export interface WatchlistItem {
  id: number;
  symbol: string;
  name: string;
  assetType: AssetType;
  currency: string;
  addedAt: string;
  quote: Quote | null;
  marketCapMillions: number | null;
  industry: string | null;
  logo: string | null;
  metrics: Metrics | null;
}

export interface EodPrice {
  id: number;
  securityId: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
