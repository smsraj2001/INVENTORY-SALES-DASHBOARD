import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
const apiUrl = process.env.REACT_APP_API_URL;

const SalesForm = () => {
    const [customerCompanyName, setCustomerCompanyName] = useState('');
    const [orderQuantity, setOrderQuantity] = useState('');
    const [dateOfPurchase, setDateOfPurchase] = useState(null);
    const [vehicleId, setVehicleId] = useState('');
    const [vehicles, setVehicles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const empid = currentUser.id;

    useEffect(() => {
        axios.get(`${apiUrl}/vehicles`)
            .then((response) => {
                setVehicles(response.data);
                const uniqueCategories = [...new Set(response.data.map((vehicle) => vehicle.category))];
                setCategories(uniqueCategories);
            })
            .catch((error) => {
                console.error('Error fetching vehicles:', error);
                setSnackbarMessage('Error fetching vehicle data');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            const filtered = vehicles.filter(vehicle => vehicle.category === selectedCategory);
            setFilteredVehicles(filtered);
        }
    }, [selectedCategory, vehicles]);

    useEffect(() => {
        if (vehicleId) {
            const vehicle = vehicles.find(v => v.id === vehicleId);
            setSelectedVehicle(vehicle);
        } else {
            setSelectedVehicle(null);
        }
    }, [vehicleId, vehicles]);

    const validateForm = () => {
        if (!customerCompanyName || !orderQuantity || !dateOfPurchase || !vehicleId) {
            setSnackbarMessage('Please fill in all fields');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        // Format date to UTC string
        const formattedDate = dateOfPurchase ? dateOfPurchase.toISOString().split('T')[0] : null;

        axios.post(`${apiUrl}/sales`, {
            status: 'Pending',
            customer_company_name: customerCompanyName,
            empid: empid,
            order_quantity: orderQuantity,
            date_of_purchase: formattedDate,
            vehicle_id: vehicleId
        })
            .then(() => {
                setSnackbarMessage('Sales quotation posted successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                resetForm();
                // setTimeout(() => navigate('/saleslist'), 2000);
            })
            .catch((error) => {
                console.error('Error posting sales quotation:', error);
                setSnackbarMessage('Error posting sales quotation');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    const resetForm = () => {
        setCustomerCompanyName('');
        setOrderQuantity('');
        setDateOfPurchase(null);
        setVehicleId('');
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <div className="container mt-5">
            <div className="row g-4">
                {/* Left Column: Sales Form */}
                <div className="col-md-6 bg-light border p-4">
                    <h2 className="text-center mb-4" style={{ fontFamily: "'Roboto', sans-serif", fontWeight: '500', color: '#007bff' }}>
                        Post New Sales Quotation
                    </h2>
                    <form>
                        {/* Customer Company Name Input */}
                        <div className="form-group mb-3">
                            <label className="form-label">Customer Company Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={customerCompanyName}
                                onChange={(e) => setCustomerCompanyName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Order Quantity Input */}
                        <div className="form-group mb-3">
                            <label className="form-label">Order Quantity</label>
                            <input
                                type="number"
                                className="form-control"
                                value={orderQuantity}
                                onChange={(e) => setOrderQuantity(e.target.value)}
                                required
                            />
                        </div>

                        {/* Date of Purchase Picker */}
                        <div className="form-group mb-3">
                            <label className="form-label me-2">Date of Purchase</label>
                            <DatePicker
                                selected={dateOfPurchase}
                                onChange={(date) => setDateOfPurchase(date)}
                                className="form-control"
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select date"
                                popperPlacement="bottom" 
                            />
                        </div>

                        {/* Dropdown for categories */}
                        <div className="form-group mb-3">
                            <label className="form-label">Category</label>
                            <select
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

                        {/* Dropdown for vehicle names */}
                        <div className="form-group mb-4">
                            <label className="form-label">Vehicle Name</label>
                            <select
                                value={vehicleId || ""}
                                onChange={(e) => setVehicleId(e.target.value)}
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

                        {/* Display Selected Vehicle Image */}
                        {selectedVehicle && (
                            <div className="mb-4 text-center">
                                <img
                                    src={selectedVehicle.image}
                                    alt={selectedVehicle.name}
                                    className="img-fluid"
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                                <p>{selectedVehicle.name}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button type="button" className="btn btn-primary btn-block shadow-lg" onClick={handleSubmit}>
                            Submit
                        </button>
                    </form>

                    {/* Snackbar for notifications */}
                    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </div>

                {/* Right Column: Sales Guidelines */}
                <div className="col-md-6 bg-light border p-4 d-flex align-items-center">
                    <div>
                        <h4 className="text-center mb-4" style={{ fontFamily: "'Roboto', sans-serif", fontWeight: '500', color: '#007bff' }}>
                            Sales Guidelines for Posting a New Sale
                        </h4>
                        <ul className="list-unstyled">
                            <li className="d-flex align-items-start mb-3">
                                <FaCheckCircle className="me-2" style={{ color: '#28a745', fontSize: '1.2rem' }} />
                                <span>Please ensure that the customer's company name is correct.</span>
                            </li>
                            <li className="d-flex align-items-start mb-3">
                                <FaExclamationCircle className="me-2" style={{ color: '#dc3545', fontSize: '1.2rem' }} />
                                <span>Enter the exact quantity of vehicles ordered by the customer.</span>
                            </li>
                            <li className="d-flex align-items-start mb-3">
                                <FaCheckCircle className="me-2" style={{ color: '#28a745', fontSize: '1.2rem' }} />
                                <span>Make sure the selected vehicle category matches the customer's request.</span>
                            </li>
                            <li className="d-flex align-items-start mb-3">
                                <FaInfoCircle className="me-2" style={{ color: '#17a2b8', fontSize: '1.2rem' }} />
                                <span>Verify that the date of purchase aligns with the customer's expectations.</span>
                            </li>
                            <li className="d-flex align-items-start mb-3">
                                <FaExclamationCircle className="me-2" style={{ color: '#dc3545', fontSize: '1.2rem' }} />
                                <span>Check that the vehicle image is properly displayed after selection.</span>
                            </li>
                            <li className="d-flex align-items-start mb-3">
                                <FaCheckCircle className="me-2" style={{ color: '#28a745', fontSize: '1.2rem' }} />
                                <span>Please follow the industry best practices.</span>
                            </li>
                            <li className="d-flex align-items-start mb-3">
                                <FaInfoCircle className="me-2" style={{ color: '#17a2b8', fontSize: '1.2rem' }} />
                                <span>Always be obsessed with the dealer expectations & have good rapport.</span>
                            </li>
                            <li className="d-flex align-items-start mb-3">
                                <FaInfoCircle className="me-2" style={{ color: '#17a2b8', fontSize: '1.2rem' }} />
                                <span>Status update might take 1 or 2 business days.</span>
                            </li>
                            <li className="d-flex align-items-start mb-3">
                                <FaExclamationCircle className="me-2" style={{ color: '#dc3545', fontSize: '1.2rem' }} />
                                <span>Rejection of quotation might occur due to low stock or pricing dispute.</span>
                            </li>
                            <li className="d-flex align-items-start mb-3">
                                <FaCheckCircle className="me-2" style={{ color: '#28a745', fontSize: '1.2rem' }} />
                                <span>Please make sure to annual sales report by end of March.</span>
                            </li>
                            <li className="d-flex align-items-start mb-3">
                                <FaInfoCircle className="me-2" style={{ color: '#17a2b8', fontSize: '1.2rem' }} />
                                <span>For any support, make sure to contact: <a href="mailto:sales@tvsmotor.com">sales@tvsmotor.com</a></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesForm;
