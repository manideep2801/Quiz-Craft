import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8080",
});

// Automatically add token if user is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("qc_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle unauthorized errors gracefully
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      console.warn("Unauthorized request, redirecting to login...");
      // window.location.href = "/login"; // enable later if needed
    }
    return Promise.reject(err);
  }
);
