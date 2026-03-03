import { useState, useRef, useEffect } from 'react';
import type { AssetType } from '../types';
import type { SearchResult } from '../services/api';
import { securitiesApi, watchlistApi } from '../services/api';

interface Props {
  onAdded: () => void;
}

// ─── Equity / Bond search panel ───────────────────────────────────────────────
function EquityBondPanel({ onAdded }: Props) {
  const [query, setQuery] = useState('');
  const [assetType, setAssetType] = useState<'Equity' | 'Bond'>('Equity');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (selected) return;
    if (query.length < 2) { setResults([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const r = await securitiesApi.search(query);
        setResults(r.filter(x => x.type === 'Common Stock' || x.type === 'EQS' || x.type === ''));
      } finally {
        setSearching(false);
      }
    }, 350);
  }, [query, selected]);

  const handleSelect = (r: SearchResult) => {
    setSelected(r);
    setQuery(r.description);
    setResults([]);
  };

  const handleClear = () => {
    setSelected(null);
    setQuery('');
    setResults([]);
    setError('');
  };

  const handleAdd = async () => {
    if (!selected) return;
    setError('');
    setLoading(true);
    try {
      let security;
      try {
        security = await securitiesApi.create({ symbol: selected.symbol, assetType: assetType as AssetType });
      } catch (err: any) {
        if (err.response?.status === 409) {
          const all = await securitiesApi.getAll();
          security = all.find(s => s.symbol === selected.symbol)!;
        } else throw err;
      }
      await watchlistApi.add(security.id);
      handleClear();
      onAdded();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(['Equity', 'Bond'] as const).map(t => (
          <button key={t} onClick={() => setAssetType(t)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              assetType === t
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}>
            {t}
          </button>
        ))}
      </div>

      <div className="relative">
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected(null); }}
          placeholder="Search by name or ticker (e.g. Apple, AAPL)"
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-indigo-500"
        />
        {selected && (
          <button onClick={handleClear}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-white text-xs">✕</button>
        )}
        {searching && (
          <span className="absolute right-3 top-2.5 text-gray-500 text-xs">searching…</span>
        )}

        {results.length > 0 && !selected && (
          <ul className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
            {results.map(r => (
              <li key={r.symbol}
                onClick={() => handleSelect(r)}
                className="px-4 py-2.5 flex items-center justify-between hover:bg-gray-800 cursor-pointer">
                <span className="text-gray-300 text-sm">{r.description}</span>
                <span className="font-mono text-xs text-indigo-400 ml-3">{r.displaySymbol}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2 text-sm">
          <div>
            <span className="font-mono text-indigo-400 font-semibold">{selected.symbol}</span>
            <span className="text-gray-400 ml-2">{selected.description}</span>
          </div>
          <button onClick={handleAdd} disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ml-4 whitespace-nowrap">
            {loading ? 'Adding…' : '+ Add to Watchlist'}
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

// ─── Forex panel ──────────────────────────────────────────────────────────────
function ForexPanel({ onAdded }: Props) {
  const [base, setBase] = useState('EUR');
  const [quote, setQuote] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const symbol = `OANDA:${base.toUpperCase()}_${quote.toUpperCase()}`;

  const handleAdd = async () => {
    if (!base || !quote) return;
    setError('');
    setLoading(true);
    try {
      let security;
      try {
        security = await securitiesApi.create({
          symbol,
          assetType: 'Forex',
          name: `${base.toUpperCase()}/${quote.toUpperCase()}`,
          currency: quote.toUpperCase(),
        });
      } catch (err: any) {
        if (err.response?.status === 409) {
          const all = await securitiesApi.getAll();
          security = all.find(s => s.symbol === symbol)!;
        } else throw err;
      }
      await watchlistApi.add(security.id);
      setBase('EUR'); setQuote('USD');
      onAdded();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">Base currency</label>
          <input value={base} onChange={e => setBase(e.target.value.toUpperCase())}
            maxLength={3} placeholder="EUR"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-indigo-500 font-mono uppercase" />
        </div>
        <div className="pt-5 text-gray-500">/</div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">Quote currency</label>
          <input value={quote} onChange={e => setQuote(e.target.value.toUpperCase())}
            maxLength={3} placeholder="USD"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-indigo-500 font-mono uppercase" />
        </div>
        <div className="pt-5">
          <button onClick={handleAdd} disabled={loading || base.length !== 3 || quote.length !== 3}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
            {loading ? 'Adding…' : '+ Add'}
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-600">
        Symbol sent to Finnhub: <span className="font-mono text-gray-500">{symbol}</span>
        <span className="ml-2 text-gray-700">— format: <span className="font-mono">OANDA:CCY1_CCY2</span></span>
      </p>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────
export default function AddSecurityForm({ onAdded }: Props) {
  const [tab, setTab] = useState<'equity' | 'forex'>('equity');

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-4 border-b border-gray-800 pb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Add to Watchlist</span>
        <div className="flex gap-1 ml-auto">
          <button onClick={() => setTab('equity')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              tab === 'equity' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-white'
            }`}>
            📈 Equity / Bond
          </button>
          <button onClick={() => setTab('forex')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              tab === 'forex' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-white'
            }`}>
            💱 Forex
          </button>
        </div>
      </div>

      {tab === 'equity'
        ? <EquityBondPanel onAdded={onAdded} />
        : <ForexPanel onAdded={onAdded} />}
    </div>
  );
}
