import { useState } from 'react';
import type { AssetType, Security } from '../types';
import { securitiesApi, watchlistApi } from '../services/api';

interface Props {
  onAdded: () => void;
}

export default function AddSecurityForm({ onAdded }: Props) {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [assetType, setAssetType] = useState<AssetType>('Equity');
  const [exchange, setExchange] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let security: Security;
      try {
        security = await securitiesApi.create({ symbol, name, assetType, exchange, currency });
      } catch (err: any) {
        if (err.response?.status === 409) {
          // Already exists — find it
          const all = await securitiesApi.getAll();
          security = all.find(s => s.symbol === symbol.toUpperCase())!;
        } else throw err;
      }
      await watchlistApi.add(security.id);
      setSymbol(''); setName(''); setExchange('');
      onAdded();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Add to Watchlist</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <input value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())}
          placeholder="Symbol (e.g. AAPL)" required
          className="flex-1 min-w-28 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-indigo-500 font-mono" />
        <input value={name} onChange={e => setName(e.target.value)}
          placeholder="Name (e.g. Apple Inc.)" required
          className="flex-1 min-w-40 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-indigo-500" />
        <select value={assetType} onChange={e => setAssetType(e.target.value as AssetType)}
          className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-indigo-500">
          <option value="Equity">Equity</option>
          <option value="Bond">Bond</option>
          <option value="Forex">Forex</option>
        </select>
        <input value={exchange} onChange={e => setExchange(e.target.value)}
          placeholder="Exchange (optional)"
          className="flex-1 min-w-32 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-indigo-500" />
        <input value={currency} onChange={e => setCurrency(e.target.value.toUpperCase())}
          placeholder="CCY" maxLength={3}
          className="w-20 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-indigo-500 font-mono" />
        <button type="submit" disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
          {loading ? 'Adding…' : '+ Add'}
        </button>
      </div>
    </form>
  );
}
