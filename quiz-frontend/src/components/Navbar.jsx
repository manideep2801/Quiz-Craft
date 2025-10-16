import { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { api } from "../lib/api";
import {
  Moon,
  Sun,
  ChevronDown,
  LogOut,
  User,
  History,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleLogout = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => resolve(), 600);
      }),
      {
        loading: "Logging out...",
        success: () => {
          logout();
          navigate("/login");
          return "Logged out successfully!";
        },
        error: "Failed to logout",
      }
    );
    setMenuOpen(false);
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const linkClass = ({ isActive }) =>
    `px-3 py-1 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-primary/10 text-primary"
        : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
    }`;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-extrabold text-xl text-primary tracking-tight"
        >
          🧠 Quiz Craft
        </Link>

        {/* Middle: Navigation */}
        {user && (
          <div className="flex items-center gap-4">
            {user.role === "USER" && (
              <NavLink to="/" className={linkClass}>
                Home
              </NavLink>
            )}
            {user.role === "ADMIN" && (
              <NavLink to="/admin-home" className={linkClass}>
                Home
              </NavLink>
            )}
            {user.role === "USER" && (
              <NavLink to="/history" className={linkClass}>
                History
              </NavLink>
            )}
            {user.role === "ADMIN" && (
              <NavLink to="/admin-dashboard" className={linkClass}>
                Admin Dashboard
              </NavLink>
            )}
          </div>
        )}

        {/* Right: Theme + Auth */}
        <div className="flex items-center gap-3 relative">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!user ? (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Register
              </NavLink>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-sm font-medium"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center bg-primary text-white font-semibold">
                  {initials}
                </div>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    menuOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    {user.role === "USER" && (
                      <Link
                        to="/history"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      >
                        <History size={16} /> My History
                      </Link>
                    )}
                    {/* ✉️ Verify Email Option */}
                    {!user.isEmailVerified && (
                      <button
                        onClick={async () => {
                          setMenuOpen(false);
                          try {
                            await toast.promise(
                              api.post(
                                `/api/auth/resend-verification?email=${encodeURIComponent(
                                  user.email
                                )}`
                              ),
                              {
                                loading: "Sending verification email...",
                                success: (res) => {
                                  // ✅ Check backend response
                                  const msg =
                                    res?.data?.message ||
                                    "Verification email sent successfully!";
                                  return msg.includes("already verified")
                                    ? "✅ Your email is already verified!"
                                    : msg;
                                },
                                error: (err) => {
                                  const msg =
                                    err?.response?.data?.message ||
                                    "❌ Failed to resend verification email.";
                                  if (msg.includes("already verified")) {
                                    return "✅ Your email is already verified!";
                                  }
                                  return msg;
                                },
                              }
                            );
                          } catch (err) {
                            console.error("Email verification error:", err);
                          }
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      >
                        ✉️ Verify Email
                      </button>
                    )}

                    {/* 🔐 New Change Password Option */}
                    <Link
                      to="/change-password"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    >
                      <Lock size={16} /> Change Password
                    </Link>

                    {user.role === "ADMIN" && (
                      <Link
                        to="/admin-dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      >
                        🧩 Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
