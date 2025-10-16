import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/api/auth/verify-email?token=${token}`);
        const backendMsg = res.data.message?.toLowerCase() || "";

        if (backendMsg.includes("verified")) {
          setStatus("success");
          setMessage(res.data.message);
        } else {
          setStatus("error");
          setMessage(
            res.data.message || "Invalid or expired verification link."
          );
        }
      } catch (err) {
        console.error("Verification failed", err);
        const backendMsg = err.response?.data?.message?.toLowerCase() || "";

        if (backendMsg.includes("already verified")) {
          setStatus("success");
          setMessage("Your email is already verified!");
        } else if (backendMsg.includes("verified")) {
          setStatus("success");
          setMessage("Your email has been verified successfully!");
        } else {
          setStatus("error");
          setMessage(backendMsg || "Invalid or expired verification link.");
        }
      }
    };
    if (token) verify();
  }, [token]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-screen text-center px-4"
    >
      {status === "loading" && (
        <>
          <Loader2 className="animate-spin text-primary mb-4" size={32} />
          <p className="text-lg">Verifying your email...</p>
        </>
      )}

      {status === "success" && (
        <>
          <h2 className="text-3xl font-bold text-green-500 mb-3">
            ✅ Verified!
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
            {message}
          </p>
          <Link
            to="/login"
            className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/80 transition"
          >
            Go to Login
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <h2 className="text-3xl font-bold text-red-500 mb-3">
            ❌ Invalid Link
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">{message}</p>
        </>
      )}
    </motion.div>
  );
}
