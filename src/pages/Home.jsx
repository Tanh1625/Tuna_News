import { useState, useEffect, use } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { Eye, Heart, Calendar, Person, Plus } from "react-bootstrap-icons";
import CreateArticle from "../components/CreateArticle";
import { newsArticleApi } from "../api/newsArticleApi";
import { Link } from "react-router-dom";

export default function Home() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleGetArticles = async () => {
    try {
      const articlesRes = await newsArticleApi.getAll(0, 50);
      // API returns ApiResponse wrapper -> data property contains page
      const page = articlesRes.data;
      setArticles(page.content || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetArticles();
  }, []);

  useEffect(() => {
    if (saveSuccess) {
      handleGetArticles();
      setSaveSuccess(false);
    }
  }, [saveSuccess]);

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
      <div className="text-center mb-5">
        <p className="lead text-muted">Tin tức nóng hổi mỗi ngày</p>

        {/* Toggle Create Article Button */}
        <Button
          variant="success"
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="mb-3"
        >
          <Plus size={18} className="me-1" />
          {showCreateForm ? "Ẩn form đăng bài" : "Đăng bài viết mới"}
        </Button>
      </div>

      {/* Create Article Form */}
      {showCreateForm && (
        <div className="mb-5">
          <CreateArticle setSaveSuccess={setSaveSuccess} />
        </div>
      )}

      {/* Existing articles list */}
      <Row>
        {articles.map((article) => (
          <Col key={article.newArticleId} lg={6} className="mb-4">
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
                <Card.Title
                  className="fw-bold mb-3"
                  style={{ fontSize: "1.4rem" }}
                >
                  {article.newsTitle}
                </Card.Title>

                <Card.Text className="text-muted mb-3">
                  {article.headline}
                </Card.Text>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <Person size={18} className="text-muted me-2" />
                    <span className="fw-semibold">
                      {article.createdBy}
                    </span>
                  </div>
                  <div className="d-flex align-items-center text-muted small">
                    <Calendar size={14} className="me-1" />
                    <span>{formatDate(article.createdDate)}</span>
                  </div>
                </div>

                <div className="d-grid">
                  <Link
                    to={`/news/${article.newArticleId}`}
                    className="btn btn-primary btn-sm fw-semibold text-decoration-none text-white"
                  >
                    Đọc thêm →
                  </Link>
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
    </Container>
  );
}
