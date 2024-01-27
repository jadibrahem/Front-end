// AuthRouteWrapper.js
import React from 'react';
import { AuthProvider } from './AuthContext.js'; // Import your AuthProvider

const AuthRouteWrapper = ({ children }) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
};

export default AuthRouteWrapper;