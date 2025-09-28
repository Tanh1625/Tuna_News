import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/auth/Login";
import Demo from "../pages/demo";
import AuthLayout from "../layouts/AuthLayout";
import Register from "../pages/auth/Register";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";

const router = createBrowserRouter([
  {
    Component: App,
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
      {
        path: "/home",
        Component: MainLayout,
        children: [
          {
            index: true,
            Component: Demo,
          },
        ],
      },
      {
        path: "/demo",
        Component: Demo,
      },
    ],
  },
]);

export default router;
