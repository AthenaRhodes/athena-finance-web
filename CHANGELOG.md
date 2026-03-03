# Changelog — athena-finance-web

> Append-only. Each beta version is documented below in reverse chronological order.

---

## v0.1.0-beta.6 — 2026-03-03

### Changed
- Watchlist table streamlined — removed: 52W High, 52W Low, Change (value), Day High, Day Low
- Kept columns: Symbol, Name, Industry, Price, **Day %**, **YTD %**, **Mkt Cap**

---

## v0.1.0-beta.5 — 2026-03-03

### Added
- **YTD** return column — colour-coded green/red (equities only)
- **52W High / 52W Low** columns — with date shown on hover
- `Metrics` type added to match API response

---

## v0.1.0-beta.4 — 2026-03-03

### Added
- **Add Security form** fully reworked with two tabs:
  - 📈 **Equity / Bond** tab: live search by company name or ticker with debounced autocomplete; name auto-filled from Finnhub; Equity/Bond toggle
  - 💱 **Forex** tab: separate base/quote currency inputs; live preview of Finnhub symbol (`OANDA:EUR_USD`); format hint shown
- Name field removed from form — always resolved from Finnhub

### Changed
- `securitiesApi.create` — `name` is now optional

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
