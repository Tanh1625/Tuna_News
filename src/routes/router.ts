import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../layouts/Login";
import Demo from "../pages/demo";

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "/",
        Component: Login,
      },
      {
        path: "/demo",
        Component: Demo
      }
    ]
  }
]);

export default router;