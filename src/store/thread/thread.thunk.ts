import {
  addThread,
  // editThread,
  getThread,
  getThreads,
  // removeThread,
} from "@/services/thread.api";
import type { Thread, ThreadRequest } from "@/types/thread";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Display all threads
export const fetchThreads = createAsyncThunk<Thread[]>(
  "thread/fetchThreads",
  async () => {
    const res = await getThreads();
    return res.data.data as Thread[];
  },
);

// Thread by id
export const fetchThread = createAsyncThunk<Thread, number>(
  "thread/fetchThread",
  async (id) => {
    const res = await getThread(id);
    return res.data.data as Thread;
  },
);

// Create new thread
export const createThread = createAsyncThunk<Thread, ThreadRequest>(
  "thread/createThread",
  async ({ content, images }) => {
    const res = await addThread({ content, images });
    return res.data.data as Thread;
  },
);


// // Delete thread
// export const deleteThread = createAsyncThunk<Thread, number>(
//   "thread/deleteThread",
//   async (id) => {
//     const res = await removeThread(id);
//     return res.data.data as Thread;
//   },
// );

// // Update thread
// export const updateThread = createAsyncThunk<
//   Thread,
//   { id: number; content: string; image?: string }
// >("thread/updateThread", async ({ id, content, image }) => {
//   const res = await editThread(id, content, image);
//   return res.data.data as Thread;
// });
