import { fetchFollows, toggleFollow, fetchSuggestions } from "./follow.thunk";
import type { FollowsState } from "@/types/follows";
import type { User } from "@/types/user";
import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { fetchSearchUsers } from "../user/user.thunk";

export const followsExtraReducers = (
  builder: ActionReducerMapBuilder<FollowsState>,
) => {
  builder
    .addCase(fetchFollows.pending, (state) => {
      state.fetching = true;
    })

    // Fetch followers/followings
    .addCase(fetchFollows.fulfilled, (state, action) => {
      const { key, users } = action.payload;

      state.lists[key] = users.map((u) => u.id);

      users.forEach((user) => {
        state.users[user.id] = {
          ...user,
          is_following: Boolean(user.is_following),
        };
      });

      state.fetching = false;
    })

    .addCase(fetchFollows.rejected, (state) => {
      state.fetching = false;
    })

    // Toggle follow unfollow
    .addCase(toggleFollow.pending, (state, action) => {
      state.loading[action.meta.arg] = true;
    })

    .addCase(toggleFollow.fulfilled, (state, action) => {
      const { id, follows, followers_count, following_count } = action.payload;

      if (state.users[id]) {
        state.users[id] = {
          ...state.users[id],
          is_following: follows,
          followers_count,
          following_count,
        };
      }

      if (follows && state.lists["suggestions"]) {
        state.lists["suggestions"] = state.lists["suggestions"].filter(
          (uid) => uid !== id,
        );
      }

      // Add suggestions replacement
      if (state.lists["suggestions"]) {
        const existingIds = new Set(state.lists["suggestions"]);
        const replacement = Object.values(state.users)
          .filter((u) => u.id !== id)
          .filter((u) => !u.is_following && !existingIds.has(u.id))
          .map((u) => u.id)
          .slice(0, 1);

        state.lists["suggestions"].push(...replacement);
      }

      if (state.lists["suggestions"]) {
        state.lists["suggestions"] = state.lists["suggestions"].slice(0, 3);
      }

      state.loading[id] = false;
    })

    .addCase(toggleFollow.rejected, (state, action) => {
      state.loading[action.meta.arg] = false;
    })

    .addCase(fetchSuggestions.pending, (state) => {
      state.fetching = true;
    })
    .addCase(fetchSuggestions.fulfilled, (state, action) => {
      const users = action.payload;

      state.lists["suggestions"] = users.map((u: User) => u.id).slice(0, 3);

      users.forEach((user: User) => {
        state.users[user.id] = {
          ...user,
          is_following: Boolean(user.is_following),
        };
      });

      state.fetching = false;
    })
    .addCase(fetchSuggestions.rejected, (state) => {
      state.fetching = false;
    })

    // Search users
    .addCase(fetchSearchUsers.fulfilled, (state, action) => {
      const { q, users } = action.payload;

      const key = `search_${q}`;
      state.lists[key] = users.map((u: User) => u.id);

      users.forEach((user: User) => {
        state.users[user.id] = {
          ...state.users[user.id],
          ...user,
        };
      });
    });
};
