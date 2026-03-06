import { prisma } from "../../lib/prisma";

// Create new reply
export async function addReply(
  threadId: number,
  userId: number,
  content: string,
  images: string[],
) {
  return await prisma.replies.create({
    data: {
      content,
      images,
      thread_id: threadId,
      user_id: userId,
      created_by: userId,
    },
    select: {
      id: true,
      content: true,
      images: true,
      user_id: true,
      thread_id: true,
      created_at: true,
      created: {
        select: {
          username: true,
          full_name: true,
          photo_profile: true,
        },
      },
    },
  });
}

// Display replies by thread
export async function findReplies(id: number) {
  return await prisma.replies.findMany({
    take: 25,
    where: {
      thread_id: id,
    },
    select: {
      id: true,
      content: true,
      images: true,
      user_id: true,
      thread_id: true,
      created_at: true,
      created: {
        select: {
          username: true,
          full_name: true,
          photo_profile: true,
        },
      },
    },
  });
}
