import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { newsArticleApi } from "../api/newsArticleApi";

export default function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await newsArticleApi.getById(id);
        setArticle(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Container className="py-5">Loading...</Container>;
  if (!article)
    return <Container className="py-5">Không tìm thấy bài viết</Container>;

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="shadow-sm border-0">
            {article.thumbnail && (
              <Card.Img
                variant="top"
                src={article.thumbnail}
                style={{ maxHeight: 400, objectFit: "cover" }}
              />
            )}
            <Card.Body>
              <h2 className="fw-bold">{article.title}</h2>
              <div className="mb-2 text-muted">
                {article.category} •{" "}
                {new Date(article.createdAt).toLocaleString()}
              </div>
              <div className="mb-3">
                {article.tags &&
                  article.tags.map((t, i) => (
                    <Badge key={i} bg="light" text="dark" className="me-1">
                      #{t}
                    </Badge>
                  ))}
              </div>
              <div className="mb-4">{article.excerpt}</div>
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
              <div className="mt-4">
                <Link to="/home" className="btn btn-outline-secondary me-2">
                  Quay lại
                </Link>
                <Link
                  to={`/admin/edit/${article.id}`}
                  className="btn btn-primary"
                >
                  Chỉnh sửa
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
