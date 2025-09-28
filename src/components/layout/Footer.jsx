import { Container, Row, Col } from "react-bootstrap";
import { Facebook, Twitter, Instagram, Youtube, Newspaper } from "react-bootstrap-icons";
import "../../styles/components/Footer.css";

export default function Footer() {
  return (
    <footer className="custom-footer bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <div className="d-flex align-items-center mb-3">
              <Newspaper size={28} className="text-primary me-2" />
              <h5 className="mb-0 fw-bold">NewsHub</h5>
            </div>
            <p className="text-muted small">
              Nền tảng chia sẻ tin tức và kết nối cộng đồng hàng đầu Việt Nam. 
              Cập nhật thông tin nhanh chóng, chính xác và đáng tin cậy.
            </p>
          </Col>
          
          <Col md={2} className="mb-3">
            <h6 className="fw-bold mb-3">Khám phá</h6>
            <ul className="list-unstyled">
              <li><a href="/trending" className="footer-link">Xu hướng</a></li>
              <li><a href="/sports" className="footer-link">Thể thao</a></li>
              <li><a href="/tech" className="footer-link">Công nghệ</a></li>
              <li><a href="/entertainment" className="footer-link">Giải trí</a></li>
            </ul>
          </Col>

          <Col md={2} className="mb-3">
            <h6 className="fw-bold mb-3">Hỗ trợ</h6>
            <ul className="list-unstyled">
              <li><a href="/help" className="footer-link">Trung tâm trợ giúp</a></li>
              <li><a href="/contact" className="footer-link">Liên hệ</a></li>
              <li><a href="/privacy" className="footer-link">Chính sách</a></li>
              <li><a href="/terms" className="footer-link">Điều khoản</a></li>
            </ul>
          </Col>

          <Col md={4} className="mb-3">
            <h6 className="fw-bold mb-3">Kết nối với chúng tôi</h6>
            <div className="social-links mb-3">
              <a href="#" className="social-link me-3">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link me-3">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-link me-3">
                <Instagram size={20} />
              </a>
              <a href="#" className="social-link">
                <Youtube size={20} />
              </a>
            </div>
            <p className="small text-muted">
              📧 contact@newshub.vn<br />
              📱 +84 123 456 789
            </p>
          </Col>
        </Row>
        
        <hr className="my-3" />
        <Row>
          <Col className="text-center">
            <p className="small text-muted mb-0">
              © 2025 NewsHub. Tất cả quyền được bảo lưu. | Thiết kế bởi SBA Team
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}