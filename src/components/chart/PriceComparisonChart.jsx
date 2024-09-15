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

const PriceComparisonChart = () => {
  const [chartData, setChartData] = useState(null);  // Initialize as null to check loading state

  useEffect(() => {
    axios.get(`${apiUrl}/vehicles`)  // Replace with the correct path
      .then(response => {
        const vehicles = response.data || [];  // Ensure vehicles is an array

        if (vehicles.length > 0) {
          setChartData({
            labels: vehicles.map(v => v.name),
            datasets: [
              {
                label: 'Selling Price',
                data: vehicles.map(v => {
                  const price = v.price ? v.price.replace(/[₹,]/g, '') : '0';  // Handle undefined prices
                  return parseFloat(price);
                }),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
              {
                label: 'Cost Price',
                data: vehicles.map(v => {
                  const costPrice = v.cost_price ? v.cost_price.replace(/[₹,]/g, '') : '0';  // Handle undefined cost prices
                  return parseFloat(costPrice);
                }),
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
              },
            ],
          });
        }
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
    maintainAspectRatio: false, // Allow chart to resize dynamically
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Price (₹)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Vehicle Name',
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

export default PriceComparisonChart;
