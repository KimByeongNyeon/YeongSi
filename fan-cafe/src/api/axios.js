// api/axios.js
import axios from "axios";

// 백엔드 API용 인스턴스
export const authApi = axios.create({
  baseURL: "http://localhost:8080",
});

// YouTube API용 인스턴스
export const youtubeApi = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
});

// 백엔드 API 인터셉터
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default authApi;
