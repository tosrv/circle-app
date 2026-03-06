import { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from "../ui/card";
import type { RepliesProps } from "./Replies";
import { getReplies } from "@/services/replies.api";
import { useWebSocket } from "@/hooks/useWebSocket";
import Images from "../thread/Images";
import { Heart } from "lucide-react";
import { likeReply } from "@/services/thread.api";
import { useLocation, useNavigate } from "react-router-dom";

interface Replies {
  id: number;
  content: string;
  images?: string[];
  created: {
    username: string;
    full_name: string;
    photo_profile: string;
  };
  likeCount: number;
  isLiked: boolean;
}

export default function RepliesList({ threadId }: RepliesProps) {
  const [loading, setLoading] = useState(false);
  const [replies, setReplies] = useState<Replies[]>([]);
  const [clickedLikes, setClickedLikes] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [likeCounts, setLikeCounts] = useState<{ [key: number]: number }>({});
  const location = useLocation();
  const navigate = useNavigate();

  useWebSocket({
    new_reply: (payload: Replies) => {
      setReplies((prev) => [payload, ...prev]);
      setLikeCounts((prev) => ({
        ...prev,
        [payload.id]: payload.likeCount || 0,
      }));
      setClickedLikes((prev) => ({
        ...prev,
        [payload.id]: payload.isLiked || false,
      }));
    },
    reply_like: (payload: { replyId: number; likeCount: number }) => {
      setLikeCounts((prev) => ({
        ...prev,
        [payload.replyId]: payload.likeCount,
      }));
    },
  });

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        setLoading(true);
        const res = await getReplies(threadId);
        const repliesData: Replies[] = res.data.data;
        setReplies(repliesData);

        const counts: { [key: number]: number } = {};
        const clicked: { [key: number]: boolean } = {};
        repliesData.forEach((r) => {
          counts[r.id] = r.likeCount ?? 0;
          clicked[r.id] = r.isLiked ?? false;
        });
        setLikeCounts(counts);
        setClickedLikes(clicked);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReplies();
  }, [threadId]);

  const toggleLike = async (id: number) => {
    const currentlyLiked = clickedLikes[id];

    setClickedLikes((prev) => ({
      ...prev,
      [id]: !currentlyLiked,
    }));
    setLikeCounts((prev) => ({
      ...prev,
      [id]: prev[id] + (currentlyLiked ? -1 : 1),
    }));

    try {
      const res = await likeReply(id);
      if (res.data.likeCount !== undefined) {
        setLikeCounts((prev) => ({ ...prev, [id]: res.data.likeCount }));
      }
    } catch (err) {
      console.error(err);
      setClickedLikes((prev) => ({ ...prev, [id]: currentlyLiked }));
      setLikeCounts((prev) => ({
        ...prev,
        [id]: prev[id] + (currentlyLiked ? 1 : -1),
      }));
    }
  };

  const handleProfile = (username: string) => {
    const url = `/profile/${username}`;
    if (location.pathname !== url) {
      navigate(url);
    }
  };

  if (loading) return null;

  return (
    <ul>
      {replies.length === 0 ? (
        <div className="flex justify-center items-center h-30">
          <h2 className="text-2xl text-gray-500">No replies yet</h2>
        </div>
      ) : (
        replies.map((reply) => (
          <li key={reply.id}>
            <Card className="p-5 rounded-none border-0 border-b-2 bg-transparent">
              <div className="grid grid-cols-[60px_1fr]">
                <section className="h-14 w-14 rounded-full overflow-hidden">
                  <img
                    src={
                      reply.created?.photo_profile
                        ? reply.created.photo_profile
                        : "https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg"
                    }
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                </section>
                <CardContent className="space-y-1 flex flex-col justify-start">
                  <CardHeader className="flex w-full justify-start p-0 gap-2">
                    <h3 onClick={() => handleProfile(reply.created.username)} className="hover:cursor-pointer">{reply.created.full_name}</h3>
                    <h4 className="text-gray-500">@{reply.created.username}</h4>
                  </CardHeader>
                  <CardDescription>
                    <p className="text-lg">{reply.content}</p>
                    {reply.images && <Images images={reply.images} />}
                  </CardDescription>
                  <CardAction className="flex space-x-2 items-center">
                    <span
                      onClick={() => toggleLike(reply.id)}
                      className="cursor-pointer"
                    >
                      <Heart
                        className={`transition ${
                          clickedLikes[reply.id]
                            ? "fill-red-600 text-red-600"
                            : "text-gray-500"
                        }`}
                      />
                    </span>
                    <span className="text-gray-500">
                      {likeCounts[reply.id] || 0}
                    </span>
                  </CardAction>
                </CardContent>
              </div>
            </Card>
          </li>
        ))
      )}
    </ul>
  );
}
