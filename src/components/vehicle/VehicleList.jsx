import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import './VehicleList.css'; // Import the CSS file
const apiUrl = process.env.REACT_APP_API_URL;

const Vehiclelist = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    axios
      .get(`${apiUrl}/vehicles`)
      .then((response) => {
        setVehicles(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredVehicles(vehicles);
    } else {
      const filter = vehicles.filter((v) => v.category.toLowerCase() === selectedCategory.toLowerCase());
      setFilteredVehicles(filter);
    }
  }, [selectedCategory, vehicles]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav w-100 justify-content-around">
            <li className="nav-item">
              <a className="nav-link" href="#!" onClick={() => setSelectedCategory("All")}>All</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#!" onClick={() => setSelectedCategory("Scooters")}>Scooters</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#!" onClick={() => setSelectedCategory("Motorcycles")}>Bikes</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#!" onClick={() => setSelectedCategory("Mopeds")}>Mopeds</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#!" onClick={() => setSelectedCategory("Electric")}>E-Scooter</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#!" onClick={() => setSelectedCategory("Three Wheelers")}>Three Wheelers</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mt-5" style={{ maxWidth: '1200px' }}>
        <div className="row justify-content-center">
          {filteredVehicles.map((vehicle, index) => (
            <div className="col-sm-6 col-md-6 col-lg-4 d-flex justify-content-center mb-4" key={index}>
              <div className="card shadow-sm card-custom-background" style={{ 
                minWidth: '350px', 
                maxWidth: '400px', 
                minHeight: '500px', 
                display: 'flex', 
                flexDirection: 'column'
              }}>
                <img
                  src={vehicle.image}
                  className="card-img-top"
                  alt={vehicle.name}
                  style={{ maxHeight: "250px", objectFit: "cover" }}
                />
                <div className="card-body text-center d-flex flex-column" style={{ flex: '1 0 auto' }}>
                  <h5 className="card-title mt-3" style={{ backgroundColor: '#333', color: 'white', padding: '10px' }}>
                    {vehicle.name}
                  </h5>
                  <table className="table table-striped mb-0 table-custom">
                    <tbody>
                      {vehicle.engine && (
                        <tr>
                          <td><strong>Engine:</strong></td>
                          <td>{vehicle.engine}</td>
                        </tr>
                      )}
                      {vehicle.power && (
                        <tr>
                          <td><strong>Power:</strong></td>
                          <td className="power-field">{vehicle.power}</td>
                        </tr>
                      )}
                      {vehicle.weight && (
                        <tr>
                          <td><strong>Weight:</strong></td>
                          <td>{vehicle.weight}</td>
                        </tr>
                      )}
                      {vehicle.price && (
                        <tr>
                          <td><strong>Price:</strong></td>
                          <td>{vehicle.price}</td>
                        </tr>
                      )}
                      {vehicle.category === "Electric" && (
                        <>
                          {vehicle.range && (
                            <tr>
                              <td><strong>Range:</strong></td>
                              <td>{vehicle.range}</td>
                            </tr>
                          )}
                          {vehicle.batteryCapacity && (
                            <tr>
                              <td><strong>Battery Cap:</strong></td>
                              <td>{vehicle.batteryCapacity}</td>
                            </tr>
                          )}
                          {vehicle.topSpeed && (
                            <tr>
                              <td><strong>Top Speed:</strong></td>
                              <td>{vehicle.topSpeed}</td>
                            </tr>
                          )}
                        </>
                      )}
                      {vehicle.category === "Three Wheelers" && vehicle.topSpeed && (
                        <tr>
                          <td><strong>Top Speed:</strong></td>
                          <td>{vehicle.topSpeed}</td>
                        </tr>
                      )}
                      {vehicle.stock && (
                        <tr>
                          <td><strong>Stock:</strong></td>
                          <td style={vehicle.stock < 100 ? { color: "red", fontWeight: "bold", backgroundColor: "#ffe6e6", padding: "10px", borderRadius: "5px" } : { color: "#102C57", fontWeight: "bold", backgroundColor: "#cce0ff", padding: "10px", borderRadius: "5px" }}>
                            {vehicle.stock}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Vehiclelist;
