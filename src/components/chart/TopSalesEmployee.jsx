import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
const apiUrl = process.env.REACT_APP_API_URL;

// Styled components
const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const ChartWrapper = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 10px; /* Reduced padding for consistency */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 300px; /* Reduced height for consistency */
  overflow: auto; /* Add scroll if content overflows */
`;

const summarizeSalesByEmployee = (data) => {
  const summary = data.reduce((acc, { empid, order_quantity }) => {
    if (!acc[empid]) acc[empid] = 0;
    acc[empid] += Number(order_quantity);
    return acc;
  }, {});

  return Object.entries(summary).map(([empid, totalSales]) => ({ empid, totalSales }));
};

const EmployeeSalesChart = ({ data }) => (
  <BarChart
    width={400}  /* Adjusted width */
    height={250} /* Adjusted height */
    data={data}
    margin={{ top: 20, right: 20, left: 20, bottom: 5 }} /* Adjusted margin */
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="empid" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="totalSales" fill="#8884d8" />
  </BarChart>
);

const TopSalesEmployee = () => {
  const [employeeSalesData, setEmployeeSalesData] = useState([]);

  useEffect(() => {
    // Fetch data from API
    axios.get(`${apiUrl}/sales`)
      .then(response => {
        const data = response.data;
        const summarizedData = summarizeSalesByEmployee(data);
        setEmployeeSalesData(summarizedData);
      })
      .catch(error => {
        console.error('Error fetching sales data:', error);
      });
  }, []);

  return (
    <Container>
      <ChartWrapper>
        <EmployeeSalesChart data={employeeSalesData} />
      </ChartWrapper>
    </Container>
  );
};

export default TopSalesEmployee;
