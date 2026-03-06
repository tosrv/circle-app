import type { ThreadState } from "@/types/thread";
import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { createThread, fetchThread, fetchThreads } from "./thread.thunk";

export const threadExtraReducers = (
  builder: ActionReducerMapBuilder<ThreadState>,
) => {
  // Display all threads
  builder
    .addCase(fetchThreads.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchThreads.fulfilled, (state, action) => {
      state.threads = action.payload;
      state.loading = false;
    })
    .addCase(fetchThreads.rejected, (state, action) => {
      state.threads = [];
      state.loading = false;
      state.error = action.error.message || "Failed to fetch threads";
    });

    // Thread by id
    builder
    .addCase(fetchThread.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchThread.fulfilled, (state, action) => {
      state.thread = action.payload;
      state.loading = false;
    })
    .addCase(fetchThread.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch thread";
    });

    // Create new thread
    builder
    .addCase(createThread.pending, (state) => {
      state.loading = true;
    })
    .addCase(createThread.fulfilled, (state, action) => {
      state.threads.unshift(action.payload);
      state.loading = false;
    })
    .addCase(createThread.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to create thread";
    })
};
