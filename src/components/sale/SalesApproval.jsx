import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    CardActions,
    Button,
    Typography,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './SalesApproval.css'; 
const apiUrl = process.env.REACT_APP_API_URL;

const SalesApproval = () => {
    const [sales, setSales] = useState([]);
    const [vehicles, setVehicles] = useState({});
    const [employees, setEmployees] = useState({});
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedSaleId, setSelectedSaleId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const [statusFilter, setStatusFilter] = useState('All');
    const [vehicleFilter, setVehicleFilter] = useState('All');
    const navigate = useNavigate(); // Initialize useNavigate hook
    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        // Fetch sales data
        axios.get(`${apiUrl}/sales`)
            .then(response => {
                setSales(response.data);
            })
            .catch(error => {
                console.error('Error fetching sales data:', error);
            });

        // Fetch vehicles data
        axios.get(`${apiUrl}/vehicles`)
            .then(response => {
                const vehiclesData = response.data.reduce((map, vehicle) => {
                    map[vehicle.id] = vehicle;
                    return map;
                }, {});
                setVehicles(vehiclesData);
            })
            .catch(error => {
                console.error('Error fetching vehicle data:', error);
            });

        // Fetch employees data
        axios.get(`${apiUrl}/users`)
            .then(response => {
                const employeesData = response.data.reduce((map, employee) => {
                    map[employee.id] = employee.name;
                    return map;
                }, {});
                setEmployees(employeesData);
            })
            .catch(error => {
                console.error('Error fetching employee data:', error);
            });
    }, []);

    const handleApproval = (sale) => {
        const { id, order_quantity, vehicle_id } = sale;
        axios.get(`${apiUrl}/vehicles/${vehicle_id}`)
            .then(vehicleResponse => {
                const vehicle = vehicleResponse.data;
                if (parseInt(vehicle.stock) < order_quantity) {
                    setSnackbarMessage('Insufficient stock to approve the sale');
                    setSnackbarSeverity('warning');
                    setSnackbarOpen(true);
                } else {
                    const updatedStock = parseInt(vehicle.stock) - order_quantity;
                    axios.patch(`${apiUrl}/vehicles/${vehicle_id}`, { stock: updatedStock })
                        .then(() => {
                            return axios.patch(`${apiUrl}/sales/${id}`, { status: 'Approved' });
                        })
                        .then(() => {
                            setSnackbarMessage('Sale approved and stock updated successfully');
                            setSnackbarSeverity('success');
                            setSnackbarOpen(true);
                            setSales(prevSales => prevSales.map(s => s.id === id ? { ...s, status: 'Approved' } : s));
                        })
                        .catch(error => {
                            console.error('Error approving sale or updating stock:', error);
                            setSnackbarMessage('Error updating sale status or stock');
                            setSnackbarSeverity('error');
                            setSnackbarOpen(true);
                        });
                }
            })
            .catch(error => {
                console.error('Error fetching vehicle data:', error);
                setSnackbarMessage('Error fetching vehicle details');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    const handleRejection = (sale) => {
        const { id } = sale;
        axios.patch(`${apiUrl}/sales/${id}`, { status: 'Rejected' })
            .then(() => {
                setSnackbarMessage('Sale rejected successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setSales(prevSales => prevSales.map(s => s.id === id ? { ...s, status: 'Rejected' } : s));
            })
            .catch(error => {
                console.error('Error rejecting sale:', error);
                setSnackbarMessage('Error rejecting sale');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    const handleOpenDeleteConfirm = (id) => {
        setSelectedSaleId(id);
        setDeleteConfirmOpen(true);
    };

    const handleCloseDeleteConfirm = () => {
        setDeleteConfirmOpen(false);
        setSelectedSaleId(null);
    };

    const handleConfirmDelete = () => {
        axios.delete(`${apiUrl}/sales/${selectedSaleId}`)
            .then(() => {
                setSnackbarMessage('Sale deleted successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setSales(prevSales => prevSales.filter(sale => sale.id !== selectedSaleId));
                handleCloseDeleteConfirm();
            })
            .catch(error => {
                console.error('Error deleting sale:', error);
                setSnackbarMessage('Error deleting sale');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                handleCloseDeleteConfirm();
            });
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Approved': return 'card-approved';
            case 'Rejected': return 'card-rejected';
            default: return 'card-pending';
        }
    };

    const handleStatusFilterChange = (status) => {
        setStatusFilter(status);
    };

    const handleVehicleFilterChange = (event) => {
        setVehicleFilter(event.target.value);
    };

    const filteredSales = sales.filter(sale => {
        // Filter by status
        if (statusFilter === 'Completed') {
            if (sale.status === 'Pending') return false;
        } else if (statusFilter !== 'All') {
            if (sale.status !== statusFilter) return false;
        }

        // Filter by vehicle
        if (vehicleFilter !== 'All') {
            // Ensure both sale.vehicle_id and vehicleFilter are compared as strings
            if (String(sale.vehicle_id) !== String(vehicleFilter)) return false;
        }

        return true;
    });

    // Get list of unique vehicle IDs from sales for the vehicle filter dropdown
    const vehicleOptions = Object.values(vehicles).map(vehicle => ({
        id: String(vehicle.id), // Ensure vehicle IDs are strings
        name: vehicle.name
    }));


    return (
        <Box className="container">
            <Box display="flex" justifyContent="space-between" mb={3}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/calsales")}
                >
                    Calendar List View
                </Button>
            </Box>

            <h1 className="text-center mb-4 text-white bg-dark p-3 rounded">Sales Approval</h1>

            {/* Filters Section */}
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="center" alignItems={{ xs: 'stretch', md: 'center' }} mb={3} gap={2}>
                {/* Status Filters */}
                <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
                    <Button variant={statusFilter === 'All' ? 'contained' : 'outlined'} onClick={() => handleStatusFilterChange('All')} className="mx-1">All</Button>
                    <Button variant={statusFilter === 'Completed' ? 'contained' : 'outlined'} onClick={() => handleStatusFilterChange('Completed')} className="mx-1">Completed</Button>
                    <Button variant={statusFilter === 'Approved' ? 'contained' : 'outlined'} onClick={() => handleStatusFilterChange('Approved')} className="mx-1">Approved</Button>
                    <Button variant={statusFilter === 'Pending' ? 'contained' : 'outlined'} onClick={() => handleStatusFilterChange('Pending')} className="mx-1">Pending</Button>
                    <Button variant={statusFilter === 'Rejected' ? 'contained' : 'outlined'} onClick={() => handleStatusFilterChange('Rejected')} className="mx-1">Rejected</Button>
                </Box>

                {/* Vehicle Filter */}
                <FormControl variant="outlined" size="small" className="mx-1" style={{ minWidth: 200 }}>
                    <InputLabel id="vehicle-filter-label">Filter by Vehicle</InputLabel>
                    <Select
                        labelId="vehicle-filter-label"
                        id="vehicle-filter"
                        value={vehicleFilter}
                        onChange={handleVehicleFilterChange}
                        label="Filter by Vehicle"
                    >
                        <MenuItem value="All">All Vehicles</MenuItem>
                        {vehicleOptions.map(vehicle => (
                            <MenuItem key={vehicle.id} value={vehicle.id}>
                                {vehicle.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Sales Cards */}
            <Box className="cards-container">
                {filteredSales.length === 0 ? (
                    <Typography variant="h6" className="text-center">
                        No sales found matching the selected filters.
                    </Typography>
                ) : (
                    filteredSales.map(sale => (
                        <Card key={sale.id} className={`card ${getStatusClass(sale.status)}`}>
                            <CardContent className="card-content">
                                <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
                                    <img
                                        src={vehicles[sale.vehicle_id]?.image || '/path/to/default-image.jpg'}
                                        alt={vehicles[sale.vehicle_id]?.name || 'Vehicle Image'}
                                        className="card-image"
                                    />
                                    <Box ml={2}>
                                        <Typography component="div" className="font-weight-bold mb-1 small-font">
                                            {vehicles[sale.vehicle_id]?.name} (ID: {sale.vehicle_id})
                                        </Typography>
                                        <Typography variant="body2" className="text-muted">
                                            Employee: {employees[sale.empid]}
                                        </Typography>
                                        <Typography variant="body2" className="status-text">
                                            Status: {sale.status}
                                        </Typography>
                                        <Typography variant="body2">
                                            Order Quantity: {sale.order_quantity}
                                        </Typography>
                                        <Typography variant="body2">
                                            Date: {new Date(sale.date_of_purchase).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                            <CardActions className="card-actions">
                                {(sale.status === 'Pending' || sale.status === 'Rejected' || sale.status === 'Approved') && (
                                    <Box display="flex" justifyContent="center" width="100%" gap={2}>
                                        {sale.status !== 'Approved' && (
                                            <Button size="small" variant="contained" color="success" onClick={() => handleApproval(sale)}>Approve</Button>
                                        )}
                                        {sale.status === 'Pending' && (
                                            <Button size="small" variant="contained" color="error" onClick={() => handleRejection(sale)}>Reject</Button>
                                        )}
                                        <Button size="small" variant="contained" color="secondary" onClick={() => handleOpenDeleteConfirm(sale.id)}>Delete</Button>
                                    </Box>
                                )}
                            </CardActions>
                        </Card>
                    ))
                )}
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
                <DialogTitle className="dialog-title">Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this sale?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Notifications */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} className="snackbar-message">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SalesApproval;
