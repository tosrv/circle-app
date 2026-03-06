import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import type { AuthState } from "@/types/auth";
import { fetchUser, loginUser, logoutUser } from "./auth.thunk";

export const authExtraReducers = (
  builder: ActionReducerMapBuilder<AuthState>,
) => {
  // Fetch login user
  builder
    .addCase(fetchUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    })
    .addCase(fetchUser.rejected, (state) => {
      state.user = null;
      state.loading = false;
    });

  // Login
  builder
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    })
    .addCase(loginUser.rejected, (state) => {
      state.user = null;
      state.loading = false;
    });

  // Logout
  builder.addCase(logoutUser.fulfilled, (state) => {
    state.user = null;
    state.loading = false;
  });
};
