import React from 'react';
import { Navigate } from 'react-router-dom';
import log from '../components/log'; // Make sure this path is correct

export const ProtectedRoute = ({ component: Component }) => {
    const isLoggedIn = log.getCurrentUser(); // Replace this with your actual logic

    return isLoggedIn ? <Component /> : <Navigate to="/login" replace />;
};