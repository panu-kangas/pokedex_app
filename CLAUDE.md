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
- `npm test`, `npm run test:list` (every test by name)
- `npm run seed`: re-seeds the DB

## Tests (Vitest)

See `docs/testing.md` for strategy, gaps and conventions.

- API: `apps/api/test/`, Supertest against `createApp()` with an in-memory MongoDB (`useTestDb()` + fixtures in `test/helpers.ts`). `tsconfig.build.json` keeps tests out of `dist`.
- Web: colocated `*.test.ts(x)`, jsdom + Testing Library; mock `api/client` rather than `fetch` in component tests. Fixtures in `src/test/`.

## Conventions

- Keep comments to a minimum; only explain what the code doesn't make obvious.
- One small, reviewable PR per PLAN.md item. PR titles use Conventional Commits; PRs are squash-merged.
- `main` auto-deploys, so production must keep working.
- After each PR, update the PLAN.md status and this file (keep it short).
