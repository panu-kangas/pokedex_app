import { config } from '../config.js';
import { connectDb, disconnectDb } from '../db.js';
import { pokeApi } from '../seed/pokeapi.js';
import { assertCompleteSeedData, toEvolutionChain, toPokemon } from '../seed/transform.js';
import { upsertSeedData } from '../seed/write.js';
import { mapWithConcurrency } from '../utils/map-with-concurrency.js';

const POKEMON_COUNT = 151;
const CONCURRENCY = 5;

async function seed({ dryRun }: { dryRun: boolean }) {
  const ids = Array.from({ length: POKEMON_COUNT }, (_, i) => i + 1);

  const pokemon = await mapWithConcurrency(ids, CONCURRENCY, async (id) => {
    const [data, species] = await Promise.all([pokeApi.pokemon(id), pokeApi.species(id)]);
    return toPokemon(data, species);
  });
  const chainIds = [...new Set(pokemon.map((p) => p.evolutionChainId))];
  const chains = await mapWithConcurrency(chainIds, CONCURRENCY, async (id) =>
    toEvolutionChain(await pokeApi.chain(id)),
  );
  console.log(`Fetched ${pokemon.length} Pokémon and ${chains.length} evolution chains`);

  assertCompleteSeedData(pokemon, chains, POKEMON_COUNT);

  if (dryRun) {
    console.log('Dry run: data is complete and valid, nothing was written');
    return;
  }

  await connectDb(config.mongoUri);
  const result = await upsertSeedData(pokemon, chains);
  console.log('Evolution chains:', result.chains);
  console.log('Pokémon:', result.pokemon);
}

try {
  await seed({ dryRun: process.argv.includes('--dry-run') });
} catch (err) {
  console.error('Seeding failed, the database was not changed:', err);
  process.exitCode = 1;
} finally {
  await disconnectDb();
}
