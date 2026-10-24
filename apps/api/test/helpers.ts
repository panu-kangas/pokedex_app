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

const stats = (hp: number) => [
  { statName: 'hp', baseStat: hp },
  { statName: 'attack', baseStat: 50 },
];

export const fixtures: Pokemon[] = [
  {
    id: 1,
    name: 'bulbasaur',
    types: ['grass', 'poison'],
    sprite: 's1',
    weight: 69,
    height: 7,
    stats: stats(45),
  },
  {
    id: 4,
    name: 'charmander',
    types: ['fire'],
    sprite: 's4',
    weight: 85,
    height: 6,
    stats: stats(39),
  },
  {
    id: 6,
    name: 'charizard',
    types: ['fire', 'flying'],
    sprite: 's6',
    weight: 905,
    height: 17,
    stats: stats(78),
  },
  {
    id: 25,
    name: 'pikachu',
    types: ['electric'],
    sprite: 's25',
    weight: 60,
    height: 4,
    stats: stats(35),
  },
  {
    id: 64,
    name: 'kadabra',
    types: ['psychic'],
    sprite: 's64',
    weight: 565,
    height: 13,
    stats: stats(40),
  },
  {
    id: 143,
    name: 'snorlax',
    types: ['normal'],
    sprite: 's143',
    weight: 4600,
    height: 21,
    stats: stats(160),
  },
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
