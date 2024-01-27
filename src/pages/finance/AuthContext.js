import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const getInitialUser = () => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch (error) {
                console.error('Error parsing user from localStorage:', error);
            }
        }
        return null;
    };

    const [currentUser, setCurrentUser] = useState(getInitialUser);

    const login = (user) => {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('token'); // Removes the token from sessionStorage
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);