import type { WatchlistItem } from '../types';
import { fmtPrice, fmtChange, fmtMarketCap, changeColor } from '../utils/format';

const fmtReturn = (n: number | null | undefined) =>
  n != null ? (n >= 0 ? '+' : '') + n.toFixed(2) + '%' : '—';

interface Props {
  items: WatchlistItem[];
  onRemove: (id: number) => void;
  loading: boolean;
}

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
            <th className="px-4 py-3 text-left">Industry</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 text-right">Change</th>
            <th className="px-4 py-3 text-right">Chg %</th>
            <th className="px-4 py-3 text-right">High</th>
            <th className="px-4 py-3 text-right">Low</th>
            <th className="px-4 py-3 text-right">Mkt Cap</th>
            <th className="px-4 py-3 text-right">YTD</th>
            <th className="px-4 py-3 text-right">52W High</th>
            <th className="px-4 py-3 text-right">52W Low</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {items.map(item => (
            <tr key={item.id} className="hover:bg-gray-900/50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {item.logo && (
                    <img src={item.logo} alt={item.symbol} className="w-5 h-5 rounded-sm object-contain bg-white p-0.5" />
                  )}
                  <span className="font-mono font-semibold text-white">{item.symbol}</span>
                  <span className="px-1.5 py-0.5 rounded-full text-xs bg-gray-800 text-gray-500">
                    {item.assetType}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-300">{item.name}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">{item.industry ?? '—'}</td>
              <td className="px-4 py-3 text-right font-mono text-white">
                {fmtPrice(item.quote?.currentPrice ?? undefined)}
              </td>
              <td className={`px-4 py-3 text-right font-mono ${changeColor(item.quote?.change)}`}>
                {fmtChange(item.quote?.change ?? null)}
              </td>
              <td className={`px-4 py-3 text-right font-mono ${changeColor(item.quote?.percentChange)}`}>
                {fmtChange(item.quote?.percentChange ?? null, '%')}
              </td>
              <td className="px-4 py-3 text-right font-mono text-gray-400">
                {fmtPrice(item.quote?.high ?? undefined)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-gray-400">
                {fmtPrice(item.quote?.low ?? undefined)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-gray-300">
                {fmtMarketCap(item.marketCapMillions)}
              </td>
              <td className={`px-4 py-3 text-right font-mono ${changeColor(item.metrics?.ytdReturn)}`}>
                {fmtReturn(item.metrics?.ytdReturn)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-gray-400"
                title={item.metrics?.high52WDate ?? ''}>
                {fmtPrice(item.metrics?.high52W ?? undefined)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-gray-400"
                title={item.metrics?.low52WDate ?? ''}>
                {fmtPrice(item.metrics?.low52W ?? undefined)}
              </td>
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
