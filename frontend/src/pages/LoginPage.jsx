import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Email atau password salah");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-soft">
        {/* Panel kiri - branding */}
        <div className="hidden md:flex flex-col justify-between bg-navy text-white p-10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-pastel-purple/20" />
          <div className="absolute bottom-10 -left-10 w-32 h-32 rounded-full bg-pastel-mint/20" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-10">
              <div className="w-9 h-9 rounded-xl bg-brand-blue flex items-center justify-center font-bold text-lg">
                P
              </div>
              <span className="text-xl font-bold">Planify</span>
            </div>
            <h2 className="text-2xl font-bold leading-snug mb-3">
              Atur waktu kerja dan kuliah dalam satu tempat.
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Gabungkan task Work dan Course, lalu biarkan Planify merekomendasikan
              mana yang harus dikerjakan lebih dulu.
            </p>
          </div>
          <div className="relative z-10 flex gap-2">
            <span className="w-8 h-2 rounded-full bg-pastel-mint" />
            <span className="w-8 h-2 rounded-full bg-pastel-pink" />
            <span className="w-8 h-2 rounded-full bg-pastel-yellow" />
          </div>
        </div>

        {/* Panel kanan - form */}
        <div className="bg-white p-8 sm:p-10 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-navy mb-1">Selamat datang kembali</h1>
          <p className="text-slate-500 text-sm mb-6">Masuk untuk melanjutkan ke dashboard Anda</p>

          {error && (
            <div className="mb-4 text-sm text-rose-600 bg-rose-50 rounded-xl px-4 py-2.5">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label-field">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label-field">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-2 flex items-center justify-center gap-2">
              <LogIn size={18} />
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            Belum punya akun?{" "}
            <Link to="/register" className="text-brand-blue font-semibold hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
