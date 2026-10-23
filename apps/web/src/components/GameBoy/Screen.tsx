import { useState, useEffect } from 'react';
import type { Pokemon } from '@pokedex/shared';
import { api } from '../../api/client';
import InfoCard from './InfoCard';
import BigInfoCard from '../BigInfoCard/BigInfoCard';
import pokeballImage from '../../assets/pokeball.png';

// Matches the .pokemon-image opacity transition in GameBoy.css
const FADE_OUT_MS = 400;

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

// Swapping <img src> before the new sprite is downloaded makes Chrome keep painting the old one
async function preloadImage(src: string): Promise<void> {
  const image = new Image();
  image.src = src;
  await image.decode();
}

async function loadPokemon(id: number, signal: AbortSignal): Promise<Pokemon> {
  const pokemon = await api.getPokemon(id, signal);
  await preloadImage(pokemon.sprite).catch(() => {});
  return pokemon;
}

interface ScreenProps {
  currentId: number;
  isBig: boolean;
}

const Screen = ({ currentId, isBig }: ScreenProps) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const idChange = pokemon !== null && pokemon.id !== currentId;

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([loadPokemon(currentId, controller.signal), wait(FADE_OUT_MS, controller.signal)])
      .then(([next]) => setPokemon(next))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) console.error('Error fetching Pokémon:', error);
      });

    return () => controller.abort();
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
