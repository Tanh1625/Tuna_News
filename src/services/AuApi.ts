import axios from "axios";

type LoginRequest = {
  userName: string;
  password: string;
};
type LoginResponse = {
  accessToken: string;
  userName: string;
};
export type RegisterRequest = {
  id: string;
  userName: string;
  gender: string;
  email: string;
  password: string;
  role: string;
  country: string;
  createdAt: string;
  accessToken: string;
};

export async function login(loginRequest: LoginRequest): Promise<LoginResponse> {
  const response = await axios.get(`http://localhost:3000/users`, {
    params: {
      userName: loginRequest.userName,
      password: loginRequest.password,
    },
  });

  if (response.data.length === 0) {
    throw new Error("Sai username hoặc password");
  }

  const user = response.data[0];
  return {
    accessToken: user.accessToken,
    userName: user.userName,
  };
}

export async function register(registerRequest: RegisterRequest): Promise<void> {
  try {
    // 1. Check username đã tồn tại chưa
    const existingUserName = await axios.get(`http://localhost:3000/users`, {
      params: { userName: registerRequest.userName },
    });

    if (existingUserName.data.length > 0) {
      throw new Error("Tên đăng nhập đã tồn tại");
    }

    // 2. Check email đã tồn tại chưa
    const existingEmail = await axios.get(`http://localhost:3000/users`, {
      params: { email: registerRequest.email },
    });

    if (existingEmail.data.length > 0) {
      throw new Error("Email đã được sử dụng");
    }

    // 3. Nếu OK thì tạo user mới
    const response = await axios.post(`http://localhost:3000/users`, registerRequest);
    return response.data;
  } catch (error) {
    console.error("Failed to register", error);
    throw error;
  }
}
