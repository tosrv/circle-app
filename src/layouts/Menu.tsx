import { useAuth } from "@/hooks/useAuth";
import { CircleUser, Heart, House, LogOutIcon, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useThreadDialog } from "@/context/ThreadProvider";

export default function Menu() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { openThreadDialog } = useThreadDialog();

  const menu = [
    { icon: <House />, label: "Home", path: "/home" },
    { icon: <Search />, label: "Search", path: "/search" },
    { icon: <Heart />, label: "Follows", path: "/follows" },
    {
      icon: <CircleUser />,
      label: "Profile",
      path: `/profile/${user?.username}`,
    },
  ];

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex flex-col items-end lg:items-start justify-between h-screen py-6 px-0 lg:px-4 mx-0">
      <section className="space-y-5 w-full p-2">
        <h1 className="text-5xl font-bold text-green-500 hidden lg:block">Circle</h1>
        <ul className="space-y-3">
          {menu.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={index} className="flex justify-end lg:justify-start mx-0 px-0">
                <Button
                  onClick={() => navigate(item.path)}
                  className={`
                    border-0 bg-transparent hover:bg-transparent hover:cursor-pointer
                    ${isActive ? "text-white" : "text-gray-500 hover:text-white"}
                  `}
                >
                  {item.icon}
                  <span className="text-xl hidden lg:block">{item.label}</span>
                </Button>
              </li>
            );
          })}
        </ul>

        <Button
          onClick={openThreadDialog} 
          className="h-10 font-semibold bg-green-500 text-white hover:text-black w-full rounded-2xl text-xl hidden lg:block"
        >
          Create post
        </Button>
      </section>

      <Button
        onClick={handleLogout}
        className="border-0 bg-transparent hover:bg-transparent text-gray-500 hover:text-white hover:cursor-pointer"
      >
        <LogOutIcon />
        <span className="text-xl hidden lg:block">Logout</span>
      </Button>
    </div>
  );
}
