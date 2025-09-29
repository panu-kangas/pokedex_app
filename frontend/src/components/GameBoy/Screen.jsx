import React, { useState, useEffect } from 'react';
import InfoCard from './InfoCard';
import BigInfoCard from '../BigInfoCard/BigInfoCard';
import pokeballImage from '../../assets/pokeball.png';

const Screen = ({ currentId, isBig }) => {
  const [pokemon, setPokemon] = useState(null);
  const [idChange, setIdChange] = useState(false);
 
  useEffect(() => {
    const fetchPokemon = async () => {
      try {

		setIdChange(true);
		const apiKey = import.meta.env.VITE_API_KEY;

		

		const timer = setTimeout (async () => {

			const response = await fetch(`${apiKey}/api/pokemon/${currentId}`);
			const data = await response.json();
			setPokemon(data);
		  }, 400);

		  const timer2 = setTimeout (() => {
			setIdChange(false);
		  }, 700);

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

  if (!pokemon) {
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
		<div className={`info-card ${isBig ? 'card-hidden' : 'card-visible'}`}>
			<InfoCard
				id={`#${pokemon.id}`}
				name={pokemon.name}
				image={pokemon.sprite}
				type={pokemon.types}
				idChange={idChange}
			/>
		</div>
		<div className={`big-info-card-div ${!isBig ? 'card-hidden' : 'card-visible'}`}>
			<BigInfoCard pokemon={pokemon} />
		</div>
    </div>
  );
};

export default Screen;
