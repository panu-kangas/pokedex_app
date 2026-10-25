import { useEffect, useState } from 'react';
import type { WeightDistribution } from '@pokedex/shared';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { motion } from 'framer-motion';
import { api } from '../../api/client';
import { cardAnimation } from './chartTheme';
import styles from './ChartCard.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const SIZES = [
  { key: 'small', label: 'Small (≤ 30 kg)', color: '#f95587' },
  { key: 'medium', label: 'Medium (30–70 kg)', color: '#8e6fd8' },
  { key: 'large', label: 'Large (> 70 kg)', color: '#ffde00' },
] as const;

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16 } } },
};

function percentage(part: number, total: number): string {
  return ((part / total) * 100).toFixed(1);
}

const WeightDistChart = () => {
  const [data, setData] = useState<WeightDistribution | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    api
      .getWeightDistribution(controller.signal)
      .then(setData)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) console.error('Error fetching weight distribution:', error);
      });
    return () => controller.abort();
  }, []);

  if (!data) {
    return <div className={styles.loading}>Loading weight data…</div>;
  }

  const total = data.small + data.medium + data.large;
  const chartData: ChartData<'doughnut'> = {
    labels: SIZES.map((size) => size.label),
    datasets: [
      {
        data: SIZES.map((size) => data[size.key]),
        backgroundColor: SIZES.map((size) => size.color),
        borderColor: '#161935',
        borderWidth: 4,
      },
    ],
  };

  return (
    <motion.article className={styles.card} {...cardAnimation}>
      <div>
        <h3 className={styles.title}>Pokémon by weight</h3>
        <div className={styles.chart}>
          <Doughnut
            data={chartData}
            options={chartOptions}
            aria-label="Doughnut chart of Pokémon by weight"
          />
        </div>
      </div>
      <aside className={styles.facts}>
        {SIZES.map((size) => (
          <p key={size.key}>
            <strong style={{ color: size.color }}>{percentage(data[size.key], total)}%</strong> are{' '}
            {size.label.toLowerCase()}
          </p>
        ))}
      </aside>
    </motion.article>
  );
};

export default WeightDistChart;
