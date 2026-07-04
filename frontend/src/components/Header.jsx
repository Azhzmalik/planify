import React from "react";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import { formatDuration } from "../utils/formatTime";

export default function Header({ title, subtitle, totalEstimateMinutes, notifications = [] }) {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">{title}</h1>
        {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {typeof totalEstimateMinutes === "number" && (
          <div className="hidden sm:flex flex-col items-end bg-white rounded-xl px-4 py-2 shadow-card">
            <span className="text-xs text-slate-400">Total Estimasi Waktu</span>
            <span className="text-sm font-semibold text-navy">
              {formatDuration(totalEstimateMinutes)}
            </span>
          </div>
        )}

        <NotificationBell notifications={notifications} />

        <div className="flex items-center gap-3 bg-white rounded-xl pl-3 pr-4 py-2 shadow-card">
          <div className="w-9 h-9 rounded-full bg-pastel-purple text-pastel-purpledark flex items-center justify-center font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-navy">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
