import type { CSSProperties } from 'react';
import type { PokemonType } from '@pokedex/shared';
import typeColors from '../../constants/typeColors';

interface InfoCardProps {
  id: string;
  name: string;
  image: string;
  type: PokemonType[];
  pending: boolean;
}

const FALLBACK_COLOR = '#777';
const TRANSITION = 'background 0.8s ease';

const InfoCard = ({ id, name, image, type, pending }: InfoCardProps) => {
  const [type1, type2] = type;
  const firstColor = type1 ? typeColors[type1] : FALLBACK_COLOR;
  // Single-type Pokémon reuse the first colour so the right half always exists and can transition
  const secondColor = type2 ? typeColors[type2] : firstColor;

  const backgroundStyle: CSSProperties = {
    backgroundColor: firstColor,
    transition: TRANSITION,
  };

  const secondHalfStyle: CSSProperties = {
    backgroundColor: secondColor,
    width: '50%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '50%',
    transition: TRANSITION,
  };

  return (
    <div className="info-card" style={backgroundStyle}>
      <div className={`pokemon-id ${pending ? 'pending' : ''}`}>{id}</div>
      <img src={image} alt={name} className={`pokemon-image ${pending ? 'fade' : ''}`} />
      <div className={`pokemon-name ${pending ? 'pending' : ''}`} aria-hidden={pending}>
        {name}
      </div>

      <div style={secondHalfStyle}></div>
    </div>
  );
};

export default InfoCard;
