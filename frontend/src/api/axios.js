/**
 * BREW HAVEN - Axios Instance
 * This file creates a configured axios instance
 * that automatically adds the JWT token to every request
 */

import axios from "axios";

const api = axios.create({
  baseURL: "https://brew-haven-production-6b70.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("bh_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("bh_token");
      localStorage.removeItem("bh_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;