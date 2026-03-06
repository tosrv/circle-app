import { useProfile } from "@/context/ProfileProvider";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useProfile();

  const getTitle = () => {
    if (location.pathname === "/home") return "Home";
    if (location.pathname.startsWith("/thread")) return "Threads";
    if (location.pathname.startsWith("/profile")) return profile || "Profile";
    if (location.pathname.startsWith("/follows")) return "Follows";
    if (location.pathname.startsWith("/search")) return "Search";
    return "";
  };

  const back = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center sticky top-0 backdrop-blur-md p-3 z-10 space-x-2">
      {location.pathname !== "/home" && (
        <button
          onClick={back}
          className="hover:cursor-pointer font-bold text-xl text-gray-500 hover:text-white"
        >
          ←
        </button>
      )}
      <h2 className="font-semibold text-2xl flex items-center space-x-1">
        <span>{getTitle()}</span>
      </h2>
    </div>
  );
}
