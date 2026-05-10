import axios from "axios";

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ?? "https://localhost:7129/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("kgs_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const oldToken = localStorage.getItem("kgs_token");
        const refreshToken = localStorage.getItem("kgs_refreshToken");

        const response = await axios.post(
          "https://localhost:7129/api/Account/refresh",
          {
            accessToken: oldToken,
            refreshToken: refreshToken,
          },
        );

        const { token: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        localStorage.setItem("kgs_token", newAccessToken);
        localStorage.setItem("kgs_refreshToken", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Phiên đăng nhập đã hết hạn hoàn toàn");
        localStorage.removeItem("kgs_token");
        localStorage.removeItem("kgs_refreshToken");
        localStorage.removeItem("kgs_user");
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
