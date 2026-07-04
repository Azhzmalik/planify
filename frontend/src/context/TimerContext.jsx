import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { taskService } from "../services/taskService";

const TimerContext = createContext(null);

// Context ini sengaja diletakkan di atas semua routing (lihat main.jsx),
// supaya saat user pindah halaman lewat sidebar, komponen ini TIDAK ikut
// di-unmount oleh React Router. Dengan begitu, state timer (secondsLeft,
// mode, activeTask, dll) tetap hidup walau SchedulerPage dibongkar-pasang.
export function TimerProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(null);
  const [mode, setMode] = useState("idle"); // idle | running | resting
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [toast, setToast] = useState("");
  const timerRef = useRef(null);

  const loadTasks = useCallback(async () => {
    const data = await taskService.getAll();
    setTasks(data);
    return data;
  }, []);

  // Load awal sekali saat aplikasi pertama kali dibuka (bukan setiap kali
  // masuk halaman Scheduler), supaya task aktif dari server hanya dipakai
  // untuk inisialisasi awal, bukan menimpa timer yang sedang berjalan.
  useEffect(() => {
    loadTasks().then((data) => {
      const running = data.find((t) => t.status === "active");
      if (running) {
        setActiveTask(running);
        setMode("running");
        setTotalSeconds(running.duration_minutes * 60);
        setSecondsLeft(running.duration_minutes * 60);
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3500);
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification("Planify", { body: message });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Interval utama untuk countdown, berjalan baik saat "running" maupun "resting"
  useEffect(() => {
    if (mode !== "running" && mode !== "resting") return undefined;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [mode]);

  const finishTaskNaturally = useCallback(async () => {
    setActiveTask((current) => {
      if (current) {
        taskService.updateStatus(current.id, "completed").then(() => {
          showToast(`Task "${current.title}" selesai. Waktu habis!`);
          loadTasks();
        });
      }
      return null;
    });
    setMode("idle");
  }, [loadTasks, showToast]);

  // Reaksi ketika countdown mencapai 0
  useEffect(() => {
    if (secondsLeft !== 0) return;

    if (mode === "running") {
      finishTaskNaturally();
    } else if (mode === "resting") {
      setMode("idle");
      showToast("Waktu istirahat selesai. Saatnya lanjut ke task berikutnya!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  async function handleStart(nextRecommended) {
    if (!nextRecommended) return;
    const updated = await taskService.updateStatus(nextRecommended.id, "active");
    setActiveTask(updated);
    setTotalSeconds(updated.duration_minutes * 60);
    setSecondsLeft(updated.duration_minutes * 60);
    setMode("running");
    await loadTasks();
  }

  async function handleComplete() {
    if (!activeTask) return;
    const remaining = secondsLeft;
    await taskService.updateStatus(activeTask.id, "completed");
    showToast(`Task "${activeTask.title}" ditandai selesai.`);
    await loadTasks();

    if (remaining > 0) {
      // Sisa waktu dipakai sebagai waktu istirahat sampai jadwal berikutnya
      setTotalSeconds(remaining);
      setSecondsLeft(remaining);
      setMode("resting");
    } else {
      setMode("idle");
    }
    setActiveTask(null);
  }

  async function handleSkip() {
    if (!activeTask) return;
    await taskService.updateStatus(activeTask.id, "skipped");
    showToast(`Task "${activeTask.title}" dilewati.`);
    setActiveTask(null);
    setMode("idle");
    await loadTasks();
  }

  return (
    <TimerContext.Provider
      value={{
        tasks,
        loading,
        activeTask,
        mode,
        secondsLeft,
        totalSeconds,
        toast,
        loadTasks,
        handleStart,
        handleComplete,
        handleSkip,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer harus digunakan di dalam TimerProvider");
  return ctx;
}
