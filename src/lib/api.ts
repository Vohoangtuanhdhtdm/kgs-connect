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
