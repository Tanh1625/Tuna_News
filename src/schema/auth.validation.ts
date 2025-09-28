import { z } from "zod";

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

// use zod for schema validation
export const registerSchema = z
  .object({
    id: z.string().optional(),
    userName: z
      .string()
      .min(2, { message: "Tên đăng nhập phải có ít nhất 2 ký tự" })
      .max(100, { message: "Tên đăng nhập không được vượt quá 100 ký tự" }),
    gender: z.enum(["male", "female", "other"]),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
      .max(100, { message: "Mật khẩu không được vượt quá 100 ký tự" }),
    confirmPassword: z.string().min(6, { message: "Xác nhận mật khẩu phải có ít nhất 6 ký tự" }),
    country: z
      .string()
      .min(2, { message: "Tên quốc gia phải có ít nhất 2 ký tự" })
      .max(100, { message: "Tên quốc gia không được vượt quá 100 ký tự" }),
    createdAt: z.string().datetime(),
    role: z.enum(["user", "admin"]).optional(),
    accessToken: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== (data as any).confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
