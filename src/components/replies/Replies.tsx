import {  newReply } from "@/services/replies.api";
import RepliesList from "./RepliesList";
import ReplyForm from "./ReplyForm";
import { useState } from "react";

export interface RepliesProps {
  threadId: number;
}

export default function Replies({ threadId }: RepliesProps) {
  const [sending, setSending] = useState(false);

  const handleSendReply = async (content: string, images: File[]) => {
    try {
      setSending(true);
      await newReply(threadId, content, images);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <ReplyForm onSubmit={handleSendReply} loading={sending} />
      <RepliesList threadId={threadId} />
    </div>
  );
}
