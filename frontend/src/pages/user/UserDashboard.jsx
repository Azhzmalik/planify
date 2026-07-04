import React, { useEffect, useState, useCallback } from "react";
import { Briefcase, GraduationCap, ListTodo, CheckCircle2 } from "lucide-react";
import Header from "../../components/Header";
import StatCard from "../../components/StatCard";
import TaskForm from "../../components/TaskForm";
import TaskTable from "../../components/TaskTable";
import { taskService } from "../../services/taskService";
import { calculateTotalEstimate } from "../../utils/scheduler";

export default function UserDashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    const data = await taskService.getAll();
    setTasks(data);
  }, []);

  useEffect(() => {
    loadTasks().finally(() => setLoading(false));
  }, [loadTasks]);

  async function handleAddTask(payload) {
    await taskService.create(payload);
    await loadTasks();
  }

  async function handleDeleteTask(id) {
    await taskService.remove(id);
    await loadTasks();
  }

  const filteredTasks = filter === "all" ? tasks : tasks.filter((t) => t.type === filter);
  const totalWork = tasks.filter((t) => t.type === "work").length;
  const totalCourse = tasks.filter((t) => t.type === "course").length;
  const totalActive = tasks.filter((t) => t.status === "pending" || t.status === "active").length;
  const totalCompleted = tasks.filter((t) => t.status === "completed").length;
  const totalEstimate = calculateTotalEstimate(tasks);

  return (
    <div>
      <Header title="Dashboard" subtitle="Ringkasan task Work dan Course Anda" totalEstimateMinutes={totalEstimate} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Briefcase} label="Total Work Task" value={totalWork} color="mint" />
        <StatCard icon={GraduationCap} label="Total Course Task" value={totalCourse} color="purple" />
        <StatCard icon={ListTodo} label="Total Task Aktif" value={totalActive} color="yellow" />
        <StatCard icon={CheckCircle2} label="Total Task Selesai" value={totalCompleted} color="pink" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TaskForm onSubmit={handleAddTask} />
        </div>
        <div className="lg:col-span-2">
          {loading ? (
            <div className="card text-center text-slate-400 py-10">Memuat task...</div>
          ) : (
            <TaskTable tasks={filteredTasks} filter={filter} onFilterChange={setFilter} onDelete={handleDeleteTask} />
          )}
        </div>
      </div>
    </div>
  );
}
