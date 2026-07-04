import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import TaskTable from "../../components/TaskTable";
import { adminService } from "../../services/adminService";

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getTasks()
      .then(setTasks)
      .finally(() => setLoading(false));
  }, []);

  const filteredTasks = filter === "all" ? tasks : tasks.filter((t) => t.type === filter);

  return (
    <div>
      <Header title="Data Task" subtitle="Seluruh task dari semua pengguna" />

      {loading ? (
        <div className="card text-center text-slate-400 py-10">Memuat data task...</div>
      ) : (
        <TaskTable tasks={filteredTasks} filter={filter} onFilterChange={setFilter} showUserColumn />
      )}
    </div>
  );
}
