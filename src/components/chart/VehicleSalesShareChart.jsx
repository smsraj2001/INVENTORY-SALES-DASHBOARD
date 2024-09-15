import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
const apiUrl = process.env.REACT_APP_API_URL;

// Register required components for Pie chart and the plugin
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const VehicleSalesShareChart = () => {
  const [chartData, setChartData] = useState(null);  // Initialize chartData as null for loading state

  useEffect(() => {
    // Fetch data from correct URLs
    Promise.all([
      axios.get(`${apiUrl}/vehicles`),
      axios.get(`${apiUrl}/sales`),
    ])
    .then(([vehiclesResponse, salesResponse]) => {
      const vehicles = vehiclesResponse.data || [];  // Ensure vehicles is an array
      const sales = salesResponse.data || [];        // Ensure sales is an array

      // Calculate total sales per vehicle
      const vehicleSales = vehicles.map(vehicle => {
        const totalSales = sales
          .filter(sale => sale.vehicle_id === parseInt(vehicle.id, 10))
          .reduce((sum, sale) => sum + parseInt(sale.order_quantity, 10), 0);

        return { name: vehicle.name, totalSales };
      });

      // Remove vehicles with no sales
      const vehiclesWithSales = vehicleSales.filter(v => v.totalSales > 0);

      // Calculate total number of sales to determine percentage
      const totalSales = vehiclesWithSales.reduce((sum, v) => sum + v.totalSales, 0);

      setChartData({
        labels: vehiclesWithSales.map(v => v.name),
        datasets: [
          {
            label: 'Percentage Share of Vehicles Sold',
            data: vehiclesWithSales.map(v => v.totalSales),
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1,
          },
        ],
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, []);

  // Show a loading message while chartData is null
  if (!chartData) {
    return <div>Loading...</div>;
  }

  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        color: '#000',  // Set the inside text color to black
        formatter: (value, ctx) => {
          let total = ctx.chart._metasets[0].total;
          let percentage = ((value / total) * 100).toFixed(1) + '%';  // Show percentage
          return `${ctx.chart.data.labels[ctx.dataIndex]}: ${percentage}`;  // Show label and percentage
        },
        font: {
          size: 14,  // Increase the font size
        },
      },
      legend: {
        position: 'bottom',  // Display the legend below the chart
      },
    },
    maintainAspectRatio: false,  // Disable maintaining aspect ratio to customize chart size
  };

  return (
    <div style={{ width: '500px', height: '500px' }} className='mt-5'>  {/* Increase the chart size */}
      <h6>Percentage Share of Vehicles Sold</h6>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default VehicleSalesShareChart;
