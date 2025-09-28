import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { Eye, Heart, Calendar, Person } from "react-bootstrap-icons";
import axios from "axios";
// import "./Home.css";
export default function Home() {
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, usersRes] = await Promise.all([
          axios.get("http://localhost:3000/articles"),
          axios.get("http://localhost:3000/users"),
        ]);
        setArticles(articlesRes.data);
        setUsers(usersRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const getAuthorName = (authorId) => {
    const author = users.find((user) => user.id == authorId);
    return author ? author.userName : "Unknown Author";
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  if (loading) {
    return (
      <Container className="py-5">
        {" "}
        <div className="d-flex justify-content-center">
          {" "}
          <div className="spinner-border text-primary" role="status">
            {" "}
            <span className="visually-hidden">Đang tải...</span>{" "}
          </div>{" "}
        </div>{" "}
      </Container>
    );
  }
  return (
    <Container className="py-4">
      {" "}
      <div className="text-center mb-5">
        {" "}
        <h1 className="fw-bold text-primary">📰 NewsHub</h1>{" "}
        <p className="lead text-muted">Tin tức nóng hổi mỗi ngày</p>{" "}
      </div>{" "}
      <Row>
        {" "}
        {articles.map((article) => (
          <Col key={article.id} lg={6} className="mb-4">
            {" "}
            <Card className="h-100 shadow-sm border-0 rounded-3 overflow-hidden">
              {" "}
              {/* Thumbnail */}{" "}
              <div className="position-relative">
                {" "}
                <Card.Img
                  variant="top"
                  src={article.thumbnail}
                  style={{ height: "250px", objectFit: "cover" }}
                />{" "}
                <Badge
                  bg="primary"
                  className="position-absolute top-0 start-0 m-3 px-3 py-2"
                >
                  {" "}
                  {article.category}{" "}
                </Badge>{" "}
              </div>{" "}
              <Card.Body className="p-4">
                {" "}
                {/* Title */}{" "}
                <Card.Title
                  className="fw-bold mb-3"
                  style={{ fontSize: "1.4rem" }}
                >
                  {" "}
                  {article.title}{" "}
                </Card.Title>{" "}
                {/* Excerpt */}{" "}
                <Card.Text className="text-muted mb-3">
                  {" "}
                  {article.excerpt}{" "}
                </Card.Text>{" "}
                {/* Tags */}{" "}
                <div className="mb-3">
                  {" "}
                  {article.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      bg="light"
                      text="dark"
                      className="me-1 mb-1 px-2 py-1"
                    >
                      {" "}
                      #{tag}{" "}
                    </Badge>
                  ))}{" "}
                </div>
                {/* Stats */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center text-muted small">
                    <Eye size={16} className="me-1" />
                    <span className="me-3">
                      {article.views.toLocaleString()} lượt xem
                    </span>
                    <Heart size={16} className="me-1" />
                    <span>{article.likes} thích</span>
                  </div>
                </div>
                {/* Author & Date */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <Person size={18} className="text-muted me-2" />
                    <span className="fw-semibold">
                      {getAuthorName(article.authorId)}
                    </span>
                  </div>
                  <div className="d-flex align-items-center text-muted small">
                    <Calendar size={14} className="me-1" />
                    <span>{formatDate(article.createdAt)}</span>
                  </div>
                </div>
                {/* Read More Button */}
                <div className="d-grid">
                  <Button variant="primary" size="sm" className="fw-semibold">
                    Đọc thêm →
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {/* Empty State */}
      {articles.length === 0 && !loading && (
        <div className="text-center py-5">
          <h4 className="text-muted">📰 Chưa có bài viết nào</h4>
          <p className="text-muted">
            Hãy quay lại sau để đọc tin tức mới nhất!
          </p>
        </div>
      )}
      {/* User List Section */}
      <hr className="my-5" />
      <div className="text-center mb-4">
        <h3 className="fw-bold">👥 Cộng tác viên</h3>
      </div>
      <Row>
        {users.map(
          (user) =>
            (user.role === "admin" || user.role === "contributor") && (
              <Col key={user.id} md={4} className="mb-3">
                <Card className="text-center border-0 shadow-sm">
                  <Card.Body className="py-4">
                    <div className="mb-3">
                      <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
                        style={{
                          width: "60px",
                          height: "60px",
                          fontSize: "1.5rem",
                        }}
                      >
                        {user.userName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <h6 className="fw-bold mb-1">{user.userName}</h6>
                    <small className="text-muted d-block mb-2">
                      {user.email}
                    </small>
                    <Badge
                      bg={user.role === "admin" ? "danger" : "secondary"}
                      className="mb-2"
                    >
                      {user.role === "admin" ? "Admin" : "Cộng tác viên"}
                    </Badge>
                    <div className="small text-muted">
                      <span> {user.country}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )
        )}
      </Row>
    </Container>
  );
}
