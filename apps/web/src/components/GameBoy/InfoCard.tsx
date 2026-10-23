import { useState, type CSSProperties } from 'react';
import type { PokemonType } from '@pokedex/shared';
import typeColors from '../../constants/typeColors';

interface InfoCardProps {
  id: string;
  name: string;
  image: string;
  type: PokemonType[];
  idChange: boolean;
}

const FALLBACK_COLOR = '#777';
const TRANSITION = 'background 0.8s ease';

const InfoCard = ({ id, name, image, type, idChange }: InfoCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [type1, type2] = type;

  const backgroundStyle: CSSProperties = {
    backgroundColor: type1 ? typeColors[type1] : FALLBACK_COLOR,
    transition: TRANSITION,
  };

  const secondBg: CSSProperties | undefined = type2
    ? {
        backgroundColor: typeColors[type2],
        width: '50%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '50%',
        transition: TRANSITION,
      }
    : undefined;

  return (
    <div className="info-card" style={backgroundStyle}>
      <div className="pokemon-id">{id}</div>
      <img
        src={image}
        alt={name}
        className={`pokemon-image ${idChange && isLoaded ? 'fade' : ''}`}
        onLoad={() => setIsLoaded(true)}
      />
      <div className="pokemon-name">{name}</div>

      <div style={secondBg}></div>
    </div>
  );
};

export default InfoCard;
