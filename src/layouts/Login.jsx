//external
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { set, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
//internal
import CustomTextField from "../components/input/Custom-text-field";
import { VALIDATION_LOGIN_RULES } from "../schema/auth.validation";
import "../styles/Login.css";
import userSvg from "../assets/icons/user.svg";
import lockSvg from "../assets/icons/lock.svg";
import { useLoading } from "../context/loading-context";
import { DEFAULT_ACCOUNT } from "../constants";

export default function Login() {
  const { startLoading, stopLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [error, setError] = useState(false);

  const userIcon = <img src={userSvg} alt="User Icon" />;
  const lockIcon = <img src={lockSvg} alt="Lock Icon" />;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const handleLogin = (user) => {
    if (
      user.userName === DEFAULT_ACCOUNT.username &&
      user.password === DEFAULT_ACCOUNT.password
    ) {
      console.log("dcmmm====>");
      localStorage.setItem("user", JSON.stringify({ user }));
      localStorage.setItem("accessToken", JSON.stringify(user.accessToken));
      return true;
    } else {
      setError(true);
      console.log("delll dc ::::::::");
      return false;
    }
  };

  const onSubmit = async (data) => {
    try {
      const { userName, password } = data;
      const user = { userName, password, accessToken: "fakeToken1234567890" };

      // Simulate API call
      startLoading();
      const success = handleLogin(user);
      if (success) {
        setTimeout(() => {
          stopLoading();
          setError(false);
          navigate("/demo");
        }, 2000);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setTimeout(() => {
        stopLoading();
      }, 2000);
    }
  };

  return (
    <Container className="login-bg min-vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100">
        <Col xs={12} md={6} lg={4} className="mx-auto">
          <Card className="glass-effect">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-white">Đăng nhập</h2>
              </div>

              <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Username Field */}
                <CustomTextField
                  name="userName"
                  control={control}
                  errors={errors}
                  type="text"
                  placeholder="Nhập tên tài khoản của bạn"
                  required={true}
                  className="mb-2 input-glass"
                  rules={VALIDATION_LOGIN_RULES.userName}
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
                    <small>
                      Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.
                    </small>
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
                      href="#"
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
    </Container>
  );
}
