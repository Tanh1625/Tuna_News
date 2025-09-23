import { useNavigate } from "react-router-dom";
import { useLoading } from "../context/loading-context";
import { set } from "react-hook-form";

export default function Demo() {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();

  const handleLogout = () => {
    startLoading();
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setTimeout(() => {
      stopLoading();
      navigate("/"); // Redirect to login page
    }, 2000);
  };

  return <button onClick={handleLogout}>Logout</button>;
};