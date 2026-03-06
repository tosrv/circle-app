import { createAsyncThunk } from "@reduxjs/toolkit";
import { searchUser } from "@/services/user.api";

export const fetchSearchUsers = createAsyncThunk("follows/search", async (q: string) => {
  const res = await searchUser(q);
  return {q, users: res.data.data};
});
