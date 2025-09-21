import React, { useState } from 'react';
import typeColors from '../../types/typeConfig';
import './SearchBar.css';


const SearchBar = () => {

	const [query, setQuery] = useState("");
	const [pokemonList, setPokemonList] = useState([]);
	const [firstResult, setFirstResult] = useState(false);

	// API call then search is clicked
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

	// Create result-cards for each Pokemon found
	const renderResults = () => {
		if (!firstResult) {
			return <p className="no-results">No results yet</p>;
		}

		if (pokemonList.length === 0) {
			return <p className="no-results">Pokémon not found</p>;
		}

		return pokemonList.map((pokemon) => {

			// Set BG colors
			let bgColor = '';
			let hasTwoTypes = Array.isArray(pokemon.types) && pokemon.types.length === 2;
			if (hasTwoTypes) {
				bgColor = { 
					background: `linear-gradient(130deg, ${typeColors[pokemon.types[0]]} 50%, ${typeColors[pokemon.types[1]]} 50%)`,
				}
			}
			else {
				bgColor = { 
					backgroundColor: typeColors[pokemon.types[0]],
 				};
			}

			return (
				<div key={pokemon.name} style={ bgColor } className="result-card">
					<p>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1).toLowerCase()}</p>
					<img src={pokemon.sprite} alt={pokemon.name} />
				</div>
			)
		});
	};

	// Update query based on input
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