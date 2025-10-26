import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
} from "react-bootstrap";
import { Plus, X } from "react-bootstrap-icons";
import { newsArticleApi } from "../api/newsArticleApi";

const CATEGORIES = [
  { id: 1, name: "Công nghệ" },
  { id: 2, name: "Thể thao" },
  { id: 3, name: "Kinh tế" },
  { id: 4, name: "Giáo dục" },
  { id: 5, name: "Khoa học" },
  { id: 6, name: "Sức khỏe" },
  { id: 7, name: "Văn hóa" },
  { id: 8, name: "Ẩm thực" },
];

export default function CreateArticle({
  articleId = null,
  initialData = null,
  onSaved = null,
  setSaveSuccess = false,
}) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [saving, setSaving] = useState(false);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      newsTitle: title,
      headline: excerpt,
      newsContent: content,
      newsSource: thumbnail || "",
      newsStatus: true,
      category: category ? parseInt(category, 10) : null,
    };

    const save = async () => {
      try {
        setSaving(true);
        let res;
        if (articleId) {
          res = await newsArticleApi.update(articleId, payload);
        } else {
          res = await newsArticleApi.create(payload);
          setSaveSuccess(true);
        }
        if (onSaved) onSaved(res);
      } catch (err) {
        console.error("Error saving article:", err);
        alert("Lỗi xảy ra khi lưu: " + (err.message || "error"));
      } finally {
        setSaving(false);
      }
    };

    save();
  };

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.newsTitle || "");
      setExcerpt(initialData.headline || "");
      setContent(initialData.newsContent || "");
      setCategory(
        initialData.category != null ? String(initialData.category) : ""
      );
      setTags(initialData.tags || []);
      setThumbnail(initialData.newsSource || "");
    }
  }, [initialData]);

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
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Tiêu đề bài viết *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tiêu đề..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="py-2"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Mô tả ngắn *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Mô tả ngắn..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    required
                    className="py-2"
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Danh mục *
                      </Form.Label>
                      <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="py-2"
                      >
                        <option value="">Chọn danh mục...</option>
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </Form.Select>
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
                        value={thumbnail}
                        onChange={(e) => setThumbnail(e.target.value)}
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
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="py-2"
                  />
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
                      onClick={() => {
                        setTitle("");
                        setExcerpt("");
                        setContent("");
                        setCategory("");
                        setTags([]);
                        setThumbnail("");
                      }}
                    >
                      Làm mới
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={
                        !title || !excerpt || !content || !category || saving
                      }
                    >
                      {saving
                        ? "⏳ Lưu..."
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
