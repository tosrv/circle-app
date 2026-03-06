import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/context/ProfileProvider";
import { useFollow } from "@/hooks/useFollow";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchSearchUsers } from "@/store/user/user.thunk";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export default function Search() {
  const { user: loginUser } = useProfile();
  const [keyword, setKeyword] = useState("");
  const [showNoResult, setShowNoResult] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { toggleFollow, loading: followLoading } = useFollow();
  const ids = useSelector(
    (state: RootState) => state.follows.lists[`search_${keyword}`] ?? [],
  );

  const users = useSelector((state: RootState) =>
    ids.map((id) => state.follows.users[id]).filter(Boolean),
  );

  useEffect(() => {
    if (!keyword) return;
    const timer = setTimeout(() => {
      dispatch(fetchSearchUsers(keyword));
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  const handleProfile = (username: string) => {
    const url = `/profile/${username}`;
    if (location.pathname !== url) {
      navigate(url);
    }
  };

  useEffect(() => {
    if (!keyword) {
      setShowNoResult(false);
      return;
    }

    const timer = setTimeout(() => {
      if (users.length === 0) {
        setShowNoResult(true);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      setShowNoResult(false);
    };
  }, [keyword, users.length]);

  return (
    <div className="px-15">
      <Input
        type="text"
        placeholder="Search..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="h-11 rounded-3xl mt-5"
      />
      <ul className="mt-5 px-5">
        {!keyword && (
          <div className="flex justify-center items-end h-100">
            <p className="text-2xl text-gray-500">Who are you looking for?</p>
          </div>
        )}

        {showNoResult && (
          <div className="flex justify-center items-end h-100">
            <p className="text-2xl text-gray-500">No result for "{keyword}"</p>
          </div>
        )}

        {users.map((user) => (
          <li key={user.id}>
            <Card className="bg-transparent border-0 p-0 shadow-none">
              <CardContent className="flex items-center justify-between py-0 px-2">
                <CardHeader className="p-0 w-full">
                  <div className="flex items-center gap-3">
                    <section className="h-18 w-21 rounded-full overflow-hidden">
                      <img
                        src={
                          user?.photo_profile
                            ? user.photo_profile
                            : "https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg"
                        }
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    </section>
                    <CardTitle className="w-full space-y-1">
                      <h3
                        onClick={() => handleProfile(user.username)}
                        className="hover:cursor-pointer"
                      >
                        {user.full_name}
                      </h3>
                      <h4 className="text-gray-500">@{user.username}</h4>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardAction className="flex items-center h-18">
                  {loginUser?.id !== user.id && (
                    <Button
                      onClick={() => toggleFollow(user.id)}
                      variant={user.is_following ? "secondary" : "outline"}
                      className="rounded-2xl"
                      disabled={followLoading[user.id]}
                    >
                      {followLoading[user.id]
                        ? ""
                        : user.is_following
                          ? "Following"
                          : "Follow"}
                    </Button>
                  )}
                </CardAction>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
