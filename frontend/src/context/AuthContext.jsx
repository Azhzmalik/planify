import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Pakai sessionStorage (bukan localStorage) supaya sesi login tidak
  // dibagikan antar tab browser. Tiap tab baru akan mulai tanpa sesi,
  // sehingga membuka link di tab baru mengharuskan login ulang, dan
  // logout di satu tab tidak ikut logout tab lain.
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem("planify_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("planify_token");
    if (!token) {
      setLoading(false);
      return;
    }
    // Verifikasi token masih valid dengan mengambil data user terbaru
    authService
      .getMe()
      .then((freshUser) => {
        setUser(freshUser);
        sessionStorage.setItem("planify_user", JSON.stringify(freshUser));
      })
      .catch(() => {
        sessionStorage.removeItem("planify_token");
        sessionStorage.removeItem("planify_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await authService.login(email, password);
    sessionStorage.setItem("planify_token", data.token);
    sessionStorage.setItem("planify_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  async function register(name, email, password) {
    const data = await authService.register(name, email, password);
    sessionStorage.setItem("planify_token", data.token);
    sessionStorage.setItem("planify_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    sessionStorage.removeItem("planify_token");
    sessionStorage.removeItem("planify_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return ctx;
}
