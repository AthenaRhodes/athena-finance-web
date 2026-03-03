# Changelog — athena-finance-web

> Append-only. Each beta version is documented below in reverse chronological order.

---

## v0.1.0-beta.3 — 2026-03-03

### Added
- **Market Cap** column in watchlist table — formatted as `$3.86T`, `$500B`, `$2.3M`
- **Industry** column — shown for equities
- **Company logo** — small icon next to symbol (equities only, from Finnhub)
- Extracted `src/utils/format.ts` — shared helpers for price, change and market cap formatting

---

## v0.1.0-beta.2 — 2026-03-03

### Added
- **VersionBadge** component in header: displays live `web x.x.x-beta.x` and `api x.x.x-beta.x` versions
- API version fetched from `GET /api/info` on mount
- `__APP_VERSION__` injected at build time from `package.json` via Vite `define`
- Dev environment badge shown when API reports `Development`

### Fixed
- `VITE_API_URL` now correctly points to configurable API port via `.env`

---

## v0.1.0-beta.1 — 2026-03-03

### Added
- Initial project scaffold: React + Vite + TypeScript + Tailwind CSS (dark theme)
- **Types**: `Security`, `Quote`, `WatchlistItem`, `EodPrice`, `AssetType`
- **API service layer**: `securitiesApi`, `watchlistApi`, `pricesApi` via Axios
- **WatchlistTable**: displays symbol, name, asset type, live price, change, change %, high, low; remove button
- **AddSecurityForm**: add a security by symbol, name, type, exchange and currency; creates security then adds to watchlist
- Auto-refresh every 30 seconds
- `.env.example` with `VITE_API_URL` template
