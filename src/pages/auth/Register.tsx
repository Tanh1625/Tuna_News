import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CustomDropdown from "../../components/input/Custom-Dropdown";
import CustomTextField from "../../components/input/Custom-text-field";
import { RegisterFormData, registerSchema } from "../../schema/auth.validation";
import { register, RegisterRequest } from "../../services/AuApi";

const genders = [
  { name: "male", value: 1 },
  { name: "female", value: 2 },
  { name: "other", value: 3 },
];

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorRegister, setErrorRegister] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    watch,
    setValue, // Thêm setValue để cập nhật form
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange", // real-time validation
    defaultValues: {
      id: Date.now().toString(36) + Math.random().toString(36),
      userName: "",
      password: "",
      country: "vietNam",
      email: "",
      createdAt: new Date().toISOString(),
      role: "user",
      gender: "male",
      accessToken: "user_token",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const req: RegisterRequest = { ...data };
      setIsLoading(true);
      const response = await register(req);
      console.log("Registration successful", response);
      navigate("/");
    } catch (error) {
      setErrorRegister((error as Error).message);
      console.error("Registration failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Row className="w-100 mx-auto justify-content-center align-items-center vh-100">
        <Col xs={12} md={5} lg={4} className="text-center mb-4 mb-md-0">
          <div className="logo-section">
            <img
              src="../src/assets/images/logo.png"
              alt="Company Logo"
              className="img-fluid logo-image"
              style={{ maxWidth: "250px", filter: "brightness(1.1)" }}
            />
            <h3 className="text-light mt-3 fw-bold">
              Chào mừng đến với hệ thống
            </h3>
            <p className="text-warning">
              Tạo tài khoản để bắt đầu trải nghiệm
            </p>
          </div>
        </Col>

        <Col xs={12} md={4} lg={4} className="glass-effect">
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2 className="text-light text-center mt-3">Đăng ký</h2>
            {/* API Error Display */}
            {errorRegister && (
              <div className="alert alert-danger mb-3" role="alert">
                <small>{errorRegister}</small>
              </div>
            )}
            {/* Username Field */}
            <CustomTextField
              name="userName"
              control={control}
              errors={errors}
              type="text"
              placeholder="Nhập tên tài khoản của bạn"
              required={true}
              className="mb-2 input-glass"
              icon={<img src="src/assets/icons/user.svg" alt="User Icon" />}
            />

            {/* Password Field */}
            <CustomTextField
              name="password"
              control={control}
              type="password"
              placeholder="Nhập mật khẩu của bạn"
              errors={errors}
              required={true}
              className="mb-2 input-glass"
              icon={<img src="src/assets/icons/lock.svg" alt="Lock Icon" />}
            />

            {/* Confirm Password - Đơn giản */}
            <CustomTextField
              name="confirmPassword"
              control={control}
              type="password"
              placeholder="Xác nhận mật khẩu"
              errors={errors}
              required={true}
              className="mb-2 input-glass"
              icon={<img src="src/assets/icons/lock.svg" alt="Lock Icon" />}
              label={null}
            />
            <CustomTextField
              name="email"
              control={control}
              type="email"
              placeholder="Nhập email của bạn"
              errors={errors}
              required={true}
              className="mb-4 input-glass"
              icon={<img src="src/assets/icons/mail.svg" alt="Mail Icon" />}
              label={null}
            />
            <CustomDropdown
              name="country"
              control={control}
              errors={errors}
              label={null}
              options={[
                { value: "vietNam", label: "Việt Nam" },
                { value: "usa", label: "USA" },
                { value: "uk", label: "UK" },
              ]}
              _className={"mb-4 input-glass"}
            />
            <CustomDropdown
              name="gender"
              control={control}
              errors={errors}
              label={null}
              options={[
                { value: "male", label: "Nam" },
                { value: "female", label: "Nữ" },
                { value: "other", label: "Khác" },
              ]}
              _className={"mb-4 input-glass"}
            />
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
                    Đang đăng Ký...
                  </>
                ) : (
                  "Đăng Ký"
                )}
              </Button>
            </div>

            <hr className="my-3 border-light" />

            <div className="text-center">
              <span className="text-light small">
                Đã có tài khoản?{" "}
                <a
                  href="/"
                  className="text-decoration-none text-warning fw-semibold"
                >
                  Đăng nhập ngay
                </a>
              </span>
            </div>
          </Form>
        </Col>
      </Row>
    </>
  );
}
