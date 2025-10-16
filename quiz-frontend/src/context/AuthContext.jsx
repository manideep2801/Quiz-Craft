import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthCtx = createContext();

export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("qc_user")) || null);
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: "http://localhost:8080/api/auth", // ✅ adjust if your backend port differs
  });

  const login = async (email, password) => {
  setLoading(true);
  try {
    const { data } = await api.post("/login", { email, password });
    if (!data || !data.token) throw new Error("Invalid response from server");

    localStorage.setItem("qc_token", data.token);
    localStorage.setItem("qc_user", JSON.stringify(data));
    setUser(data);

    return { ok: true, data };
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Login failed, please try again.";
    return { ok: false, message };
  } finally {
    setLoading(false);
  }
};

const register = async ({ fullName, email, password }) => {
  setLoading(true);
  try {
    const { data } = await api.post("/register", { fullName, email, password });
    if (!data) throw new Error("Invalid response from server");
    return { ok: true, data };
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Registration failed, please try again.";
    return { ok: false, message };
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    localStorage.removeItem("qc_token");
    localStorage.removeItem("qc_user");
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthCtx.Provider>
  );
}
