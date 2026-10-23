# CLAUDE.md

A fullstack Pokédex covering Gen I (151 Pokémon). Portfolio project, being refactored. See `PLAN.md` for the roadmap and status.

## Stack (current)
- `frontend/`: React 19 + Vite, Chart.js, Framer Motion. Deployed on Vercel.
- `backend/`: Express 5 + Mongoose (MongoDB Atlas). Deployed on Render.
- `backend/pokemonSeeder.js` seeds the DB from PokéAPI.

## Commands
- Frontend: `cd frontend && npm run dev`
- Backend: `cd backend && npm start` (needs `MONGO_URI` in `.env`)
- Seed: `cd backend && node pokemonSeeder.js`

## Conventions
- Keep comments to a minimum; only explain what the code doesn't make obvious.
- One small, reviewable PR per PLAN.md item. `main` auto-deploys, so production must keep working.
- After each PR, update the PLAN.md status and this file (keep it short).
