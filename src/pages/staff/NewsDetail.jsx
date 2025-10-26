import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import {
  Calendar,
  Person,
  ArrowLeft,
  PencilSquare,
  Tag as TagIcon,
} from "react-bootstrap-icons";
import { newsArticleApi } from "../../api/newsArticleApi";
import EditArticleModal from "../../components/EditArticleModal";
import { useAuth } from "../../context/auth-context";

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const res = await newsArticleApi.getById(id);
      setArticle(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticle();
  }, [id]);

  const handleEditSuccess = () => {
    loadArticle(); // Reload article sau khi edit
    setShowEditModal(false);
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
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </Container>
    );
  }

  if (!article) {
    return (
      <Container className="py-5 text-center">
        <h3 className="text-muted">📰 Không tìm thấy bài viết</h3>
        <Button
          variant="outline-primary"
          onClick={() => navigate("/home")}
          className="mt-3"
        >
          <ArrowLeft size={16} className="me-2" />
          Quay lại trang chủ
        </Button>
      </Container>
    );
  }

  // Chỉ STAFF mới thấy button Edit
  const canEdit = user && user.roles && user.roles.includes("ROLE_STAFF");

  return (
    <>
      <Container className="py-4">
        <Row>
          <Col lg={10} xl={8} className="mx-auto">
            {/* Header với button quay lại và edit */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/home")}
                size="sm"
              >
                <ArrowLeft size={16} className="me-2" />
                Quay lại
              </Button>

              {canEdit && (
                <Button
                  variant="primary"
                  onClick={() => setShowEditModal(true)}
                  size="sm"
                >
                  <PencilSquare size={16} className="me-2" />
                  Chỉnh sửa
                </Button>
              )}
            </div>

            <Card className="shadow-sm border-0">
              {/* Image từ newsSource */}
              {article.newsSource && (
                <Card.Img
                  variant="top"
                  src={article.newsSource}
                  style={{ maxHeight: 500, objectFit: "cover" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}

              <Card.Body className="p-4 p-md-5">
                {/* Category Badge */}
                {article.category && (
                  <Badge bg="primary" className="mb-3 px-3 py-2">
                    {article.category.categoryName}
                  </Badge>
                )}

                {/* newsTitle */}
                <h1 className="fw-bold mb-3">{article.newsTitle}</h1>

                {/* headline (mô tả ngắn) */}
                <p className="lead text-muted border-start border-4 border-primary ps-3 mb-4">
                  {article.headline}
                </p>

                {/* Meta Info */}
                <div className="d-flex flex-wrap gap-3 mb-4 pb-4 border-bottom">
                  <div className="d-flex align-items-center text-muted">
                    <Person size={18} className="me-2" />
                    <span>
                      <strong>Tác giả:</strong>{" "}
                      {article.createdBy?.accountName || "Anonymous"}
                    </span>
                  </div>

                  <div className="d-flex align-items-center text-muted">
                    <Calendar size={18} className="me-2" />
                    <span>
                      <strong>Ngày đăng:</strong>{" "}
                      {article.createdDate
                        ? formatDate(article.createdDate)
                        : "Chưa cập nhật"}
                    </span>
                  </div>

                  {article.modifiedDate && (
                    <div className="d-flex align-items-center text-muted">
                      <Calendar size={18} className="me-2" />
                      <span>
                        <strong>Cập nhật:</strong>{" "}
                        {formatDate(article.modifiedDate)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <TagIcon size={16} className="me-2 text-muted" />
                      <span className="text-muted fw-semibold">Tags:</span>
                    </div>
                    <div>
                      {article.tags.map((tag) => (
                        <Badge
                          key={tag.tagId}
                          bg="light"
                          text="dark"
                          className="me-2 mb-2 px-3 py-2"
                        >
                          #{tag.tagName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* newsContent */}
                <div
                  className="article-content fs-5 lh-lg"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {article.newsContent}
                </div>

                {/* Updated By Info */}
                {article.updatedBy && (
                  <div className="mt-5 pt-4 border-top">
                    <p className="text-muted small mb-0">
                      <strong>Cập nhật bởi:</strong>{" "}
                      {article.updatedBy.accountName}
                      {article.modifiedDate && (
                        <> vào {formatDate(article.modifiedDate)}</>
                      )}
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Edit Modal */}
      {canEdit && (
        <EditArticleModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          articleId={article.newArticleId}
          onSaved={handleEditSuccess}
        />
      )}
    </>
  );
}
