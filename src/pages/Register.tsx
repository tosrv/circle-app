import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register } from "@/services/auth.api";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fields = [
    {
      value: username,
      setter: setUsername,
      placeholder: "Username",
      type: "text",
    },
    {
      value: fullname,
      setter: setFullname,
      placeholder: "Fullname",
      type: "text",
    },
    { value: email, setter: setEmail, placeholder: "Email", type: "email" },
    {
      value: password,
      setter: setPassword,
      placeholder: "Password",
      type: "password",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await register(username, fullname, email, password);

      setMsg(res.data.message);
      setUsername("");
      setFullname("");
      setEmail("");
      setPassword("");
      navigate("/login", {
        replace: true,
        state: {
          from: location,
          message: "Register success, please login",
        },
      });
    } catch (err: any) {
      console.log(err.response.data);

      const message =
        err.response.data.error ||
        err.response.data.message ||
        "Register failed";
      setMsg(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  return (
    <div className="flex justify-center items-center h-screen">
      <section>
        <div className="space-y-3">
          <h1 className="text-6xl font-bold text-green-500">Circle</h1>
          <h2 className="text-4xl font-bold">Create account Circle</h2>
        </div>
        <form onSubmit={handleSubmit} className="w-100 space-y-3">
          <div className="h-7 flex items-center justify-center">
            {msg && (
              <p
                className={`text-sm ${msg.includes("success") ? "text-green-500" : "text-red-500"}`}
              >
                {msg}
              </p>
            )}
          </div>

          {fields.map((f, idx) => (
            <Input
              key={idx}
              type={f.type}
              placeholder={f.placeholder}
              required
              value={f.value}
              onChange={(e) => f.setter(e.target.value)}
              className="h-12 rounded-lg"
            />
          ))}

          <Button
            type="submit"
            disabled={!username || !fullname || !email || !password || loading}
            className="h-10 w-full rounded-2xl bg-green-500 font-bold text-xl text-white hover:text-black"
          >
            {loading ? "Creating..." : "Create account"}
          </Button>
          <p>
            <span>Already have an account?</span>
            <Link
              to="/login"
              className="font-semibold text-green-500 hover:text-white"
            >
              {" "}
              Login
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
