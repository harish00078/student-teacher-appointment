import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { token, role: userRole } = useAuth();

  if (!token || userRole !== role) return <Navigate to="/" />;
  return children;
}
