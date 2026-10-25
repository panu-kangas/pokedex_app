import { useState, type FormEvent } from 'react';
import type { Pokemon } from '@pokedex/shared';
import { api } from '../../api/client';
import ResultCard from './ResultCard';
import styles from './SearchBar.module.css';

const MAX_SEARCH_LENGTH = 30;

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
          <ResultCard key={pokemon.id} pokemon={pokemon} />
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
