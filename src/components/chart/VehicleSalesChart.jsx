import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);
const apiUrl = process.env.REACT_APP_API_URL;

const VehicleSalesChart = () => {
  const [salesData, setSalesData] = useState(null);
  const [timeUnit, setTimeUnit] = useState('month');  // Default to 'month'

  useEffect(() => {
    axios.get(`${apiUrl}/sales`)  // Replace with actual path to db.json
      .then(response => {
        const sales = response.data;

        // Process data: Aggregate sales data across all vehicles
        const aggregatedSalesData = processSalesData(sales);
        setSalesData(aggregatedSalesData);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  // Function to process the sales data
  const processSalesData = (sales) => {
    const salesByDate = {};

    sales.forEach(sale => {
      const date = new Date(sale.date_of_purchase).toISOString().split('T')[0];  // YYYY-MM-DD format

      if (!salesByDate[date]) {
        salesByDate[date] = 0;
      }

      salesByDate[date] += sale.order_quantity;
    });

    const labels = Array.from(new Set(sales.map(sale => new Date(sale.date_of_purchase).toISOString().split('T')[0]))).sort();

    const data = labels.map(date => salesByDate[date] || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Total Sales',
          data,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Ensure chart resizes with container
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timeUnit,  // 'week', 'month', or 'year'
        },
        title: {
          display: true,
          text: 'Date of Purchase',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Sales',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Total Sales Over Time',
      },
    },
  };

  // Handle dropdown selection change
  const handleTimeUnitChange = (e) => {
    setTimeUnit(e.target.value);
  };

  // Inline styles for responsiveness
  const containerStyle = {
    width: '100%',
    height: '400px', // You can adjust this height as needed
    position: 'relative',
    margin: '0 auto',
    padding: '20px',
  };

  const dropdownStyle = {
    display: 'block',
    margin: '10px 0',
  };

  return (
    <div style={containerStyle}>
      {/* <h2>Total Sales Over Time</h2> */}

      {/* Dropdown to select the time unit */}
      <label htmlFor="time-unit">View By: </label>
      <select
        id="time-unit"
        value={timeUnit}
        onChange={handleTimeUnitChange}
        style={dropdownStyle}
      >
        <option value="week">Weekly</option>
        <option value="month">Monthly</option>
        <option value="year">Yearly</option>
      </select>

      {/* Render the Line chart */}
      {salesData ? (
        <Line data={salesData} options={chartOptions} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default VehicleSalesChart;
