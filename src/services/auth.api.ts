import { api } from "./api";

// Get current user
export async function getMe() {
  return await api.get("/me", { withCredentials: true });
}

// Registration
export async function register(
  username: string,
  fullname: string,
  email: string,
  password: string,
) {
  return await api.post("/register", { username, fullname, email, password });
}

// Login
export async function login(email: string, password: string) {
  return await api.post(
    "/login",
    { email, password },
    { withCredentials: true },
  );
}

// Logout
export async function logout() {
  return await api.post("/logout", {}, { withCredentials: true });
}
