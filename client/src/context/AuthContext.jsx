import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLogin = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await api.get("/test");
                    setUser(res.data);
                } catch (err) {
                    console.log(err);
                    localStorage.removeItem("token");
                }
            }
            setLoading(false);
        }
        checkLogin();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post("/auth/login", { email, password })
            localStorage.setItem("token", res.data.token)
            setUser(res.data)
        }
        catch (err) {
            console.log(err);
        }
    }

    const signup = async (name, email, password) => {
        try {
            const res = await api.post("/auth/register", { name, email, password })
            localStorage.setItem("token", res.data.token)
            setUser(res.data)
        }
        catch (err) {
            console.log(err);
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    )
} 