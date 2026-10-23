import { useEffect, useState } from 'react';
import type { WeightDistribution } from '@pokedex/shared';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { motion } from 'framer-motion';
import { api } from '../../api/client';
import './WeightDistChart.css';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const smallColor = '#F95587';
const mediumColor = '#735797';
const largeColor = '#F7D02C';

const chartOptions: ChartOptions<'pie'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#444',
        font: {
          size: 14,
        },
      },
    },
  },
};

function percentage(part: number, total: number): string {
  return ((part / total) * 100).toFixed(2);
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
    return <div>Loading...</div>;
  }

  const chartData: ChartData<'pie'> = {
    labels: ['Small (0-30 kg)', 'Medium (30-70 kg)', 'Large (> 70 kg)'],
    datasets: [
      {
        data: [data.small, data.medium, data.large],
        backgroundColor: [smallColor, mediumColor, largeColor],
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };

  const total = data.small + data.medium + data.large;

  const sizeBadge = (label: string, count: number, color: string) => (
    <span style={{ padding: '5px', borderRadius: '10px', color: 'black', backgroundColor: color }}>
      {`${label} Pokémon ${percentage(count, total)}%`}
    </span>
  );

  return (
    <div style={{ overflowX: 'hidden' }}>
      <motion.div
        className="facts-container2"
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
      >
        <div className="fun-fact-container2">
          <h2 className="chart-header2">Fun facts</h2>
          <p className="fact-paragraph">
            {' '}
            Pokémon Size Distribution by Percentage
            <br />
            <br />
            {sizeBadge('Small', data.small, smallColor)} <br />
            <br />
            {sizeBadge('Medium', data.medium, mediumColor)} <br />
            <br />
            {sizeBadge('Large', data.large, largeColor)}
          </p>
        </div>
        <div className="chart-container2">
          <h2 className="chart-header2">Weight Distribution</h2>
          <div className="chart-wrapper2">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WeightDistChart;
