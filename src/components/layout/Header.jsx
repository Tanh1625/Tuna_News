import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Form,
  Button,
  Badge,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import {
  Bell,
  ChatDots,
  PersonCircle,
  Search,
  House,
  FileText,
  Person,
} from "react-bootstrap-icons";
import logoImage from "../../assets/images/logo.png";
import axios from "axios";
import "../../styles/components/Header.css";
import { useAuth } from "../../context/auth-context";

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState(3);
  const [messages, setMessages] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    articles: [],
    users: [],
    loading: false,
  });
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  const handleLogout = () => {
    logout(); // Clear AuthContext state
    navigate("/");
  };

  // Debounce search function
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ articles: [], users: [], loading: false });
      setShowResults(false);
      return;
    }

    const delayedSearch = setTimeout(() => {
      performSearch(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async (query) => {
    setSearchResults((prev) => ({ ...prev, loading: true }));

    try {
      // Search in parallel
      const [articlesResponse, usersResponse] = await Promise.all([
        // Search articles by title, content, or tags
        axios.get(
          `http://localhost:3000/articles?q=${encodeURIComponent(query)}`
        ),
        // Search users by username or email
        axios.get(`http://localhost:3000/users?q=${encodeURIComponent(query)}`),
      ]);

      // Additional filtering for better results
      const filteredArticles = articlesResponse.data.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.content.toLowerCase().includes(query.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          article.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          ) ||
          article.category.toLowerCase().includes(query.toLowerCase())
      );

      const filteredUsers = usersResponse.data.filter(
        (user) =>
          user.userName.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults({
        articles: filteredArticles.slice(0, 5), // Limit to 5 results
        users: filteredUsers.slice(0, 3), // Limit to 3 results
        loading: false,
      });

      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults({ articles: [], users: [], loading: false });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      setShowResults(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleResultClick = (type, id) => {
    setShowResults(false);
    setSearchQuery("");

    if (type === "article") {
      navigate(`/article/${id}`);
    } else if (type === "user") {
      navigate(`/profile/${id}`);
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  const handleNavClick = (path) => (e) => {
    e.preventDefault();
    navigate(path);
  };

  const highlightText = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-warning text-dark fw-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <Navbar expand="lg" className="custom-navbar shadow-sm" fixed="top">
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand
          href="/home"
          className="d-flex align-items-center"
          onClick={handleLogoClick}
        >
          <img
            src={logoImage}
            alt="TunashNew"
            className="me-2 logo-img"
            style={{ height: "40px", width: "auto" }}
          />
        </Navbar.Brand>

        {/* Search Bar */}
        <div
          className="search-container mx-3 flex-grow-1 position-relative"
          ref={searchRef}
        >
          <Form
            className="d-flex position-relative"
            onSubmit={handleSearchSubmit}
          >
            <Form.Control
              type="search"
              placeholder="Tìm kiếm tin tức, người dùng..."
              className="search-input rounded-pill"
              style={{ maxWidth: "500px" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
            />
            <Button
              variant="outline-secondary"
              className="search-btn position-absolute"
              style={{ right: "5px", top: "3px", border: "none" }}
              type="submit"
            >
              <Search size={18} />
            </Button>
          </Form>

          {/* Search Results Dropdown */}
          {showResults &&
            (searchResults.articles.length > 0 ||
              searchResults.users.length > 0 ||
              searchResults.loading) && (
              <div
                ref={resultsRef}
                className="search-results position-absolute w-100 bg-white border rounded shadow-lg mt-1"
                style={{
                  zIndex: 1050,
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                {searchResults.loading ? (
                  <div className="text-center p-3">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang tìm kiếm...
                  </div>
                ) : (
                  <>
                    {/* Articles Results */}
                    {searchResults.articles.length > 0 && (
                      <>
                        <div className="px-3 py-2 bg-light border-bottom">
                          <small className="fw-bold text-muted">
                            📰 BÀI VIẾT
                          </small>
                        </div>
                        <ListGroup variant="flush">
                          {searchResults.articles.map((article) => (
                            <ListGroup.Item
                              key={article.id}
                              action
                              onClick={() =>
                                handleResultClick("article", article.id)
                              }
                              className="border-0 py-3"
                            >
                              <div className="d-flex align-items-center">
                                <FileText
                                  size={20}
                                  className="text-primary me-3"
                                />
                                <div className="flex-grow-1">
                                  <div className="fw-semibold mb-1">
                                    {highlightText(article.title, searchQuery)}
                                  </div>
                                  <div className="small text-muted">
                                    {highlightText(
                                      article.excerpt.substring(0, 80) + "...",
                                      searchQuery
                                    )}
                                  </div>
                                  <div className="small">
                                    <Badge
                                      bg="light"
                                      text="dark"
                                      className="me-1"
                                    >
                                      {article.category}
                                    </Badge>
                                    <span className="text-muted">
                                      {article.views.toLocaleString()} lượt xem
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </>
                    )}

                    {/* Users Results */}
                    {searchResults.users.length > 0 && (
                      <>
                        <div className="px-3 py-2 bg-light border-bottom">
                          <small className="fw-bold text-muted">
                            👥 NGƯỜI DÙNG
                          </small>
                        </div>
                        <ListGroup variant="flush">
                          {searchResults.users.map((user) => (
                            <ListGroup.Item
                              key={user.id}
                              action
                              onClick={() => handleResultClick("user", user.id)}
                              className="border-0 py-3"
                            >
                              <div className="d-flex align-items-center">
                                <Person
                                  size={20}
                                  className="text-success me-3"
                                />
                                <div>
                                  <div className="fw-semibold">
                                    {highlightText(user.userName, searchQuery)}
                                  </div>
                                  <div className="small text-muted">
                                    {highlightText(user.email, searchQuery)}
                                  </div>
                                  <Badge
                                    bg={
                                      user.role === "admin"
                                        ? "danger"
                                        : "secondary"
                                    }
                                    className="small"
                                  >
                                    {user.role === "admin" ? "Admin" : "User"}
                                  </Badge>
                                </div>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </>
                    )}

                    {/* See All Results */}
                    <div className="px-3 py-2 border-top bg-light">
                      <Button
                        variant="link"
                        size="sm"
                        className="text-decoration-none p-0 fw-semibold"
                        onClick={handleSearchSubmit}
                      >
                        Xem tất cả kết quả cho "{searchQuery}" →
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

          {/* No Results */}
          {showResults &&
            !searchResults.loading &&
            searchResults.articles.length === 0 &&
            searchResults.users.length === 0 &&
            searchQuery && (
              <div
                ref={resultsRef}
                className="search-results position-absolute w-100 bg-white border rounded shadow-lg mt-1 p-3 text-center"
                style={{ zIndex: 1050 }}
              >
                <div className="text-muted">
                  <Search size={24} className="mb-2" />
                  <div>Không tìm thấy kết quả cho "{searchQuery}"</div>
                  <small>Thử với từ khóa khác</small>
                </div>
              </div>
            )}
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Navigation Links */}
          <Nav className="me-auto d-flex align-items-center">
            <Nav.Link
              className="nav-item-custom"
              onClick={handleNavClick("/home")}
            >
              <House size={20} className="me-1" />
              <span className="d-none d-lg-inline">Trang chủ</span>
            </Nav.Link>
            <Nav.Link
              className="nav-item-custom"
              onClick={handleNavClick("/trending")}
            >
              <i className="bi bi-fire me-1"></i>
              <span className="d-none d-lg-inline">Xu hướng</span>
            </Nav.Link>
            <Nav.Link
              className="nav-item-custom"
              onClick={handleNavClick("/categories")}
            >
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
              <NavDropdown.Item onClick={handleNavClick("/profile")}>
                <PersonCircle size={16} className="me-2" />
                Trang cá nhân
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleNavClick("/settings")}>
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
