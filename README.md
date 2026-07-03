# MERIDIAN — Global Intelligence Feed

A **completely free**, single-file, real-time intelligence dashboard. No accounts, no API keys, no tracking, no backend — just open data, served straight from GitHub Pages.

---

## v5.0 — Premium Design System

A complete visual redesign of every screen, tab, card, and control — with component *swaps* where a different pattern serves better than polishing the old one:

| Swap | Before → After |
|---|---|
| **Mobile navigation** | Cramped top pill-scroller → fixed **bottom app dock** (icon-over-label, safe-area aware, wire ticker rides above it) |
| **Article modal on mobile** | Centered dialog → **slide-up reader sheet** with drag handle |
| **Tone indicator** | Top edge strip → **left ribbon**, matching the grid's vertical scan axis |
| **Source label** | Text-only → **favicon identity chip** + name (Google s2 favicons, self-removing on failure) |
| **Card surface** | Flat border → **gradient-hairline glass** (dual-layer background-clip border) with layered depth shadows |

Plus, across the board: frosted-glass masthead and dock with saturated blur, a glowing active-tab chip, larger editorial type scale (17px card titles, 30px hero headlines, 27px reader titles), gold-gradient primary CTA, "Today in Brief" rebuilt as a connected timeline with hover-indent rows, styled global scrollbars, dashed-border empty states, glass wire-ticker rail, and a quieter debug button. The cursor spotlight was re-engineered to CSS custom properties consumed by `::after`, so it now composes with the layered card backgrounds instead of overwriting them. Radius, shadow, and edge tokens are theme-aware (`--edge-*`, `--glass`, `--shadow-card*`) in both dark and light.

---

## v4.1 — Apex

Everything on the v4.0 roadmap, shipped:

| Feature | What it does |
|---|---|
| **Offline PWA** | A service worker caches the app shell and every successful data response. Lose connectivity and MERIDIAN keeps working from cache, with an `OFFLINE` pip in the header and toasts on connection changes. Installable to the home screen. |
| **Per-tab unread badges** | The Daily Brief prefetch doubles as an unread scanner: each nav tab shows a red count of stories newer than your last visit. Visiting the tab clears it. No extra network cost. |
| **Audio brief** | `▷ LISTEN` on the Today in Brief card reads the day's headlines aloud via the browser's built-in SpeechSynthesis — a hands-free morning briefing, zero external services. |
| **Markdown export** | `⎘ COPY` exports the brief as clean Markdown (headline, category, age, link) — paste it straight into Slack, Notion, or a note. |
| **Settings panel** | One place for default landing tab, theme, density, cache stats + clear, reading-history reset, and saved-stories management. |
| **Clickable threads** | The cross-section keyword tags on Home now launch a live news search for that thread. |
| **Default landing tab** | Open straight to Markets (or any tab) every morning — your call. |

All of it is keyboard-reachable from the ⌘K palette.

**Live tabs:** Home · World Conflicts · Economy · Tech & AI · India · Tamil Nadu · Markets (Google Finance + Nifty 50 analytics + TradingView calendar/signals/heatmap) · Climate (Open-Meteo, animated sky scenes) · Crisis Watch (GDACS + USGS + news) · Search (Google News)

---

## v4.0 — The Premium Release

v4.0 is the result of a full line-by-line review of the entire project from five perspectives — developer, UI/UX designer, architect, product owner, and end user. Everything below was found in that review and either fixed or shipped.

### New in v4.0

| Feature | What it does |
|---|---|
| **⌘K Command Palette** | `Ctrl/Cmd+K` from anywhere: jump to any tab, toggle theme/density/hide-read, refresh feeds, reopen saved stories, or fire a live news search — all keyboard-driven with arrow/enter navigation. |
| **Saved stories** | Star any article from its modal (`★ Save`). Saved stories persist in localStorage and are one keystroke away in the palette. |
| **Share** | Native share sheet on mobile (`navigator.share`), clipboard copy with toast confirmation on desktop. |
| **Hide-read mode** | One header toggle hides everything you've already read — turning the feed into a true inbox. Persists across sessions. |
| **Live timestamps** | "4m ago" labels now re-render every minute without refetching, so a long-open tab never lies about freshness. |
| **Aurora ambient background** | Subtle animated gold/blue radial glow behind the whole app — distinctive, cheap to render, disabled for reduced-motion users. |
| **PWA-ready** | Web manifest + SVG favicon + theme-color: installable to the home screen, branded tab icon (the site previously had *no* favicon at all). |
| **SEO / social cards** | Meta description + Open Graph tags for clean link previews. |

