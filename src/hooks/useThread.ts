import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
  createThread,
  fetchThread,
  fetchThreads,
} from "@/store/thread/thread.thunk";
import type { ThreadRequest } from "@/types/thread";
import { useCallback } from "react";

export const useThread = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { threads, thread, loading } = useSelector(
    (state: RootState) => state.thread,
  );

  const getUserThreads = useCallback(
    (username: string) => {
      return threads.filter((t) => t.created.username === username);
    },
    [threads],
  );

  return {
    threads,
    thread,
    loading,
    getUserThreads,
    fetchThreads: () => dispatch(fetchThreads()),
    fetchThread: (id: number) => dispatch(fetchThread(id)),
    createThread: (data: ThreadRequest) => dispatch(createThread(data)),
  };
};
