import React from "react";
import { UserCircle, Mail, ShieldCheck, CalendarDays } from "lucide-react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/formatTime";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <Header title="Profile" subtitle="Informasi akun Anda" />

      <div className="card max-w-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-pastel-purple text-pastel-purpledark flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-lg font-bold text-navy">{user?.name}</p>
            <p className="text-sm text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface">
            <UserCircle size={18} className="text-brand-blue" />
            <div>
              <p className="text-xs text-slate-400">Nama Lengkap</p>
              <p className="text-sm font-medium text-navy">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface">
            <Mail size={18} className="text-brand-blue" />
            <div>
              <p className="text-xs text-slate-400">Email</p>
              <p className="text-sm font-medium text-navy">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface">
            <ShieldCheck size={18} className="text-brand-blue" />
            <div>
              <p className="text-xs text-slate-400">Role</p>
              <p className="text-sm font-medium text-navy capitalize">{user?.role}</p>
            </div>
          </div>

          {user?.created_at && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface">
              <CalendarDays size={18} className="text-brand-blue" />
              <div>
                <p className="text-xs text-slate-400">Bergabung Sejak</p>
                <p className="text-sm font-medium text-navy">{formatDate(user.created_at)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
