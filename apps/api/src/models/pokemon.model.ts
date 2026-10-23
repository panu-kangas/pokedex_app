import { Schema, model } from 'mongoose';
import type { Pokemon, PokemonStat } from '@pokedex/shared';

const statSchema = new Schema<PokemonStat>(
  {
    statName: { type: String, required: true },
    baseStat: { type: Number, required: true },
  },
  { _id: false },
);

const pokemonSchema = new Schema<Pokemon>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  types: { type: [String], required: true },
  sprite: { type: String, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  stats: { type: [statSchema], required: true },
});

export const PokemonModel = model<Pokemon>('Pokemon', pokemonSchema);
