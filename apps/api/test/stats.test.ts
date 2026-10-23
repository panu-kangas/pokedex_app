import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createTestApp, useTestDb } from './helpers.js';

useTestDb();
const app = createTestApp();

describe('GET /api/types-count', () => {
  it('counts every type of dual-type Pokémon', async () => {
    const res = await request(app).get('/api/types-count');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      grass: 1,
      poison: 1,
      fire: 2,
      flying: 1,
      electric: 1,
      psychic: 1,
      normal: 1,
    });
  });
});

describe('GET /api/weight-dist', () => {
  it('buckets by weight: small <= 30 kg < medium <= 70 kg < large', async () => {
    const res = await request(app).get('/api/weight-dist');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ small: 3, medium: 1, large: 2 });
  });
});
