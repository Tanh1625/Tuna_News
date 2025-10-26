import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import {
  Calendar,
  Person,
  Plus,
  BookmarkFill,
  TagFill,
} from "react-bootstrap-icons";
import CreateArticle from "../../components/CreateArticle";
import { newsArticleApi } from "../../api/newsArticleApi";
import { tagApi } from "../../api/tagApi";
import { Link } from "react-router-dom";
import "../../styles/Home.css";

export default function Home() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleGetArticles = async (tagId = null) => {
    try {
      setLoading(true);
      const articlesRes = await newsArticleApi.getAll(tagId);
      console.log("Articles response:", articlesRes);
      setArticles(articlesRes.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleGetTags = async () => {
    try {
      const tagsRes = await tagApi.getAll();
      console.log("Tags response:", tagsRes);
      setTags(tagsRes.data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    handleGetArticles();
    handleGetTags();
  }, []);

  useEffect(() => {
    if (saveSuccess) {
      handleGetArticles(selectedTagId);
      setSaveSuccess(false);
      setShowCreateForm(false);
    }
  }, [saveSuccess, selectedTagId]);

  const handleTagClick = (tagId) => {
    console.log("Tag clicked:", tagId);
    setSelectedTagId(tagId);
    handleGetArticles(tagId);
  };

  const handleShowAll = () => {
    console.log("Show all clicked");
    setSelectedTagId(null);
    handleGetArticles(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-center align-items-center home-loading-container">
          <div className="text-center">
            <div
              className="spinner-border text-primary mb-3 home-loading-spinner"
              role="status"
            >
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="text-muted">Đang tải tin tức...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4 pb-5">
      {/* Header */}
      <div className="mb-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 className="fw-bold mb-2 home-header-title">📰 FPT News</h1>
            <p className="text-muted mb-0">
              Cập nhật tin tức mới nhất mỗi ngày
            </p>
          </div>
          <Button
            variant={showCreateForm ? "outline-danger" : "primary"}
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 home-header-button"
          >
            <Plus size={20} className="me-2" />
            {showCreateForm ? "Đóng" : "Viết bài mới"}
          </Button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-4">
            <CreateArticle setSaveSuccess={setSaveSuccess} />
          </div>
        )}
      </div>

      {/* Tags Filter */}
      {tags.length > 0 && (
        <div className="mb-4">
          <div className="d-flex align-items-center mb-3">
            <TagFill size={20} className="text-primary me-2" />
            <h5 className="fw-bold mb-0">Lọc theo danh mục</h5>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <Badge
              bg={selectedTagId === null ? "primary" : "light"}
              text={selectedTagId === null ? "white" : "dark"}
              className="home-filter-tag"
              onClick={handleShowAll}
              style={{ cursor: "pointer" }}
            >
              Tất cả
            </Badge>
            {tags.map((tag) => (
              <Badge
                key={tag.tagId}
                bg={selectedTagId === tag.tagId ? "primary" : "light"}
                text={selectedTagId === tag.tagId ? "white" : "dark"}
                className="home-filter-tag"
                onClick={() => handleTagClick(tag.tagId)}
                style={{ cursor: "pointer" }}
              >
                {tag.tagName}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Articles List */}
      {articles.length > 0 ? (
        <>
          <div className="d-flex align-items-center mb-4">
            <div className="me-3 home-section-highlight"></div>
            <h4 className="fw-bold mb-0">
              {selectedTagId
                ? `Bài viết: ${
                    tags.find((t) => t.tagId === selectedTagId)?.tagName || ""
                  }`
                : "Bài viết gần đây"}
            </h4>
            <Badge bg="secondary" className="ms-3 px-3 py-2 home-section-badge">
              {articles.length} bài
            </Badge>
          </div>

          <Row className="g-4">
            {articles.map((article) => (
              <Col key={article.newArticleId} lg={6} xl={4}>
                <Card className="h-100 border-0 shadow-sm home-article-card">
                  <Card.Body className="p-4">
                    {/* Category Badge */}
                    {article.category && (
                      <Badge bg="primary" className="mb-3 home-category-badge">
                        {article.category}
                      </Badge>
                    )}

                    {/* Title */}
                    <h5 className="fw-bold mb-3 home-article-title">
                      <Link
                        to={`/news/${article.newArticleId}`}
                        className="text-dark text-decoration-none"
                      >
                        {article.newsTitle}
                      </Link>
                    </h5>

                    {/* Headline */}
                    <p className="text-muted mb-4 home-article-headline">
                      {article.headline}
                    </p>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="mb-3 d-flex flex-wrap gap-2">
                        {article.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag.tagId}
                            bg="light"
                            text="primary"
                            className="home-tag-badge"
                          >
                            #{tag.tagName}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge
                            bg="light"
                            text="muted"
                            className="home-tag-badge"
                          >
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Divider */}
                    <hr className="home-divider" />

                    {/* Meta Info */}
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center text-muted home-meta-info">
                        <Calendar size={14} className="me-2" />
                        <span>
                          {article.createdDate
                            ? formatDate(article.createdDate)
                            : "N/A"}
                        </span>
                      </div>
                      <div className="d-flex align-items-center text-muted home-meta-info">
                        <Person size={14} className="me-2" />
                        <span className="home-author-name">
                          {article.createdBy?.accountName || "Anonymous"}
                        </span>
                      </div>
                    </div>

                    {/* Read Button */}
                    <Link
                      to={`/news/${article.newArticleId}`}
                      className="btn btn-primary w-100 mt-3 home-read-button"
                    >
                      <BookmarkFill size={16} className="me-2" />
                      Đọc bài viết
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        // Empty State
        <div className="text-center py-5 my-5">
          <div className="mb-4 mx-auto d-flex align-items-center justify-content-center home-empty-icon-wrapper">
            <BookmarkFill size={50} className="text-primary" />
          </div>
          <h3 className="fw-bold mb-3">Chưa có bài viết nào</h3>
          <p className="text-muted mb-4">
            Hãy là người đầu tiên chia sẻ tin tức!
          </p>
          {!showCreateForm && (
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowCreateForm(true)}
              className="px-5"
            >
              <Plus size={20} className="me-2" />
              Viết bài đầu tiên
            </Button>
          )}
        </div>
      )}
    </Container>
  );
}
