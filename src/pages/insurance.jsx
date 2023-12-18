import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../components/insurance.css'; // Importing a CSS file for styling

const Insurance = () => {
    const [insuranceNumber, setInsuranceNumber] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://halotrust.pythonanywhere.com/loginnum/', { insuranceNumber });
            navigate('/attendance', { state: { employee: response.data } });
        } catch (error) {
            setError('Login failed. Please try again.');
            console.error('Login error', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2 className="login-title">Employee Login</h2>
                <input
                    className="login-input"
                    type="text"
                    value={insuranceNumber}
                    onChange={(e) => setInsuranceNumber(e.target.value)}
                    placeholder="Enter your Insurance Number"
                />
                <button className="login-button" onClick={handleLogin}>Login</button>
                {error && <p className="login-error">{error}</p>}
            </div>
        </div>
    );
};

export default Insurance;