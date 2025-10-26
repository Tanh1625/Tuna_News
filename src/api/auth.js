import axiosClient from "./axiosClient";

export const authApi = {
  login: async (payload) => {
    const response = await axiosClient.post("/api/auth/login", payload);
    return response;
  }
}