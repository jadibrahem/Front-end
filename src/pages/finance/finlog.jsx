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
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('loginType', 'finance'); // Store login type
            login(response.data.user);
            navigate('/finance-dashboard'); // Navigate to a finance-specific dashboard if you have one
        } catch (error) {
            console.error('Login failed:', error);
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