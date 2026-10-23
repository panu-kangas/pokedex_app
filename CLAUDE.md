# CLAUDE.md

A fullstack Pokédex covering Gen I (151 Pokémon). Portfolio project, being refactored. See `PLAN.md` for the roadmap and status.

## Structure (npm workspaces)
- `apps/web`: React 19 + Vite, Chart.js, Framer Motion. Deployed on Vercel (root dir `apps/web`).
- `apps/api`: Express 5 + Mongoose (MongoDB Atlas). Deployed on Render (from the repo root).
- `apps/api/pokemonSeeder.js` seeds the DB from PokéAPI.
- Env vars: see `apps/*/.env.example`.

## Commands (from the repo root)
- `npm install`: installs all workspaces
- `npm run dev`: API on :5000 and web on :5173 together (or `dev:api` / `dev:web`)
- `npm run build`, `npm run lint`, `npm run format`
- `npm run seed`: re-seeds the DB

## Conventions
- Keep comments to a minimum; only explain what the code doesn't make obvious.
- One small, reviewable PR per PLAN.md item. PR titles use Conventional Commits; PRs are squash-merged.
- `main` auto-deploys, so production must keep working.
- After each PR, update the PLAN.md status and this file (keep it short).
