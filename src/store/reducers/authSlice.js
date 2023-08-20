import { login, registration } from "@actions/actions";

import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  isAuth: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    checkAuth(state) {
      let token = localStorage?.getItem("token") ?? null
      state.isAuth = !!token;
    },
    logOut(state) {
      localStorage.removeItem("token");
      state.isAuth = false;
    },
  },
  extraReducers: {
    [login.pending.type]: (state) => {
      state.isLoading = true;
    },
    [login.fulfilled.type]: (state) => {
      state.isLoading = false;
      state.error = null;
      state.isAuth = true;
    },
    [login.rejected.type]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [registration.pending.type]: (state) => {
      state.isLoading = true;
    },
    [registration.fulfilled.type]: (state) => {
      state.isLoading = false;
      state.error = null;
      state.isAuth = true;
    },
    [registration.rejected.type]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default authSlice.reducer;
