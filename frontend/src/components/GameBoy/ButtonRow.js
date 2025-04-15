import React from 'react';

const ButtonRow = ({ onNext, onPrev, onMoreInfo, isBig }) => {

	let infoBtnText;

	if (!isBig)
		infoBtnText = 'More info';
	else
		infoBtnText = 'Less info';

  return (
    <div className="button-row">
      <button className="gb-button" onClick={onPrev}>◀</button>
	  <button className="gb-button" onClick={onMoreInfo}>{infoBtnText}</button>
      <button className="gb-button" onClick={onNext}>▶</button>
    </div>
  );
};

export default ButtonRow;
