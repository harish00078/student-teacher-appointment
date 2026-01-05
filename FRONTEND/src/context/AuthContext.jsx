import { createContext, useState, useEffect, useContext } from "react";
import { login as loginService } from "../services/auth.service";
import api from "../services/api";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
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
            localStorage.setItem("user", JSON.stringify(data));
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            // If fetching profile fails (e.g. invalid token), logout
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
    const userObj = { role, ...userData };

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("user", JSON.stringify(userObj));
    
    setToken(token);
    setRole(role);
    setUser(userObj);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
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