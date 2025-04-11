import React, { useState } from 'react';
import Screen from './Screen';
import ButtonRow from './ButtonRow';
import './GameBoy.css';

const GameBoy = () => {
  const [currentId, setCurrentId] = useState(1);

  const handleNext = () => {
    if (currentId < 151) setCurrentId(currentId + 1);
  };

  const handlePrev = () => {
    if (currentId > 1) setCurrentId(currentId - 1);
  };

  return (
    <div className="gameboy-box">
      <Screen currentId={currentId} />
      <ButtonRow onNext={handleNext} onPrev={handlePrev} />
    </div>
  );
};

export default GameBoy;
