import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/auth/Login";
import Demo from "../pages/demo";
import AuthLayout from "../layouts/AuthLayout";
import Register from "../pages/auth/Register";

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
        path: "/demo",
        Component: Demo,
      },
    ],
  },
]);

export default router;
