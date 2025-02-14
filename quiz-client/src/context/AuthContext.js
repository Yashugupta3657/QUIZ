import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
    const login = (newToken,newUserId) => {
        setToken(newToken);
        setUserId(newUserId)
        localStorage.setItem("token", newToken);
        localStorage.setItem("userId", newUserId);
    };

    const logout = () => {
        setToken("");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ token, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
