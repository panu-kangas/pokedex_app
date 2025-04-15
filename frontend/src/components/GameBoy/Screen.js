import React, { useState, useEffect } from 'react';
import InfoCard from './InfoCard';
import pokeballImage from '../../assets/pokeball.png';

const Screen = ({ currentId }) => {
  const [pokemon, setPokemon] = useState(null);
  const [idChange, setIdChange] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {

		setIdChange(true);

		const timer = setTimeout (async () => {

			const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pokemon/${currentId}`);
			const data = await response.json();
			setPokemon(data);
		  }, 300);

		  const timer2 = setTimeout (() => {
			setIdChange(false);
		  }, 600);

		  return () => {
			clearTimeout(timer);
			clearTimeout(timer2);
		  };

		  
		} catch (error) {
        console.error('Error fetching Pokémon:', error);
      }
    };

    fetchPokemon();
  }, [currentId]);

  if (!pokemon || pokemon) {
    return (
	<div className="screen">
		<div className="pokeball ball1" style={{ backgroundImage: `url(${pokeballImage})` }}></div>
		<div className="pokeball ball2" style={{ backgroundImage: `url(${pokeballImage})` }}></div>

		<div className="load-text-div">
			<span className="load-text">Loading</span>
			<span className="dot dot1">.</span>
			<span className="dot dot2">.</span>
			<span className="dot dot3">.</span>
			<br/><br/>
			This might take some time,
			<br/>max 50 seconds... 
			<br/>
			The backend is sleeping like a Snorlax...
		</div>
	</div>
);
  }

  return (
    <div className="screen">
      <InfoCard
        id={`#${pokemon.id}`}
        name={pokemon.name}
        image={pokemon.sprite}
		type={pokemon.types}
		idChange={idChange}
      />
    </div>
  );
};

export default Screen;
