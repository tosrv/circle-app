import { api } from "./api";

export async function getReplies(id: number) {
  return await api.get(`/replies/${id}`, { withCredentials: true });
}

export async function newReply(id: number, content: string, images: File[]) {
  const formData = new FormData();
  formData.append("content", content);
  if (images?.length) {
    images.forEach((image) => {
      formData.append("image", image);
    });
  }

  return await api.post(`/reply/${id}`, formData, { withCredentials: true });
}
