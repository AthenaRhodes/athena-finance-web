import { useState, useEffect, useCallback } from 'react';
import type { WatchlistItem } from './types';
import { watchlistApi } from './services/api';
import WatchlistTable from './components/WatchlistTable';
import AddSecurityForm from './components/AddSecurityForm';

const REFRESH_INTERVAL = 30_000; // 30s

export default function App() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await watchlistApi.get();
      setWatchlist(data);
      setLastUpdated(new Date());
    } catch {
      // silently retry on next interval
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [load]);

  const handleRemove = async (id: number) => {
    await watchlistApi.remove(id);
    await load();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🦉</span>
          <h1 className="text-lg font-semibold tracking-tight">Athena Finance</h1>
        </div>
        {lastUpdated && (
          <span className="text-xs text-gray-500">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <WatchlistTable items={watchlist} onRemove={handleRemove} loading={loading} />
        <AddSecurityForm onAdded={load} />
      </main>
    </div>
  );
}
