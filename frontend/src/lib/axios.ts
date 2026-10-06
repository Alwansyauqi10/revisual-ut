import axios from "axios";

import {
  clearAuth,
  getToken,
} from "@/services/authStorage";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();

      if (
        window.location.pathname.startsWith(
          "/admin",
        ) &&
        window.location.pathname !==
          "/admin/login"
      ) {
        window.location.href =
          "/admin/login";
      }
    }

    return Promise.reject(error);
  },
);