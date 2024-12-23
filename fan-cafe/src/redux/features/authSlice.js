// src/redux/features/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 로그인 액션
export const login = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://127.0.0.1:8080/api/auth/login", { email, password });
    // 토큰 저장
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// 회원가입 액션
// 회원가입 액션
export const signup = createAsyncThunk("auth/signup", async ({ email, password, username, gender, profileImageUrl }, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post("http://127.0.0.1:8080/api/auth/signup", {
      email,
      password,
      username,
      gender,
      profileImageUrl,
    });

    // 회원가입 성공 후 자동 로그인
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    if (error.response) {
      // 서버가 응답을 반환한 경우
      return rejectWithValue(error.response.data);
    } else if (error.request) {
      // 요청이 만들어졌으나 응답을 받지 못한 경우
      return rejectWithValue({ message: "서버에서 응답을 받지 못했습니다." });
    } else {
      // 요청을 만드는 중에 오류가 발생한 경우
      return rejectWithValue({ message: "요청 중 오류가 발생했습니다." });
    }
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 로그인 상태 처리
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("나오냐?? 1", state.isAuthenticated);
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("Login success:", action.payload); // 응답 데이터 확인
        // 로컬 스토리지에 저장
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("userEmail", action.payload.email);
        localStorage.setItem("username", action.payload.username);
        // 리덕스 상태 업데이트
        state.token = action.payload.token;
        state.user = {
          email: action.payload.email,
          username: action.payload.username,
        };
        state.isAuthenticated = true;
        console.log("나오냐?2 :", state.isAuthenticated);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 회원가입 상태 처리
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
