import React, { useState, useEffect } from 'react';
import InfoCard from './InfoCard';

const Screen = ({ currentId }) => {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/pokemon/${currentId}`);
        const data = await response.json();
        setPokemon(data);
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
      }
    };

    fetchPokemon();
  }, [currentId]);

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  return (
    <div className="screen">
      <InfoCard
        id={`#${pokemon.id}`}
        name={pokemon.name}
        image={pokemon.sprite}
      />
    </div>
  );
};

export default Screen;
