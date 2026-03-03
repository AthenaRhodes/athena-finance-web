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
