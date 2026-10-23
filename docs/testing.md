# Testing

Vitest in both apps. Run everything from the repo root:

| Command                                  | What it does                                    |
| ---------------------------------------- | ----------------------------------------------- |
| `npm test`                               | Run all tests once                              |
| `npm run test:list`                      | List every test by name (the up-to-date "spec") |
| `npm run test:watch -w apps/web`         | Watch mode for one app                          |
| `npx vitest run --root apps/api pokemon` | Run test files matching a name                  |

## Strategy

**API: integration tests over HTTP.** Supertest sends real requests to `createApp()` (no port opened) backed by an in-memory MongoDB seeded with a few fixture Pokémon. One test covers routing, validation, the database query and error handling together, the same way a client sees them. Atlas is never touched.

**Web: behaviour tests.** Testing Library renders components and interacts with them like a user (find by text, placeholder or role; type; click), never through internal state. Component tests mock the `api` client module. The client has its own tests that mock `fetch`, so each layer is tested once.

**Regression tests for fixed bugs.** Security hardening (regex injection, error leakage, CORS, headers, rate limiting) and the viewer race condition have tests that were checked by temporarily reintroducing the bug and seeing them fail.

## Not covered (on purpose)

- **Chart rendering:** jsdom has no real canvas. Chart data comes from the API, which is tested.
- **Visual and CSS behaviour** such as fades and layout. Checked manually in the browser for now.
- **Full user journeys in a real browser:** E2E tests with Playwright are planned for Phase 3.

## Conventions

- API tests live in `apps/api/test/`. `useTestDb()` and `fixtures` are in `test/helpers.ts`; call `useTestDb()` at the top of each file that needs the DB.
- Web tests sit next to the component (`Foo.test.tsx`). Shared fixtures (`makePokemon()`) are in `apps/web/src/test/`.
- Timing-dependent components use fake timers (`vi.useFakeTimers()` + `vi.advanceTimersByTimeAsync()` inside `act`).
- Test names are full sentences describing behaviour, since `test:list` output is the readable spec.
- Tests are typechecked (`npm run typecheck`) but never built into `apps/api/dist`.
