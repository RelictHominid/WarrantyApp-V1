import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decoded.exp < currentTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true;
    }
};

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('Checking token');

            if (isTokenExpired(token)) {
                console.log('Token expired, logging out.')
                setToken(null);
                localStorage.removeItem('token');
                navigate('/login');
            }
        }, 60000)

        return () => clearInterval(interval);
    }, [token, navigate]);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);