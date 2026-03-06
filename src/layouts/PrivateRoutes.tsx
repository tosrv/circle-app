import { useAuth } from "@/hooks/useAuth";
import { getMe, logout } from "@/services/auth.api";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoute() {
  const { user, loading, fetchUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchUser();
  }, []);
  
  useEffect(() => {
    const checkToken = async () => {
      try {
        await getMe();
      } catch {
        logout();
      }
    };
    checkToken();
  }, [logout]);

  if (loading) return null;
  if (!user)
    return (
      <Navigate
        to="/"
        replace
        state={{
          from: location,
          message: "You must be logged in to access page",
        }}
      />
    );

  return <Outlet />;
}
