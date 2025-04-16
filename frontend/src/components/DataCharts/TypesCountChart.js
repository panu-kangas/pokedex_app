import React, { useEffect, useState } from 'react';
import typeColors from '../../types/typeConfig';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, BarElement, Title, Tooltip, Legend, LinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, BarElement, LinearScale, Title, Tooltip, Legend);

const TypesCountChart = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      const response = await fetch('/api/types-count');
      const result = await response.json();
      setData(result);
    };

    fetchData();

	return () => {
		const chart = ChartJS.instances.get('pokemon-type-chart');
		if (chart) {
		  chart.destroy();
		}
	  };
  }, []);


  if (!data) {
    return <div>Loading...</div>; // FIX THIS LATER
  }

  // Prepare data for the chart
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Number of Pokémon per Type',
        data: Object.values(data),
        backgroundColor: Object.keys(data).map(type => {
			return typeColors[type];
		  }),
        borderColor: 'rgb(6, 30, 30)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Pokémon Type Counts (Original 151)',
      },
    },
    scales: {
      y: {
		type: 'linear',
        beginAtZero: true,
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  const chartStyle = {
	width: '80%',
	margin: '0 auto',
  }

  return (
    <div>
    	<h2>Pokémon Type Distribution</h2>
		<div className="chart-container" style={ chartStyle }>
			<Bar id="pokemon-type-chart" data={chartData} options={chartOptions} />
		</div>
    </div>
  );
};

export default TypesCountChart;