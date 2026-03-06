import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { threadExtraReducers } from "./thread.reducer";
import type { Thread, ThreadState } from "@/types/thread";
import type { Reply } from "@/types/reply";

const initialState: ThreadState = {
  threads: [],
  thread: null,
  loading: false,
};

const threadSlice = createSlice({
  name: "thread",
  initialState,
  reducers: {
    addThreadToState(state, action: PayloadAction<Thread>) {
      state.threads.unshift(action.payload);
    },
    addReplyToThread(
      state,
      action: PayloadAction<{ threadId: number; content: Reply }>,
    ) {
      const { threadId, content } = action.payload;
      
      // update di threads list
      const thread = state.threads.find((t) => t.id === threadId);
      if (thread) {
        if (!thread.replies) thread.replies = [];
        thread.replies.push(content);
      }

      // update jika sedang buka thread detail
      if (state.thread?.id === threadId) {
        if (!state.thread.replies) state.thread.replies = [];
        state.thread.replies.push(content);
      }
    },
  },
  extraReducers: threadExtraReducers,
});

export const { addThreadToState, addReplyToThread } = threadSlice.actions;
export default threadSlice.reducer;
