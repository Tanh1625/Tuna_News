import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    console.log("send Token:.....>", token);

    console.log("Request config: ", config.url, config.method, config.data);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Config===>", config);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

export default axiosClient;
