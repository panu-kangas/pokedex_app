import type { PokemonStat } from '@pokedex/shared';
import styles from './StatBars.module.css';

const BAR_MAX = 150;
const LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SP.ATK',
  'special-defense': 'SP.DEF',
  speed: 'SPD',
};

export type StatLevel = 'weak' | 'mid' | 'strong';

// Gen I base stats split into thirds at 55 and 80 (median 65), rounded to 55 and 85
export function statLevel(value: number): StatLevel {
  if (value < 55) return 'weak';
  if (value < 85) return 'mid';
  return 'strong';
}

interface StatBarsProps {
  stats: PokemonStat[];
  // Label, bar and value on one line, for tight spaces like the GameBoy screen
  inline?: boolean;
}

const StatBars = ({ stats, inline = false }: StatBarsProps) => (
  <ul className={`${styles.list} ${inline ? styles.inline : ''}`}>
    {stats.map(({ statName, baseStat }) => {
      const label = LABELS[statName] ?? statName.toUpperCase();
      return (
        <li key={statName} className={styles.row}>
          <span className={styles.label}>{label}</span>
          <span className={styles.value}>{baseStat}</span>
          <div
            className={styles.track}
            role="meter"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={255}
            aria-valuenow={baseStat}
          >
            <div
              className={styles.fill}
              data-level={statLevel(baseStat)}
              style={{ width: `${Math.min(baseStat / BAR_MAX, 1) * 100}%` }}
            />
          </div>
        </li>
      );
    })}
  </ul>
);

export default StatBars;
