import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { fetchJson } from '../src/seed/pokeapi.js';

const schema = z.object({ id: z.number() });
const ok = () => new Response(JSON.stringify({ id: 1 }), { status: 200 });
const status = (code: number, headers?: Record<string, string>) =>
  new Response('', { status: code, headers });

const noDelay = { baseDelayMs: 0 };

afterEach(() => {
  vi.useRealTimers();
});

describe('fetchJson', () => {
  it('returns the validated body', async () => {
    const fetchFn = vi.fn().mockResolvedValue(ok());

    await expect(fetchJson('https://api.test/1', schema, { fetchFn })).resolves.toEqual({ id: 1 });
  });

  it('retries server errors, rate limits and network failures', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(status(503))
      .mockResolvedValueOnce(status(429))
      .mockRejectedValueOnce(new TypeError('fetch failed'))
      .mockResolvedValueOnce(ok());

    await expect(fetchJson('https://api.test/1', schema, { ...noDelay, fetchFn })).resolves.toEqual(
      {
        id: 1,
      },
    );
    expect(fetchFn).toHaveBeenCalledTimes(4);
  });

  it('gives up after the configured number of retries', async () => {
    const fetchFn = vi.fn().mockResolvedValue(status(500));

    await expect(
      fetchJson('https://api.test/1', schema, { ...noDelay, retries: 2, fetchFn }),
    ).rejects.toThrow('HTTP 500');
    expect(fetchFn).toHaveBeenCalledTimes(3);
  });

  it('fails immediately on other client errors', async () => {
    const fetchFn = vi.fn().mockResolvedValue(status(404));

    await expect(fetchJson('https://api.test/1', schema, { ...noDelay, fetchFn })).rejects.toThrow(
      'HTTP 404',
    );
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('fails immediately when the response does not match the schema', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 'one' })));

    await expect(fetchJson('https://api.test/1', schema, { ...noDelay, fetchFn })).rejects.toThrow(
      z.ZodError,
    );
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('waits as long as Retry-After asks before retrying', async () => {
    vi.useFakeTimers();
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(status(429, { 'Retry-After': '5' }))
      .mockResolvedValueOnce(ok());

    const result = fetchJson('https://api.test/1', schema, { baseDelayMs: 1000, fetchFn });

    await vi.advanceTimersByTimeAsync(4999);
    expect(fetchFn).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    await expect(result).resolves.toEqual({ id: 1 });
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });
});
