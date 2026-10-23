import { PokemonModel } from '../models/pokemon.model.js';
import { escapeRegex } from '../utils/escape-regex.js';

export function findPokemonById(id: number) {
  return PokemonModel.findOne({ id }).lean();
}

export function searchPokemonByName(query: string) {
  return PokemonModel.find({ name: { $regex: escapeRegex(query), $options: 'i' } })
    .sort({ id: 1 })
    .lean();
}
