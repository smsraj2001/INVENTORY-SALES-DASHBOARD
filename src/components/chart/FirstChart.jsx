import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
const apiUrl = process.env.REACT_APP_API_URL;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FirstChart = () => {
  const [categoryCounts, setCategoryCounts] = useState({});

  // Fetch data from db.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/vehicles`); // Replace with your actual path
        const vehicles = response.data;

        // Process vehicle data for categories
        const counts = vehicles.reduce((acc, vehicle) => {
          acc[vehicle.category] = (acc[vehicle.category] || 0) + 1; // Count total sales by category
          return acc;
        }, {});

        setCategoryCounts(counts);
      } catch (error) {
        console.error("Error fetching vehicle data", error);
      }
    };

    fetchData();
  }, []);

  // Prepare data for the chart
  const chartData = {
    labels: Object.keys(categoryCounts), // X-axis: categories (e.g., 'Electric', 'Gasoline', etc.)
    datasets: [
      {
        label: "Total Vehicles Sold", // Bar chart for vehicle count
        type: "bar",
        data: Object.values(categoryCounts),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Sales Trend", // Line chart for sales trend
        type: "line",
        data: Object.values(categoryCounts),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4, // Smooth lines
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow resizing
    scales: {
      y: {
        beginAtZero: true, // Y-axis will show total sales
        title: {
          display: true,
          text: 'Total Sales',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Category', // X-axis: vehicle category
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Total Vehicles Sold by Category",
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutBounce",
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default FirstChart;
