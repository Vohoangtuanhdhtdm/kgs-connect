import axios from "axios";

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ?? "https://localhost:7129/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/** True when we should fall back to mock data (preview can't reach localhost). */
export const USE_MOCKS =
  (import.meta as any).env?.VITE_USE_MOCKS !== "false" &&
  /localhost|127\.0\.0\.1/.test(API_BASE_URL);

// Thêm Access Token vào mọi Request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("kgs_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tự động bắt lỗi 401 và gọi Refresh Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi là 401 (Hết hạn Access Token) và chưa từng thử refresh lại (_retry)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu là đang thử lại để tránh vòng lặp vô hạn

      try {
        const oldToken = localStorage.getItem("kgs_token");
        const refreshToken = localStorage.getItem("kgs_refreshToken");

        // Gọi API refresh của Backend
        const response = await axios.post(
          "https://localhost:7129/api/Account/refresh",
          {
            accessToken: oldToken,
            refreshToken: refreshToken,
          },
        );

        const { token: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        // Lưu lại cặp thẻ mới vào két sắt
        localStorage.setItem("kgs_token", newAccessToken);
        localStorage.setItem("kgs_refreshToken", newRefreshToken);

        // Đổi thẻ mới cho Request vừa bị lỗi và ĐÁNH KẺNG chạy lại request đó!
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token cũng sai hoặc hết hạn -> Đuổi ra màn hình Login
        console.error("Phiên đăng nhập đã hết hạn hoàn toàn");
        localStorage.removeItem("kgs_token");
        localStorage.removeItem("kgs_refreshToken");
        localStorage.removeItem("kgs_user");
        window.location.href = "/auth"; // Chuyển hướng về trang đăng nhập
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
