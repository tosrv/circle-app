import { MessageSquareText } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from "../ui/card";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LikeButton from "./LikeButton";
import { useThread } from "@/hooks/useThread";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { likeThread } from "@/services/thread.api";
import { setLike, setLikesCount } from "@/store/like/like.slice";
import { useEffect } from "react";
import Images from "./Images";
import Replies from "../replies/Replies";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/hooks/useAuth";
import type { Thread } from "@/types/thread";
import { addReplyToThread } from "@/store/thread/thread.slice";

export default function ThreadDetail() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const { thread, fetchThread } = useThread();
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const likes = useSelector((state: RootState) => state.likes.likes);
  const likeCount = useSelector((state: RootState) => state.likes.likeCount);

  const { send } = useWebSocket({
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
  });

  useEffect(() => {
    if (id) fetchThread(Number(id));
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchThread(Number(id)).then((action) => {
        const thread = action.payload as Thread;

        const currentUserId = user?.id;

        const isLiked =
          thread.likes?.some((like) => like.user_id === currentUserId) ?? false;

        const count = thread.likes?.length ?? 0;

        dispatch(setLike({ id: thread.id, isLiked }));
        dispatch(setLikesCount({ id: thread.id, count }));
      });
    }
  }, [id, user, dispatch]);

  if (!thread) {
    return <p className="p-5">Thread not found</p>;
  }

  const isLiked = likes[thread.id] ?? false;
  const count = likeCount[thread.id] ?? 0;

  const toggleLike = async () => {
    try {
      const res = await likeThread(thread.id);

      dispatch(setLike({ id: thread.id, isLiked: res.data.isLiked }));
      dispatch(setLikesCount({ id: thread.id, count: res.data.likeCount }));

      if (send) {
        send("like", {
          id: thread.id,
          count: res.data.likeCount,
        });
      }
    } catch (err) {
      console.error("Failed to like thread:", err);
    }
  };

  const time = new Date(thread.created_at).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const date = new Date(thread.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleProfile = (username: string) => {
    const url = `/profile/${username}`;
    if (location.pathname !== url) {
      navigate(url);
    }
  };

  return (
    <div>
      <Card className="p-5 rounded-none border-0 border-b-2 bg-transparent shadow-none">
        <div className="grid grid-cols-[60px_1fr]">
          <section className="h-17 w-17 rounded-full overflow-hidden">
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
              <h4 className="text-gray-500">@{thread.created.username}</h4>
            </CardHeader>
            <CardDescription className="space-y-3">
              <span className="text-lg">{thread.content}</span>
              {thread.images && <Images images={thread.images} />}
              <div className="flex space-x-2 text-lg">
                <span className="text-gray-500">{time}</span>
                <span className="text-gray-500">󠁯•󠁏</span>
                <span className="text-gray-500">{date}</span>
              </div>
            </CardDescription>
            <CardAction className="flex justify-between w-25">
              <span className="flex items-center space-x-2">
                <LikeButton isLiked={isLiked} onToggle={toggleLike} />
                <span className="text-gray-500">{count}</span>
              </span>
              <span className="flex items-center space-x-2">
                <MessageSquareText className="text-gray-500" />
                <span className="text-gray-500">{thread.replies?.length ?? 0}</span>
              </span>
            </CardAction>
          </CardContent>
        </div>
      </Card>
      <Replies threadId={thread.id} />
    </div>
  );
}
