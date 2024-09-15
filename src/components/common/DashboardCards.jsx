import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import styled from 'styled-components';
const apiUrl = process.env.REACT_APP_API_URL;

const Container = styled.div`
  .row {
    margin-top: 50px;
  }
`;

const Card = styled.div`
  background-color: ${(props) => props.bgColor || '#fff'};
  color: #fff;
  height: 250px; /* Set a fixed height */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Add transition effects */

  .card-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .icon-container {
    margin-bottom: 10px;
  }

  &:hover {
    transform: translateY(-10px); /* Lift the card on hover */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* Add a more prominent shadow */
  }
`;

function DashboardCards() {
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalStock: 0,
    totalEmployees: 0,
    totalProductValue: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesResponse = await axios.get(`${apiUrl}/sales`);
        const usersResponse = await axios.get(`${apiUrl}/users`);
        const vehiclesResponse = await axios.get(`${apiUrl}/vehicles`);

        const sales = salesResponse.data;
        const users = usersResponse.data;
        const vehicles = vehiclesResponse.data;

        const totalSales = sales.reduce((acc, sale) => acc + (parseInt(sale.order_quantity, 10) || 0), 0);
        const totalStock = vehicles.reduce((acc, vehicle) => acc + parseInt(vehicle.stock), 0);
        const totalEmployees = users.length;
        const totalProductValue = vehicles.reduce((acc, vehicle) => {
          const price = parseInt(vehicle.price.replace('₹', '').replace(',', ''), 10);
          return acc + price * vehicle.stock;
        }, 0);

        setDashboardData({
          totalSales,
          totalStock,
          totalEmployees,
          totalProductValue,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container className="container">
      <div className="row">
        <div className="col-md-3">
          <Card bgColor="#e4b90f">
            <div className="card-body">
              <div className="icon-container">
                <i className="fas fa-box-open fa-2x"></i>
              </div>
              <h5 className="card-title">Total Products Value</h5>
              <p className="card-text">₹{dashboardData.totalProductValue}</p>
              <small>+55% than last week</small>
            </div>
          </Card>
        </div>
        <div className="col-md-3">
          <Card bgColor="#d83611">
            <div className="card-body">
              <div className="icon-container">
                <i className="fas fa-users fa-2x"></i>
              </div>
              <h5 className="card-title">Total Employees</h5>
              <p className="card-text">{dashboardData.totalEmployees}</p>
              <small>+3% than last month</small>
            </div>
          </Card>
        </div>
        <div className="col-md-3">
          <Card bgColor="#2b84d2">
            <div className="card-body">
              <div className="icon-container">
                <i className="fas fa-boxes fa-2x"></i>
              </div>
              <h5 className="card-title">Total Stock</h5>
              <p className="card-text">{dashboardData.totalStock}</p>
              <small>-2% than yesterday</small>
            </div>
          </Card>
        </div>
        <div className="col-md-3">
          <Card bgColor="#17a2b8">
            <div className="card-body">
              <div className="icon-container">
              <span className="fa-2x"><strong>₹</strong></span>

              </div>
              <h5 className="card-title">Total Sales</h5>
              <p className="card-text">{dashboardData.totalSales}</p>
              <small>+5% than yesterday</small>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default DashboardCards;
