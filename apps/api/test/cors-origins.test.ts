import { describe, expect, it } from 'vitest';
import { parseCorsOrigins } from '../src/utils/cors-origins.js';

const PREVIEWS = 'https://pokedex-app-*-panu-kangas-projects.vercel.app';

const matches = (pattern: string, origin: string) =>
  parseCorsOrigins(pattern).some((allowed) =>
    typeof allowed === 'string' ? allowed === origin : allowed.test(origin),
  );

describe('parseCorsOrigins', () => {
  it('splits a comma-separated list and keeps exact origins as strings', () => {
    expect(parseCorsOrigins(' http://localhost:5173, https://example.com ,')).toEqual([
      'http://localhost:5173',
      'https://example.com',
    ]);
  });

  it('matches Vercel preview deployments with a wildcard origin', () => {
    expect(
      matches(PREVIEWS, 'https://pokedex-app-git-feat-x-panu-kangas-projects.vercel.app'),
    ).toBe(true);
    expect(matches(PREVIEWS, 'https://pokedex-app-a1b2c3d4e-panu-kangas-projects.vercel.app')).toBe(
      true,
    );
  });

  it('does not let a wildcard match other hosts', () => {
    expect(matches(PREVIEWS, 'https://pokedex-app-x-someone-else.vercel.app')).toBe(false);
    expect(
      matches(PREVIEWS, 'https://pokedex-app-x.evil.test-panu-kangas-projects.vercel.app'),
    ).toBe(false);
    expect(
      matches(PREVIEWS, 'https://pokedex-app-x-panu-kangas-projects.vercel.app.evil.test'),
    ).toBe(false);
    expect(matches(PREVIEWS, 'http://pokedex-app-x-panu-kangas-projects.vercel.app')).toBe(false);
  });
});
