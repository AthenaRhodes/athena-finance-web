import { useState, useEffect, useCallback } from 'react';
import type { WatchlistItem } from './types';
import { watchlistApi } from './services/api';
import WatchlistTable from './components/WatchlistTable';
import AddSecurityForm from './components/AddSecurityForm';
import VersionBadge from './components/VersionBadge';

const REFRESH_INTERVAL = 30_000; // 30s

export default function App() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

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
    if (!autoRefresh) return;
    const interval = setInterval(load, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [load, autoRefresh]);

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
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}

          {/* Auto-refresh toggle */}
          <button
            onClick={() => setAutoRefresh(v => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
              autoRefresh
                ? 'border-emerald-700 bg-emerald-900/30 text-emerald-400'
                : 'border-gray-700 bg-gray-800 text-gray-500 hover:text-gray-300'
            }`}
            title={autoRefresh ? 'Auto-refresh ON — click to pause' : 'Auto-refresh OFF — click to resume'}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`} />
            {autoRefresh ? 'Live' : 'Paused'}
          </button>

          <VersionBadge />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <WatchlistTable items={watchlist} onRemove={handleRemove} loading={loading} />
        <AddSecurityForm onAdded={load} />
      </main>
    </div>
  );
}
