import { createContext, useContext, useState, useEffect } from "react";
import getUserFromToken, { isTokenExpired } from "../utils/jwt";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [logoutTimer, setLogoutTimer] = useState(null);

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      // Check if token is expired
      if (isTokenExpired(token)) {
        console.log("Token expired, clearing...");
        localStorage.removeItem("accessToken");
        setUser(null);
      } else {
        const userData = getUserFromToken(token);
        console.log("Token valid, user loaded:", userData);
        setUser(userData);
        
      }
    }

    setLoading(false); // Done checking
  }, []);

  const login = (token) => {
    localStorage.setItem("accessToken", token);
    const userData = getUserFromToken(token);
    setUser(userData);
    setAutoLogout(token);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    if (logoutTimer) {
      clearTimeout(logoutTimer);
      setLogoutTimer(null);
    }
  };

  const setAutoLogout = (token) => {
    if (!token) return;
    
    const decoded = getUserFromToken(token);
    if (!decoded?.exp) return;

    const expiresTime = decoded.exp * 1000 - Date.now();// convert to milliseconds

    console.log("Token will be expire in: ", Math.round(expiresTime / 1000), " seconds")
    
    if (logoutTimer) clearTimeout(logoutTimer);
    
    const timer = setTimeout(() => {
      alert("Session expired. Logging out.");
      logout();
    }, expiresTime);

    setLogoutTimer(timer);
   }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
