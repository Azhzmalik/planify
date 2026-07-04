import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Semua field wajib diisi");
      return;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);
      await register(form.name, form.email, form.password);
      navigate("/user/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Registrasi gagal, coba lagi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-soft p-8 sm:p-10">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-brand-blue flex items-center justify-center font-bold text-lg text-white">
            P
          </div>
          <span className="text-xl font-bold text-navy">Planify</span>
        </div>

        <h1 className="text-2xl font-bold text-navy mb-1">Buat akun baru</h1>
        <p className="text-slate-500 text-sm mb-6">Daftar untuk mulai mengatur jadwal Anda</p>

        {error && (
          <div className="mb-4 text-sm text-rose-600 bg-rose-50 rounded-xl px-4 py-2.5">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label-field">Nama Lengkap</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nama Anda"
                className="input-field pl-10"
              />
            </div>
          </div>

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
                placeholder="Minimal 6 karakter"
                className="input-field pl-10"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-2 flex items-center justify-center gap-2">
            <UserPlus size={18} />
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-6">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-brand-blue font-semibold hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
