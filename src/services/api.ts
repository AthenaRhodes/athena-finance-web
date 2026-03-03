import axios from 'axios';
import type { Security, WatchlistItem, EodPrice, AssetType } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
});

export const securitiesApi = {
  getAll: () => api.get<Security[]>('/securities').then(r => r.data),
  create: (data: { symbol: string; name: string; assetType: AssetType; exchange?: string; currency?: string }) =>
    api.post<Security>('/securities', data).then(r => r.data),
  delete: (id: number) => api.delete(`/securities/${id}`),
};

export const watchlistApi = {
  get: () => api.get<WatchlistItem[]>('/watchlist').then(r => r.data),
  add: (securityId: number) => api.post(`/watchlist/${securityId}`).then(r => r.data),
  remove: (id: number) => api.delete(`/watchlist/${id}`),
};

export const pricesApi = {
  get: (securityId: number, from?: string, to?: string) =>
    api.get<EodPrice[]>(`/prices/${securityId}`, { params: { from, to } }).then(r => r.data),
  fetch: (securityId: number) =>
    api.post(`/prices/${securityId}/fetch`).then(r => r.data),
};
