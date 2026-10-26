# Refactor Plan

Turn the Pokédex app into a portfolio-grade fullstack project. First an **MVP**: solid foundations, security, CI, a reworked UI and better core features. Then **advanced features**.

Status: ⬜ todo · 🟨 in progress · ✅ merged

## Decisions

| Topic       | Decision                                                                              | Why                                                                     |
| ----------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Language    | TypeScript (frontend + backend), migrated early                                       | Most junior job ads ask for it; all new code is typed from the start    |
| Database    | Keep MongoDB (Atlas + Mongoose), done properly                                        | Less migration work; adds validation, indexes and aggregation pipelines |
| Styling     | CSS Modules + design tokens (CSS variables)                                           | Scoped styles, real CSS skill, full control over the GameBoy look       |
| Theme       | Dark, modern UI; accents from the classic Pokémon blue `#3B4CCA` and yellow `#FFDE00` | The current palette looks bland                                         |
| Auth        | After the MVP                                                                         | Build it on a stable, tested base                                       |
| Repo layout | npm workspaces monorepo: `apps/web`, `apps/api`, `packages/shared`                    | One install and one CI run; types shared between frontend and backend   |

## Workflow

- One PR per item below, on a branch `feat/…`, `fix/…` or `chore/…`, with conventional commit messages.
- `main` is auto-deployed (Vercel + Render), so every PR must leave production working.
- After each PR: a short recap (what, why, interview talking points), then update this file and CLAUDE.md.

## Next up

1. **Review PRs 34–38 together, then a quiz.** Phase 1.5 was merged under time pressure, without the usual hand-written piece or explain-back. Panu reads each diff and asks questions, then gets a quiz on it.
2. **Resume PR 7.** It's on `feat/richer-data-model` (pushed, no PR yet). Rebase it onto `main` first (it predates PRs 34–38; expect a PLAN.md conflict only). Panu finishes the hand-written `cleanFlavorText` (WIP commit with its tests), then review, a real `--dry-run`, and open the PR.

## Phase 0: Foundations

- ✅ **PR 1 – Security hotfixes.** Stop logging `MONGO_URI`. Escape and length-limit the search regex. Add a generic error handler (no raw errors sent to clients), `helmet` and rate limiting. Read the CORS origin from an env var so local development works.
- ✅ **PR 2 – Repo cleanup + monorepo.** npm workspaces, root scripts (`dev`, `build`, `lint`, `test`). Remove CRA leftovers. Rename `VITE_API_KEY` → `VITE_API_URL`. Add `.env.example` files, ESLint (flat config) + Prettier and `.editorconfig`. Update the Render/Vercel root directories if needed.
- ✅ **PR 3 – API to TypeScript + layered structure.** `routes → controllers → services → models`, a typed config module, zod validation of requests, central error middleware, and `/api/health`.
- ✅ **PR 4 – Web to TypeScript + shared types.** Convert components to `.tsx`, set up `packages/shared` with the Pokémon/API types and a typed API client.
- ✅ **PR 5 – Testing setup.** API: Vitest + Supertest + mongodb-memory-server. Web: Vitest + React Testing Library. A few meaningful first tests.
- ✅ **PR 5b – Viewer transition fix.** The next sprite was swapped in before it loaded (stale-image blink in Chrome), and the dual-type colour half popped in without a transition. Fetch in parallel with the fade-out, preload + decode the sprite before swapping, and always render both colour halves.
- ✅ **PR 5c – Rate limiter fix + behaviour tests.** Production logs showed Render's chain is client → Cloudflare → Render load balancer, so `trust proxy 1` keyed the limiter on Cloudflare edge IPs (users shared a few counters). Now `trust proxy 2`. The limit is configurable in `createApp`, and tests replay the real header chain: JSON 429 over the limit, health check exempt, per-client counting across Cloudflare edges, and spoofed `X-Forwarded-For` entries ignored.
- ✅ **PR 6 – CI + security tooling.** GitHub Actions on every PR: lint, typecheck, test, build, `npm audit --audit-level=high`. CodeQL scanning. `dependabot.yml` for grouped weekly npm + Actions updates. Coverage report (`@vitest/coverage-v8`) in CI, linked from `docs/testing.md`. Status badge in the README. Allow this project's Vercel preview origins in the API's CORS so PR previews can load data (needed before the Phase 2 UI reviews).

## Phase 1.5: Visual refresh (before job applications)

Added on 2026-10-25: the site is shown to recruiters before the MVP is done, so first impressions and a working mobile layout come first. It follows the Phase 2 decisions (dark theme, tokens, CSS Modules) so nothing is thrown away; routing, new pages and the full GameBoy redesign stay in Phase 2.

