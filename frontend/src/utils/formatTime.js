// Format waktu ke format jam:menit lokal (contoh: 14:30)
export function formatTime(dateInput) {
  const date = new Date(dateInput);
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

// Format tanggal singkat (contoh: 2 Jul 2026)
export function formatDate(dateInput) {
  const date = new Date(dateInput);
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// Format durasi menit menjadi "1j 30m" atau "45m"
export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}j` : `${hours}j ${rest}m`;
}

// Format detik menjadi mm:ss untuk countdown timer
export function formatCountdown(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = Math.floor(safeSeconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
