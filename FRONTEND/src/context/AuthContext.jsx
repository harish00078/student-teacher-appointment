import { createContext, useState, useEffect, useContext } from "react";
import { login as loginService } from "../services/auth.service";
import api from "../services/api";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");
      
      if (storedToken) {
        setToken(storedToken);
        setRole(storedRole);
        try {
            // Fetch fresh user data
            const { data } = await api.get("/auth/me");
            setUser(data);
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            // If fetching profile fails (e.g. invalid token), maybe logout?
            // For now, fall back to what we have or do nothing.
            // But if token is invalid, we should probably clear it.
            if (error.response && error.response.status === 401) {
                logout();
            }
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await loginService(credentials);
    const { token, role, ...userData } = data;
    
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    // localStorage.setItem("userData", JSON.stringify({ role, ...userData })); // No longer strictly needed if we fetch on load, but good for offline/initial render? 
    // Actually, let's keep it simple and just rely on API or login response.
    
    setToken(token);
    setRole(role);
    setUser({ role, ...userData });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // localStorage.removeItem("userData");
    setToken(null);
    setRole(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    role,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};