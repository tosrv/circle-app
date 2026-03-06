import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/context/ProfileProvider";
import { useEffect } from "react";
import MyProfile from "./MyProfile";
import { useFollow } from "@/hooks/useFollow";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchSearchUsers } from "@/store/user/user.thunk";
import { Button } from "../ui/button";

export default function UserProfile({ username }: { username: string }) {
  const { user: loginUser } = useAuth();
  const { setProfile } = useProfile();
  const dispatch = useDispatch<AppDispatch>();

  const { toggleFollow, loading } = useFollow();

  const user = useSelector((state: RootState) =>
    Object.values(state.follows.users).find((u) => u.username === username),
  );

  const isMyProfile = loginUser?.username === username;

  useEffect(() => {
    if (isMyProfile && loginUser) {
      setProfile(loginUser.full_name);
      return;
    }

    if (!isMyProfile && user) {
      setProfile(user.full_name);
    }
  }, [isMyProfile, loginUser, user, setProfile]);

  useEffect(() => {
    if (!username) return;
    dispatch(fetchSearchUsers(username));
  }, [username, dispatch]);

  if (loginUser?.username === username) {
    return (
      <div className="h-fit p-5 border-b-2">
        <MyProfile />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-30">
        <h2 className="text-2xl text-gray-500">User not found</h2>
      </div>
    );
  }

  return (
    <div className="h-fit p-5 border-b-2">
      <>
        <section className="relative w-full py-3">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqYO0HBlSwjaclJpc1omQSTgeaTV9sZi9aFw&s"
            alt="Banner"
            className="rounded-md h-30 w-full"
          />
          <div className="flex justify-end mt-3">
            {user.photo_profile ? (
              <img
                src={user.photo_profile}
                alt="Avatar"
                className="h-25 border-4 rounded-full bg-gray-900 absolute bottom-2 left-10"
              />
            ) : (
              <img
                src="https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg"
                alt="Avatar"
                className="h-25 border-4 rounded-full bg-gray-900 absolute bottom-2 left-10"
              />
            )}
            <Button
              onClick={() => toggleFollow(user.id)}
              variant={user.is_following ? "secondary" : "outline"}
              className="rounded-2xl"
              disabled={loading[user.id]}
            >
              {loading[user.id]
                ? ""
                : user.is_following
                  ? "Following"
                  : "Follow"}
            </Button>
          </div>
        </section>
        <div className="space-y-2">
          <h3 className="font-semibold text-2xl">{user.full_name}</h3>
          <h4 className="text-gray-500">@{user.username}</h4>
          <h5>Bio</h5>
          <section className="flex space-x-3">
            <p className="space-x-2">
              <span className="font-semibold">{user.following_count}</span>
              <span>Following</span>
            </p>
            <p className="space-x-2">
              <span className="font-semibold">{user.followers_count}</span>
              <span>Followers</span>
            </p>
          </section>
        </div>
      </>
    </div>
  );
}
