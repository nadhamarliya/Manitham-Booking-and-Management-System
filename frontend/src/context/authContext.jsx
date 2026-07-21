import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const userContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
    const verifyUserSession = async () => {
        try {
            const token = localStorage.getItem('manitham_token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await axios.get('https://onrender.com', {
                headers: {
                    'Authorization': `Bearer ${token}` // Pass token safely via headers
                }
            });

            if (response.data.success) {
                setUser(response.data.user);
            } else {
                localStorage.removeItem('manitham_token');
                setUser(null);
            }
        } catch (error) {
            localStorage.removeItem('manitham_token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    verifyUserSession();
}, []); 

// Also update your logout function to wipe the token:
const logout = () => {
    localStorage.removeItem('manitham_token');
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
