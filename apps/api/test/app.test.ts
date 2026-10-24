import { afterEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { PokemonModel } from '../src/models/pokemon.model.js';
import { parseCorsOrigins } from '../src/utils/cors-origins.js';
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

  it('allows CORS origins that match a wildcard pattern', async () => {
    const previews = createTestApp({
      corsOrigins: parseCorsOrigins('https://pokedex-app-*-team.vercel.app'),
    });
    const preview = 'https://pokedex-app-git-feat-x-team.vercel.app';

    const allowed = await request(previews).get('/api/health').set('Origin', preview);
    const blocked = await request(previews)
      .get('/api/health')
      .set('Origin', 'https://pokedex-app-x-other.vercel.app');

    expect(allowed.headers['access-control-allow-origin']).toBe(preview);
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
  const EDGE = '172.64.0.1';

  // In production the socket is Render's load balancer (127.0.0.1 here), which forwards
  // "X-Forwarded-For: [client-supplied..., ]<client>, <cloudflare edge>"
  const viaProxies = (app: ReturnType<typeof createTestApp>, path: string, forwardedFor: string) =>
    request(app).get(path).set('X-Forwarded-For', forwardedFor);

  it('blocks requests over the limit with a JSON 429', async () => {
    const limited = createTestApp({ rateLimitPerMinute: LIMIT });

    for (let i = 0; i < LIMIT; i++) {
      const res = await viaProxies(limited, '/api/pokemon/1', `203.0.113.1, ${EDGE}`);
      expect(res.status).toBe(200);
    }
    const blocked = await viaProxies(limited, '/api/pokemon/1', `203.0.113.1, ${EDGE}`);

    expect(blocked.status).toBe(429);
    expect(blocked.body).toEqual({ message: 'Too many requests, please try again later' });
    expect(blocked.headers['retry-after']).toBeDefined();
  });

  it('keeps the health check available after the limit is hit', async () => {
    const limited = createTestApp({ rateLimitPerMinute: LIMIT });

    for (let i = 0; i < LIMIT; i++) {
      await viaProxies(limited, '/api/pokemon/1', `203.0.113.2, ${EDGE}`);
    }
    const blocked = await viaProxies(limited, '/api/pokemon/1', `203.0.113.2, ${EDGE}`);
    const health = await viaProxies(limited, '/api/health', `203.0.113.2, ${EDGE}`);

    expect(blocked.status).toBe(429);
    expect(health.status).toBe(200);
    expect(health.headers['ratelimit-policy']).toBeUndefined();
  });

  it('counts each client IP separately', async () => {
    const limited = createTestApp({ rateLimitPerMinute: LIMIT });

    for (let i = 0; i < LIMIT; i++) {
      await viaProxies(limited, '/api/pokemon/1', `203.0.113.3, ${EDGE}`);
    }
    const blocked = await viaProxies(limited, '/api/pokemon/1', `203.0.113.3, ${EDGE}`);
    const otherClient = await viaProxies(limited, '/api/pokemon/1', `203.0.113.4, ${EDGE}`);

    expect(blocked.status).toBe(429);
    expect(otherClient.status).toBe(200);
  });

  it('counts a client once across different Cloudflare edges', async () => {
    const limited = createTestApp({ rateLimitPerMinute: LIMIT });

    for (let i = 0; i < LIMIT; i++) {
      await viaProxies(limited, '/api/pokemon/1', `203.0.113.5, 172.64.0.${i}`);
    }
    const blocked = await viaProxies(limited, '/api/pokemon/1', '203.0.113.5, 172.71.0.99');

    expect(blocked.status).toBe(429);
  });

  it('ignores client-supplied X-Forwarded-For entries', async () => {
    const limited = createTestApp({ rateLimitPerMinute: LIMIT });

    for (let i = 0; i < LIMIT; i++) {
      await viaProxies(limited, '/api/pokemon/1', `10.0.0.${i}, 203.0.113.6, ${EDGE}`);
    }
    const spoofed = await viaProxies(limited, '/api/pokemon/1', `10.0.0.99, 203.0.113.6, ${EDGE}`);

    expect(spoofed.status).toBe(429);
  });
});
