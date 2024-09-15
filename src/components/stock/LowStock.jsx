import React, { useState, useEffect } from "react";
import "./LowStock.css";
import axios from "axios"; // Import axios
const LowStock = () => {
  const [lowStockVehicles, setLowStockVehicles] = useState([]);

  

useEffect(() => {
  // Fetch vehicles data from API using axios
  axios
    .get("http://localhost:5000/vehicles")
    .then((response) => {
      // Sort vehicles by stock (ascending) and get the 3 vehicles with the lowest stock
      const sortedVehicles = response.data.sort((a, b) => a.stock - b.stock).slice(0, 3);
      setLowStockVehicles(sortedVehicles);
    })
    .catch((err) => console.log(err));
}, []);


  return (
    <div className="low-stock-container">
      <h2 className="text-white bg-dark p-3 rounded">Low Stock Vehicles</h2>
      <div className="bar-graph">
        {lowStockVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bar-container">
            <div className="vehicle-name">{vehicle.name}</div>
            <div className="bar" style={{ height: `${vehicle.stock * 10}px` }}>
              <span className="stock-label">{vehicle.stock}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStock;
