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
        backgroundColor: ['green', 'blue', 'red'],
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

  return (
    <motion.div
      className="facts-container-2"
      initial={{ x: 100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
    >

      <div className="info-text-container-2">
        <h2 className="chart-header-2">Fun facts</h2>
        {/* You can insert some fun weight-related facts here later */}
      </div>
	  <div className="weight-dist-container">
        <h2 className="chart-header-2">Weight Distribution</h2>
        <div className="chart-container-2">
          <Pie ref={chartRef} data={chartData} options={chartOptions} />
        </div>
      </div>
    </motion.div>
  );
};

export default WeightDistChart;
