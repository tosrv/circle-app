import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { useFollow } from "@/hooks/useFollow";
import { useAuth } from "@/hooks/useAuth";

interface FollowProps {
  listKey: string;
}

export default function FollowList({ listKey }: FollowProps) {
  const { user: loginUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { users, toggleFollow, loading } = useFollow(listKey);

  const handleProfile = (username: string) => {
    const url = `/profile/${username}`;
    if (location.pathname !== url) {
      navigate(url);
    }
  };

  return (
    <>
      <ul className="mt-3 space-y-2">
        {/* Display follow or following user and action */}
        {users.map(
          (user) =>
            user.id !== loginUser?.id && (
              <li key={user.id}>
                <Card className="bg-transparent border-0 p-0 shadow-none">
                  <CardContent className="flex justify-between py-0 px-2">
                    <CardHeader className="p-0 w-full">
                      <div className="flex gap-3">
                        <section className="h-12 w-14 rounded-full overflow-hidden">
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
                    <CardAction>
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
                    </CardAction>
                  </CardContent>
                </Card>
              </li>
            ),
        )}
      </ul>
    </>
  );
}
