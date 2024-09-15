import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Avatar from 'avataaars';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from '@mui/material';
const apiUrl = process.env.REACT_APP_API_URL;

const EmployeeList = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    useEffect(() => {
        axios.get(`${apiUrl}/users`)
            .then(response => {
                setEmployees(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching employees data:', error);
                setError('Error fetching employee data');
                setLoading(false);
            });
    }, []);

    const handleDelete = () => {
        if (selectedEmployeeId) {
            axios.delete(`${apiUrl}/users/${selectedEmployeeId}`)
                .then(() => {
                    setSnackbarMessage('Employee deleted successfully');
                    setSnackbarSeverity('success');
                    setSnackbarOpen(true);
                    setDeleteConfirmOpen(false);
                    setEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== selectedEmployeeId));
                    setSelectedEmployeeId(null);
                })
                .catch(error => {
                    console.error('Error deleting employee:', error);
                    setSnackbarMessage('Error deleting employee');
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                    setDeleteConfirmOpen(false);
                    setSelectedEmployeeId(null);
                });
        }
    };

    const handleDeleteClick = (id) => {
        setSelectedEmployeeId(id);
        setDeleteConfirmOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const getAvatarProps = (gender) => {
        if (gender === 'Male') {
            return {
                topType: 'ShortHairShortFlat',
                clotheType: 'BlazerShirt',
                skinColor: 'Light'
            };
        } else {
            return {
                topType: 'LongHairStraight',
                clotheType: 'BlazerShirt',
                skinColor: 'Light'
            };
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-5 text-danger">{error}</div>;
    }

    return (
        <div className="container mt-5" style={{ maxWidth: '1200px' }}>
            <h1 className="text-center mb-4 text-white bg-dark p-3 rounded">Employee List</h1>
            <div className="row justify-content-center">
                {employees.map(employee => (
                    <div key={employee.id} className="col-sm-6 col-md-6 col-lg-4 d-flex justify-content-center mb-4">
                        <div className="card shadow-sm" style={{ minWidth: '350px', maxWidth: '400px' }}>
                            <div className="card-body text-center">
                                <Avatar
                                    avatarStyle='Circle'
                                    topType={getAvatarProps(employee.gender).topType}
                                    clotheType={getAvatarProps(employee.gender).clotheType}
                                    accessoriesType='Blank'
                                    eyeType='Default'
                                    eyebrowType='Default'
                                    mouthType='Smile'
                                    skinColor={getAvatarProps(employee.gender).skinColor}
                                    style={{ width: '80px', height: '80px' }}
                                />
                                <h5 className="card-title mt-3" style={{ backgroundColor: '#333', color: 'white', padding: '10px', borderRadius: '15px' }}>
                                    {employee.name}
                                </h5>
                                <p className="card-text text-black" style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '10px', margin: '10px 0' }}>
                                    <strong>Department:</strong> {employee.department}
                                </p>
                                <p className="card-text text-black" style={{ backgroundColor: '#e6f7ff', padding: '10px', borderRadius: '10px', margin: '10px 0' }}>
                                    <strong>Email:</strong> {employee.mail_id}
                                </p>
                                <p className="card-text text-black" style={{ backgroundColor: '#eaffea', padding: '10px', borderRadius: '10px', margin: '10px 0' }}>
                                    <strong>Phone:</strong> {employee.phone_number}
                                </p>
                                <div className="d-flex justify-content-center">
                                    <Button size="small" color="info" variant="contained" className='me-2' onClick={() => navigate(`/employeeform/${employee.id}`)}>Edit</Button>
                                    <Button variant="contained" color="error" size="small" onClick={() => handleDeleteClick(employee.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this employee? This action cannot be undone.
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
        </div>
    );
};

export default EmployeeList;
