import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import homeImg from "../assets/home.png";
import profileImg from "../assets/profile.png";
import demoGif from "../assets/Cicle.gif";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center h-screen">
      <header className="w-full p-3 bg-gray-900">
        <nav className="container mx-auto flex justify-between">
          <h1 className="text-4xl font-bold text-green-500 ">Circle</h1>
          <section className="space-x-3">
            <Button
              onClick={() => navigate("/login")}
              className="border text-green-500 hover:text-white bg-transparent hover:bg-green-500 active:bg-green-800"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/register")}
              className="border text-green-500 hover:text-white bg-transparent hover:bg-green-500 active:bg-green-800"
            >
              Register
            </Button>
          </section>
        </nav>
      </header>
      <main className="flex justify-center items-center grow">
        <section>
          <div className="flex flex-col items-center p-5">
            <h2 className="font-bold text-6xl">
              Welcome to <span className="text-green-500">Circle</span>
            </h2>
            <h3 className="font-semibold text-4xl text-gray-500">
              Let's Make and Join Our Circle
            </h3>
          </div>
          <div className="flex flex-wrap justify-center space-x-5 space-y-5">
            <img
              src={homeImg}
              alt="Circle Home"
              className="h-70 w-auto rounded-xl border hover:scale-102 transition-transform duration-300"
            />
            <img
              src={demoGif}
              alt="Circle Follows"
              className="h-70 w-auto rounded-xl border hover:scale-102 transition-transform duration-300"
            />
            <img
              src={profileImg}
              alt="Circle Profile"
              className="h-70 w-auto rounded-xl border hover:scale-102 transition-transform duration-300"
            />
          </div>
        </section>
      </main>
      <footer className="w-full flex justify-center p-1 bg-gray-900">
        <p>Copyright © 2026 Circle. All rights reserved.</p>
      </footer>
    </div>
  );
}
