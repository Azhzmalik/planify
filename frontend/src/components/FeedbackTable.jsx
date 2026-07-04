import React from "react";
import { Trash2 } from "lucide-react";
import { formatDate } from "../utils/formatTime";

const categoryLabel = { bug: "Bug", suggestion: "Saran", complaint: "Keluhan", other: "Lainnya" };
const categoryBadge = {
  bug: "bg-rose-100 text-rose-500",
  suggestion: "bg-pastel-mint text-pastel-mintdark",
  complaint: "bg-pastel-yellow text-pastel-yellowdark",
  other: "bg-pastel-purple text-pastel-purpledark",
};

const statusLabel = { new: "Baru", read: "Dibaca", done: "Selesai" };

export default function FeedbackTable({ feedbacks, isAdmin = false, onStatusChange, onDelete }) {
  return (
    <div className="card overflow-x-auto">
      <h3 className="font-semibold text-navy mb-4">{isAdmin ? "Semua Feedback" : "Riwayat Feedback Saya"}</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 border-b border-slate-100">
            <th className="py-2 pr-3 font-medium">Tanggal</th>
            {isAdmin && <th className="py-2 pr-3 font-medium">User</th>}
            <th className="py-2 pr-3 font-medium">Kategori</th>
            <th className="py-2 pr-3 font-medium">Judul</th>
            <th className="py-2 pr-3 font-medium">Isi</th>
            <th className="py-2 pr-3 font-medium">Status</th>
            {isAdmin && <th className="py-2 pr-3 font-medium">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {feedbacks.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 7 : 5} className="py-8 text-center text-slate-400">
                Belum ada feedback
              </td>
            </tr>
          ) : (
            feedbacks.map((fb) => (
              <tr key={fb.id} className="border-b border-slate-50 last:border-0 align-top">
                <td className="py-3 pr-3 text-slate-500 whitespace-nowrap">{formatDate(fb.created_at)}</td>
                {isAdmin && <td className="py-3 pr-3">{fb.user_name}</td>}
                <td className="py-3 pr-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${categoryBadge[fb.category]}`}>
                    {categoryLabel[fb.category]}
                  </span>
                </td>
                <td className="py-3 pr-3 font-medium text-navy max-w-[160px]">{fb.title}</td>
                <td className="py-3 pr-3 text-slate-500 max-w-[260px]">{fb.message}</td>
                <td className="py-3 pr-3">
                  {isAdmin ? (
                    <select
                      value={fb.status}
                      onChange={(e) => onStatusChange(fb.id, e.target.value)}
                      className="text-xs rounded-lg border border-slate-200 px-2 py-1.5 bg-white"
                    >
                      <option value="new">Baru</option>
                      <option value="read">Dibaca</option>
                      <option value="done">Selesai</option>
                    </select>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface text-slate-500">
                      {statusLabel[fb.status]}
                    </span>
                  )}
                </td>
                {isAdmin && (
                  <td className="py-3 pr-3">
                    <button
                      onClick={() => onDelete(fb.id)}
                      className="text-rose-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
