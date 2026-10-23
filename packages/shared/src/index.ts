// Types only: this package has no build step, so runtime code here would not reach the API's compiled output

export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export interface PokemonStat {
  statName: string;
  baseStat: number;
}

export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  sprite: string;
  weight: number; // hectograms
  height: number; // decimetres
  stats: PokemonStat[];
}

export type TypeCounts = Partial<Record<PokemonType, number>>;

export interface WeightDistribution {
  small: number;
  medium: number;
  large: number;
}

export interface ApiErrorBody {
  message: string;
}
