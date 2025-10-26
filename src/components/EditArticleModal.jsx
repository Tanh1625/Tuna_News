import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { newsArticleApi } from "../api/newsArticleApi";
import categoryApi from "../api/categoryApi";

export default function EditArticleModal({ show, onHide, articleId, onSaved }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      newsTitle: "",
      headline: "",
      newsContent: "",
      category: "",
      newsSource: "",
    },
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAll();
      setCategories(data?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch article data when modal opens
  const fetchArticleData = async () => {
    if (!articleId) return;

    try {
      setLoading(true);
      const response = await newsArticleApi.getById(articleId);
      const article = response.data;

      // Load data vào form
      setValue("newsTitle", article.newsTitle || "");
      setValue("headline", article.headline || "");
      setValue("newsContent", article.newsContent || "");
      setValue(
        "category",
        article.category != null ? String(article.category) : ""
      );
      setValue("newsSource", article.newsSource || "");
    } catch (error) {
      console.error("Error fetching article:", error);
      alert("Không thể tải dữ liệu bài viết");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (show && articleId) {
      fetchArticleData();
    }
  }, [show, articleId]);

  const onSubmit = async (data) => {
    const payload = {
      newsTitle: data.newsTitle,
      headline: data.headline,
      newsContent: data.newsContent,
      newsSource: data.newsSource || "",
      newsStatus: true,
      category: data.category ? parseInt(data.category, 10) : null,
    };

    try {
      const res = await newsArticleApi.update(articleId, payload);
      alert("Cập nhật bài viết thành công!");
      if (onSaved) onSaved(res);
      handleClose();
    } catch (err) {
      console.error("Error updating article:", err);
      alert("Lỗi xảy ra khi cập nhật: " + (err.message || "error"));
    }
  };

  const handleClose = () => {
    reset();
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-pencil-square me-2"></i>
          Chỉnh sửa bài viết
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)} id="editArticleForm">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Tiêu đề bài viết <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tiêu đề..."
                {...register("newsTitle", {
                  required: "Tiêu đề không được để trống",
                })}
                isInvalid={!!errors.newsTitle}
              />
              <Form.Control.Feedback type="invalid">
                {errors.newsTitle?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Mô tả ngắn <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Mô tả ngắn..."
                {...register("headline", {
                  required: "Mô tả ngắn không được để trống",
                })}
                isInvalid={!!errors.headline}
              />
              <Form.Control.Feedback type="invalid">
                {errors.headline?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Danh mục <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    {...register("category", {
                      required: "Vui lòng chọn danh mục",
                    })}
                    isInvalid={!!errors.category}
                  >
                    <option value="">Chọn danh mục...</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.category?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Nguồn</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="https://... hoặc nguồn"
                    {...register("newsSource")}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Nội dung bài viết <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                placeholder="Nội dung..."
                {...register("newsContent", {
                  required: "Nội dung không được để trống",
                })}
                isInvalid={!!errors.newsContent}
              />
              <Form.Control.Feedback type="invalid">
                {errors.newsContent?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={handleClose}
          disabled={isSubmitting}
        >
          <i className="bi bi-x-circle me-2"></i>
          Hủy
        </Button>
        <Button
          variant="primary"
          type="submit"
          form="editArticleForm"
          disabled={isSubmitting || loading}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Đang lưu...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle me-2"></i>
              Lưu thay đổi
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
