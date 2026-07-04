import React from "react";
import { formatCountdown } from "../utils/formatTime";

// Komponen terkontrol: parent (SchedulerPage) yang mengatur interval dan
// mengirim secondsLeft/totalSeconds sebagai prop. Ini memudahkan parent
// menangkap sisa waktu persis saat tombol "Selesai" ditekan lebih awal.
export default function CountdownTimer({ secondsLeft, totalSeconds, label }) {
  const progress = totalSeconds > 0 ? 1 - secondsLeft / totalSeconds : 1;

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative w-44 h-44">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#242E6B" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 52}
            strokeDashoffset={2 * Math.PI * 52 * (1 - progress)}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{formatCountdown(secondsLeft)}</span>
          {label && <span className="text-xs text-white/60 mt-1">{label}</span>}
        </div>
      </div>
    </div>
  );
}
