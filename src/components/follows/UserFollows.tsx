import { useEffect } from "react";
import FollowsList from "./FollowsList";
import { useFollow } from "@/hooks/useFollow";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { useWebSocket } from "@/hooks/useWebSocket";
import {
  toggleFollowListOnly,
  updateFollowersList,
} from "@/store/follows/follow.slice";
import { useAuth } from "@/hooks/useAuth";

export interface FollowListProps {
  type: "followers" | "followings";
  username: string;
}

export default function UserFollows({ type, username }: FollowListProps) {
  const { user } = useAuth();
  const listKey = `${type}_${username}`;
  const { fetchFollows } = useFollow(listKey);
  const dispatch = useDispatch<AppDispatch>();

  // Fetch data from store
  useEffect(() => {
    fetchFollows(type, username);
  }, [type, username]);

  useWebSocket(
    {
      following_update: (payload) => {
        if (type !== "followings") return;
        dispatch(
          toggleFollowListOnly({
            listKey,
            id: payload.followId,
            follows: payload.isFollowing,
          }),
        );
      },
      followers_update: (payload) => {
        if (type !== "followers") return;
        dispatch(
          updateFollowersList({
            listKey,
            id: payload.followerId,
            follows: payload.isFollowing,
          }),
        );
      },
    },
    user?.id,
  );

  return (
    <div className="mx-20 mt-10">
      <FollowsList listKey={listKey} />
    </div>
  );
}
