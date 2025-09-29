import React, { useState } from 'react';
import Screen from './Screen';
import ButtonRow from './ButtonRow';
import './GameBoy.css';

const GameBoy = () => {
  const [currentId, setCurrentId] = useState(1);
  const [isBig, setIsBig] = useState(false);

  const handleNext = () => {
    if (currentId < 151) setCurrentId(currentId + 1);
  };

  const handlePrev = () => {
    if (currentId > 1) setCurrentId(currentId - 1);
  };

  const handleMoreInfo = () => {
    setIsBig(!isBig);
  };

  return (
    <div className="gameboy-box">
      <Screen currentId={currentId} isBig={isBig} />
      <ButtonRow 
	  	onNext={handleNext} onPrev={handlePrev} onMoreInfo={handleMoreInfo} isBig={isBig} 
	  />
    </div>
  );
};

export default GameBoy;
