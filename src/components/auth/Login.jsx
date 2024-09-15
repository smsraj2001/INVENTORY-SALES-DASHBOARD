import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const apiUrl = process.env.REACT_APP_API_URL;

const Login = () => {
    const [users, setUsers] = useState([]);
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${apiUrl}/users`)
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                setSnackbarMessage('Error fetching user data');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    }, []);

    const validateUser = (e) => {
        e.preventDefault();

        if (users.length === 0) return;

        let isValidUser = false;

        for (const user of users) {
            const { id: id_json, password: pass_json, department: department_js, name: name_json } = user;

            if (id === id_json && password === pass_json) {
                if (department_js === "Admin" || department_js === "Inventory" || department_js === "Sales") {
                    setSnackbarMessage(`Hello ${name_json}! Press OK to continue`);
                    setSnackbarSeverity('success');
                    setSnackbarOpen(true);

                    const loggedInUser = { id: id_json, password: pass_json, department: department_js, name: name_json };
                    localStorage.setItem("user", JSON.stringify(loggedInUser));
                    navigate("/home");
                    isValidUser = true;
                    break;
                }
            }
        }

        if (!isValidUser) {
            setSnackbarMessage('Invalid User');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: "url('Pictures/background.jpg')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            minHeight: '100vh',
            width: '100%',
        }}>
            <div style={{
                padding: '25px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                borderRadius: '10px',
                background: 'linear-gradient(to bottom right, #ffffff, #f0f4f8)',
                width: '100%',
                maxWidth: '320px',
                textAlign: 'center',
            }}>
                <img
                    src="logo/tvslogo.jpg"
                    alt="TVS MOTORS"
                    style={{ width: '220px', height: '110px', marginBottom: '20px' }}
                />
                <h2 style={{
                    marginBottom: '20px',
                    backgroundColor: '#343a40',
                    color: '#f8f9fa',
                    padding: '12px',
                    borderRadius: '5px',
                }}>
                    Inventory & Sales
                </h2>

                <form onSubmit={validateUser}>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="id" style={{
                            color: '#333',
                            display: 'block',
                            marginBottom: '5px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}>
                            User ID <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type='text'
                            id='id'
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '5px',
                                border: '2px solid #ced4da',
                                transition: 'border-color 0.3s ease',
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#007bff'}
                            onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="password" style={{
                            color: '#333',
                            display: 'block',
                            marginBottom: '5px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}>
                            Password <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type='password'
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '5px',
                                border: '2px solid #ced4da',
                                transition: 'border-color 0.3s ease',
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#007bff'}
                            onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                            required
                        />
                    </div>
                    <button type='submit' style={{
                        backgroundColor: '#007bff',
                        color: '#fff',
                        padding: '12px',
                        width: '100%',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                    }}>
                        Login
                    </button>
                </form>
            </div>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} elevation={6} variant="filled">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default Login;
