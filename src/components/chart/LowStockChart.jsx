import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
const apiUrl = process.env.REACT_APP_API_URL;

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

const LowStockChart = () => {
  const [chartData, setChartData] = useState(null);  // Initialize chartData as null

  useEffect(() => {
    axios.get(`${apiUrl}/vehicles`)  // Correct URL
      .then(response => {
        const vehicles = response.data || [];  // Ensure vehicles is not undefined

        // Convert stock from string to number and sort vehicles by stock in ascending order
        const lowStockVehicles = vehicles
          .map(vehicle => ({
            ...vehicle,
            stock: parseInt(vehicle.stock, 10) || 0
          }))
          .sort((a, b) => a.stock - b.stock)
          .slice(0, 5);

        // Prepare chart data only if there are vehicles
        if (lowStockVehicles.length > 0) {
          setChartData({
            labels: lowStockVehicles.map(v => v.name),
            datasets: [
              {
                label: 'Stock Count',
                data: lowStockVehicles.map(v => v.stock),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              },
            ],
          });
        }
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  // If chartData is null (data is still loading), show a loading message
  if (!chartData) {
    return <div>Loading...</div>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to resize dynamically
    scales: {
      x: {
        title: {
          display: true,
          text: 'Vehicle Name',  // Title for the X-axis
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Stock Count',  // Title for the Y-axis
        },
      },
    },
  };

  return (
    <ChartContainer>
      <Bar data={chartData} options={options} />
    </ChartContainer>
  );
};

export default LowStockChart;
