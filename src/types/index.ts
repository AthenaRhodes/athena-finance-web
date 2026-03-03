export type AssetType = 'Equity' | 'Bond' | 'Forex';
export type MarketZone = 'US' | 'EU' | 'ASIA' | 'FX';

export interface Security {
  id: number;
  symbol: string;
  name: string;
  assetType: AssetType;
  marketZone: MarketZone;
  exchange: string;
  currency: string;
  createdAt: string;
}

export interface LiveData {
  dayChangePercent: number;
}

export interface EodData {
  date: string;         // "2026-03-03"
  close: number;
  high: number;
  low: number;
  marketCapMillions: number | null;
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
  marketZone: MarketZone;
  currency: string;
  addedAt: string;
  industry: string | null;
  logo: string | null;
  live: LiveData | null;
  eod: EodData | null;
  ytdReturn: number | null;
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
  marketCapMillions: number | null;
}
