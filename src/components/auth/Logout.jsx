import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("user", false);
        navigate('/login');
    }, [navigate]);

    return (
        <div className="text-center mt-5">
            <h1>Logging Out...</h1>
        </div>
    );
};

export default Logout;
