import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from '@mui/material';
import './VehicleRemove.css';  // Import the CSS file
const apiUrl = process.env.REACT_APP_API_URL;

const VehicleRemove = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  // Fetch vehicles
  useEffect(() => {
    axios.get(`${apiUrl}/vehicles`)
      .then((response) => {
        setVehicles(response.data); // Set vehicles with the response data
      })
      .catch((err) => {
        console.log(err.message); // Log any errors
      });
  }, []);

  // Filter vehicles based on selected category
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredVehicles(vehicles);
    } else {
      const filter = vehicles.filter((v) => v.category.toLowerCase() === selectedCategory.toLowerCase());
      setFilteredVehicles(filter);
    }
  }, [selectedCategory, vehicles]);

  // Handle delete button click
  const handleDeleteClick = (id) => {
    setSelectedVehicleId(id);
    setDeleteConfirmOpen(true);
  };

  // Confirm and delete vehicle
  const handleDelete = () => {
    if (selectedVehicleId) {
      axios.delete(`${apiUrl}/vehicles/${selectedVehicleId}`)
        .then(() => {
          setSnackbarMessage("Deleted successfully");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          setDeleteConfirmOpen(false);
          setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== selectedVehicleId)); // Update local state
          setFilteredVehicles(filteredVehicles.filter(vehicle => vehicle.id !== selectedVehicleId)); // Update filtered vehicles
          setSelectedVehicleId(null);
        })
        .catch((err) => {
          console.log(err.message);
          setSnackbarMessage("Error deleting vehicle");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          setDeleteConfirmOpen(false);
          setSelectedVehicleId(null);
        });
    }
  };

  // Handle Snackbar close
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

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

      <div className="container mt-5">
        <div className="row">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="col-md-4 mb-4">
              <div className="del-card">
                <img
                  src={vehicle.image}
                  className="card-img-top"
                  alt={vehicle.name}
                />
                <div className="del-card-body">
                  <h5 className="del-card-title">{vehicle.name}</h5>
                  <table className="table">
                    <tbody>
                      {vehicle.price && (
                        <tr>
                          <td><strong>Price:</strong></td>
                          <td>{vehicle.price}</td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan="2">
                          <button
                            onClick={() => handleDeleteClick(vehicle.id)}
                            className="btn btn-danger mt-3"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this vehicle? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default VehicleRemove;
