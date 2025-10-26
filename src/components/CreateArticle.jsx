import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { newsArticleApi } from "../api/newsArticleApi";
import categoryApi from "../api/categoryApi";


export default function CreateArticle({
  articleId = null,
  onSaved = null,
  setSaveSuccess = false,
}) {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAll();
      setCategories(data?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  //get categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

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
      let res;
      if (articleId) {
        res = await newsArticleApi.update(articleId, payload);
      } else {
        res = await newsArticleApi.create(payload);
        if (setSaveSuccess) setSaveSuccess(true);
      }
      if (onSaved) onSaved(res);
    } catch (err) {
      console.error("Error saving article:", err);
      alert("Lỗi xảy ra khi lưu: " + (err.message || "error"));
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8} md={10}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-bottom">
              <h4 className="mb-0 fw-bold">
                {articleId ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
              </h4>
            </Card.Header>

            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Tiêu đề bài viết *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tiêu đề..."
                    {...register("newsTitle", {
                      required: "Tiêu đề không được để trống",
                    })}
                    isInvalid={!!errors.newsTitle}
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.newsTitle?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Mô tả ngắn *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Mô tả ngắn..."
                    {...register("headline", {
                      required: "Mô tả ngắn không được để trống",
                    })}
                    isInvalid={!!errors.headline}
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.headline?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Danh mục *
                      </Form.Label>
                      <Form.Select
                        {...register("category", {
                          required: "Vui lòng chọn danh mục",
                        })}
                        isInvalid={!!errors.category}
                        className="py-2"
                      >
                        <option value="">Chọn danh mục...</option>
                        {categories.map((c) => (
                          <option key={c.categoryId} value={c.categoryId}>
                            {c.categoryName}
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
                      <Form.Label className="fw-semibold">
                        Nguồn (URL hoặc tên nguồn)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="https://... hoặc nguồn"
                        {...register("newsSource")}
                        className="py-2"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    Nội dung bài viết *
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    placeholder="Nội dung..."
                    {...register("newsContent", {
                      required: "Nội dung không được để trống",
                    })}
                    isInvalid={!!errors.newsContent}
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.newsContent?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-muted small">
                    <span className="text-danger">*</span> Thông tin bắt buộc
                  </div>
                  <div>
                    <Button
                      variant="outline-secondary"
                      className="me-2"
                      type="button"
                      onClick={() => reset()}
                    >
                      Làm mới
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "⏳ Đang lưu..."
                        : articleId
                        ? "Lưu thay đổi"
                        : "Đăng bài"}
                    </Button>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
