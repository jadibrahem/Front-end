import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.js';
import '../../components/log.css';

const FinanceLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Define error state
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/finance/login/', { username, password });
            sessionStorage.setItem('token', response.data.token); // Store the token
            login(response.data.user);  // Assuming the response includes the user data
            navigate('/purchas-list');
        } catch (error) {
            console.error('Login failed:', error);
            // Update error state with a user-friendly message
            setError('Failed to log in. Please check your credentials.');
        }
    };

    return (
        <div className="finance-login-container">
            <form onSubmit={handleSubmit} className="finance-login-form">
                <h2>Finance Login</h2>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default FinanceLogin;