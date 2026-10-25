import type { Pokemon } from '@pokedex/shared';

export function makePokemon(overrides: Partial<Pokemon> = {}): Pokemon {
  return {
    id: 4,
    name: 'charmander',
    types: ['fire'],
    sprite: 'https://sprites.test/4.png',
    artwork: 'https://sprites.test/artwork/4.png',
    weight: 85,
    height: 6,
    stats: [
      { statName: 'hp', baseStat: 39 },
      { statName: 'attack', baseStat: 52 },
    ],
    baseStatTotal: 91,
    abilities: [{ name: 'blaze', isHidden: false }],
    genus: 'Lizard Pokémon',
    flavorText: 'Obviously prefers hot places.',
    isLegendary: false,
    isMythical: false,
    evolutionChainId: 2,
    ...overrides,
  };
}
