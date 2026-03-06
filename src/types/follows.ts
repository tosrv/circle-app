import type { User } from "./user";

export interface FollowsState {
  users: Record<number, User>;
  lists: Record<string, number[]>;
  loading: Record<number, boolean>;
  fetching: boolean;
}
