import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Sisipkan token JWT ke setiap request jika ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("planify_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Jika token kedaluwarsa / tidak valid, arahkan kembali ke login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("planify_token");
      localStorage.removeItem("planify_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
