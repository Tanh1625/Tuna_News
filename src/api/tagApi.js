import axiosClient from "./axiosClient";

const BASE = "/api/tags";

export const tagApi = {
  getAll: async () => {
    const response = await axiosClient.get(BASE);
    return response.data;
  },
  getById: async (id) => {
    const response = await axiosClient.get(`${BASE}/${id}`);
    return response.data;
  },
  create: async (payload) => {
    const response = await axiosClient.post(BASE, payload);
    return response.data;
  },
  update: async (id, payload) => {
    const response = await axiosClient.put(`${BASE}/${id}`, payload);
    return response.data;
  },
  delete: async (id) => {
    const response = await axiosClient.delete(`${BASE}/${id}`);
    return response.data;
  },
};

export default tagApi;
