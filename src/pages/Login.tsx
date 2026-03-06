import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setMsg(location.state.message);
    }
  }, [location]);

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password).unwrap();
      setEmail("");
      setPassword("");
      navigate("/home");
    } catch (err: any) {
      setMsg(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <section>
        <div className="space-y-3">
          <h1 className="text-6xl font-bold text-green-500">Circle</h1>
          <h2 className="text-4xl font-bold">Login to Circle</h2>
        </div>
        <form onSubmit={handleSubmit} className="w-100 space-y-3">
          <div className="h-5 flex items-center justify-center">
            {msg && (
              <p
                className={`text-sm ${msg.includes("success") ? "text-green-500" : "text-red-500"}`}
              >
                {msg}
              </p>
            )}
          </div>

          <Input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-lg"
          />
          <Input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-lg"
          />

          <Button
            type="submit"
            disabled={!email || !password || loading}
            className="h-10 w-full rounded-2xl bg-green-500 font-bold text-xl text-white hover:text-black"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <p>
            <span>Don't have an account yet?</span>
            <Link
              to="/register"
              className="font-semibold text-green-500 hover:text-white"
            >
              {" "}
              Create account
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