- ✅ **PR A – Tokens + page shell.** Colour, type and spacing tokens with the dark theme. Hero with a one-line pitch and calls to action, sticky nav, consistent section cards, footer with the tech stack and links. Mobile-first; CSS Modules for every restyled component.
- ✅ **PR B – GameBoy, charts and search.** A GameBoy that scales to any screen, themed charts that stack on mobile and resize correctly, and a styled search with type-coloured result cards.
- ✅ **PR C – First impressions.** README with screenshot, live link, tech stack and highlights. Page title, description and Open Graph image for link previews.
- ✅ **PR D – Readability + background-tab fix.** Larger text in the stat views, search cards and GameBoy (new `--text-xs` floor), a wider GameBoy on desktop, and a decode timeout so the viewer no longer stays on "Loading…" in background tabs.
- ✅ **PR E – Search cards + More info layout.** Bigger search card text with a visible "Tap for stats" pill. More info shows the number (updates instantly while browsing, the rest dims), vertically centred content, compact one-line stat rows, and height/weight/type on one or two lines under the stats.

## Phase 1: Data & API

- 🚧 **PR 7 – Richer data model + seeder.** _(In progress on `feat/richer-data-model`, paused for Phase 1.5.)_ Add species data (genus, flavour text), abilities, evolution chain and base stat total. Required/unique fields and indexes. Idempotent upsert seeder with limited concurrency.
- ⬜ **PR 8 – API v1.** `GET /api/v1/pokemon` with pagination, type filter, sorting and safe search. `GET /api/v1/pokemon/:id` including the evolution chain. `/api/v1/stats/*` built on aggregation pipelines. Cache headers. Tests for every endpoint.

## Phase 2: UI rework

- ⬜ **PR 9 – Design system.** Tokens (colours, spacing, typography, radii, shadows), a dark theme, and breakpoints. Base components: `Button`, `Card`, `TypeBadge`, `StatBar`, `Skeleton`, `ErrorState`.
- ⬜ **PR 10 – App shell + routing.** React Router with a layout, responsive nav and a 404 page. TanStack Query for data fetching (caching, loading and error states). Pages: Home, Pokédex, Pokémon detail, Insights.
- ⬜ **PR 11 – Pokédex browse page.** Responsive card grid, debounced live search, type filters and sorting, with state kept in the URL query params. Pagination or infinite scroll. Separate error state for failed requests (today an API failure shows "Pokémon not found").
- ⬜ **PR 12 – Pokémon detail page.** `/pokemon/:id` with a stats chart, evolution chain, flavour text, prev/next links and keyboard navigation.
- ⬜ **PR 13 – GameBoy redesign.** A polished, responsive GameBoy viewer as the home page centrepiece, with D-pad and keyboard controls, a "go to number" input, and accessible labels.
- ⬜ **PR 14 – Insights page.** Themed, responsive charts backed by the aggregation endpoints, plus new ones (e.g. average stats per type, base stat total distribution).
- ⬜ **PR 14b – Compare tool** _(idea from 2026-10-26, needs refinement; probably split into 2–3 small PRs)._ A section/page with two empty slots side by side. Clicking a slot opens a big picker pop-up listing all 151, with search and type filter. Once both slots are filled, show the stat differences between the cards: per stat, both values with the difference in the middle as a green ▲ / red ▼ and the amount, plus the base stat total.
  - Extras: swap sides, clear a slot, random pair, the pair kept in the URL (`?a=25&b=6`) so it can be shared, maybe a radar chart overlay (Chart.js is already in).
  - Depends on PR 8 (list endpoint; 151 is small enough to fetch once and filter client-side). A `/compare` route needs PR 10.
  - Open questions: arrows from whose point of view (left vs right, or per side)? Phone layout (stacked cards or narrow side-by-side)? Should the picker reuse the PR 11 browse grid?
  - Pieces Panu can hand-write: a pure `compareStats(a, b)` with tests; the picker's search + type filter function; parsing and validating the `?a=&b=` params; keyboard navigation in the picker.
- ⬜ **PR 15 – Polish + docs.** Accessibility and Lighthouse pass, mobile QA. README rewrite with screenshots/GIF, an architecture diagram, an API overview and local setup steps.

**→ MVP complete**

## Phase 3: Advanced features (detailed after the MVP)

- Auth: register/login, httpOnly-cookie sessions or JWT, password hashing
- Favourites and a team builder (6 Pokémon) with type-coverage analysis
- Type matchup calculator
- E2E tests (Playwright), OpenAPI docs, Docker Compose for local development
- More generations, server-side caching
- Optional load testing: an `autocannon` or k6 script run locally (never against prod or in CI), with results written up, e.g. p95 latency before/after indexes

## Held dependency upgrades

Dependabot is told to ignore these majors, so nothing reminds us; check now and then.

- **TypeScript 7** (closed #31): wait until `typescript-eslint` supports it (its peer range is `<6.1.0` as of 8.72.0).
- **ESLint 10** (closed #29): `eslint-plugin-react` only supports ESLint ≤ 9 and is no longer released. Chore PR: swap it for `@eslint-react/eslint-plugin`, then upgrade ESLint and `@eslint/js`.
