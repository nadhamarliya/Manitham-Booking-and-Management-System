import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const userContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const verifyUserSession = async () => {
            try {
                // RESTORED: Directly hit the backend verification endpoint with cookies enabled
                const response = await axios.get('https://onrender.com', {
                    withCredentials: true // MANDATORY: Automatically transmits HTTP-Only cookies
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

    // RESTORED: Clean logout structure mapping your local app state clear loop
    const logout = () => {
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
