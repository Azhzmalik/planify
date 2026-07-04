import React from "react";
import { Play, CheckCircle, SkipForward, Sparkles } from "lucide-react";
import Header from "../../components/Header";
import CountdownTimer from "../../components/CountdownTimer";
import { sortTasksForSchedule, calculateTotalEstimate } from "../../utils/scheduler";
import { formatDuration, formatTime } from "../../utils/formatTime";
import { useTimer } from "../../context/TimerContext";

const priorityLabel = { low: "Rendah", medium: "Sedang", high: "Tinggi" };

export default function SchedulerPage() {
  const {
    tasks,
    loading,
    activeTask,
    mode,
    secondsLeft,
    totalSeconds,
    toast,
    handleStart,
    handleComplete,
    handleSkip,
  } = useTimer();

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const nextRecommended = sortTasksForSchedule(pendingTasks)[0] || null;
  const totalEstimate = calculateTotalEstimate(tasks);

  if (loading) {
    return (
      <div>
        <Header title="Scheduler" subtitle="Jalankan jadwal Anda secara real-time" />
        <div className="card text-center text-slate-400 py-10">Memuat scheduler...</div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Scheduler" subtitle="Jalankan jadwal Anda secara real-time" totalEstimateMinutes={totalEstimate} />

      {toast && (
        <div className="mb-4 flex items-center gap-2 text-sm text-brand-bluedark bg-brand-blue/10 rounded-xl px-4 py-3">
          <Sparkles size={16} />
          {toast}
        </div>
      )}

      {/* Area scheduler utama */}
      <div className="bg-navy rounded-2xl p-8 flex flex-col items-center text-center mb-6">
        {mode === "running" && activeTask && (
          <>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium mb-2 capitalize">
              {activeTask.type} • Prioritas {priorityLabel[activeTask.priority]}
            </span>
            <h2 className="text-xl font-bold text-white mb-1">{activeTask.title}</h2>
            <p className="text-white/50 text-sm mb-2">
              {formatTime(activeTask.start_time)} - {formatTime(activeTask.end_time)}
            </p>
            <CountdownTimer secondsLeft={secondsLeft} totalSeconds={totalSeconds} label="sedang berjalan" />
            <div className="flex gap-3 mt-2">
              <button onClick={handleComplete} className="btn-primary flex items-center gap-2">
                <CheckCircle size={18} />
                Selesai
              </button>
              <button
                onClick={handleSkip}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl px-5 py-2.5 transition-colors flex items-center gap-2"
              >
                <SkipForward size={18} />
                Lewati
              </button>
            </div>
          </>
        )}

        {mode === "resting" && (
          <>
            <span className="px-3 py-1 rounded-full bg-pastel-mint/20 text-pastel-mint text-xs font-medium mb-2">
              Waktu Istirahat
            </span>
            <h2 className="text-xl font-bold text-white mb-1">Santai sejenak dulu</h2>
            <p className="text-white/50 text-sm mb-2">Jadwal berikutnya akan direkomendasikan setelah ini</p>
            <CountdownTimer secondsLeft={secondsLeft} totalSeconds={totalSeconds} label="waktu istirahat" />
          </>
        )}

        {mode === "idle" && (
          <>
            {nextRecommended ? (
              <>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium mb-3 capitalize">
                  Direkomendasikan • {nextRecommended.type} • Prioritas {priorityLabel[nextRecommended.priority]}
                </span>
                <h2 className="text-2xl font-bold text-white mb-2">{nextRecommended.title}</h2>
                <p className="text-white/50 text-sm mb-1">
                  {formatTime(nextRecommended.start_time)} - {formatTime(nextRecommended.end_time)} •{" "}
                  {formatDuration(nextRecommended.duration_minutes)}
                </p>
                <button onClick={() => handleStart(nextRecommended)} className="btn-primary mt-6 flex items-center gap-2 px-8">
                  <Play size={18} />
                  Mulai Jadwal
                </button>
              </>
            ) : (
              <div className="py-10">
                <p className="text-white/70 font-medium">Tidak ada task pending saat ini.</p>
                <p className="text-white/40 text-sm mt-1">Tambahkan task baru dari halaman Dashboard.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Daftar antrian berikutnya */}
      <div className="card">
        <h3 className="font-semibold text-navy mb-4">Antrian Task Berikutnya</h3>
        {sortTasksForSchedule(pendingTasks).length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">Tidak ada task dalam antrian</p>
        ) : (
          <div className="flex flex-col gap-2">
            {sortTasksForSchedule(pendingTasks).map((t, idx) => (
              <div
                key={t.id}
                className={`flex items-center justify-between px-4 py-3 rounded-xl ${
                  idx === 0 ? "bg-brand-blue/10" : "bg-surface"
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-navy">{t.title}</p>
                  <p className="text-xs text-slate-400 capitalize">
                    {t.type} • {formatTime(t.start_time)} • {formatDuration(t.duration_minutes)}
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-500 capitalize">{priorityLabel[t.priority]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
