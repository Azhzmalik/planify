import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AlertTriangle, TrendingUp } from "lucide-react";
import Header from "../../components/Header";
import { adminService } from "../../services/adminService";

const statusColors = {
  Selesai: "#3FB98A",
  Aktif: "#3B82F6",
  Dilewati: "#EC6BA0",
};

export default function AdminStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div>
        <Header title="Statistik" subtitle="Insight mendalam penggunaan aplikasi" />
        <div className="card text-center text-slate-400 py-10">Memuat statistik...</div>
      </div>
    );
  }

  const taskStatusData = [
    { name: "Selesai", value: stats.totalCompletedTasks },
    { name: "Aktif", value: stats.totalActiveTasks },
    { name: "Dilewati", value: stats.totalSkippedTasks },
  ];

  const skipRate =
    stats.totalCompletedTasks + stats.totalSkippedTasks > 0
      ? Math.round((stats.totalSkippedTasks / (stats.totalCompletedTasks + stats.totalSkippedTasks)) * 100)
      : 0;

  return (
    <div>
      <Header title="Statistik" subtitle="Insight mendalam penggunaan aplikasi Planify" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-navy mb-4">Status Task Secara Keseluruhan</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={taskStatusData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {taskStatusData.map((entry) => (
                  <Cell key={entry.name} fill={statusColors[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card flex flex-col justify-center gap-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-pastel-pink/40">
            <div className="w-12 h-12 rounded-xl bg-pastel-pink text-pastel-pinkdark flex items-center justify-center">
              <AlertTriangle size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.totalSkippedTasks}</p>
              <p className="text-sm text-slate-500">Task yang sering dilewati</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-pastel-mint/40">
            <div className="w-12 h-12 rounded-xl bg-pastel-mint text-pastel-mintdark flex items-center justify-center">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{skipRate}%</p>
              <p className="text-sm text-slate-500">Tingkat task dilewati dari task yang sudah dijadwalkan</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-navy mb-4">User dengan Task Terbanyak</h3>
        {stats.topUsers.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">Belum ada data</p>
        ) : (
          <div className="flex flex-col gap-2">
            {stats.topUsers.map((u, idx) => (
              <div key={u.name + idx} className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface">
                <span className="text-sm font-medium text-navy">{u.name}</span>
                <span className="text-sm text-slate-500">{u.task_count} task</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
