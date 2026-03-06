import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { useFollow } from "@/hooks/useFollow";
import { useEffect, useState } from "react";
import type { User } from "@/types/user";

export default function FollowButton({ user }: { user: User }) {
  const { user: loginUser } = useAuth();
  const [follow, setFollow] = useState(false);

  const type = "followings";
  const username = loginUser!.username;
  const listKey = `${type}_${username}`;
  const {
    users: followingsList,
    toggleFollow,
    fetchFollows,
    loading,
  } = useFollow(listKey);

  useEffect(() => {
    fetchFollows(type, username);
  }, [type, username]);

  
  useEffect(() => {
    const userInList = followingsList.find((u) => u.id === user.id);
    if (userInList) {
      setFollow(userInList.is_following);
    }
  }, [followingsList, user.id]);
  
  const handleFollow = () => {
    setFollow(!follow);
    toggleFollow(user.id);
  };


  return (
    <Button
      onClick={handleFollow}
      variant={follow ? "secondary" : "outline"}
      className="rounded-2xl"
      disabled={loading[user.id] ?? false}
    >
      {follow ? "Following" : "Follow"}
    </Button>
  );
}
