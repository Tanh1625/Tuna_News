import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";

export default function AdminLayout() {
  return (
    <>
      <Header />
      <Container fluid className="p-0 mt-5">
        <Outlet />
      </Container>
    </>
  );
}
