import { Outlet } from "react-router-dom";
//component
import LoadingSpinner from "./components/global/loading-spinner";
import { LoadingProvider } from "./context/loading-context";
import Login from "./pages/auth/Login";
//styles
import "./App.css";

function App() {
  return (
    <>
      <LoadingProvider>
        <LoadingSpinner />
        <Outlet />
      </LoadingProvider>
    </>
  );
}

export default App;
