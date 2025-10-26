//external
import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { set, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
//internal
import CustomTextField from "../../components/input/Custom-text-field";
import { VALIDATION_LOGIN_RULES } from "../../schema/auth.validation.js";
import "../../styles/Login.css";
import userSvg from "../../assets/icons/user.svg";
import lockSvg from "../../assets/icons/lock.svg";
import { useLoading } from "../../context/loading-context";
import { authApi } from "../../api/auth.js";
import { useAuth } from "../../context/auth-context";

export default function Login() {
  const { startLoading, stopLoading } = useLoading();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const userIcon = <img src={userSvg} alt="User Icon" />;
  const lockIcon = <img src={lockSvg} alt="Lock Icon" />;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      const user = { email, password };

      startLoading();
      const res = await authApi.login(user);
      const token = res.data.data;

      // Use AuthContext login to update global state
      const userLogin = login(token);
      console.log("User info:", userLogin);

      // Safe check for roles
      if (userLogin && userLogin.roles && userLogin.roles.length > 0) {
        if (userLogin.roles[0] === "ROLE_ADMIN") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        // Default to home if no roles found
        navigate("/home");
      }

      setError(""); // Clear any previous errors
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Đăng nhập thất bại. Vui lòng thử lại."
      );
      console.error("Login error:", error);
    } finally {
      stopLoading();
    }
  };

  return (
    <Row className="w-100">
      <Col xs={12} md={6} lg={4} className="mx-auto">
        <Card className="glass-effect">
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-white">Đăng nhập</h2>
            </div>

            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Email Field */}
              <CustomTextField
                name="email"
                control={control}
                errors={errors}
                type="text"
                placeholder="Nhập email của bạn"
                required={true}
                className="mb-2 input-glass"
                rules={VALIDATION_LOGIN_RULES.email}
                icon={userIcon}
              />

              {/* Password Field */}
              <CustomTextField
                name="password"
                control={control}
                type="password"
                placeholder="Nhập mật khẩu của bạn"
                errors={errors}
                required={true}
                className="mb-4 input-glass"
                rules={VALIDATION_LOGIN_RULES.password}
                icon={lockIcon}
              />

              {/* API Error Display */}
              {error && (
                <div className="alert alert-danger mb-3" role="alert">
                  <small>{error}</small>
                </div>
              )}

              {/* Submit Button */}
              <div className="d-grid">
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  disabled={!isValid || isLoading}
                  className="fw-semibold"
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Đang đăng nhập...
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
              </div>

              {/* Additional Links */}
              <div className="text-center mt-3">
                <a href="#" className="text-decoration-none text-light small">
                  Quên mật khẩu?
                </a>
              </div>

              <hr className="my-3 border-light" />

              <div className="text-center">
                <span className="text-light small">
                  Chưa có tài khoản?{" "}
                  <a
                    href="register"
                    className="text-decoration-none text-warning fw-semibold"
                  >
                    Đăng ký ngay
                  </a>
                </span>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
