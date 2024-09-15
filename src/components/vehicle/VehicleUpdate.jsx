import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const VehicleUpdate = () => {
  const { id } = useParams(); // Extract vehicle ID from the URL
  const navigate = useNavigate();

  const [vehicleDetails, setVehicleDetails] = useState({
    id: "",
    name: "",
    engine: "",
    power: "",
    weight: "",
    price: "",
    stock: 0,
    range: "",
    batteryCapacity: "",
    topSpeed: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Snackbar severity

  // Fetch vehicle details by ID
  useEffect(() => {
    axios
      .get(`http://localhost:5000/vehicles/${id}`)
      .then((response) => {
        setVehicleDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching vehicle details:", error);
        setSnackbarMessage("Vehicle not found");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setTimeout(() => navigate("/vehicle/select"), 2000); // Redirect after a short delay
      });
  }, [id, navigate]);

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/vehicles/${id}`, vehicleDetails, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        setSnackbarMessage("Vehicle details updated successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setTimeout(() => navigate("/vehicle/list"), 2000); // Redirect after a short delay
      })
      .catch((error) => {
        console.error("Error updating vehicle details:", error);
        setSnackbarMessage("Error updating vehicle details.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const { category, type, name, engine, power, weight, price, range, batteryCapacity, topSpeed } = vehicleDetails;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2
          style={{
            backgroundColor: "#343a40",  // Dark background color for the heading
            color: "#fff",               // Light text for contrast
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          Update Vehicle Information
        </h2>
        <button
          onClick={() => navigate("/vehicle/list")}
          className="btn btn-secondary"
          style={{
            backgroundColor: "#6c757d",  // Dark background for back button
            color: "#fff",               // Light text color
            border: "none",              // Remove border for a modern look
          }}
        >
          Back
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-4 mb-3">
            <label htmlFor="name" className="form-label">Vehicle Name</label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={handleInputChange}
              type="text"
              className="form-control"
            />
          </div>
          {type !== '2W Electric' && (
            <div className="col-lg-4 mb-3">
              <label htmlFor="engine" className="form-label">Engine</label>
              <input
                id="engine"
                name="engine"
                value={engine}
                onChange={handleInputChange}
                type="text"
                className="form-control"
              />
            </div>
          )}
          {type !== '2W Electric' && (
            <div className="col-lg-4 mb-3">
              <label htmlFor="power" className="form-label">Power</label>
              <input
                id="power"
                name="power"
                value={power}
                onChange={handleInputChange}
                type="text"
                className="form-control"
              />
            </div>
          )}
          {type !== '2W Electric' && (
            <div className="col-lg-4 mb-3">
              <label htmlFor="weight" className="form-label">Weight</label>
              <input
                id="weight"
                name="weight"
                value={weight}
                onChange={handleInputChange}
                type="text"
                className="form-control"
              />
            </div>
          )}
          {type === '2W Electric' && (
            <>
              <div className="col-lg-4 mb-3">
                <label htmlFor="range" className="form-label">Range</label>
                <input
                  id="range"
                  name="range"
                  value={range}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="col-lg-4 mb-3">
                <label htmlFor="batteryCapacity" className="form-label">Battery Capacity</label>
                <input
                  id="batteryCapacity"
                  name="batteryCapacity"
                  value={batteryCapacity}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="col-lg-4 mb-3">
                <label htmlFor="topSpeed" className="form-label">Top Speed</label>
                <input
                  id="topSpeed"
                  name="topSpeed"
                  value={topSpeed}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control"
                />
              </div>
            </>
          )}
          <div className="col-lg-4 mb-3">
            <label htmlFor="price" className="form-label">Price</label>
            <input
              id="price"
              name="price"
              value={price}
              onChange={handleInputChange}
              type="text"
              className="form-control"
            />
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            type="submit"
            className="btn btn-success me-2"
            style={{
              backgroundColor: "#28a745",  // Dark green background for Update button
              color: "#fff",               // Light text color
              border: "none",              // Remove borders for modern look
              padding: "10px 20px",
            }}
          >
            Update
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/vehicle/list")}
            style={{
              backgroundColor: "#6c757d",  // Dark grey background for Back button
              color: "#fff",               // Light text color
              border: "none",              // Remove borders for modern look
              padding: "10px 20px",
            }}
          >
            Back
          </button>
        </div>
      </form>

      {/* Snackbar component */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default VehicleUpdate;
