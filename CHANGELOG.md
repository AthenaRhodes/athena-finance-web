# Changelog — athena-finance-web

> Append-only. Each version is documented below in reverse chronological order.

---

## v0.1.0 — 2026-03-04

First stable release. Promotes v0.1.0-beta.11 to production-ready MVP.

### Summary
- React + Vite + TypeScript + Tailwind CSS (dark theme)
- Watchlist table with clear live/provider/db data source indicators
- Live equity search with autocomplete; separate Forex tab
- Auto-refresh toggle with visual live/paused state
- Version badge showing web and API versions in header
- EOD date badge per row with stale data warning

### Features
- **Watchlist table**: Symbol + logo, Name, Industry, Price (EOD), Day% (live), YTD% (provider), Market Cap (EOD)
- **Data source badges**: 🟢 live (intraday), ↻ provider (EOD-based from Finnhub), db (local DB nightly)
- **EOD date badge**: shows date of last EOD record; yellow if stale (>1 day)
- **Add security form**: two tabs
  - 📈 Equity/Bond: live search by name or ticker, autocomplete, name auto-filled
  - 💱 Forex: base/quote currency inputs, live symbol preview (`OANDA:EUR_USD`)
- **Auto-refresh toggle**: enable/disable 30s live refresh from header
- **Version badge**: web and API version displayed in header

---

## Beta history

### v0.1.0-beta.11 — 2026-03-04
- Auto-refresh toggle in header — Live (pulsing) / Paused

### v0.1.0-beta.10 — 2026-03-04
- Three data-source badges: `live`, `↻ provider`, `db` in column headers
- Corrected YTD % label — provider-sourced, not from local DB

### v0.1.0-beta.7 — 2026-03-04
- Live vs EOD distinction: date badges, stale warning, pulsing live indicator
- Market zone badge per row

### v0.1.0-beta.6 — 2026-03-03
- Watchlist table streamlined to key columns only

### v0.1.0-beta.5 — 2026-03-03
- YTD %, 52W High/Low columns (later removed in beta.6 cleanup)

### v0.1.0-beta.4 — 2026-03-03
- Equity/Bond search with autocomplete; Forex tab with format hint
- Company name auto-filled from Finnhub

### v0.1.0-beta.3 — 2026-03-03
- Market cap, industry, company logo in watchlist table

### v0.1.0-beta.2 — 2026-03-03
- Version badge in header; API version fetched from `/api/info`
- Dev environment badge

### v0.1.0-beta.1 — 2026-03-03
- Initial scaffold: React/Vite/TypeScript/Tailwind, watchlist table, add form
