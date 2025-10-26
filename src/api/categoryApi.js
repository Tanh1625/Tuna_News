import axiosClient from "./axiosClient"

export const categoryApi = {
  getAll: async () => {
    const response = await axiosClient.get("");
    return response;
  },
}