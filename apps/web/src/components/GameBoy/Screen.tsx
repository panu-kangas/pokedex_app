import { useState, useEffect, useRef } from 'react';
import type { Pokemon } from '@pokedex/shared';
import { api } from '../../api/client';
import InfoCard from './InfoCard';
import BigInfoCard from '../BigInfoCard/BigInfoCard';
import pokeballImage from '../../assets/pokeball.png';

// Matches the .pokemon-image opacity transition in GameBoy.css
const FADE_OUT_MS = 400;
// Rapid presses only update the number; the fetch waits until they pause
const SETTLE_MS = 300;
const DECODE_TIMEOUT_MS = 1500;

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

// Swapping <img src> before the new sprite is downloaded makes Chrome keep painting the old one.
// Chrome doesn't settle decode() in tabs that aren't being painted, so stop waiting after a while.
async function preloadImage(src: string): Promise<void> {
  const image = new Image();
  image.src = src;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<void>((resolve) => {
    timer = setTimeout(resolve, DECODE_TIMEOUT_MS);
  });
  try {
    await Promise.race([image.decode(), timeout]);
  } finally {
    clearTimeout(timer);
  }
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
  const hasShown = useRef(false);
  const pending = pokemon !== null && pokemon.id !== currentId;

  useEffect(() => {
    const controller = new AbortController();
    const settle = hasShown.current ? SETTLE_MS : 0;

    Promise.all([
      wait(settle, controller.signal).then(() => loadPokemon(currentId, controller.signal)),
      wait(FADE_OUT_MS, controller.signal),
    ])
      .then(([next]) => {
        hasShown.current = true;
        setPokemon(next);
      })
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
      <div className={`screen-layer ${isBig ? 'card-hidden' : 'card-visible'}`}>
        <InfoCard
          id={`#${currentId}`}
          name={pokemon.name}
          image={pokemon.sprite}
          type={pokemon.types}
          pending={pending}
        />
      </div>
      <div className={`screen-layer ${!isBig ? 'card-hidden' : 'card-visible'}`}>
        <BigInfoCard pokemon={pokemon} number={currentId} pending={pending} />
      </div>
    </div>
  );
};

export default Screen;
