import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Avatar from 'avataaars';
import { Button } from '@mui/material';
import './UserProfileDetails.css'; 
const apiUrl = process.env.REACT_APP_API_URL;

const UserProfileDetails = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("user")); // Get userId from localStorage
    const userId = currentUser?.id;

    let logout = () => {

        localStorage.setItem("user", false);
        navigate('/login');

        return (
            <div className="text-center mt-5">
                <h1>Logging Out...</h1>
            </div>
        );
    };

    useEffect(() => {
        if (!userId) {
            navigate("/login"); // Redirect to login if no userId is found in localStorage
            return;
        }

        axios.get(`${apiUrl}/users/${userId}`)
            .then(response => {
                setUser(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError('Error fetching user data');
                setLoading(false);
            });
    }, [navigate, userId]);

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-5 text-danger">{error}</div>;
    }

    const getAvatarProps = (gender) => {
        return gender === 'Male'
            ? {
                topType: 'ShortHairShortFlat',
                clotheType: 'BlazerShirt',
                skinColor: 'Light'
            }
            : {
                topType: 'LongHairStraight',
                clotheType: 'BlazerShirt',
                skinColor: 'Light'
            };
    };

    return (
        <section className="user-profile-section" style={{ backgroundColor: '#eee' }}>
            <div className="container py-5">
                <div className="row align-items-start"> 
                    <div className="col-lg-4 text-center">
                        <Avatar
                            avatarStyle='Circle'
                            topType={getAvatarProps(user.gender).topType}
                            clotheType={getAvatarProps(user.gender).clotheType}
                            accessoriesType='Blank'
                            eyeType='Default'
                            eyebrowType='Default'
                            mouthType='Smile'
                            skinColor={getAvatarProps(user.gender).skinColor}
                            style={{ width: '150px', height: '150px' }}
                        />
                        <h5 className="my-3 text-dark">{user.name}</h5>
                        <p className="text-muted mb-3">{user.department}</p> 
                        <div className="d-flex justify-content-center mb-4"> 
                            <Button type="button" variant="contained" color="primary" className="me-2">Edit</Button>
                            <Button type="button" variant="outlined" color="primary" onClick={logout}>Logout</Button>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="user-details p-4" style={{ backgroundColor: '#fff', borderRadius: '10px', height: '100%' }}>
                            <h4 className="mb-4 text-center">User Details</h4>
                            <table className="table table-borderless">
                                <tbody>
                                    <tr>
                                        <th scope="row">Full Name</th>
                                        <td>{user.name}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Email</th>
                                        <td>{user.mail_id}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Phone</th>
                                        <td>{user.phone_number}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Department</th>
                                        <td>{user.department}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Gender</th>
                                        <td>{user.gender}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default UserProfileDetails;