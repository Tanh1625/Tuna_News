import axiosClient from "./axiosClient";

const BASE = "/api/newsArticles";

export const newsArticleApi = {
  getAll: async (page = 0, size = 10) => {
    const response = await axiosClient.get(`${BASE}?page=${page}&size=${size}`);
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

export default newsArticleApi;
