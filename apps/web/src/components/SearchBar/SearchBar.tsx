import { useState, type CSSProperties, type FormEvent } from 'react';
import type { Pokemon } from '@pokedex/shared';
import { api } from '../../api/client';
import typeColors from '../../constants/typeColors';
import TypeBadge from '../TypeBadge/TypeBadge';
import styles from './SearchBar.module.css';

const MAX_SEARCH_LENGTH = 30;

function cardColors(pokemon: Pokemon): CSSProperties {
  const [type1, type2] = pokemon.types;
  const first = type1 ? typeColors[type1] : '#777';
  return { '--type-1': first, '--type-2': type2 ? typeColors[type2] : first } as CSSProperties;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [firstResult, setFirstResult] = useState(false);

  const search = async (event: FormEvent) => {
    event.preventDefault();
    if (query.trim().length === 0) {
      setPokemonList([]);
      return;
    }

    try {
      setPokemonList(await api.searchPokemon(query));
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
      setPokemonList([]);
    }
    setFirstResult(true);
  };

  const renderResults = () => {
    if (!firstResult) {
      return <p className={styles.message}>No results yet</p>;
    }

    if (pokemonList.length === 0) {
      return <p className={styles.message}>Pokémon not found</p>;
    }

    return (
      <ul className={styles.results}>
        {pokemonList.map((pokemon) => (
          <li key={pokemon.id} className={styles.card} style={cardColors(pokemon)}>
            <img src={pokemon.sprite} alt={pokemon.name} width={96} height={96} />
            <span className={styles.number}>#{String(pokemon.id).padStart(3, '0')}</span>
            <span className={styles.name}>{capitalize(pokemon.name)}</span>
            <span className={styles.types}>
              {pokemon.types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={styles.search}>
      <form className={styles.form} role="search" onSubmit={search}>
        <input
          className={styles.input}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          maxLength={MAX_SEARCH_LENGTH}
          placeholder="Type Pokémon name..."
          aria-label="Pokémon name"
        />
        <button className={styles.button} type="submit">
          Search
        </button>
      </form>
      {renderResults()}
    </div>
  );
};

export default SearchBar;
