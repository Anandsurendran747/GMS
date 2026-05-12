// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const checkUser = async () => {
            const user = await localStorage.getItem("user");
            if (user) setUser(JSON.parse(user));
            setLoading(false);
        };
        checkUser();
    }, []);





    const login = async (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
    };

    const logout = () => {
        // localStorage.removeItem("token");
        localStorage.removeItem("user");
        setLoading(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ login, logout, loading, user }}>
            {children}
        </AuthContext.Provider>
    );
};