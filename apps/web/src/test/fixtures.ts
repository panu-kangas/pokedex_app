import type { Pokemon } from '@pokedex/shared';

export function makePokemon(overrides: Partial<Pokemon> = {}): Pokemon {
  return {
    id: 4,
    name: 'charmander',
    types: ['fire'],
    sprite: 'https://sprites.test/4.png',
    weight: 85,
    height: 6,
    stats: [
      { statName: 'hp', baseStat: 39 },
      { statName: 'attack', baseStat: 52 },
    ],
    ...overrides,
  };
}
