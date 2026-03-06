import { MessageSquareText } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from "../ui/card";
import type { ThreadsProps } from "@/types/props";
import { useEffect } from "react";
import LikeButton from "./LikeButton";
import { likeThread } from "@/services/thread.api";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { setLike, setLikesCount } from "@/store/like/like.slice";
import {
  addReplyToThread,
  addThreadToState,
} from "@/store/thread/thread.slice";
import { useWebSocket } from "@/hooks/useWebSocket";
import Images from "./Images";

export default function ThreadsLists({ threads }: ThreadsProps) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const threadsStore = useSelector((state: RootState) => state.thread.threads);
  const likes = useSelector((state: RootState) => state.likes.likes);
  const likesCount = useSelector((state: RootState) => state.likes.likeCount);

  const { send } = useWebSocket(
    {
      new_thread: (payload) => dispatch(addThreadToState(payload)),

      new_reply: (payload) => {
        dispatch(
          addReplyToThread({
            threadId: payload.thread_id,
            content: payload.content,
          }),
        );
      },

      like: (payload: { id: number; count: number }) => {
        dispatch(setLikesCount({ id: payload.id, count: payload.count }));
      },
    },
    user?.id,
  );

  const toggleLike = async (id: number) => {
    try {
      const res = await likeThread(id);

      dispatch(setLike({ id, isLiked: res.data.isLiked }));
      dispatch(setLikesCount({ id, count: res.data.likeCount }));

      if (send) {
        send("like", {
          id,
          count: res.data.likeCount,
        });
      }
    } catch (err) {
      console.error("Failed to like thread:", err);
    }
  };

  useEffect(() => {
    if (!user) return;

    threads.forEach((thread) => {
      const currentUserId = user!.id;

      const isLiked =
        thread.likes?.some((like) => like.user_id === currentUserId) ?? false;

      const count = thread.likes?.length ?? 0;

      dispatch(setLike({ id: thread.id, isLiked }));
      dispatch(setLikesCount({ id: thread.id, count }));
    });
  }, [threads, user, dispatch]);

  const handleProfile = (username: string) => {
    const url = `/profile/${username}`;
    if (location.pathname !== url) {
      navigate(url);
    }
  };

  return (
    <ul>
      {threads.map((threadProp) => {
        const thread =
          threadsStore.find((thread) => thread.id === threadProp.id) ||
          threadProp;
        const isLiked = likes[thread.id] ?? false;
        const count = likesCount[thread.id] ?? 0;

        return (
          <li key={thread.id}>
            <Card className="p-5 rounded-none border-0 border-b-2 bg-transparent shadow-none">
              <div className="grid grid-cols-[60px_1fr]">
                <section className="h-14 w-14 rounded-full overflow-hidden">
                  <img
                    src={
                      thread.created?.photo_profile
                        ? thread.created.photo_profile
                        : "https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg"
                    }
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                </section>
                <CardContent className="flex flex-col justify-start space-y-1">
                  <CardHeader className="flex w-full justify-start p-0">
                    <h3
                      onClick={() => handleProfile(thread.created.username)}
                      className="hover:cursor-pointer"
                    >
                      {thread.created.full_name}
                    </h3>
                    <h4 className="text-gray-500">
                      @{thread.created.username}
                    </h4>
                    <span className="text-gray-500">󠁯•󠁏</span>
                    <span className="text-gray-500">{thread.created_at}</span>
                  </CardHeader>
                  <CardDescription>
                    <p className="text-lg">{thread.content}</p>
                    {thread.images!.length > 0 && (
                      <Images images={thread.images || []} />
                    )}
                  </CardDescription>
                  <CardAction className="flex justify-between w-25">
                    <span className="flex items-center space-x-1">
                      <LikeButton
                        isLiked={isLiked}
                        onToggle={() => toggleLike(thread.id)}
                      />
                      <span>{count}</span>
                    </span>
                    <Link
                      to={`/thread/${thread.id}`}
                      state={{ from: location.pathname }}
                      className="flex items-center space-x-2"
                    >
                      <MessageSquareText className="text-gray-500" />
                      <span>{thread.replies?.length ?? 0}</span>
                    </Link>
                  </CardAction>
                </CardContent>
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
