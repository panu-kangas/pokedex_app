import { useEffect, useState } from 'react';
import type { PokemonType, TypeCounts } from '@pokedex/shared';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Tooltip,
  LinearScale,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { motion } from 'framer-motion';
import { api } from '../../api/client';
import typeColors from '../../constants/typeColors';
import TypeBadge from '../TypeBadge/TypeBadge';
import { cardAnimation } from './chartTheme';
import styles from './ChartCard.module.css';

ChartJS.register(CategoryScale, BarElement, LinearScale, Tooltip);

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, ticks: { stepSize: 5 } },
  },
};

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const TypesCountChart = () => {
  const [data, setData] = useState<TypeCounts | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    api
      .getTypeCounts(controller.signal)
      .then(setData)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) console.error('Error fetching type counts:', error);
      });
    return () => controller.abort();
  }, []);

  if (!data) {
    return <div className={styles.loading}>Loading type data…</div>;
  }

  const entries = Object.entries(data) as [PokemonType, number][];
  const sortedEntries = [...entries].sort(([a], [b]) => a.localeCompare(b));
  const mostCommon = sortedEntries.reduce<[PokemonType, number] | undefined>(
    (max, entry) => (!max || entry[1] > max[1] ? entry : max),
    undefined,
  );
  const rarest = sortedEntries.reduce<[PokemonType, number] | undefined>(
    (min, entry) => (!min || entry[1] < min[1] ? entry : min),
    undefined,
  );

  const chartData: ChartData<'bar'> = {
    labels: sortedEntries.map(([type]) => capitalize(type)),
    datasets: [
      {
        data: sortedEntries.map(([, count]) => count),
        backgroundColor: sortedEntries.map(([type]) => typeColors[type]),
        borderRadius: 6,
      },
    ],
  };

  return (
    <motion.article className={styles.card} {...cardAnimation}>
      <div>
        <h3 className={styles.title}>Pokémon per type</h3>
        <div className={styles.chart}>
          <Bar data={chartData} options={chartOptions} aria-label="Bar chart of Pokémon per type" />
        </div>
      </div>
      <aside className={styles.facts}>
        {mostCommon && (
          <p>
            Most common type, with <strong>{mostCommon[1]} Pokémon</strong>
            <span className={styles.factValue}>
              <TypeBadge type={mostCommon[0]} />
            </span>
          </p>
        )}
        {rarest && (
          <p>
            Rarest type, with <strong>{rarest[1]} Pokémon</strong>
            <span className={styles.factValue}>
              <TypeBadge type={rarest[0]} />
            </span>
          </p>
        )}
        <p>Dual-type Pokémon count once for each of their types.</p>
      </aside>
    </motion.article>
  );
};

export default TypesCountChart;
