import { useState } from 'react';
import { POKEMON_COUNT } from '../../constants/pokedex';
import Screen from './Screen';
import ButtonRow from './ButtonRow';
import './GameBoy.css';

const GameBoy = () => {
  const [currentId, setCurrentId] = useState(1);
  const [isBig, setIsBig] = useState(false);

  // Wraps around, so the last Pokémon is one press away from the first
  const handleNext = () => setCurrentId((id) => (id % POKEMON_COUNT) + 1);
  const handlePrev = () => setCurrentId((id) => ((id + POKEMON_COUNT - 2) % POKEMON_COUNT) + 1);

  const handleMoreInfo = () => {
    setIsBig(!isBig);
  };

  return (
    <div className="gameboy-box">
      <p className="gameboy-label" aria-hidden="true">
        POKéDEX
      </p>
      <Screen currentId={currentId} isBig={isBig} />
      <ButtonRow
        onNext={handleNext}
        onPrev={handlePrev}
        onMoreInfo={handleMoreInfo}
        isBig={isBig}
      />
    </div>
  );
};

export default GameBoy;
