import Follow from "@/components/follows/Suggestion";
import Mark from "@/components/user/Mark";
import { EditDialog } from "@/components/user/EditDialog";
import MyProfile from "@/components/user/MyProfile";
import { useProfile } from "@/context/ProfileProvider";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "react-router-dom";

export default function Sidebar() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const location = useLocation();
  const hideMyProfile =
    location.pathname.startsWith("/profile") && user?.full_name === profile;

  return (
    <>
      {!hideMyProfile && (
        <div className="h-fit bg-gray-900 p-5 rounded-md">
          <h2 className="font-bold text-xl">My Profile</h2>
          <MyProfile />
        </div>
      )}
      <EditDialog />
      <Follow />
      <Mark />
    </>
  );
}
