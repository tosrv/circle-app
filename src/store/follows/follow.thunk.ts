import { follow, follows } from "@/services/follows.api";
import { userToFollow } from "@/services/follows.api";
import type { User } from "@/types/user";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface FetchFollowsPayload {
  key: string;
  users: User[];
}

// Fetch followers / followings (display)
export const fetchFollows = createAsyncThunk<
  FetchFollowsPayload,
  { type: "followers" | "followings"; username: string }
>("follows/fetch", async ({ type, username }) => {
  const res = await follows(type, username);

  return {
    key: `${type}_${username}`,
    users: res.data.data,
  };
});

export const fetchSuggestions = createAsyncThunk(
  "follows/fetchSuggestions",
  async () => {
    const res = await userToFollow();
    return res.data.data;
  },
);

// Toggle follow / unfollow
export const toggleFollow = createAsyncThunk(
  "follows/toggleFollow",
  async (id: number) => {
    const res = await follow(id);
    const { follows, followers_count, following_count } = res;
    return { id, follows, followers_count, following_count };
  },
);
