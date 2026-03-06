import type { ThreadRequest } from "@/types/thread";
import { api } from "./api";

// Display all threads
export async function getThreads() {
  return await api.get("/threads", { withCredentials: true });
}

// Thread by id
export async function getThread(threadId: number) {
  return await api.get(`/thread/${threadId}`, { withCredentials: true });
}

// Create new thread
export async function addThread(thread: ThreadRequest) {
  const formData = new FormData();

  formData.append("content", thread.content);
  if (thread.images?.length) {
    thread.images.forEach((image) => {
      formData.append("image", image);
    });
  }

  return await api.post("/thread", formData, {
    withCredentials: true,
  });
}

// // Delete thread
// export async function removeThread(threadId: number) {
//   return await api.delete(`/thread/${threadId}`, { withCredentials: true });
// }

// // updata thread
// export async function editThread(
//   threadId: number,
//   content: string,
//   image?: string,
// ) {
//   const formData = new FormData();
//   formData.append("content", content);
//   if (image) formData.append("image", image);
//   return await api.put(`/thread/${threadId}`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//     withCredentials: true,
//   });
// }

// Likes
export async function likeThread(threadId: number) {
  return await api.post(`/thread/${threadId}/like`, {}, { withCredentials: true });
}


// Reply likes
export async function likeReply(replyId:number) {
  return await api.post(`/reply/${replyId}/like`, {}, { withCredentials: true });
}