# Stream2 — website prototype

A working, deployable implementation of the redesign proposal: 8 pages × EN/ES, anonymized coverage map, two-form contact page. Plain HTML/CSS/JS — no build step, no framework (see proposal Fase 7.1 for why).

## Run locally
```
npx serve .
```
Then open the printed localhost URL. (Opening `index.html` directly via `file://` won't work — the header/footer are loaded with `fetch`, which browsers block on `file://`.)

## Deploy
Drag this folder onto [app.netlify.com/drop](https://app.netlify.com/drop), or `netlify deploy`. The two contact forms already have `data-netlify="true"` — Netlify detects and wires them up automatically on deploy, no backend needed. Submissions land in Site settings → Forms.

## Before this goes live
- ~~Confirm the figures marked in the proposal as `[confirmar]`~~ — confirmed by Mario 2026-07-15: 600+ hotels, 12 languages, 18 team members, 25+ countries, `stream2.nl` stays the primary domain.
- Review the privacy policy draft (`privacy-policy.html` / `es/politica-privacidad.html`) with an actual lawyer before publishing — see the caveats logged in this session (24-month retention default, sub-processor list, DPO question).
- ~~Team photos on the About page~~ — done, all 17 are real (`assets/img/team/`, resized to 640px/JPEG q78).
- ~~Logo~~ — done, using the client-supplied color/white PNGs (`assets/img/stream2-logo-color.png` / `-white.png`).
- Find a real logo for **BUY Veneto** — couldn't locate an official one; `events.html` currently shows a text wordmark fallback for that entry only.
- `data/hotel-coverage.json` is a snapshot from 2026-07-15 — refresh quarterly from the internal Netlify hotel map (country counts only, never hotel-level data).
- `events.html` / `es/eventos.html` dates need re-checking periodically — FITUR and ITB Berlin were rolled to their real 2027 dates (confirmed via web search) since the 2026 editions had already passed; the rest are still their original 2026 dates and will need the same treatment as they pass.

## Structure
- `index.html`, `for-hotels.html`, etc. — English pages (root)
- `es/` — Spanish equivalents
- `assets/partials/` — header/footer, one pair per language, injected client-side by `assets/js/include.js`
- `assets/js/map.js` + `data/hotel-coverage.json` — the anonymized country-level map (Leaflet), zoom now goes to street level (no hotel-level data plotted, so nothing new is exposed by zooming)
- `assets/img/team/` — real team headshots (17/17)
- `assets/img/canva/` — department photos pulled from the two Canva decks, used on the How We Work team cards
- `assets/img/events/` — real fair logos, pulled from each event's own site
- `assets/img/photos/` — the two Unsplash hero photos (hotel lobby, European street) — Unsplash License, free for commercial use
- Typography: Fraunces (headings) + Inter (body/UI), loaded from Google Fonts on every page
