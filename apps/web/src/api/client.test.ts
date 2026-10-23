import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { api, ApiError } from './client';
import { makePokemon } from '../test/fixtures';

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('api client', () => {
  it('requests the API URL and returns the parsed body', async () => {
    const pokemon = makePokemon();
    fetchMock.mockResolvedValue(jsonResponse(pokemon));

    await expect(api.getPokemon(4)).resolves.toEqual(pokemon);
    expect(fetchMock).toHaveBeenCalledWith('http://api.test/api/pokemon/4', { signal: undefined });
  });

  it('URL-encodes search input', async () => {
    fetchMock.mockResolvedValue(jsonResponse([]));

    await api.searchPokemon('mr. mime&x=1');

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      'http://api.test/api/pokemon-search?name=mr.%20mime%26x%3D1',
    );
  });

  it('throws ApiError with the server message on error responses', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'Pokémon not found' }, 404));

    const error = await api.getPokemon(999).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, message: 'Pokémon not found' });
  });

  it('falls back to a generic message when the error body is not JSON', async () => {
    fetchMock.mockResolvedValue(new Response('Bad gateway', { status: 502 }));

    await expect(api.getTypeCounts()).rejects.toMatchObject({
      status: 502,
      message: 'Request failed (502)',
    });
  });

  it('passes the abort signal to fetch', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ small: 0, medium: 0, large: 0 }));
    const controller = new AbortController();

    await api.getWeightDistribution(controller.signal);

    expect(fetchMock.mock.calls[0]?.[1]).toEqual({ signal: controller.signal });
  });
});
