import axiosClient from "./axiosClient"

const BASE = "/api/categories";

export const categoryApi = {
  getAll: async () => {
    const response = await axiosClient.get(BASE);
    return response.data;
  },
}
export default categoryApi;