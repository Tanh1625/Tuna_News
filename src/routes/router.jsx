import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/auth/Login";
import AuthLayout from "../layouts/AuthLayout";
import Register from "../pages/auth/Register";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/staff/Home";
import NewsDetail from "../pages/staff/NewsDetail";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AccessDenied from "../pages/auth/AccessDenied";
import PublicRoute from "./PublicRoute";

// Wrapper components for ProtectedRoute
const StaffProtectedRoute = () => (
  <ProtectedRoute allowedRoles={["ROLE_STAFF"]} />
);
const AdminProtectedRoute = () => (
  <ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />
);

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        Component: PublicRoute,
        children: [
          {
            path: "/",
            Component: AuthLayout,
            children: [
              {
                index: true,
                Component: Login,
              },
              {
                path: "register",
                Component: Register,
              },
            ],
          },
        ],
      },
      {
        Component: StaffProtectedRoute,
        children: [
          {
            path: "/home",
            Component: MainLayout,
            children: [
              {
                index: true,
                Component: Home,
              },
            ],
          },
        ],
      },
      {
        Component: AdminProtectedRoute,
        children: [
          {
            path: "/admin",
            Component: AdminLayout,
            children: [{ index: true, Component: AdminDashboard }],
          },
        ],
      },
      { path: "/news/:id", Component: NewsDetail },
      {
        path: "/access-denied",
        Component: AccessDenied,
      },
    ],
  },
]);

export default router;
