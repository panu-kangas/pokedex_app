interface ButtonRowProps {
  onNext: () => void;
  onPrev: () => void;
  onMoreInfo: () => void;
  isBig: boolean;
}

const ButtonRow = ({ onNext, onPrev, onMoreInfo, isBig }: ButtonRowProps) => {
  return (
    <div className="button-row">
      <button className="gb-button" onClick={onPrev}>
        ◀
      </button>
      <button className="gb-button" onClick={onMoreInfo}>
        {isBig ? 'Less info' : 'More info'}
      </button>
      <button className="gb-button" onClick={onNext}>
        ▶
      </button>
    </div>
  );
};

export default ButtonRow;
