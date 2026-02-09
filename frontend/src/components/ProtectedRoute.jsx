import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ⏳ Prevent flicker during auth hydration
  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="loader-spinner"></div>
      </div>
    );
  }

  /* 🔒 NOT LOGGED IN
     ✅ FIX: Redirect to HOME, NOT LOGIN
  */
  if (!user) {
    return <Navigate to="/" replace />;
  }

  /* ⛔ ROLE NOT ALLOWED */
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
