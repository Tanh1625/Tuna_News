// Validation rules
export const VALIDATION_LOGIN_RULES = {
  userName: {
    required: "Tên đăng nhập là bắt buộc",
    minLength: {
      value: 1,
      message: "Tên đăng nhập phải có ít nhất 1 ký tự",
    },
    maxLength: {
      value: 50,
      message: "Tên đăng nhập không được vượt quá 50 ký tự",
    },
    pattern: {
      value: /^[a-zA-Z0-9_]+$/,
      message: "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới",
    },
  },
  password: {
    required: "Mật khẩu là bắt buộc",
    minLength: {
      value: 6,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    },
  },
};
