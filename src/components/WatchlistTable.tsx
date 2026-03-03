import type { WatchlistItem } from '../types';

interface Props {
  items: WatchlistItem[];
  onRemove: (id: number) => void;
  loading: boolean;
}

const fmt = (n: number | undefined, decimals = 2) =>
  n != null ? n.toFixed(decimals) : '—';

const changeColor = (n: number | null | undefined) => {
  if (n == null) return 'text-gray-400';
  return n >= 0 ? 'text-green-500' : 'text-red-500';
};

export default function WatchlistTable({ items, onRemove, loading }: Props) {
  if (loading) return <div className="text-center py-12 text-gray-400">Loading watchlist…</div>;
  if (items.length === 0)
    return <div className="text-center py-12 text-gray-400">Your watchlist is empty. Add a security below.</div>;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="w-full text-sm">
        <thead className="bg-gray-900 text-gray-400 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3 text-left">Symbol</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 text-right">Change</th>
            <th className="px-4 py-3 text-right">Chg %</th>
            <th className="px-4 py-3 text-right">High</th>
            <th className="px-4 py-3 text-right">Low</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {items.map(item => (
            <tr key={item.id} className="hover:bg-gray-900/50 transition-colors">
              <td className="px-4 py-3 font-mono font-semibold text-white">{item.symbol}</td>
              <td className="px-4 py-3 text-gray-300">{item.name}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-400">
                  {item.assetType}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-mono text-white">
                {fmt(item.quote?.currentPrice)}
              </td>
              <td className={`px-4 py-3 text-right font-mono ${changeColor(item.quote?.change)}`}>
                {item.quote?.change != null ? (item.quote.change >= 0 ? '+' : '') + fmt(item.quote.change) : '—'}
              </td>
              <td className={`px-4 py-3 text-right font-mono ${changeColor(item.quote?.percentChange)}`}>
                {item.quote?.percentChange != null
                  ? (item.quote.percentChange >= 0 ? '+' : '') + fmt(item.quote.percentChange) + '%'
                  : '—'}
              </td>
              <td className="px-4 py-3 text-right font-mono text-gray-400">{fmt(item.quote?.high)}</td>
              <td className="px-4 py-3 text-right font-mono text-gray-400">{fmt(item.quote?.low)}</td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-gray-600 hover:text-red-500 transition-colors text-xs"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
