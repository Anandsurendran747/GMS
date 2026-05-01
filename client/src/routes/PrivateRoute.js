// routes/PrivateRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

export default function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}