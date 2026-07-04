import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarClock,
  MessageSquareText,
  UserCircle,
  LogOut,
  Users,
  ListChecks,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const userLinks = [
  { to: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/user/scheduler", label: "Scheduler", icon: CalendarClock },
  { to: "/user/feedback", label: "Feedback", icon: MessageSquareText },
  { to: "/user/profile", label: "Profile", icon: UserCircle },
];

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Data User", icon: Users },
  { to: "/admin/tasks", label: "Data Task", icon: ListChecks },
  { to: "/admin/feedback", label: "Feedback", icon: MessageSquareText },
  { to: "/admin/statistics", label: "Statistik", icon: BarChart3 },
];

export default function Sidebar({ role }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const links = role === "admin" ? adminLinks : userLinks;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-navy text-white rounded-2xl m-4 p-5 h-[calc(100vh-2rem)] sticky top-4">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-brand-blue flex items-center justify-center font-bold text-lg">
          P
        </div>
        <span className="text-xl font-bold tracking-tight">Planify</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-blue text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors mt-4"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
