// src/pages/AccessDenied.jsx
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ShieldLockFill } from "react-bootstrap-icons";

export default function AccessDenied() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // quay về trang trước
  };

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <Row className="text-center">
        <Col>
          <div className="p-5 bg-white shadow rounded-4 border">
            <ShieldLockFill size={60} color="#dc3545" className="mb-3" />
            <h2 className="fw-bold text-danger mb-3">Access Denied</h2>
            <p className="text-secondary mb-4">
              Bạn không có quyền truy cập vào trang này.
              <br />
              Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là lỗi.
            </p>
            <Button variant="outline-danger" onClick={handleGoBack}>
              ← Quay lại trang trước
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
