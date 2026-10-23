import { useEffect, useState } from 'react';
import type { PokemonType, TypeCounts } from '@pokedex/shared';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LinearScale,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { motion } from 'framer-motion';
import { api } from '../../api/client';
import typeColors from '../../constants/typeColors';
import './TypesCountChart.css';

ChartJS.register(CategoryScale, BarElement, LinearScale, Title, Tooltip, Legend);

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      type: 'linear',
      beginAtZero: true,
      ticks: {
        stepSize: 4,
      },
    },
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
    return <div>Loading...</div>;
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
        borderColor: 'rgb(6, 30, 30)',
        borderWidth: 1,
      },
    ],
  };

  const typeBadge = (type: PokemonType) => (
    <span
      style={{
        padding: '5px',
        borderRadius: '10px',
        color: 'white',
        backgroundColor: typeColors[type],
      }}
    >
      {capitalize(type)}
    </span>
  );

  return (
    <motion.div
      className="fact-container1"
      initial={{ x: -100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
    >
      <div className="chart-container1">
        <h2 className="chart-header1">Type Distribution</h2>
        <div className="chart-wrapper1">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
      <div className="fun-fact-container1">
        <h2 className="chart-header1">Fun facts</h2>
        {mostCommon && (
          <p className="fact-paragraph">
            {`The most common type (with ${mostCommon[1]} Pokémon) is:`}
            <br />
            {typeBadge(mostCommon[0])}
          </p>
        )}
        {rarest && (
          <p className="fact-paragraph">
            {`The most rare type (with ${rarest[1]} Pokémon) is:`}
            <br />
            {typeBadge(rarest[0])}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default TypesCountChart;
