# CLAUDE.md

A fullstack Pokédex covering Gen I (151 Pokémon). Portfolio project, being refactored. See `PLAN.md` for the roadmap and status.

## Structure (npm workspaces)

- `packages/shared`: types shared by web and API (`Pokemon`, `PokemonType`, response shapes). Types only, no build step, so never put runtime code here.
- `apps/web`: TypeScript, React 19 + Vite, Chart.js, Framer Motion. Deployed on Vercel (root dir `apps/web`; `build` typechecks first).
  - All HTTP calls go through `src/api/client.ts` (typed, throws `ApiError`, takes an `AbortSignal`).
- `apps/api`: TypeScript, Express 5 + Mongoose (MongoDB Atlas), zod. Deployed on Render (from the repo root; build `npm ci --include=dev && npm run build -w apps/api`).
  - `src/`: `index.ts` (bootstrap + shutdown) → `app.ts` (`createApp`, middleware) → `routes/` → `controllers/` (zod validation) → `services/` (DB logic) → `models/`
  - Throw `HttpError` or let `ZodError` bubble; `middleware/error-handler.ts` maps them to responses.
  - `src/config.ts` validates env at startup; `src/scripts/seed.ts` seeds from PokéAPI.
- Env vars: see `apps/*/.env.example`.

## Commands (from the repo root)

- `npm install`: installs all workspaces
- `npm run dev`: API on :5000 and web on :5173 together (or `dev:api` / `dev:web`)
- `npm run build`, `npm run typecheck`, `npm run lint`, `npm run format`
- `npm test`, `npm run test:list` (every test by name), `npm run test:coverage`
- `npm run seed`: re-seeds the DB

## Tests (Vitest)

See `docs/testing.md` for strategy, gaps and conventions.

- API: `apps/api/test/`, Supertest against `createApp()` with an in-memory MongoDB (`useTestDb()` + fixtures in `test/helpers.ts`). `tsconfig.build.json` keeps tests out of `dist`.
- Web: colocated `*.test.ts(x)`, jsdom + Testing Library; mock `api/client` rather than `fetch` in component tests. Fixtures in `src/test/`.

## Deployment gotchas

- Vercel installs only the `apps/web` workspace's dependencies, so every workspace must declare the tools its own scripts use (e.g. `typescript`); never rely on root-hoisted packages.
- Render tracks `main` (Build: `npm ci --include=dev && npm run build -w apps/api`, Start: `npm start`). A failed deploy keeps the previous version live.
- Prod: web `https://pokedex-app-seven-tan.vercel.app`, API `https://pokedex-backend-o7nb.onrender.com` (check `/api/health` after deploys).
- The API runs on a **paid Render instance**: it is always on and never sleeps. There are no cold starts, so don't add keep-alive pings or "waking up the server" UI.
- Render's proxy chain is client → Cloudflare → Render load balancer, hence `trust proxy 2` (verified from prod logs). Changing it breaks per-client rate limiting; the tests in `app.test.ts` cover this.
- API CORS allows only `CORS_ORIGIN` (comma-separated; `*` matches within one hostname label). Render's value includes `https://pokedex-app-*-panu-kangas-projects.vercel.app` so PR previews can load data.
- CI (`.github/workflows/ci.yml`) must pass on PRs; CodeQL and Dependabot (weekly, grouped minor/patch) are also configured in `.github/`.
- When a PR changes Vercel/Render settings, tell the user exactly what to change and when (usually right after merging).

## Conventions

- Keep comments to a minimum; only explain what the code doesn't make obvious.
- One small, reviewable PR per PLAN.md item. PR titles use Conventional Commits; PRs are squash-merged.
- `main` auto-deploys, so production must keep working.
- After each PR, update the PLAN.md status and this file (keep it short).
