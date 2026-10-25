import { beforeEach, describe, expect, it } from 'vitest';
import type { EvolutionChain } from '@pokedex/shared';
import { EvolutionChainModel } from '../src/models/evolution-chain.model.js';
import { PokemonModel } from '../src/models/pokemon.model.js';
import { upsertSeedData } from '../src/seed/write.js';
import { fixtures, useTestDb } from './helpers.js';

useTestDb();

const chains: EvolutionChain[] = fixtures.map((p) => ({
  chainId: p.evolutionChainId,
  root: { pokemonId: p.id, name: p.name, evolvesTo: [] },
}));

beforeEach(async () => {
  await PokemonModel.deleteMany({});
  await EvolutionChainModel.deleteMany({});
});

describe('upsertSeedData', () => {
  it('inserts everything on the first run', async () => {
    const result = await upsertSeedData(fixtures, chains);

    expect(result.pokemon).toEqual({ matched: 0, upserted: fixtures.length });
    expect(result.chains).toEqual({ matched: 0, upserted: chains.length });
    expect(await PokemonModel.countDocuments()).toBe(fixtures.length);
  });

  it('is idempotent: a rerun updates in place without duplicates', async () => {
    await upsertSeedData(fixtures, chains);
    const changed = fixtures.map((p) => (p.id === 25 ? { ...p, genus: 'Mouse Pokémon' } : p));

    const result = await upsertSeedData(changed, chains);

    expect(result.pokemon).toEqual({ matched: fixtures.length, upserted: 0 });
    expect(await PokemonModel.countDocuments()).toBe(fixtures.length);
    expect(await EvolutionChainModel.countDocuments()).toBe(chains.length);
    expect((await PokemonModel.findOne({ id: 25 }).lean())?.genus).toBe('Mouse Pokémon');
  });

  it('writes nothing when any document is invalid', async () => {
    const invalid = fixtures.map((p, i) => (i === fixtures.length - 1 ? { ...p, types: [] } : p));

    await expect(upsertSeedData(invalid, chains)).rejects.toThrow('types');
    expect(await PokemonModel.countDocuments()).toBe(0);
    expect(await EvolutionChainModel.countDocuments()).toBe(0);
  });
});
