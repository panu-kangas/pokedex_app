import { useState, type ChangeEvent, type CSSProperties } from 'react';
import type { Pokemon } from '@pokedex/shared';
import { api } from '../../api/client';
import typeColors from '../../constants/typeColors';
import './SearchBar.css';

const MAX_SEARCH_LENGTH = 30;

function cardBackground(pokemon: Pokemon): CSSProperties {
  const [type1, type2] = pokemon.types;
  if (type1 && type2) {
    return {
      background: `linear-gradient(130deg, ${typeColors[type1]} 50%, ${typeColors[type2]} 50%)`,
    };
  }
  return { backgroundColor: type1 ? typeColors[type1] : undefined };
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [firstResult, setFirstResult] = useState(false);

  const clickSearch = async () => {
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
      return <p className="no-results">No results yet</p>;
    }

    if (pokemonList.length === 0) {
      return <p className="no-results">Pokémon not found</p>;
    }

    return pokemonList.map((pokemon) => (
      <div key={pokemon.id} style={cardBackground(pokemon)} className="result-card">
        <p>
          {'#' + pokemon.id}
          <br />
          {capitalize(pokemon.name)}
        </p>
        <img src={pokemon.sprite} alt={pokemon.name} />
      </div>
    ));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className="search-bar-div">
      <input
        className="input-field"
        type="text"
        value={query}
        onChange={handleInputChange}
        maxLength={MAX_SEARCH_LENGTH}
        placeholder="Type Pokémon name..."
      />

      <br />

      <button className="search-button" onClick={clickSearch}>
        Search
      </button>

      <div className="results-div">{renderResults()}</div>
    </div>
  );
};

export default SearchBar;
