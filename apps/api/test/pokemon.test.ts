import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createTestApp, useTestDb } from './helpers.js';

useTestDb();
const app = createTestApp();

describe('GET /api/pokemon/:id', () => {
  it('returns the Pokémon', async () => {
    const res = await request(app).get('/api/pokemon/25');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 25, name: 'pikachu', types: ['electric'] });
  });

  it.each(['abc', '0', '-1', '1.5'])('rejects invalid id %s with 400', async (id) => {
    const res = await request(app).get(`/api/pokemon/${id}`);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid Pokémon id' });
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).get('/api/pokemon/999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Pokémon not found' });
  });
});

describe('GET /api/pokemon-search', () => {
  const search = (query: string) => request(app).get(`/api/pokemon-search${query}`);
  const names = (body: { name: string }[]) => body.map((p) => p.name);

  it('matches partial names case-insensitively, sorted by id', async () => {
    const res = await search('?name=CHAR');

    expect(res.status).toBe(200);
    expect(names(res.body)).toEqual(['charmander', 'charizard']);
  });

  it('trims surrounding whitespace', async () => {
    const res = await search('?name=%20pika%20');

    expect(names(res.body)).toEqual(['pikachu']);
  });

  it.each([
    ['.', 'regex wildcard'],
    ['(a+)+$', 'catastrophic backtracking pattern'],
    ['.*', 'match-all pattern'],
  ])('treats %s (%s) as literal text', async (input) => {
    const res = await search(`?name=${encodeURIComponent(input)}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it.each([
    ['', 'missing name'],
    ['?name=', 'empty name'],
    ['?name=%20%20', 'whitespace only'],
    [`?name=${'a'.repeat(31)}`, 'too long'],
    ['?name=a&name=b', 'repeated param'],
  ])('rejects %s (%s) with 400', async (query) => {
    const res = await search(query);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Search must be 1-30 characters' });
  });
});
