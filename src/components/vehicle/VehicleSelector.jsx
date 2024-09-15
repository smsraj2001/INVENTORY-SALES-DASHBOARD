import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './VehicleSelector.css'; // Import the custom CSS file for styling
import axios from "axios";
const VehicleSelector = () => {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/vehicles")
      .then((response) => {
        const data = response.data;
        setVehicles(data);
  
        // Extract unique categories
        const uniqueCategories = [
          ...new Set(data.map((vehicle) => vehicle.category)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((err) => {
        console.log(err.message); // Log any errors
      });
  }, []); // Empty dependency array to run only once on component mount
  
  // Filter vehicles based on selected category
  useEffect(() => {
    if (selectedCategory) {
      const filtered = vehicles.filter(
        (vehicle) => vehicle.category === selectedCategory
      );
      setFilteredVehicles(filtered);
    }
  }, [selectedCategory, vehicles]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedVehicleId) {
      navigate(`/vehicle/update/${selectedVehicleId}`);
    } else {
      alert("Please select a vehicle.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="vehicle-card card p-4 shadow">
        <h2 className="mb-4 text-center">Select a Vehicle to Update</h2>

        {/* Dropdown for categories */}
        <div className="form-group mb-4">
          <label htmlFor="category" className="text-black mb-2">Category</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
          >
            <option value="">Select Category</option>
            {categories.map((category, i) => (
              <option key={i} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown for vehicle names based on category */}
        <div className="form-group mb-4">
          <label htmlFor="vehicle" className="text-black mb-2">Vehicle Name</label> 
          <select
            id="vehicle"
            value={selectedVehicleId || ""}
            onChange={(e) => setSelectedVehicleId(parseInt(e.target.value))}
            className="form-select"
          >
            <option value="">Select Vehicle</option>
            {filteredVehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit button */}
        <div className="text-center mt-4">
          <button onClick={handleSubmit} className="btn btn-primary btn-animated">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleSelector;
