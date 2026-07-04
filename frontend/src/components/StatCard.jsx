import React from "react";

const colorMap = {
  mint: "bg-pastel-mint text-pastel-mintdark",
  pink: "bg-pastel-pink text-pastel-pinkdark",
  yellow: "bg-pastel-yellow text-pastel-yellowdark",
  purple: "bg-pastel-purple text-pastel-purpledark",
};

// color: "mint" | "pink" | "yellow" | "purple"
export default function StatCard({ icon: Icon, label, value, color = "mint" }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color]}`}>
        {Icon && <Icon size={22} />}
      </div>
      <div>
        <p className="text-2xl font-bold text-navy leading-tight">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}
