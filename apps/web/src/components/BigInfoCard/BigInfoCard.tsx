import type { Pokemon } from '@pokedex/shared';
import StatBars from '../StatBars/StatBars';
import './BigInfoCard.css';

interface BigInfoCardProps {
  pokemon: Pokemon;
  // Shown before the Pokémon itself loads, so rapid presses give instant feedback
  number?: number;
  pending?: boolean;
}

const BigInfoCard = ({ pokemon, number = pokemon.id, pending = false }: BigInfoCardProps) => {
  return (
    <div className={`big-info-card ${pending ? 'pending' : ''}`}>
      <div className="big-card-header">
        <span className="big-card-number">#{String(number).padStart(3, '0')}</span>
        <h2 className="big-card-name" aria-hidden={pending}>
          {pokemon.name}
        </h2>
      </div>
      <div className="big-card-body">
        <img src={pokemon.sprite} alt={pokemon.name} className="big-card-image" />
        <StatBars stats={pokemon.stats} inline />
      </div>
      <dl className="info-block">
        <div>
          <dt>Height</dt>
          <dd>{pokemon.height / 10} m</dd>
        </div>
        <div>
          <dt>Weight</dt>
          <dd>{pokemon.weight / 10} kg</dd>
        </div>
        <div>
          <dt>Type</dt>
          <dd className="info-types">{pokemon.types.join(' / ')}</dd>
        </div>
      </dl>
    </div>
  );
};

export default BigInfoCard;
