import React, { useState } from 'react';
import './SearchBar.css';


const SearchBar = () => {

	const [query, setQuery] = useState("");
	const [pokemonList, setPokemonList] = useState([]);
	const [firstResult, setFirstResult] = useState(false);

	const clickSearch = async () => {
		if (query.length === 0) {
			setPokemonList([]);
			return;
		}

		try {
			const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pokemon-search?name=${encodeURIComponent(query)}`);
			const data = await response.json();
			setPokemonList(data);
			setFirstResult(true);
		} catch (error) {
        console.error('Error fetching Pokémon:', error);
      }
	}


	const renderResults = () => {
		if (!firstResult) {
			return <p className="no-results">No results yet</p>;
		}

		if (pokemonList.length === 0) {
			return <p className="no-results">Pokémon not found</p>;
		}

		return pokemonList.map((pokemon) => (
			<div key={pokemon.name} className="result-card">
				<p>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1).toLowerCase()}</p>
				<img src={pokemon.sprite} alt={pokemon.name} />
			</div>
		));
	};

	

	const handleInputChange = (event) => {
    	setQuery(event.target.value);
  	};

	return (
		<div className='search-bar-div'>

			<input
			className='input-field'
			type="text"
			value={query}
			onChange={handleInputChange}
			placeholder="Type Pokémon name..."
			/>

			<br/>

			<button 
			className='search-button'
			onClick={clickSearch}
			>Search</button>

			<div className='results-div'>
				{renderResults()}
			</div>

		</div>
	)
};


export default SearchBar;