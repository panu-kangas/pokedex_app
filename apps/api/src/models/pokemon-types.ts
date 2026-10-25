import type { PokemonType } from '@pokedex/shared';

// A Record keyed by PokemonType makes the compiler flag a missing or misspelled type
const typeSet: Record<PokemonType, true> = {
  normal: true,
  fire: true,
  water: true,
  electric: true,
  grass: true,
  ice: true,
  fighting: true,
  poison: true,
  ground: true,
  flying: true,
  psychic: true,
  bug: true,
  rock: true,
  ghost: true,
  dragon: true,
  dark: true,
  steel: true,
  fairy: true,
};

export const POKEMON_TYPES = Object.keys(typeSet) as [PokemonType, ...PokemonType[]];
