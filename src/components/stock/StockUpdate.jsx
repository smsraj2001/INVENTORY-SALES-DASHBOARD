import { useState, useEffect } from "react";
import axios from "axios";
import { Snackbar, Alert } from '@mui/material';
import "./StockUpdate.css";
const apiUrl = process.env.REACT_APP_API_URL;

const StockUpdate = () => {
  const [vehicles, setVehicles] = useState([]);
  const [updatedStock, setUpdatedStock] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Fetch vehicles data from API
  useEffect(() => {
    axios
      .get(`${apiUrl}/vehicles`)
      .then((response) => {
        const data = response.data;
        setVehicles(data);

        // Initialize updated stock values
        const stockData = {};
        data.forEach((vehicle) => {
          stockData[vehicle.id] = vehicle.stock;
        });
        setUpdatedStock(stockData);
      })
      .catch((err) => console.log(err));
  }, []);

  // Handle stock input change
  const handleStockChange = (id, newStock) => {
    setUpdatedStock((prevState) => ({
      ...prevState,
      [id]: newStock,
    }));
  };

  // Format the price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price.replace(/₹|,/g, ""));
  };

  // Handle stock update button click
  const handleStockUpdate = (id) => {
    const newStock = updatedStock[id];
    const vehicleToUpdate = vehicles.find((vehicle) => vehicle.id === id);

    // Create an updated vehicle object with the new stock
    const updatedVehicle = { ...vehicleToUpdate, stock: newStock };

    axios
      .put(`${apiUrl}/vehicles/${id}`, updatedVehicle, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setSnackbarMessage("Stock updated successfully!");
          setSnackbarSeverity("success");
        } else {
          setSnackbarMessage("Failed to update stock.");
          setSnackbarSeverity("error");
        }
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.log("Error:", err);
        setSnackbarMessage("Error updating stock.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  // Define unique font classes based on vehicle name
  const getFontClass = (name) => {
    const fonts = {
      "TVS Apache": "apache-font",
      "TVS Jupiter": "jupiter-font",
      "TVS NTorq": "ntorq-font",
      "TVS Raider": "raider-font",
      "TVS IQube": "iqube-font",
      "TVS X": "x-font",
      "TVS King Deluxe": "king-font",
      "TVS King Cargo": "cargo-font",
      "TVS Zest": "zest-font",
      "TVS Scooty Pep+": "pep-font",
      "TVS XL100": "xl-font",
    };
    return fonts[name] || "default-font";
  };

  // Handle closing of the snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-white bg-dark p-3 rounded">Vehicle Stock Update</h2>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Weight</th>
            <th>Stock</th>
            <th className="action-column">Action</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  style={{ width: "100px", height: "auto" }}
                  className="tab-img"
                />
              </td>
              <td className={getFontClass(vehicle.name)}>{vehicle.name}</td>
              <td className="price">{formatPrice(vehicle.price)}</td>
              <td>{vehicle.weight}</td>
              <td>
                <input
                  type="number"
                  value={updatedStock[vehicle.id] || vehicle.stock}
                  onChange={(e) => handleStockChange(vehicle.id, e.target.value)}
                  style={{ width: "80px" }}
                />
              </td>
              <td className="action-column">
                <button
                  className="btn btn-primary"
                  onClick={() => handleStockUpdate(vehicle.id)}
                >
                  Update Stock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default StockUpdate;
