import { afterAll, beforeAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import type { Pokemon } from '@pokedex/shared';
import { createApp, type AppOptions } from '../src/app.js';
import { PokemonModel } from '../src/models/pokemon.model.js';

export const ALLOWED_ORIGIN = 'http://allowed.test';

export function createTestApp(options: Partial<AppOptions> = {}) {
  return createApp({ corsOrigins: [ALLOWED_ORIGIN], ...options });
}

function makePokemon(
  fields: Pick<Pokemon, 'id' | 'name' | 'types' | 'weight' | 'height'> & { hp: number },
): Pokemon {
  const { hp, ...rest } = fields;
  return {
    ...rest,
    sprite: `s${fields.id}`,
    artwork: `a${fields.id}`,
    stats: [
      { statName: 'hp', baseStat: hp },
      { statName: 'attack', baseStat: 50 },
    ],
    baseStatTotal: hp + 50,
    abilities: [{ name: 'test-ability', isHidden: false }],
    genus: 'Test Pokémon',
    flavorText: 'A Pokémon used in tests.',
    isLegendary: false,
    isMythical: false,
    evolutionChainId: fields.id,
  };
}

export const fixtures: Pokemon[] = [
  makePokemon({
    id: 1,
    name: 'bulbasaur',
    types: ['grass', 'poison'],
    weight: 69,
    height: 7,
    hp: 45,
  }),
  makePokemon({ id: 4, name: 'charmander', types: ['fire'], weight: 85, height: 6, hp: 39 }),
  makePokemon({
    id: 6,
    name: 'charizard',
    types: ['fire', 'flying'],
    weight: 905,
    height: 17,
    hp: 78,
  }),
  makePokemon({ id: 25, name: 'pikachu', types: ['electric'], weight: 60, height: 4, hp: 35 }),
  makePokemon({ id: 64, name: 'kadabra', types: ['psychic'], weight: 565, height: 13, hp: 40 }),
  makePokemon({ id: 143, name: 'snorlax', types: ['normal'], weight: 4600, height: 21, hp: 160 }),
];

export function useTestDb() {
  let server: MongoMemoryServer;

  beforeAll(async () => {
    server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
    await PokemonModel.insertMany(fixtures);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await server.stop();
  });
}
