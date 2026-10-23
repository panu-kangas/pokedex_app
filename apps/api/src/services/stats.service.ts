import type { PokemonType, TypeCounts, WeightDistribution } from '@pokedex/shared';
import { PokemonModel } from '../models/pokemon.model.js';

const SMALL_MAX_WEIGHT_HG = 300;
const LARGE_MIN_WEIGHT_HG = 700;

export async function countByType(): Promise<TypeCounts> {
  const rows = await PokemonModel.aggregate<{ _id: PokemonType; count: number }>([
    { $unwind: '$types' },
    { $group: { _id: '$types', count: { $sum: 1 } } },
  ]);

  return Object.fromEntries(rows.map((row) => [row._id, row.count]));
}

export async function weightDistribution(): Promise<WeightDistribution> {
  const [result] = await PokemonModel.aggregate<{ small: number; large: number; total: number }>([
    {
      $group: {
        _id: null,
        small: { $sum: { $cond: [{ $lte: ['$weight', SMALL_MAX_WEIGHT_HG] }, 1, 0] } },
        large: { $sum: { $cond: [{ $gt: ['$weight', LARGE_MIN_WEIGHT_HG] }, 1, 0] } },
        total: { $sum: 1 },
      },
    },
  ]);

  if (!result) return { small: 0, medium: 0, large: 0 };

  return {
    small: result.small,
    medium: result.total - result.small - result.large,
    large: result.large,
  };
}
