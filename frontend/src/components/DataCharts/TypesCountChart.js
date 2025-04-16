import React, { useEffect, useState, useRef } from 'react';
import typeColors from '../../types/typeConfig';
import { Bar } from 'react-chartjs-2';
import './TypesCountChart.css';
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LinearScale,
} from 'chart.js';

ChartJS.register(CategoryScale, BarElement, LinearScale, Title, Tooltip, Legend);

const TypesCountChart = () => {
  const [data, setData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/types-count');
      const result = await response.json();
      setData(result);
    };

    fetchData();

    return () => {
      // Access the actual chart instance via ref
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  const sortedKeys = Object.keys(data).sort();


  const chartData = {
	labels: sortedKeys.map(
		type => type.charAt(0).toUpperCase() + type.slice(1)
	  ), 
	datasets: [
      {
        data: sortedKeys.map(type => data[type]),
        backgroundColor: sortedKeys.map(type => typeColors[type]),
        borderColor: 'rgb(6, 30, 30)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: 'The type distribution of the original 151 Pokémon',
		font: {
			size: 20,        // 👈 Font size in pixels
			weight: 'bold',  // 👈 You can use 'normal', 'bold', or even 400, 700, etc.
			family: 'Arial', // 👈 Optional: custom font family
		  },
		  color: '#333',       // 👈 Title text color
		  align: 'center',
      },
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

  const maxType = Object.entries(data).reduce((max, entry) =>
	entry[1] > max[1] ? entry : max
  )[0];

  const minType = Object.entries(data).reduce((min, entry) =>
	entry[1] < min[1] ? entry : min
  )[0];

  return (
    <div className="facts-container">
		<div className="types-count-container">
			<h2 className="chart-header">Type Distribution</h2>
			<div className="chart-container">
				<Bar ref={chartRef} data={chartData} options={chartOptions} />
			</div>
		</div>
		<div className="info-text-container">
			<h2 className="chart-header">Fun facts</h2>
			<p>The most common type in Gen I Pokémon is: </p>
			<span style={{ color: typeColors[maxType] }}>
				{maxType.charAt(0).toUpperCase() + maxType.slice(1)}
			</span>
			<p>The most rare type in Gen I Pokémon is: </p>
			<span style={{ color: typeColors[minType] }}>
				{minType.charAt(0).toUpperCase() + minType.slice(1)}
			</span>
		</div>
    </div>
  );
};

export default TypesCountChart;
