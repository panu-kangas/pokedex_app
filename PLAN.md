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

## Phase 0: Foundations

- ✅ **PR 1 – Security hotfixes.** Stop logging `MONGO_URI`. Escape and length-limit the search regex. Add a generic error handler (no raw errors sent to clients), `helmet` and rate limiting. Read the CORS origin from an env var so local development works.
- ✅ **PR 2 – Repo cleanup + monorepo.** npm workspaces, root scripts (`dev`, `build`, `lint`, `test`). Remove CRA leftovers. Rename `VITE_API_KEY` → `VITE_API_URL`. Add `.env.example` files, ESLint (flat config) + Prettier and `.editorconfig`. Update the Render/Vercel root directories if needed.
- ✅ **PR 3 – API to TypeScript + layered structure.** `routes → controllers → services → models`, a typed config module, zod validation of requests, central error middleware, and `/api/health`.
- ✅ **PR 4 – Web to TypeScript + shared types.** Convert components to `.tsx`, set up `packages/shared` with the Pokémon/API types and a typed API client.
- ✅ **PR 5 – Testing setup.** API: Vitest + Supertest + mongodb-memory-server. Web: Vitest + React Testing Library. A few meaningful first tests.
- ✅ **PR 5b – Viewer transition fix.** The next sprite was swapped in before it loaded (stale-image blink in Chrome), and the dual-type colour half popped in without a transition. Fetch in parallel with the fade-out, preload + decode the sprite before swapping, and always render both colour halves.
- ✅ **PR 5c – Rate limiter behaviour tests.** The limit is configurable in `createApp`, so tests can check the real behaviour with a small limit: JSON 429 over the limit, health check exempt, separate counts per client IP behind the proxy, and spoofed `X-Forwarded-For` entries ignored.
- ⬜ **PR 6 – CI + security tooling.** GitHub Actions on every PR: lint, typecheck, test, build, `npm audit --audit-level=high`. CodeQL scanning. `dependabot.yml` for grouped weekly npm + Actions updates. Coverage report (`@vitest/coverage-v8`) in CI, linked from `docs/testing.md`. Status badge in the README. Allow this project's Vercel preview origins in the API's CORS so PR previews can load data (needed before the Phase 2 UI reviews).

## Phase 1: Data & API

- ⬜ **PR 7 – Richer data model + seeder.** Add species data (genus, flavour text), abilities, evolution chain and base stat total. Required/unique fields and indexes. Idempotent upsert seeder with limited concurrency.
- ⬜ **PR 8 – API v1.** `GET /api/v1/pokemon` with pagination, type filter, sorting and safe search. `GET /api/v1/pokemon/:id` including the evolution chain. `/api/v1/stats/*` built on aggregation pipelines. Cache headers. Tests for every endpoint.

## Phase 2: UI rework

- ⬜ **PR 9 – Design system.** Tokens (colours, spacing, typography, radii, shadows), a dark theme, and breakpoints. Base components: `Button`, `Card`, `TypeBadge`, `StatBar`, `Skeleton`, `ErrorState`.
- ⬜ **PR 10 – App shell + routing.** React Router with a layout, responsive nav and a 404 page. TanStack Query for data fetching (caching, loading and error states). Pages: Home, Pokédex, Pokémon detail, Insights.
- ⬜ **PR 11 – Pokédex browse page.** Responsive card grid, debounced live search, type filters and sorting, with state kept in the URL query params. Pagination or infinite scroll. Separate error state for failed requests (today an API failure shows "Pokémon not found").
- ⬜ **PR 12 – Pokémon detail page.** `/pokemon/:id` with a stats chart, evolution chain, flavour text, prev/next links and keyboard navigation.
- ⬜ **PR 13 – GameBoy redesign.** A polished, responsive GameBoy viewer as the home page centrepiece, with D-pad and keyboard controls and accessible labels.
- ⬜ **PR 14 – Insights page.** Themed, responsive charts backed by the aggregation endpoints, plus new ones (e.g. average stats per type, base stat total distribution).
- ⬜ **PR 15 – Polish + docs.** Accessibility and Lighthouse pass, mobile QA. README rewrite with screenshots/GIF, an architecture diagram, an API overview and local setup steps.

**→ MVP complete**

## Phase 3: Advanced features (detailed after the MVP)

- Auth: register/login, httpOnly-cookie sessions or JWT, password hashing
- Favourites and a team builder (6 Pokémon) with type-coverage analysis
- Compare tool and type matchup calculator
- E2E tests (Playwright), OpenAPI docs, Docker Compose for local development
- More generations, server-side caching
- Optional load testing: an `autocannon` or k6 script run locally (never against prod or in CI), with results written up, e.g. p95 latency before/after indexes
