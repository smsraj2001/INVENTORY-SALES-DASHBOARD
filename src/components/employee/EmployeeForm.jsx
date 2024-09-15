import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Snackbar, Alert, Button, TextField, Select, MenuItem, InputLabel, FormControl, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Card, CardContent, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL;

const EmployeeForm = () => {
    const [employee, setEmployee] = useState({
        id: '',
        name: '',
        gender: '',
        department: '',
        mail_id: '',
        password: '',
        phone_number: ''
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            axios.get(`${apiUrl}/users/${id}`)
                .then(response => {
                    setEmployee(response.data);
                })
                .catch(error => {
                    console.error('Error fetching employee data:', error);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!['Inventory', 'Sales'].includes(employee.department)) {
            setSnackbarMessage('Only Inventory and Sales employees can be added or updated here.');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return;
        }

        if (id) {
            updateEmployee();
        } else {
            addEmployee();
        }
    };

    const addEmployee = () => {
        axios.post(`${apiUrl}/users`, employee)
            .then(() => {
                setSnackbarMessage('Employee added successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                navigate('/employeelist');
            })
            .catch(error => {
                console.error('Error adding employee:', error);
                setSnackbarMessage('Error adding employee');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    const updateEmployee = () => {
        axios.patch(`${apiUrl}/users/${id}`, employee)
            .then(() => {
                setSnackbarMessage('Employee updated successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                navigate('/employeelist');
            })
            .catch(error => {
                console.error('Error updating employee:', error);
                setSnackbarMessage('Error updating employee');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    const handleDeleteClick = () => {
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = () => {
        setDeleteConfirmOpen(false);
        axios.delete(`${apiUrl}/users/${id}`)
            .then(() => {
                setSnackbarMessage('Employee deleted successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                navigate('/employeelist');
            })
            .catch(error => {
                console.error('Error deleting employee:', error);
                setSnackbarMessage('Error deleting employee');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{
            backgroundImage: "url('/Pictures/background_employee.gif')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            minHeight: '100vh',
            width: '100%'
        }}>
            <Box
                className="container mt-5"
                sx={{
                    maxWidth: '600px',
                    mx: 'auto',
                    padding: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    boxShadow: 3,
                    mb: 3
                }}
            >
                <Card className="mb-3" sx={{
                    backgroundColor: 'transparent',
                    borderRadius: '8px',
                    boxShadow: 3,
                    border: '1px solid #d32f2f' // Border line
                }}>
                    <CardContent>
                        <Typography variant="h5" component="h1" align="center" sx={{ mb: 4, color: '#d32f2f', fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold' }}>
                            {id ? `Edit Employee (${id}) - ${employee.name}` : 'Add Employee'}
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <TextField
                                    fullWidth
                                    label="ID"
                                    name="id"
                                    value={employee.id}
                                    onChange={handleChange}
                                    disabled={!!id}
                                    required
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#333'
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#555'
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <div className="mb-3">
                                <TextField
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    value={employee.name}
                                    onChange={handleChange}
                                    required
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#333'
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#555'
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <div className="mb-3">
                                <FormControl fullWidth>
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        label="Gender"
                                        name="gender"
                                        value={employee.gender}
                                        onChange={handleChange}
                                        required
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: '#333'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#555'
                                                }
                                            }
                                        }}
                                    >
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="mb-3">
                                <FormControl fullWidth>
                                    <InputLabel>Department</InputLabel>
                                    <Select
                                        label="Department"
                                        name="department"
                                        value={employee.department}
                                        onChange={handleChange}
                                        required
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: '#333'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#555'
                                                }
                                            }
                                        }}
                                    >
                                        <MenuItem value="Sales">Sales</MenuItem>
                                        <MenuItem value="Inventory">Inventory</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="mb-3">
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="mail_id"
                                    value={employee.mail_id}
                                    onChange={handleChange}
                                    required
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#333'
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#555'
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <div className="mb-3">
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={employee.password}
                                    onChange={handleChange}
                                    required
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#333'
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#555'
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <div className="mb-3">
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phone_number"
                                    value={employee.phone_number}
                                    onChange={handleChange}
                                    required
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#333'
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#555'
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
                                    {id ? 'Update Employee' : 'Add Employee'}
                                </Button>

                                {id && (
                                    <Button variant="outlined" color="error" onClick={handleDeleteClick}>
                                        Delete Employee
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    message={snackbarMessage}
                    action={
                        <Button color="inherit" onClick={handleCloseSnackbar}>
                            Close
                        </Button>
                    }
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
                <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this employee?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                        <Button onClick={handleDeleteConfirm} color="error">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
    );
};

export default EmployeeForm;
