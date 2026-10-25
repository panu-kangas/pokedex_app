import { z } from 'zod';
import { POKEMON_TYPES } from '../models/pokemon-types.js';

const BASE_URL = 'https://pokeapi.co/api/v2';
const MAX_RETRY_DELAY_MS = 30_000;

const named = z.object({ name: z.string(), url: z.string() });

export const pokeApiPokemonSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  weight: z.number(),
  height: z.number(),
  types: z.array(z.object({ type: z.object({ name: z.enum(POKEMON_TYPES) }) })).min(1),
  sprites: z.object({
    front_default: z.string(),
    other: z.object({ 'official-artwork': z.object({ front_default: z.string() }) }),
  }),
  stats: z.array(z.object({ base_stat: z.number(), stat: named })).min(1),
  abilities: z.array(z.object({ ability: named, is_hidden: z.boolean(), slot: z.number() })).min(1),
});

export const pokeApiSpeciesSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  genera: z.array(z.object({ genus: z.string(), language: named })),
  flavor_text_entries: z.array(
    z.object({ flavor_text: z.string(), language: named, version: named }),
  ),
  is_legendary: z.boolean(),
  is_mythical: z.boolean(),
  evolution_chain: z.object({ url: z.string() }),
});

const evolutionDetailSchema = z.object({
  trigger: named,
  min_level: z.number().nullish(),
  item: named.nullish(),
  version_group: named.nullish(),
});

export interface PokeApiChainLink {
  species: z.infer<typeof named>;
  evolution_details: z.infer<typeof evolutionDetailSchema>[];
  evolves_to: PokeApiChainLink[];
}

const chainLinkSchema: z.ZodType<PokeApiChainLink> = z.lazy(() =>
  z.object({
    species: named,
    evolution_details: z.array(evolutionDetailSchema),
    evolves_to: z.array(chainLinkSchema),
  }),
);

export const pokeApiChainSchema = z.object({ id: z.number().int(), chain: chainLinkSchema });

export type PokeApiPokemon = z.infer<typeof pokeApiPokemonSchema>;
export type PokeApiSpecies = z.infer<typeof pokeApiSpeciesSchema>;
export type PokeApiChain = z.infer<typeof pokeApiChainSchema>;
export type PokeApiEvolutionDetail = z.infer<typeof evolutionDetailSchema>;

export interface FetchOptions {
  retries?: number;
  baseDelayMs?: number;
  timeoutMs?: number;
  fetchFn?: typeof fetch;
}

class RetryableError extends Error {
  constructor(
    message: string,
    readonly retryAfterMs?: number,
  ) {
    super(message);
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function retryAfterMs(response: Response): number | undefined {
  const seconds = Number(response.headers.get('retry-after'));
  return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : undefined;
}

async function fetchOnce(url: string, timeoutMs: number, fetchFn: typeof fetch): Promise<unknown> {
  let response: Response;
  try {
    response = await fetchFn(url, { signal: AbortSignal.timeout(timeoutMs) });
  } catch (err) {
    // Network failures and timeouts are worth retrying
    throw new RetryableError(`${url}: ${(err as Error).message}`);
  }

  if (response.status === 429 || response.status >= 500) {
    throw new RetryableError(`${url}: HTTP ${response.status}`, retryAfterMs(response));
  }
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);

  return response.json();
}

export async function fetchJson<T>(
  url: string,
  schema: z.ZodType<T>,
  { retries = 3, baseDelayMs = 1000, timeoutMs = 10_000, fetchFn = fetch }: FetchOptions = {},
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return schema.parse(await fetchOnce(url, timeoutMs, fetchFn));
    } catch (err) {
      if (!(err instanceof RetryableError) || attempt >= retries) throw err;
      const delay = Math.max(baseDelayMs * 2 ** attempt, err.retryAfterMs ?? 0);
      await sleep(Math.min(delay, MAX_RETRY_DELAY_MS));
    }
  }
}

export const pokeApi = {
  pokemon: (id: number, options?: FetchOptions) =>
    fetchJson(`${BASE_URL}/pokemon/${id}`, pokeApiPokemonSchema, options),
  species: (id: number, options?: FetchOptions) =>
    fetchJson(`${BASE_URL}/pokemon-species/${id}`, pokeApiSpeciesSchema, options),
  chain: (id: number, options?: FetchOptions) =>
    fetchJson(`${BASE_URL}/evolution-chain/${id}`, pokeApiChainSchema, options),
};
