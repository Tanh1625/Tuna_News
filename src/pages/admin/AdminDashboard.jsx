import { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { newsArticleApi } from "../../api/newsArticleApi";

export default function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await newsArticleApi.getAll(0, 100);
      setArticles(res.data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Xác nhận xóa bài viết này?")) return;
    try {
      await newsArticleApi.delete(id);
      setArticles((s) => s.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Container className="py-5">Loading...</Container>;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Admin Dashboard</h3>
        <Link to="/admin/create" className="btn btn-success">
          Tạo bài mới
        </Link>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>CreatedAt</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.title}</td>
              <td>{a.category}</td>
              <td>{new Date(a.createdAt).toLocaleString()}</td>
              <td>
                <Link
                  className="btn btn-sm btn-primary me-2"
                  to={`/admin/edit/${a.id}`}
                >
                  Edit
                </Link>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(a.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
