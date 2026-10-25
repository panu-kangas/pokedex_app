import { Schema, model } from 'mongoose';
import type { Pokemon, PokemonAbility, PokemonStat } from '@pokedex/shared';
import { POKEMON_TYPES } from './pokemon-types.js';

const statSchema = new Schema<PokemonStat>(
  {
    statName: { type: String, required: true },
    baseStat: { type: Number, required: true },
  },
  { _id: false },
);

const abilitySchema = new Schema<PokemonAbility>(
  {
    name: { type: String, required: true },
    isHidden: { type: Boolean, required: true },
  },
  { _id: false },
);

const nonEmpty = { validator: (value: unknown[]) => value.length > 0, message: '{PATH} is empty' };

const pokemonSchema = new Schema<Pokemon>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  types: { type: [{ type: String, enum: POKEMON_TYPES }], validate: nonEmpty, index: true },
  sprite: { type: String, required: true },
  artwork: { type: String, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  stats: { type: [statSchema], validate: nonEmpty },
  baseStatTotal: { type: Number, required: true, index: true },
  abilities: { type: [abilitySchema], validate: nonEmpty },
  genus: { type: String, required: true },
  flavorText: { type: String, required: true },
  isLegendary: { type: Boolean, required: true },
  isMythical: { type: Boolean, required: true },
  evolutionChainId: { type: Number, required: true, index: true },
});

export const PokemonModel = model<Pokemon>('Pokemon', pokemonSchema);
