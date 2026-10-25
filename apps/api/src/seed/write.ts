import type { EvolutionChain, Pokemon } from '@pokedex/shared';
import { EvolutionChainModel } from '../models/evolution-chain.model.js';
import { PokemonModel } from '../models/pokemon.model.js';

// No modifiedCount: replaceOne reports every matched document as modified, even when unchanged
export interface WriteSummary {
  matched: number;
  upserted: number;
}

// replaceOne + upsert makes reruns idempotent and never leaves the collection empty
export async function upsertSeedData(
  pokemon: Pokemon[],
  chains: EvolutionChain[],
): Promise<{ chains: WriteSummary; pokemon: WriteSummary }> {
  await Promise.all([
    ...chains.map((c) => new EvolutionChainModel(c).validate()),
    ...pokemon.map((p) => new PokemonModel(p).validate()),
  ]);

  const chainResult = await EvolutionChainModel.bulkWrite(
    chains.map((c) => ({
      replaceOne: { filter: { chainId: c.chainId }, replacement: c, upsert: true },
    })),
  );
  const pokemonResult = await PokemonModel.bulkWrite(
    pokemon.map((p) => ({ replaceOne: { filter: { id: p.id }, replacement: p, upsert: true } })),
  );

  const summary = (r: typeof chainResult): WriteSummary => ({
    matched: r.matchedCount,
    upserted: r.upsertedCount,
  });
  return { chains: summary(chainResult), pokemon: summary(pokemonResult) };
}
