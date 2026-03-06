import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FollowsState } from "@/types/follows";
import { followsExtraReducers } from "./follow.reducer";
import type { User } from "@/types/user";

const initialState: FollowsState = {
  users: {},
  lists: {},
  loading: {},
  fetching: false,
};

const followsSlice = createSlice({
  name: "follows",
  initialState,
  reducers: {
    updateCount: (
      state,
      action: PayloadAction<{ userId: number; updates: Partial<User> }>,
    ) => {
      const { userId, updates } = action.payload;
      if (state.users[userId]) {
        state.users[userId] = { ...state.users[userId], ...updates };
      }
    },

    toggleFollowListOnly: (
      state,
      action: PayloadAction<{ listKey: string; id: number; follows: boolean }>,
    ) => {
      const { listKey, id, follows } = action.payload;

      if (!state.lists[listKey]) state.lists[listKey] = [];

      if (follows) {
        if (!state.lists[listKey].includes(id)) {
          state.lists[listKey] = [...state.lists[listKey], id]; // buat array baru
        }
      } else {
        state.lists[listKey] = state.lists[listKey].filter((uid) => uid !== id);
      }
    },

    updateFollowersList: (
      state,
      action: PayloadAction<{ listKey: string; id: number; follows: boolean }>,
    ) => {
      const { listKey, id, follows } = action.payload;

      if (!state.lists[listKey]) state.lists[listKey] = [];

      if (follows) {
        if (!state.lists[listKey].includes(id)) {
          state.lists[listKey] = [...state.lists[listKey], id];
        }
      } else {
        state.lists[listKey] = state.lists[listKey].filter((uid) => uid !== id);
      }
    },
  },
  extraReducers: followsExtraReducers,
});

export const { updateCount, toggleFollowListOnly, updateFollowersList } =
  followsSlice.actions;
export default followsSlice.reducer;
