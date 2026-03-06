import { getMe, login, logout } from "@/services/auth.api";
import type { User } from "@/types/user";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const res = await getMe();
  return res.data.user;
});

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    await login(email, password);
    const res = await getMe();
    return res.data.user;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed",
    );
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await logout();
});
