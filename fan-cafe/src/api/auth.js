// src/api/auth.js
import axios from "./axios";

export const authApi = {
  login: (email, password) => axios.post("/auth/login", { email, password }),

  signup: (userData) => axios.post("/auth/signup", userData),

  getUserInfo: async () => {
    try {
      const response = await axios.get("/api/auth/me");
      console.log("User Info Response:", response); // 응답 확인용
      return response;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  },
};
