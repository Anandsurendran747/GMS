// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        usertype: '',
        userid: null,
    });
    useEffect(() => {
        const storedToken = async () => {
            const token = await localStorage.getItem("token");
            if (token) setToken(token);
            setLoading(false);
        };
        storedToken();
    }, []);

    const setUserData = async (userData) => {
       await localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    }

    

    const login = async (token) => {
        localStorage.setItem("token", token);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setLoading(false);
        setUser({ usertype: '', userdata: {} });
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, loading ,user,  setUserData}}>
            {children}
        </AuthContext.Provider>
    );
};