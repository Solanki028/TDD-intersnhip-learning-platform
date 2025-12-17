import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({ ...decoded, token });
                // Optionally fetch full user details if needed, but token has role/id
            } catch (error) {
                console.error("Invalid token", error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
        localStorage.setItem('token', data.token);
        const decoded = jwtDecode(data.token);
        setUser({ ...decoded, token: data.token });
        return data;
    };

    const register = async (name, email, password, role) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { name, email, password, role });

        if (data.token) {
            localStorage.setItem('token', data.token);
            const decoded = jwtDecode(data.token);
            setUser({ ...decoded, token: data.token });
        }
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
