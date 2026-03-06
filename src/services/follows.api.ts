import { api } from "./api";

// Suggestions
export async function userToFollow() {
  return await api.get("/follow", { withCredentials: true });
}

// Find foloower & following
export async function follows(type: string, username: string) {
  return await api.get(`/follows?type=${type}&username=${username}`, {
    withCredentials: true,
  });
}

export async function follow(id: number) {
  const res = await api.post(`/follow/${id}`, null, { withCredentials: true });
  return res.data.data;
}
