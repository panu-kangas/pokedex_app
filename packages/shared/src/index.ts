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

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
}

export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  sprite: string;
  artwork: string;
  weight: number; // hectograms
  height: number; // decimetres
  stats: PokemonStat[];
  baseStatTotal: number;
  abilities: PokemonAbility[];
  genus: string;
  flavorText: string;
  isLegendary: boolean;
  isMythical: boolean;
  evolutionChainId: number;
}

export type EvolutionMethod = 'level-up' | 'use-item' | 'trade' | 'other';

export interface EvolutionTrigger {
  method: EvolutionMethod;
  minLevel?: number;
  item?: string;
}

// Chains are stored complete, so pokemonId can point outside Gen I (e.g. Pichu, #172)
export interface EvolutionNode {
  pokemonId: number;
  name: string;
  trigger?: EvolutionTrigger;
  evolvesTo: EvolutionNode[];
}

export interface EvolutionChain {
  chainId: number;
  root: EvolutionNode;
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
