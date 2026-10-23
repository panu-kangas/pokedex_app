import { useState, useEffect } from 'react';
import type { Pokemon } from '@pokedex/shared';
import { api } from '../../api/client';
import InfoCard from './InfoCard';
import BigInfoCard from '../BigInfoCard/BigInfoCard';
import pokeballImage from '../../assets/pokeball.png';

// Lets the current image fade out before the next Pokémon replaces it
const FETCH_DELAY_MS = 400;

interface ScreenProps {
  currentId: number;
  isBig: boolean;
}

const Screen = ({ currentId, isBig }: ScreenProps) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const idChange = pokemon !== null && pokemon.id !== currentId;

  useEffect(() => {
    const controller = new AbortController();

    const fetchTimer = setTimeout(() => {
      api
        .getPokemon(currentId, controller.signal)
        .then(setPokemon)
        .catch((error: unknown) => {
          if (!controller.signal.aborted) console.error('Error fetching Pokémon:', error);
        });
    }, FETCH_DELAY_MS);

    return () => {
      controller.abort();
      clearTimeout(fetchTimer);
    };
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
