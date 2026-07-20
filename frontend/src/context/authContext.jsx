import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const userContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const verifyUserSession = async () => {
            try {
                // Production change: Fire a network request to verify the browser's HTTP-Only session cookie
                const response = await axios.get('https://manitham-portal.onrender.com/api/auth/verify', {
                    withCredentials: true // MANDATORY: Instructs the browser to pass along the session cookie securely
                });

                if (response.data.success) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        verifyUserSession();
    }, []); 

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            // Optional: You can hit a backend signout route to clear the cookie, 
            // or simply wipe the user state locally to kill the active session
            setUser(null);
        } catch (error) {
            setUser(null);
        }
    };

    return (
        <userContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </userContext.Provider>
    );
};

export const useAuth = () => useContext(userContext);
export default AuthProvider;
