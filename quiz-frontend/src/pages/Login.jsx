import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    const res = await login(email, password);
    console.log("Login response:", res); // keep for testing

    if (!res.ok) {
      toast.error(res.message || "Invalid credentials");
      return;
    }

    // ✅ Extract the role from the correct location
    const role = res.data?.role;
    const token = res.data?.token;

    toast.success("Welcome back 🎉");

    if (role) localStorage.setItem("role", role);
    if (token) localStorage.setItem("token", token);

    // 🧭 Redirect based on role
    if (role === "ADMIN") {
      navigate("/admin-home");
    } else {
      navigate("/");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900"
    >
      <form
        onSubmit={submit}
        className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-zinc-200 dark:border-zinc-800"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">
          Welcome Back
        </h2>

        <div className="mb-4 relative">
          <input
            type="email"
            id="email"
            className="peer w-full px-3 py-3 bg-transparent border rounded-xl border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary text-zinc-900 dark:text-zinc-100"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label
            htmlFor="email"
            className="absolute left-3 -top-2 text-xs text-zinc-500 bg-white dark:bg-zinc-900 px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-zinc-400 peer-placeholder-shown:text-sm transition-all"
          >
            Email
          </label>
        </div>

        <div className="mb-6 relative">
          <input
            type={showPass ? "text" : "password"}
            id="password"
            className="peer w-full px-3 py-3 bg-transparent border rounded-xl border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary text-zinc-900 dark:text-zinc-100"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label
            htmlFor="password"
            className="absolute left-3 -top-2 text-xs text-zinc-500 bg-white dark:bg-zinc-900 px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-zinc-400 peer-placeholder-shown:text-sm transition-all"
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPass((s) => !s)}
            className="absolute right-3 top-3 text-zinc-500 hover:text-primary"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Sign In"}
        </button>

        <div className="flex justify-between text-sm mt-4 text-zinc-500 dark:text-zinc-400">
          <Link to="/register" className="hover:text-primary underline">
            Create account
          </Link>
          <Link to="/forgot" className="hover:text-primary underline">
            Forgot password?
          </Link>
        </div>
      </form>
    </motion.div>
  );
}
