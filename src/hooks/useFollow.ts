import {
  fetchFollows,
  fetchSuggestions,
  toggleFollow,
} from "@/store/follows/follow.thunk";
import type { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

export const useFollow = (key?: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const { users, lists, loading, fetching } = useSelector(
    (state: RootState) => state.follows,
  );

  const followUsers = key
    ? (lists[key]
        ?.map((id) => users[id])
        .filter(Boolean)
        .map((u) => ({ ...u })) ?? [])
    : [];

  return {
    users: followUsers,
    loading,
    fetching,

    fetchFollows: (type: "followers" | "followings", username: string) =>
      dispatch(fetchFollows({ type, username })),
    fetchSuggestions: () => dispatch(fetchSuggestions()),
    toggleFollow: (id: number) => dispatch(toggleFollow(id)),
  };
};
