import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { api } from "../lib/api";
import { Loader2, Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0); // 🔥 cooldown seconds

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (cooldown > 0) {
      toast.warning(`Please wait ${cooldown} seconds before trying again.`);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/forgot-password", { email });
      toast.success(res.data.message || "Password reset link sent to your email 🎉");
      setSuccess(true);
      setCooldown(60); // 🕒 start 1-minute cooldown
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset email. Try again.");
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
          Forgot Password
        </h2>

        {success ? (
          <div className="text-center text-zinc-700 dark:text-zinc-300">
            <Mail size={48} className="mx-auto text-primary mb-4" />
            <p className="text-lg mb-2">
              Password reset link has been sent to your email.
            </p>
            <p className="text-sm text-zinc-500">
              Please check your inbox (and spam folder).
            </p>
            {cooldown > 0 && (
              <p className="mt-3 text-sm text-blue-500">
                You can request a new link in {cooldown}s
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 relative">
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
                Email Address
              </label>
            </div>

            <button
              disabled={loading || cooldown > 0}
              className={`w-full flex items-center justify-center gap-2 py-3 font-semibold rounded-xl text-white transition
                ${
                  loading || cooldown > 0
                    ? "bg-primary/70 cursor-not-allowed"
                    : "bg-primary hover:opacity-90"
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Sending...
                </>
              ) : cooldown > 0 ? (
                `Try again in ${cooldown}s`
              ) : (
                "Send Reset Link"
              )}
            </button>
          </>
        )}
      </form>
    </motion.div>
  );
}
