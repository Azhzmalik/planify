import React from "react";
import { Trash2 } from "lucide-react";
import { formatTime, formatDuration } from "../utils/formatTime";

const priorityBadge = {
  low: "bg-pastel-mint text-pastel-mintdark",
  medium: "bg-pastel-yellow text-pastel-yellowdark",
  high: "bg-pastel-pink text-pastel-pinkdark",
};

const priorityLabel = { low: "Rendah", medium: "Sedang", high: "Tinggi" };

const statusBadge = {
  pending: "bg-slate-100 text-slate-500",
  active: "bg-brand-blue/10 text-brand-bluedark",
  completed: "bg-pastel-mint text-pastel-mintdark",
  skipped: "bg-rose-100 text-rose-500",
};

const statusLabel = { pending: "Pending", active: "Aktif", completed: "Selesai", skipped: "Dilewati" };

export default function TaskTable({ tasks, filter, onFilterChange, onDelete, showUserColumn = false }) {
  return (
    <div className="card overflow-x-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="font-semibold text-navy">Monitoring Jadwal</h3>
        <div className="flex gap-2">
          {["all", "work", "course"].map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${
                filter === f ? "bg-brand-blue text-white" : "bg-surface text-slate-500 hover:bg-slate-200"
              }`}
            >
              {f === "all" ? "Semua" : f}
            </button>
          ))}
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 border-b border-slate-100">
            <th className="py-2 pr-3 font-medium">No</th>
            {showUserColumn && <th className="py-2 pr-3 font-medium">User</th>}
            <th className="py-2 pr-3 font-medium">Jenis</th>
            <th className="py-2 pr-3 font-medium">Nama Task</th>
            <th className="py-2 pr-3 font-medium">Jam</th>
            <th className="py-2 pr-3 font-medium">Durasi</th>
            <th className="py-2 pr-3 font-medium">Prioritas</th>
            <th className="py-2 pr-3 font-medium">Status</th>
            {onDelete && <th className="py-2 pr-3 font-medium">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={showUserColumn ? 9 : 8} className="py-8 text-center text-slate-400">
                Belum ada task
              </td>
            </tr>
          ) : (
            tasks.map((task, idx) => (
              <tr key={task.id} className="border-b border-slate-50 last:border-0">
                <td className="py-3 pr-3 text-slate-500">{idx + 1}</td>
                {showUserColumn && <td className="py-3 pr-3">{task.user_name}</td>}
                <td className="py-3 pr-3 capitalize">{task.type}</td>
                <td className="py-3 pr-3 font-medium text-navy">{task.title}</td>
                <td className="py-3 pr-3 text-slate-500">
                  {formatTime(task.start_time)} - {formatTime(task.end_time)}
                </td>
                <td className="py-3 pr-3 text-slate-500">{formatDuration(task.duration_minutes)}</td>
                <td className="py-3 pr-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${priorityBadge[task.priority]}`}>
                    {priorityLabel[task.priority]}
                  </span>
                </td>
                <td className="py-3 pr-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusBadge[task.status]}`}>
                    {statusLabel[task.status]}
                  </span>
                </td>
                {onDelete && (
                  <td className="py-3 pr-3">
                    <button
                      onClick={() => onDelete(task.id)}
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
