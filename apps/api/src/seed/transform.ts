import type { EvolutionChain, EvolutionNode, EvolutionTrigger, Pokemon } from '@pokedex/shared';
import { cleanFlavorText } from './flavor-text.js';
import type {
  PokeApiChain,
  PokeApiChainLink,
  PokeApiEvolutionDetail,
  PokeApiPokemon,
  PokeApiSpecies,
} from './pokeapi.js';

const FLAVOR_TEXT_VERSIONS = ['red', 'blue'];
const GEN_1_VERSION_GROUP = 'red-blue';

export function idFromUrl(url: string): number {
  const id = Number(url.match(/\/(\d+)\/?$/)?.[1]);
  if (!Number.isInteger(id)) throw new Error(`No id in URL: ${url}`);
  return id;
}

export function pickFlavorText(entries: PokeApiSpecies['flavor_text_entries']): string {
  const english = entries.filter((entry) => entry.language.name === 'en');
  const entry =
    FLAVOR_TEXT_VERSIONS.map((version) => english.find((e) => e.version.name === version)).find(
      Boolean,
    ) ?? english[0];
  if (!entry) throw new Error('No English flavour text');
  return entry.flavor_text;
}

export function toPokemon(pokemon: PokeApiPokemon, species: PokeApiSpecies): Pokemon {
  const genus = species.genera.find((g) => g.language.name === 'en')?.genus;
  if (!genus) throw new Error(`No English genus for #${pokemon.id}`);

  const stats = pokemon.stats.map((s) => ({ statName: s.stat.name, baseStat: s.base_stat }));

  return {
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types.map((t) => t.type.name),
    sprite: pokemon.sprites.front_default,
    artwork: pokemon.sprites.other['official-artwork'].front_default,
    weight: pokemon.weight,
    height: pokemon.height,
    stats,
    baseStatTotal: stats.reduce((sum, s) => sum + s.baseStat, 0),
    abilities: pokemon.abilities
      .toSorted((a, b) => a.slot - b.slot)
      .map((a) => ({ name: a.ability.name, isHidden: a.is_hidden })),
    genus,
    flavorText: cleanFlavorText(pickFlavorText(species.flavor_text_entries)),
    isLegendary: species.is_legendary,
    isMythical: species.is_mythical,
    evolutionChainId: idFromUrl(species.evolution_chain.url),
  };
}

// Later games add their own evolution methods; prefer how it worked in Red/Blue
export function pickTrigger(details: PokeApiEvolutionDetail[]): EvolutionTrigger | undefined {
  const detail = details.find((d) => d.version_group?.name === GEN_1_VERSION_GROUP) ?? details[0];
  if (!detail) return undefined;

  const trigger = detail.trigger.name;
  if (trigger === 'level-up' && detail.min_level != null) {
    return { method: 'level-up', minLevel: detail.min_level };
  }
  if (trigger === 'use-item' && detail.item) return { method: 'use-item', item: detail.item.name };
  if (trigger === 'trade') return { method: 'trade' };
  return { method: 'other' };
}

function toNode(link: PokeApiChainLink): EvolutionNode {
  const trigger = pickTrigger(link.evolution_details);
  return {
    pokemonId: idFromUrl(link.species.url),
    name: link.species.name,
    ...(trigger && { trigger }),
    evolvesTo: link.evolves_to.map(toNode),
  };
}

export function toEvolutionChain(chain: PokeApiChain): EvolutionChain {
  return { chainId: chain.id, root: toNode(chain.chain) };
}

function chainMemberIds(node: EvolutionNode): number[] {
  return [node.pokemonId, ...node.evolvesTo.flatMap(chainMemberIds)];
}

// Last check before anything is written: a partial or inconsistent data set must never reach the DB
export function assertCompleteSeedData(
  pokemon: Pokemon[],
  chains: EvolutionChain[],
  expectedCount: number,
): void {
  const ids = new Set(pokemon.map((p) => p.id));
  if (pokemon.length !== expectedCount || ids.size !== expectedCount) {
    throw new Error(`Expected ${expectedCount} unique Pokémon, got ${ids.size}`);
  }

  const chainsById = new Map(chains.map((c) => [c.chainId, c]));
  for (const p of pokemon) {
    const chain = chainsById.get(p.evolutionChainId);
    if (!chain) {
      throw new Error(`#${p.id} ${p.name}: evolution chain ${p.evolutionChainId} missing`);
    }
    if (!chainMemberIds(chain.root).includes(p.id)) {
      throw new Error(`#${p.id} ${p.name}: not found in evolution chain ${chain.chainId}`);
    }
  }
}
