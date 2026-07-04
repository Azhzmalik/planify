// Format waktu ke format jam:menit (contoh: 14.30)
// PENTING: task start_time/end_time disimpan sebagai kolom TIMESTAMP (tanpa timezone)
// dan server (Vercel) berjalan di UTC. Karena itu, memakai toLocaleTimeString (yang
// otomatis konversi ke timezone browser/WIB) akan menggeser jam +7 dari yang diinput.
// Solusinya: ambil komponen jam/menit apa adanya (UTC getters) tanpa konversi ulang,
// supaya jam yang ditampilkan sama persis dengan yang diinput user.
export function formatTime(dateInput) {
  const date = new Date(dateInput);
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hh}.${mm}`;
}

// Format tanggal singkat (contoh: 2 Jul 2026)
// Dipakai untuk created_at (dibuat otomatis via NOW() di database, sudah berupa
// waktu absolut yang benar), jadi di sini konversi ke timezone lokal browser
// memang tepat dan TIDAK diubah.
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
