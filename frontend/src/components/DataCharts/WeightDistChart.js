import React, { useEffect, useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import './WeightDistChart.css';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const smallColor = '#F95587';
const mediumColor = '#735797';
const largeColor = '#F7D02C';



const WeightDistChart = () => {
  const [data, setData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/weight-dist');
      const result = await response.json();
      setData(result);
    };

    fetchData();

    const chartInstance = chartRef.current;

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  const chartData = {
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

  const chartOptions = {
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

  const overallPokemon = data.small + data.medium + data.large;

  const smallText = `Small Pokémon ${(data.small / overallPokemon * 100).toFixed(2)}%`;
  const mediumText = `Medium Pokémon ${(data.medium / overallPokemon * 100).toFixed(2)}%`;
  const largeText = `Large Pokémon ${(data.large / overallPokemon * 100).toFixed(2)}%`;


  return (
    <motion.div
      className="facts-container2"
      initial={{ x: 100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
    >

      <div className="fun-fact-container2">
        <h2 className="chart-header2">Fun facts</h2>
        <p className="fact-paragraph"> Pokémon Size Distribution by Percentage
			<br/><br/>
			<span style={{ padding: '5px', borderRadius: '10px', color: 'black', backgroundColor: smallColor }}>
				{smallText}
			</span> <br/><br/>
			<span style={{ padding: '5px', borderRadius: '10px', color: 'black', backgroundColor: mediumColor }}>
				{mediumText}
			</span> <br/><br/>
			<span style={{ padding: '5px', borderRadius: '10px', color: 'black', backgroundColor: largeColor }}>
				{largeText}
			</span>
		</p>
      </div>
	  <div className="chart-container2">
        <h2 className="chart-header2">Weight Distribution</h2>
        <div className="chart-wrapper2">
          <Pie ref={chartRef} data={chartData} options={chartOptions} />
        </div>
      </div>
    </motion.div>
  );
};

export default WeightDistChart;
