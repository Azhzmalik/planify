import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { adminService } from "../../services/adminService";
import { formatDate } from "../../utils/formatTime";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Header title="Data User" subtitle="Daftar seluruh pengguna terdaftar" />

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-2 pr-3 font-medium">Nama</th>
              <th className="py-2 pr-3 font-medium">Email</th>
              <th className="py-2 pr-3 font-medium">Role</th>
              <th className="py-2 pr-3 font-medium">Tanggal Daftar</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400">
                  Memuat data user...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400">
                  Belum ada user terdaftar
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-3 pr-3 font-medium text-navy">{u.name}</td>
                  <td className="py-3 pr-3 text-slate-500">{u.email}</td>
                  <td className="py-3 pr-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${
                        u.role === "admin" ? "bg-pastel-purple text-pastel-purpledark" : "bg-pastel-mint text-pastel-mintdark"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-slate-500">{formatDate(u.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
