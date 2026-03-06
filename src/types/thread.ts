import type { Like } from "./like";
import type { User } from "./user";

export interface Thread {
  id: number;
  content: string;
  images?: string[];
  created: User;
  created_at: string;
  created_by: number;
  likes?: Like[];
  replies?: Replies[];
}

export interface ThreadRequest {
  content: string;
  images?: File[];
}

export interface ThreadState {
  threads: Thread[];
  thread: Thread | null;
  loading: boolean;
  error?: string;
}

interface Replies {
  id: number;
  content: string;
  thread_id: number;
  images?: string[];
  created: User
}