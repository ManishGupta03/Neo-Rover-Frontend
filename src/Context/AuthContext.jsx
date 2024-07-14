// AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tokens = Object.keys(sessionStorage);
    if (tokens.length > 0) {
      const storedToken = tokens[0];
      setToken(storedToken);
      setUser(JSON.parse(sessionStorage.getItem(storedToken)));
    }
  }, []);

  const setAuthToken = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    sessionStorage.setItem(newToken, JSON.stringify(userData));
  };

  const removeAuthToken = () => {
    sessionStorage.removeItem(token);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, setAuthToken, removeAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};