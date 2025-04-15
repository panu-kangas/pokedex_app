import React from 'react';

const ButtonRow = ({ onNext, onPrev }) => {
  return (
    <div className="button-row">
      <button className="gb-button" onClick={onPrev}>◀</button>
	  <button className="gb-button">More info</button>
      <button className="gb-button" onClick={onNext}>▶</button>
    </div>
  );
};

export default ButtonRow;
