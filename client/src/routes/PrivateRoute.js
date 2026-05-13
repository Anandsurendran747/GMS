// routes/PrivateRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

export default function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) {
    return <Navigate to="/" />;
  }

  // Role check
  if (allowedRoles && !allowedRoles.includes(user.usertype)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}