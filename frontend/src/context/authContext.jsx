import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const userContext = createContext();

export const AuthProvider = ({ children }) => {
    // FIXED: Instead of starting as null, we check if a token exists first.
    // If a token exists, we don't boot them to login immediately.
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('manitham_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const verifyUserSession = async () => {
            try {
                const token = localStorage.getItem('manitham_token');
                
                if (!token) {
                    setUser(null);
                    localStorage.removeItem('manitham_user');
                    setLoading(false);
                    return;
                }

                // FIXED: URL broken down safely into tiny pieces
                const response = await axios.get(
                    "https://" +
                    "manitham-portal" +
                    ".onrender.com" +
                    "/api/auth/verify", 
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    setUser(response.data.user);
                    // Persistent session fallback cache
                    localStorage.setItem(
                        'manitham_user', 
                        JSON.stringify(response.data.user)
                    );
                } else {
                    localStorage.removeItem('manitham_token');
                    localStorage.removeItem('manitham_user');
                    setUser(null);
                }
            } catch (error) {
                // If token is invalid/expired, wipe everything
                localStorage.removeItem('manitham_token');
                localStorage.removeItem('manitham_user');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        verifyUserSession();
    }, []); 

    const login = (userData) => {
        setUser(userData);
        // Cache user info immediately on successful login
        localStorage.setItem(
            'manitham_user', 
            JSON.stringify(userData)
        );
    };

    // FIXED: Clear user tracking records out of persistent cache memory on explicit logout
    const logout = () => {
        localStorage.removeItem('manitham_token');
        localStorage.removeItem('manitham_user');
        setUser(null);
    };

    return (
        <userContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </userContext.Provider>
    );
};

export const useAuth = () => useContext(userContext);
export default AuthProvider;
