import { afterEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { PokemonModel } from '../src/models/pokemon.model.js';
import { ALLOWED_ORIGIN, createTestApp, useTestDb } from './helpers.js';

useTestDb();
const app = createTestApp();

afterEach(() => {
  vi.restoreAllMocks();
});

describe('app', () => {
  it('reports health with the database status', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', db: 'up' });
  });

  it('returns a JSON 404 for unknown routes', async () => {
    const res = await request(app).get('/api/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Not found' });
  });

  it('hides internal error details behind a generic 500', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(PokemonModel, 'findOne').mockImplementationOnce(() => {
      throw new Error('connection string leaked: mongodb://secret');
    });

    const res = await request(app).get('/api/pokemon/1');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal server error' });
    expect(JSON.stringify(res.body)).not.toContain('secret');
  });

  it('allows only configured CORS origins', async () => {
    const allowed = await request(app).get('/api/health').set('Origin', ALLOWED_ORIGIN);
    const blocked = await request(app).get('/api/health').set('Origin', 'http://evil.test');

    expect(allowed.headers['access-control-allow-origin']).toBe(ALLOWED_ORIGIN);
    expect(blocked.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('sets security headers and hides the framework', async () => {
    const res = await request(app).get('/api/health');

    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('rate limits API routes but not the health check', async () => {
    const api = await request(app).get('/api/pokemon/1');
    const health = await request(app).get('/api/health');

    expect(api.headers['ratelimit-policy']).toBeDefined();
    expect(health.headers['ratelimit-policy']).toBeUndefined();
  });
});
