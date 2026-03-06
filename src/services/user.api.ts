import type { UserRequest } from "@/types/user";
import { api } from "./api";

// Username check
export async function usernameCheck(username: string) {
  return await api.get(`/user/check?username=${username}`, {
    withCredentials: true,
  });
}

// Update user data
export async function updateUser({
  username,
  fullname,
  bio,
  image,
}: UserRequest) {
  const formData = new FormData();

  formData.append("username", username);
  formData.append("fullname", fullname);
  formData.append("bio", bio);
  if (image) formData.append("avatar", image);

  return await api.patch("/user", formData, { withCredentials: true });
}

// Search by username or name
export async function searchUser(search: string) {
  return await api.get(`/user/search?q=${search}`, { withCredentials: true });
}
