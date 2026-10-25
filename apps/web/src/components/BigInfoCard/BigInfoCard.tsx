import type { Pokemon } from '@pokedex/shared';
import './BigInfoCard.css';

const STAT_BAR_MAX = 150;
const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SP.ATK',
  'special-defense': 'SP.DEF',
  speed: 'SPD',
};

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
          {pokemon.stats.map((stat) => (
            <div key={stat.statName} className="stat-block">
              <span className="stat-name">
                {STAT_LABELS[stat.statName] ?? stat.statName.toUpperCase()}
              </span>
              <span className="stat-value">{stat.baseStat}</span>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{ width: `${Math.min(stat.baseStat / STAT_BAR_MAX, 1) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BigInfoCard;
