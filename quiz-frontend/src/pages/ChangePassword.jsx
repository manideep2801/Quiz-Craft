import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { api } from "../lib/api";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success(res.data.message || "Password changed successfully 🎉");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
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
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-zinc-200 dark:border-zinc-800"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">
          Change Password
        </h2>

        {/* Current Password */}
        <div className="mb-4 relative">
          <input
            type={showPass ? "text" : "password"}
            id="currentPassword"
            className="peer w-full px-3 py-3 bg-transparent border rounded-xl border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary text-zinc-900 dark:text-zinc-100"
            placeholder=" "
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <label
            htmlFor="currentPassword"
            className="absolute left-3 -top-2 text-xs text-zinc-500 bg-white dark:bg-zinc-900 px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-zinc-400 peer-placeholder-shown:text-sm transition-all"
          >
            Current Password
          </label>
          <button
            type="button"
            onClick={() => setShowPass((s) => !s)}
            className="absolute right-3 top-3 text-zinc-500 hover:text-primary"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* New Password */}
        <div className="mb-4 relative">
          <input
            type={showPass ? "text" : "password"}
            id="newPassword"
            className="peer w-full px-3 py-3 bg-transparent border rounded-xl border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary text-zinc-900 dark:text-zinc-100"
            placeholder=" "
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label
            htmlFor="newPassword"
            className="absolute left-3 -top-2 text-xs text-zinc-500 bg-white dark:bg-zinc-900 px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-zinc-400 peer-placeholder-shown:text-sm transition-all"
          >
            New Password
          </label>
        </div>

        {/* Confirm Password */}
        <div className="mb-6 relative">
          <input
            type={showPass ? "text" : "password"}
            id="confirmPassword"
            className="peer w-full px-3 py-3 bg-transparent border rounded-xl border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary text-zinc-900 dark:text-zinc-100"
            placeholder=" "
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <label
            htmlFor="confirmPassword"
            className="absolute left-3 -top-2 text-xs text-zinc-500 bg-white dark:bg-zinc-900 px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-zinc-400 peer-placeholder-shown:text-sm transition-all"
          >
            Confirm New Password
          </label>
        </div>

        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Changing...
            </>
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </motion.div>
  );
}
