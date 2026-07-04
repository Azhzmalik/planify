import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function UserLayout() {
  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar role="user" />
      <main className="flex-1 p-4 md:p-6 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
