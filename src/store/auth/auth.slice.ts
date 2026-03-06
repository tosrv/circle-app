import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authExtraReducers } from "./auth.reducer";
import type { AuthState } from "@/types/auth";
import type { User } from "@/types/user";

const initialState: AuthState = {
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    editUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
  extraReducers: authExtraReducers,
});

export const { editUser } = authSlice.actions;
export default authSlice.reducer;
