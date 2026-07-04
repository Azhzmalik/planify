import React, { useEffect, useState } from "react";
import { Users, Briefcase, GraduationCap, MessageSquareText, CheckCircle2, ListTodo } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Header from "../../components/Header";
import StatCard from "../../components/StatCard";
import { adminService } from "../../services/adminService";

const PIE_COLORS = ["#3FB98A", "#8B6FE8", "#E8B227", "#EC6BA0"];

const categoryLabel = { bug: "Bug", suggestion: "Saran", complaint: "Keluhan", other: "Lainnya" };

export default function AdminDashboard() {
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
        <Header title="Dashboard Admin" subtitle="Ringkasan penggunaan aplikasi Planify" />
        <div className="card text-center text-slate-400 py-10">Memuat statistik...</div>
      </div>
    );
  }

  const taskTypeData = stats.taskByType.map((t) => ({
    name: t.type === "work" ? "Work" : "Course",
    value: Number(t.count),
  }));

  const feedbackCategoryData = stats.feedbackByCategory.map((f) => ({
    name: categoryLabel[f.category] || f.category,
    value: Number(f.count),
  }));

  return (
    <div>
      <Header title="Dashboard Admin" subtitle="Ringkasan penggunaan aplikasi Planify" />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Users} label="Total User" value={stats.totalUsers} color="purple" />
        <StatCard icon={Briefcase} label="Total Work Task" value={stats.totalWorkTasks} color="mint" />
        <StatCard icon={GraduationCap} label="Total Course Task" value={stats.totalCourseTasks} color="yellow" />
        <StatCard icon={MessageSquareText} label="Total Feedback" value={stats.totalFeedback} color="pink" />
        <StatCard icon={CheckCircle2} label="Total Task Selesai" value={stats.totalCompletedTasks} color="mint" />
        <StatCard icon={ListTodo} label="Total Task Aktif" value={stats.totalActiveTasks} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-navy mb-4">Task Work vs Course</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={taskTypeData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={4}>
                {taskTypeData.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-navy mb-4">Feedback per Kategori</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={feedbackCategoryData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-navy mb-4">User Paling Aktif Membuat Task</h3>
        {stats.topUsers.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">Belum ada data</p>
        ) : (
          <div className="flex flex-col gap-2">
            {stats.topUsers.map((u, idx) => (
              <div key={u.name + idx} className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-pastel-purple text-pastel-purpledark flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-medium text-navy">{u.name}</span>
                </div>
                <span className="text-sm text-slate-500">{u.task_count} task</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
