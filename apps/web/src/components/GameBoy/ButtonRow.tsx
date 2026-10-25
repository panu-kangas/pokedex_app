interface ButtonRowProps {
  onNext: () => void;
  onPrev: () => void;
  onMoreInfo: () => void;
  isBig: boolean;
}

const ButtonRow = ({ onNext, onPrev, onMoreInfo, isBig }: ButtonRowProps) => {
  return (
    <div className="button-row">
      <button className="gb-button gb-arrow" onClick={onPrev} aria-label="Previous Pokémon">
        ◀
      </button>
      <button className="gb-button gb-pill" onClick={onMoreInfo} aria-pressed={isBig}>
        {isBig ? 'Less info' : 'More info'}
      </button>
      <button className="gb-button gb-arrow" onClick={onNext} aria-label="Next Pokémon">
        ▶
      </button>
    </div>
  );
};

export default ButtonRow;
