import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth-context";

export const PublicRoute = () => {
  const {user} = useAuth();
  const token = localStorage.getItem("accessToken");

  if (user && token) {
    // If user is authenticated, redirect to dashboard or home
    if(user.roles && user.roles[0] === 'ROLE_ADMIN'){
      return <Navigate to="/admin" replace />;
    }else if(user.roles && user.roles[0] === 'ROLE_STAFF'){
      return <Navigate to="/home" replace />;
    }
  }

  return <><Outlet /></>;
}

export default PublicRoute;