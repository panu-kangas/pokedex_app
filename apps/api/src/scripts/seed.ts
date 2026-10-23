import { config } from '../config.js';
import { connectDb, disconnectDb } from '../db.js';
import { PokemonModel, type Pokemon } from '../models/pokemon.model.js';

const POKEMON_COUNT = 151;

interface PokeApiPokemon {
  id: number;
  name: string;
  weight: number;
  height: number;
  types: { type: { name: string } }[];
  sprites: { front_default: string };
  stats: { base_stat: number; stat: { name: string } }[];
}

async function fetchPokemon(id: number): Promise<Pokemon> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!response.ok) throw new Error(`PokéAPI returned ${response.status} for #${id}`);
  const data = (await response.json()) as PokeApiPokemon;

  return {
    id: data.id,
    name: data.name,
    types: data.types.map((t) => t.type.name),
    sprite: data.sprites.front_default,
    weight: data.weight,
    height: data.height,
    stats: data.stats.map((s) => ({ statName: s.stat.name, baseStat: s.base_stat })),
  };
}

async function seed() {
  await connectDb(config.mongoUri);

  const pokemon: Pokemon[] = [];
  for (let id = 1; id <= POKEMON_COUNT; id++) {
    pokemon.push(await fetchPokemon(id));
    console.log(`Loaded #${id} ${pokemon.at(-1)?.name}`);
  }

  await PokemonModel.deleteMany({});
  await PokemonModel.insertMany(pokemon);
  console.log(`Seeded ${pokemon.length} Pokémon`);
}

try {
  await seed();
} catch (err) {
  console.error('Seeding failed:', err);
  process.exitCode = 1;
} finally {
  await disconnectDb();
}
