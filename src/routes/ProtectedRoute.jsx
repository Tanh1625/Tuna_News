import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import LoadingSpinner from "../components/global/loading-spinner";
import AccessDenied from "../pages/auth/AccessDenied";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  console.log("ProtectedRoute - loading:", loading, "user:", user);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  // If not authenticated, redirect to login page.
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If authenticated, check for roles
  if (allowedRoles && allowedRoles.length > 0 && user.roles) {
    const userRole = user.roles[0];
    if (!allowedRoles.includes(userRole)) {
      return <AccessDenied />; // or redirect to a "Not Authorized" page
    }
  }

  // If authenticated but does not have the required role, show "Access Denied" message.
  return children ? <>{children}</> : <Outlet />;
}
