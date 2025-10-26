import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import {
  PersonFill,
  PencilSquare,
  Trash,
  Plus,
  Search,
} from "react-bootstrap-icons";
import { systemAccountApi } from "../../api/systemAccountApi";
import { useForm } from "react-hook-form";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await systemAccountApi.getAll();
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error loading users:", err);
      alert("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Set form values when editingUser changes
  useEffect(() => {
    if (editingUser) {
      reset({
        accountName: editingUser.accountName,
        accountEmail: editingUser.accountEmail,
        accountRole: editingUser.accountRole,
        accountPassword: "", // Password is optional on edit
      });
    } else {
      reset({
        accountName: "",
        accountEmail: "",
        accountRole: "",
        accountPassword: "",
      });
    }
  }, [editingUser, reset]);

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (editingUser) {
        await systemAccountApi.update(editingUser.accountId, data);
        alert("Cập nhật người dùng thành công!");
      } else {
        await systemAccountApi.create(data);
        alert("Tạo người dùng mới thành công!");
      }
      handleCloseModal();
      loadUsers();
    } catch (err) {
      console.error("Error saving user:", err);
      alert(err.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Xác nhận xóa người dùng "${name}"?`)) return;
    try {
      await systemAccountApi.delete(id);
      alert("Xóa người dùng thành công!");
      loadUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err.response?.data?.message || "Không thể xóa người dùng!");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.accountName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.accountEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    return role === 1 ? (
      <Badge bg="danger">ADMIN</Badge>
    ) : (
      <Badge bg="primary">STAFF</Badge>
    );
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3 text-muted">Đang tải danh sách người dùng...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="d-flex align-items-center">
                <PersonFill size={32} className="text-primary me-3" />
                <div>
                  <h3 className="mb-0">Quản lý người dùng</h3>
                  <p className="text-muted mb-0 small">
                    Tổng số: {users.length} người dùng
                  </p>
                </div>
              </div>
            </Col>
            <Col md={6} className="text-end">
              <Button
                variant="primary"
                onClick={() => handleOpenModal()}
                className="px-4"
              >
                <Plus size={20} className="me-2" />
                Thêm người dùng
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Search */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <div className="position-relative">
            <Search
              className="position-absolute"
              style={{
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
              size={18}
            />
            <Form.Control
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "40px" }}
            />
          </div>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="py-3">Tên người dùng</th>
                <th className="py-3">Email</th>
                <th className="py-3">Vai trò</th>
                <th className="py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.accountId}>
                    <td className="px-4 py-3 align-middle">
                      <strong>#{user.accountId}</strong>
                    </td>
                    <td className="py-3 align-middle">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <PersonFill size={20} className="text-primary" />
                        </div>
                        <strong>{user.accountName}</strong>
                      </div>
                    </td>
                    <td className="py-3 align-middle text-muted">
                      {user.accountEmail}
                    </td>
                    <td className="py-3 align-middle">
                      {getRoleBadge(user.accountRole)}
                    </td>
                    <td className="py-3 align-middle text-center">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => handleOpenModal(user)}
                      >
                        <PencilSquare size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() =>
                          handleDelete(user.accountId, user.accountName)
                        }
                      >
                        <Trash size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <PersonFill size={50} className="text-muted mb-3" />
                    <p className="text-muted mb-0">
                      {searchTerm
                        ? "Không tìm thấy người dùng nào"
                        : "Chưa có người dùng nào"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal Create/Edit */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUser ? "Cập nhật người dùng" : "Thêm người dùng mới"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>
                Tên người dùng <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên người dùng"
                {...register("accountName", {
                  required: "Vui lòng nhập tên người dùng",
                })}
                isInvalid={!!errors.accountName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.accountName?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                {...register("accountEmail", {
                  required: "Vui lòng nhập email",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ",
                  },
                })}
                isInvalid={!!errors.accountEmail}
              />
              <Form.Control.Feedback type="invalid">
                {errors.accountEmail?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {!editingUser && (
              <Form.Group className="mb-3">
                <Form.Label>
                  Mật khẩu <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Nhập mật khẩu"
                  {...register("accountPassword", {
                    required: !editingUser && "Vui lòng nhập mật khẩu",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự",
                    },
                  })}
                  isInvalid={!!errors.accountPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.accountPassword?.message}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>
                Vai trò <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                {...register("accountRole", {
                  required: "Vui lòng chọn vai trò",
                })}
                isInvalid={!!errors.accountRole}
              >
                <option value="">-- Chọn vai trò --</option>
                <option value="1">ADMIN</option>
                <option value="2">STAFF</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.accountRole?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              {editingUser ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
