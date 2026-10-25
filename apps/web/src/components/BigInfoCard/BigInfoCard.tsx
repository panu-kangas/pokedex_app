import type { Pokemon } from '@pokedex/shared';
import StatBars from '../StatBars/StatBars';
import './BigInfoCard.css';

interface BigInfoCardProps {
  pokemon: Pokemon;
}

const BigInfoCard = ({ pokemon }: BigInfoCardProps) => {
  return (
    <div className="big-info-card">
      <h2 className="big-card-name">{pokemon.name}</h2>
      <div className="big-card-body">
        <div className="big-card-left">
          <img src={pokemon.sprite} alt={pokemon.name} className="big-card-image" />
          <div className="info-block">
            <p>
              <strong>Height:</strong> {pokemon.height / 10} m
            </p>
            <p>
              <strong>Weight:</strong> {pokemon.weight / 10} kg
            </p>
            <p>
              <strong>Type:</strong> {pokemon.types.join(', ')}
            </p>
          </div>
        </div>

        <div className="big-card-right">
          <StatBars stats={pokemon.stats} />
        </div>
      </div>
    </div>
  );
};

export default BigInfoCard;
