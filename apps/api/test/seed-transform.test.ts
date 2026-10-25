import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import type { z } from 'zod';
import type { EvolutionChain, Pokemon } from '@pokedex/shared';
import {
  pokeApiChainSchema,
  pokeApiPokemonSchema,
  pokeApiSpeciesSchema,
} from '../src/seed/pokeapi.js';
import {
  assertCompleteSeedData,
  idFromUrl,
  pickFlavorText,
  toEvolutionChain,
  toPokemon,
} from '../src/seed/transform.js';

// cleanFlavorText has its own tests; here we only check that toPokemon uses it
vi.mock('../src/seed/flavor-text.js', () => ({
  cleanFlavorText: (text: string) => `cleaned: ${text}`,
}));

// Real (trimmed) PokéAPI responses, parsed with the same schemas the seeder uses
const load = <T>(name: string, schema: z.ZodType<T>) =>
  schema.parse(
    JSON.parse(readFileSync(new URL(`fixtures/pokeapi/${name}.json`, import.meta.url), 'utf8')),
  );

const eevee = load('pokemon-133', pokeApiPokemonSchema);
const eeveeSpecies = load('pokemon-species-133', pokeApiSpeciesSchema);
const eeveeChain = toEvolutionChain(load('evolution-chain-67', pokeApiChainSchema));
const pikachuChain = toEvolutionChain(load('evolution-chain-10', pokeApiChainSchema));
const tyrogueChain = toEvolutionChain(load('evolution-chain-47', pokeApiChainSchema));

const entry = (language: string, version: string, text: string) => ({
  flavor_text: text,
  language: { name: language, url: '' },
  version: { name: version, url: '' },
});

describe('toPokemon', () => {
  it('maps PokéAPI data to our Pokémon shape', () => {
    const pokemon = toPokemon(eevee, eeveeSpecies);

    expect(pokemon).toMatchObject({
      id: 133,
      name: 'eevee',
      types: ['normal'],
      artwork: expect.stringContaining('official-artwork/133.png'),
      baseStatTotal: 325,
      genus: 'Evolution Pokémon',
      isLegendary: false,
      isMythical: false,
      evolutionChainId: 67,
    });
    expect(pokemon.abilities).toEqual([
      { name: 'run-away', isHidden: false },
      { name: 'adaptability', isHidden: false },
      { name: 'anticipation', isHidden: true },
    ]);
  });

  it('cleans the Red flavour text', () => {
    expect(toPokemon(eevee, eeveeSpecies).flavorText).toMatch(/^cleaned: Its genetic code/);
  });
});

describe('pickFlavorText', () => {
  it('prefers Red, then Blue, then any English entry', () => {
    const ja = entry('ja', 'red', 'japanese');

    expect(pickFlavorText([ja, entry('en', 'blue', 'blue'), entry('en', 'red', 'red')])).toBe(
      'red',
    );
    expect(pickFlavorText([ja, entry('en', 'gold', 'gold'), entry('en', 'blue', 'blue')])).toBe(
      'blue',
    );
    expect(pickFlavorText([ja, entry('en', 'gold', 'gold')])).toBe('gold');
  });

  it('fails when there is no English entry', () => {
    expect(() => pickFlavorText([entry('ja', 'red', 'japanese')])).toThrow(
      'No English flavour text',
    );
  });
});

describe('toEvolutionChain', () => {
  it('keeps branching chains complete, including later-generation evolutions', () => {
    const { root } = eeveeChain;

    expect(root).toMatchObject({ pokemonId: 133, name: 'eevee' });
    expect(root.trigger).toBeUndefined();
    expect(root.evolvesTo.map((n) => n.pokemonId)).toEqual([
      134, 135, 136, 196, 197, 470, 471, 700,
    ]);
  });

  it('uses the Red/Blue evolution method when the games disagree', () => {
    const [vaporeon] = eeveeChain.root.evolvesTo;
    const raichu = pikachuChain.root.evolvesTo[0]?.evolvesTo[0];

    expect(vaporeon?.trigger).toEqual({ method: 'use-item', item: 'water-stone' });
    expect(raichu?.trigger).toEqual({ method: 'use-item', item: 'thunder-stone' });
  });

  it('maps level-ups with a level and treats other methods as "other"', () => {
    const hitmonlee = tyrogueChain.root.evolvesTo[0];
    const espeon = eeveeChain.root.evolvesTo.find((n) => n.name === 'espeon');

    expect(hitmonlee?.trigger).toEqual({ method: 'level-up', minLevel: 20 });
    expect(espeon?.trigger).toEqual({ method: 'other' });
  });

  it('keeps a later-generation pre-evolution as the root', () => {
    expect(pikachuChain.root).toMatchObject({ pokemonId: 172, name: 'pichu' });
    expect(pikachuChain.root.evolvesTo[0]?.pokemonId).toBe(25);
  });
});

describe('idFromUrl', () => {
  it('reads the trailing id with or without a slash', () => {
    expect(idFromUrl('https://pokeapi.co/api/v2/evolution-chain/67/')).toBe(67);
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon/25')).toBe(25);
    expect(() => idFromUrl('https://pokeapi.co/api/v2/pokemon/')).toThrow('No id in URL');
  });
});

describe('assertCompleteSeedData', () => {
  const pokemon = (id: number, evolutionChainId: number) =>
    ({ id, name: `p${id}`, evolutionChainId }) as Pokemon;
  const chain = (chainId: number, ...ids: number[]): EvolutionChain => ({
    chainId,
    root: {
      pokemonId: ids[0] ?? 0,
      name: 'root',
      evolvesTo: ids.slice(1).map((id) => ({ pokemonId: id, name: `p${id}`, evolvesTo: [] })),
    },
  });

  it('accepts a complete, consistent data set', () => {
    expect(() =>
      assertCompleteSeedData([pokemon(1, 1), pokemon(2, 1)], [chain(1, 1, 2)], 2),
    ).not.toThrow();
  });

  it('rejects missing or duplicate Pokémon', () => {
    expect(() => assertCompleteSeedData([pokemon(1, 1)], [chain(1, 1)], 2)).toThrow(
      'Expected 2 unique',
    );
    expect(() => assertCompleteSeedData([pokemon(1, 1), pokemon(1, 1)], [chain(1, 1)], 2)).toThrow(
      'Expected 2 unique',
    );
  });

  it('rejects a missing chain or a Pokémon absent from its chain', () => {
    expect(() => assertCompleteSeedData([pokemon(1, 9)], [chain(1, 1)], 1)).toThrow(
      'chain 9 missing',
    );
    expect(() => assertCompleteSeedData([pokemon(2, 1)], [chain(1, 1)], 1)).toThrow(
      'not found in evolution chain 1',
    );
  });
});
