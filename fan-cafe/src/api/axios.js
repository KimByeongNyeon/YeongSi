// api/axios.js
import axios from "axios";

// 기본 설정
axios.defaults.baseURL = "http://localhost:8080";

// 요청 인터셉터
axios.interceptors.request.use(
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

// 응답 인터셉터 - 401 자동 로그아웃 제거
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 에러가 발생해도 로그아웃 처리하지 않음
    return Promise.reject(error);
  }
);

export default axios;
