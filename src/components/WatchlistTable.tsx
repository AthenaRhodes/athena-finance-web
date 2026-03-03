import type { WatchlistItem } from '../types';
import { fmtPrice, fmtChange, fmtMarketCap, changeColor } from '../utils/format';

interface Props {
  items: WatchlistItem[];
  onRemove: (id: number) => void;
  loading: boolean;
}

const fmtReturn = (n: number | null | undefined) =>
  n != null ? (n >= 0 ? '+' : '') + n.toFixed(2) + '%' : '—';

function EodBadge({ date }: { date: string | null | undefined }) {
  if (!date) return <span className="text-gray-700 text-xs">no EOD</span>;

  const eodDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - eodDate.getTime()) / 86_400_000);

  const label = eodDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  const isStale = diffDays > 1;

  return (
    <span
      className={`text-xs font-mono px-1.5 py-0.5 rounded ${
        isStale
          ? 'bg-yellow-900/40 text-yellow-500'
          : 'bg-gray-800 text-gray-500'
      }`}
      title={isStale ? `Stale — last EOD ${diffDays} day(s) ago` : `EOD: ${date}`}
    >
      {label}
    </span>
  );
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-emerald-500">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      live
    </span>
  );
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
            <th className="px-4 py-3 text-right">
              <div className="flex items-center justify-end gap-1.5">Price <span className="normal-case font-normal text-gray-600">(EOD)</span></div>
            </th>
            <th className="px-4 py-3 text-right">
              <div className="flex items-center justify-end gap-1.5">Day % <LiveBadge /></div>
            </th>
            <th className="px-4 py-3 text-right">
              <div className="flex items-center justify-end gap-1.5">YTD % <span className="normal-case font-normal text-gray-600">(EOD)</span></div>
            </th>
            <th className="px-4 py-3 text-right">
              <div className="flex items-center justify-end gap-1.5">Mkt Cap <span className="normal-case font-normal text-gray-600">(EOD)</span></div>
            </th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {items.map(item => (
            <tr key={item.id} className="hover:bg-gray-900/50 transition-colors">

              {/* Symbol + logo + type + zone */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {item.logo && (
                    <img src={item.logo} alt={item.symbol}
                      className="w-5 h-5 rounded-sm object-contain bg-white p-0.5" />
                  )}
                  <span className="font-mono font-semibold text-white">{item.symbol}</span>
                  <span className="px-1.5 py-0.5 rounded-full text-xs bg-gray-800 text-gray-500">
                    {item.assetType}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-xs bg-gray-800/50 text-gray-600">
                    {item.marketZone}
                  </span>
                </div>
              </td>

              <td className="px-4 py-3 text-gray-300">{item.name}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">{item.industry ?? '—'}</td>

              {/* EOD Price */}
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="font-mono text-white">
                    {item.eod ? fmtPrice(item.eod.close) : '—'}
                  </span>
                  <EodBadge date={item.eod?.date} />
                </div>
              </td>

              {/* Day % — live */}
              <td className={`px-4 py-3 text-right font-mono ${changeColor(item.live?.dayChangePercent)}`}>
                {item.live ? fmtChange(item.live.dayChangePercent, '%') : '—'}
              </td>

              {/* YTD % — EOD-based */}
              <td className={`px-4 py-3 text-right font-mono ${changeColor(item.ytdReturn)}`}>
                {fmtReturn(item.ytdReturn)}
              </td>

              {/* Market Cap — EOD */}
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="font-mono text-gray-300">
                    {fmtMarketCap(item.eod?.marketCapMillions)}
                  </span>
                  {item.eod && <EodBadge date={item.eod.date} />}
                </div>
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
