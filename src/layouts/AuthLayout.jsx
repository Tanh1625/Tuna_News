import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <Container className="login-bg min-vh-100 d-flex align-items-center justify-content-center">
      <Outlet />
    </Container>
  )
}