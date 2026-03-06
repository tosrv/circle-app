import type { LikeState } from "@/types/like";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: LikeState = {
  likes: {},
  likeCount: {},
};

export const likeSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    setLike(state, action: PayloadAction<{ id: number; isLiked: boolean }>) {
      state.likes[action.payload.id] = action.payload.isLiked;
    },
    setLikesCount(state, action: PayloadAction<{ id: number; count: number }>) {
      state.likeCount[action.payload.id] = action.payload.count;
    },
  },
});

export const { setLike, setLikesCount } = likeSlice.actions;

export default likeSlice.reducer;