import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

import UserLayout from "./layouts/UserLayout";
import UserDashboard from "./pages/user/UserDashboard";
import SchedulerPage from "./pages/user/SchedulerPage";
import FeedbackPage from "./pages/user/FeedbackPage";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTasks from "./pages/admin/AdminTasks";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminStatistics from "./pages/admin/AdminStatistics";

import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"} replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"} replace /> : <RegisterPage />}
      />

      {/* Rute User */}
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRole="user">
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="scheduler" element={<SchedulerPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Rute Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="tasks" element={<AdminTasks />} />
        <Route path="feedback" element={<AdminFeedback />} />
        <Route path="statistics" element={<AdminStatistics />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route
        path="/"
        element={
          <Navigate to={user ? (user.role === "admin" ? "/admin/dashboard" : "/user/dashboard") : "/login"} replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
