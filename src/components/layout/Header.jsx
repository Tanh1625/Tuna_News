import { useState } from "react";
import { Container, Navbar, Nav, NavDropdown, Form, Button, Badge } from "react-bootstrap";
import { Bell, ChatDots, PersonCircle, Search, House, Newspaper } from "react-bootstrap-icons";
import "../../styles/components/Header.css";

export default function Header() {
  const [notifications, setNotifications] = useState(3);
  const [messages, setMessages] = useState(5);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  return (
    <Navbar expand="lg" className="custom-navbar shadow-sm" fixed="top">
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand href="/home" className="d-flex align-items-center">
          <Newspaper size={32} className="text-primary me-2" />
          <span className="fw-bold fs-4 text-primary">NewsHub</span>
        </Navbar.Brand>

        {/* Search Bar */}
        <div className="search-container mx-3 flex-grow-1">
          <Form className="d-flex position-relative">
            <Form.Control
              type="search"
              placeholder="Tìm kiếm tin tức, người dùng..."
              className="search-input rounded-pill"
              style={{ maxWidth: "500px" }}
            />
            <Button 
              variant="outline-secondary" 
              className="search-btn position-absolute"
              style={{ right: "5px", top: "3px", border: "none" }}
            >
              <Search size={18} />
            </Button>
          </Form>
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Navigation Links */}
          <Nav className="me-auto d-flex align-items-center">
            <Nav.Link href="/home" className="nav-item-custom">
              <House size={20} className="me-1" />
              <span className="d-none d-lg-inline">Trang chủ</span>
            </Nav.Link>
            <Nav.Link href="/trending" className="nav-item-custom">
              <i className="bi bi-fire me-1"></i>
              <span className="d-none d-lg-inline">Xu hướng</span>
            </Nav.Link>
            <Nav.Link href="/categories" className="nav-item-custom">
              <i className="bi bi-grid me-1"></i>
              <span className="d-none d-lg-inline">Danh mục</span>
            </Nav.Link>
          </Nav>

          {/* User Actions */}
          <Nav className="d-flex align-items-center">
            {/* Notifications */}
            <Nav.Link className="position-relative me-2">
              <Bell size={20} />
              {notifications > 0 && (
                <Badge 
                  bg="danger" 
                  className="position-absolute top-0 start-100 translate-middle rounded-pill"
                  style={{ fontSize: "10px" }}
                >
                  {notifications}
                </Badge>
              )}
            </Nav.Link>

            {/* Messages */}
            <Nav.Link className="position-relative me-3">
              <ChatDots size={20} />
              {messages > 0 && (
                <Badge 
                  bg="primary" 
                  className="position-absolute top-0 start-100 translate-middle rounded-pill"
                  style={{ fontSize: "10px" }}
                >
                  {messages}
                </Badge>
              )}
            </Nav.Link>

            {/* User Menu */}
            <NavDropdown
              title={<PersonCircle size={24} />}
              id="user-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item href="/profile">
                <PersonCircle size={16} className="me-2" />
                Trang cá nhân
              </NavDropdown.Item>
              <NavDropdown.Item href="/settings">
                <i className="bi bi-gear me-2"></i>
                Cài đặt
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Đăng xuất
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}