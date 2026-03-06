import { Outlet } from "react-router-dom";
import Menu from "@/layouts/Menu";
import Navbar from "@/layouts/Navbar";
import { ThreadProvider } from "@/context/ThreadProvider";
import { ProfileProvider } from "@/context/ProfileProvider";
import Sidebar from "./Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  return (
    <ProfileProvider>
      <ThreadProvider>
        <div className="flex justify-center w-full">
          <div
            className="grid gap-6
          grid-cols-1
          sm:grid-cols-[280px_minmax(600px,1fr)_300px] 
          lg:grid-cols-[minmax(50px,380px)_minmax(600px,890px)_minmax(50px,550px)] w-fit"
          >
            {/* Left Sidebar */}
            <aside className="sticky top-0 h-screen hidden sm:block">
              <Menu />
            </aside>

            {/* Main Content */}
            <main className="flex flex-col border-x-2 w-full max-w-[890px] mx-auto">
              <Navbar />
              <Outlet />
            </main>

            {/* Right Sidebar */}
            <aside className="sticky top-0 h-screen p-5 space-y-5 hidden 2xl:block">
              <Sidebar />
            </aside>
          </div>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </ThreadProvider>
    </ProfileProvider>
  );
}
