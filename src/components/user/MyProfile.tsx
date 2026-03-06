import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useProfile } from "@/context/ProfileProvider";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { updateCount } from "@/store/follows/follow.slice";

export default function MyProfile() {
  const { user, setUser, setEditDialogOpen } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useWebSocket(
    {
      followers_update: (payload) => {
        dispatch(
          updateCount({
            userId: payload.userId,
            updates: { followers_count: payload.followersCount },
          }),
        );
        setUser((prev) =>
          prev ? { ...prev, followers_count: payload.followersCount } : prev,
        );
      },
      following_update: (payload) => {
        dispatch(
          updateCount({
            userId: payload.userId,
            updates: { following_count: payload.followingCount },
          }),
        );
        setUser((prev) =>
          prev ? { ...prev, following_count: payload.followingCount } : prev,
        );
      },
    },
    user?.id,
  );

  const handleProfile = (username: string) => {
    const url = `/profile/${username}`;
    if (location.pathname !== url) {
      navigate(url);
    }
  };

  if (!user) return null;

  return (
    <>
      <section className="relative w-full py-3">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqYO0HBlSwjaclJpc1omQSTgeaTV9sZi9aFw&s"
          alt="Banner"
          className="rounded-md h-30 w-full object-cover"
        />
        <div className="flex justify-end mt-3">
          <div className="h-25 w-25 bg-gray-900 border-4 overflow-hidden absolute bottom-2 left-10 rounded-full">
            <img
              src={
                user.photo_profile
                  ? user.photo_profile
                  : "https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg"
              }
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <Button
            variant="outline"
            className="rounded-2xl"
            onClick={() => setEditDialogOpen(true)}
          >
            Edit Profile
          </Button>
        </div>
      </section>

      <div className="space-y-2">
        <h3
          onClick={() => handleProfile(user.username)}
          className="font-semibold text-2xl hover:cursor-pointer"
        >
          {user.full_name}
        </h3>
        <h4 className="text-gray-500">@{user.username}</h4>
        {user.bio && <h5>{user.bio}</h5>}

        <section className="flex space-x-3 mt-2">
          <p className="space-x-2">
            <span className="font-semibold">{user.following_count ?? 0}</span>
            <span>Following</span>
          </p>
          <p className="space-x-2">
            <span className="font-semibold">{user.followers_count ?? 0}</span>
            <span>Followers</span>
          </p>
        </section>
      </div>
    </>
  );
}