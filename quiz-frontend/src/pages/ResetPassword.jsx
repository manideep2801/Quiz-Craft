import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { api } from "../lib/api";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (!token) {
      toast.error("Reset token is missing or invalid.");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter a valid new password.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/reset-password", {
        token,
        newPassword: password,
      });
      toast.success(res.data.message || "Password updated successfully! 🎉");
      setSuccess(true);

      // ✅ Redirect after 3 seconds
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 text-center px-4"
      >
        <CheckCircle2 className="text-green-500 mb-4" size={64} />
        <h2 className="text-3xl font-bold text-primary mb-2">
          Password Reset Successful
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Redirecting to login page in <strong>3 seconds...</strong>
        </p>
        <div className="animate-pulse text-sm text-zinc-500">
          Please wait while we redirect you.
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-zinc-200 dark:border-zinc-800"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">
          Reset Password
        </h2>

        <div className="mb-4 relative">
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
            New Password
          </label>
          <button
            type="button"
            onClick={() => setShowPass((s) => !s)}
            className="absolute right-3 top-3 text-zinc-500 hover:text-primary"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="mb-6 relative">
          <input
            type={showPass ? "text" : "password"}
            id="confirm"
            className="peer w-full px-3 py-3 bg-transparent border rounded-xl border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary text-zinc-900 dark:text-zinc-100"
            placeholder=" "
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <label
            htmlFor="confirm"
            className="absolute left-3 -top-2 text-xs text-zinc-500 bg-white dark:bg-zinc-900 px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-zinc-400 peer-placeholder-shown:text-sm transition-all"
          >
            Confirm Password
          </label>
        </div>

        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </motion.div>
  );
}
