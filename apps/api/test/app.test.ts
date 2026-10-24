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
});

describe('rate limiting', () => {
  const LIMIT = 3;

  // Simulates Render's proxy, which appends the real client IP as the last X-Forwarded-For entry
  const getFrom = (limited: ReturnType<typeof createTestApp>, path: string, forwardedFor: string) =>
    request(limited).get(path).set('X-Forwarded-For', forwardedFor);

  it('blocks requests over the limit with a JSON 429', async () => {
    const limited = createTestApp({ rateLimitPerMinute: LIMIT });

    for (let i = 0; i < LIMIT; i++) {
      const res = await getFrom(limited, '/api/pokemon/1', '203.0.113.1');
      expect(res.status).toBe(200);
    }
    const blocked = await getFrom(limited, '/api/pokemon/1', '203.0.113.1');

    expect(blocked.status).toBe(429);
    expect(blocked.body).toEqual({ message: 'Too many requests, please try again later' });
    expect(blocked.headers['retry-after']).toBeDefined();
  });

  it('keeps the health check available after the limit is hit', async () => {
    const limited = createTestApp({ rateLimitPerMinute: LIMIT });

    for (let i = 0; i <= LIMIT; i++) {
      await getFrom(limited, '/api/pokemon/1', '203.0.113.2');
    }
    const health = await getFrom(limited, '/api/health', '203.0.113.2');

    expect(health.status).toBe(200);
    expect(health.headers['ratelimit-policy']).toBeUndefined();
  });

  it('counts each client IP separately behind the proxy', async () => {
    const limited = createTestApp({ rateLimitPerMinute: LIMIT });

    for (let i = 0; i <= LIMIT; i++) {
      await getFrom(limited, '/api/pokemon/1', '203.0.113.3');
    }
    const blocked = await getFrom(limited, '/api/pokemon/1', '203.0.113.3');
    const otherClient = await getFrom(limited, '/api/pokemon/1', '203.0.113.4');

    expect(blocked.status).toBe(429);
    expect(otherClient.status).toBe(200);
  });

  it('ignores client-supplied X-Forwarded-For entries', async () => {
    const limited = createTestApp({ rateLimitPerMinute: LIMIT });

    for (let i = 0; i <= LIMIT; i++) {
      await getFrom(limited, '/api/pokemon/1', `10.0.0.${i}, 203.0.113.5`);
    }
    const spoofed = await getFrom(limited, '/api/pokemon/1', '10.0.0.99, 203.0.113.5');

    expect(spoofed.status).toBe(429);
  });
});
