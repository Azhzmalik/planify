// Logika scheduler: mengurutkan dan merekomendasikan task berikutnya
// Urutan: 1) jam mulai paling awal, 2) prioritas tertinggi, 3) durasi

const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

export function sortTasksForSchedule(tasks) {
  return [...tasks].sort((a, b) => {
    const startDiff = new Date(a.start_time) - new Date(b.start_time);
    if (startDiff !== 0) return startDiff;

    const priorityDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    return a.duration_minutes - b.duration_minutes;
  });
}

// Ambil task berikutnya yang direkomendasikan (status pending), dari daftar yang sudah diurutkan
export function getNextRecommendedTask(tasks) {
  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const sorted = sortTasksForSchedule(pendingTasks);
  return sorted[0] || null;
}

// Hitung total estimasi waktu (menit) dari task yang berstatus pending atau active
export function calculateTotalEstimate(tasks) {
  return tasks
    .filter((t) => t.status === "pending" || t.status === "active")
    .reduce((total, t) => total + t.duration_minutes, 0);
}
