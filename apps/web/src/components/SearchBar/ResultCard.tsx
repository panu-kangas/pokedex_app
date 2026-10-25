import { useState, type CSSProperties } from 'react';
import type { Pokemon } from '@pokedex/shared';
import typeColors from '../../constants/typeColors';
import StatBars from '../StatBars/StatBars';
import TypeBadge from '../TypeBadge/TypeBadge';
import styles from './ResultCard.module.css';

function cardColors(pokemon: Pokemon): CSSProperties {
  const [type1, type2] = pokemon.types;
  const first = type1 ? typeColors[type1] : '#777';
  return { '--type-1': first, '--type-2': type2 ? typeColors[type2] : first } as CSSProperties;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const ResultCard = ({ pokemon }: { pokemon: Pokemon }) => {
  const [flipped, setFlipped] = useState(false);
  const name = capitalize(pokemon.name);
  const total = pokemon.stats.reduce((sum, stat) => sum + stat.baseStat, 0);

  return (
    <li className={`${styles.card} ${flipped ? styles.flipped : ''}`} style={cardColors(pokemon)}>
      <div className={styles.inner}>
        <div className={`${styles.face} ${styles.front}`} aria-hidden={flipped}>
          <img src={pokemon.sprite} alt={pokemon.name} width={96} height={96} />
          <span className={styles.number}>#{String(pokemon.id).padStart(3, '0')}</span>
          <span className={styles.name}>{name}</span>
          <span className={styles.types}>
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </span>
          <span className={styles.hint}>Tap for stats</span>
        </div>
        <div className={`${styles.face} ${styles.back}`} aria-hidden={!flipped}>
          <span className={styles.name}>{name}</span>
          <StatBars stats={pokemon.stats} />
          <span className={styles.total}>
            Total <strong>{total}</strong>
          </span>
        </div>
      </div>
      <button
        type="button"
        className={styles.toggle}
        aria-pressed={flipped}
        aria-label={`${flipped ? 'Hide' : 'Show'} stats for ${name}`}
        onClick={() => setFlipped((value) => !value)}
      />
    </li>
  );
};

export default ResultCard;