### Accessibility (new)

- All news cards are keyboard-focusable (`tabindex`, `role="button"`) and open with **Enter/Space**.
- Visible `:focus-visible` outlines throughout.
- `prefers-reduced-motion` fully honored — tickers, tilts, aurora, and sky scenes freeze.
- Skip-to-content link, `aria-live` toasts, dialog roles on overlays.

### Performance fixes

- The cursor-spotlight/3D-tilt handler ran raw on **every mousemove** (style writes + `getBoundingClientRect` per pixel). Now `requestAnimationFrame`-throttled, passive, and **skipped entirely on touch devices** and for reduced-motion users.
- Timestamp refresh reuses rendered DOM — zero network cost.

### Bugs found & fixed in the review

- `.ticker-item` was defined **twice globally** with conflicting rules (market tape vs. crisis alert ticker) — the second silently overrode the first. Both are now properly scoped (`.ticker-wrap .ticker-item` / `.alert-ticker-outer .ticker-item`).
- Duplicate `@keyframes tickerScroll` declaration removed.
- Version strings were inconsistent across the app (v2.7 in the debug panel, v3.0 in the header, "7 tabs" in a 10-tab app). Unified to v4.0.
- The repo had **no `index.html`** — the site only worked at `/meridian_v1.html`. The root URL now serves the app; `meridian_v1.html` is kept as the v3 archive.
- Stale keyboard-shortcut help text (claimed 1–7; there are 10 tabs).

---

## Architecture

**One HTML file. Zero build. Zero server.** This is deliberate: GitHub Pages hosts it free forever, and anyone can fork one file.

```
index.html
├── Design tokens (dark/light themes, per-section accent colors)
├── Data layer
│   ├── RSS via rss2json.com (AP, Guardian, Al Jazeera, TechCrunch, MIT TR, ET, Google News queries)
│   ├── GDELT DOC 2.0 (fallback cascade: trusted 24H → 48H → 7D → unverified, rate-limit cooldown + queue)
│   ├── Google Finance via Apps Script (live NSE/BSE/US quotes; Nifty 50 monthly performance)
│   ├── USGS GeoJSON (M5+ earthquakes) · GDACS RSS (disaster alerts)
│   ├── Open-Meteo (weather + air quality + geocoding)
│   └── TradingView embeds (economic calendar, technical signals, heatmap)
├── Cache layer: localStorage, 15-min TTL, stale-fallback on fetch failure
└── UI layer: tab router (hash-synced), card grid, modal, command palette,
    tickers, debug console, density/theme/hide-read preferences
```

**Trust model:** a 200+ domain whitelist (wire services → national → regional → specialist) filters GDELT results; anything admitted from the unverified tier is visibly badged `⚠ UNVERIFIED SOURCE`.

## Keyboard

| Key | Action |
|---|---|
| `Ctrl/Cmd + K` | Command palette |
| `1`–`9`, `0` | Switch tabs |
| `R` | Refresh all feeds |
| `Tab` → `Enter` | Focus & open any story card |
| `Esc` | Close modal / palette |

## Deploy

Push to `main` → GitHub Actions deploys to Pages automatically (`.github/workflows/pages.yml`). Nothing else required.

## Roadmap ideas

- ~~Service worker for true offline reading~~ ✅ shipped in v4.1
- ~~Per-tab notification badges since last visit~~ ✅ shipped in v4.1
- ~~Cross-section threads~~ ✅ clickable in v4.1
- ~~Markdown export~~ ✅ Daily Brief export in v4.1
- Full story clustering (same event grouped across sections into one card)
- Push-style background refresh via Periodic Background Sync where supported
- Saved-stories export (Markdown/OPML)

---

*MERIDIAN is free software built on free data. Attribution to all upstream sources is shown in the app footer.*
