import type { PokemonType } from '@pokedex/shared';
import typeColors from '../../constants/typeColors';
import styles from './TypeBadge.module.css';

const TypeBadge = ({ type }: { type: PokemonType }) => (
  <span className={styles.badge} style={{ backgroundColor: typeColors[type] }}>
    {type}
  </span>
);

export default TypeBadge;
