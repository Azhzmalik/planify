import React, { useState } from "react";
import { Bell } from "lucide-react";

// Komponen bell notifikasi sederhana, menampilkan daftar notifikasi terbaru
export default function NotificationBell({ notifications = [] }) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-10 h-10 rounded-xl bg-surface hover:bg-slate-200 flex items-center justify-center transition-colors"
      >
        <Bell size={18} className="text-navy" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-soft border border-slate-100 p-3 z-20">
          <p className="text-sm font-semibold text-navy px-2 pb-2">Notifikasi</p>
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-400 px-2 py-4 text-center">Belum ada notifikasi</p>
          ) : (
            <div className="max-h-64 overflow-y-auto flex flex-col gap-1">
              {notifications.map((n) => (
                <div key={n.id} className="px-3 py-2 rounded-xl hover:bg-surface text-sm">
                  <p className="font-medium text-navy">{n.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
