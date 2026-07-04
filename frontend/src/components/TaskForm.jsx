import React, { useState } from "react";
import { Plus } from "lucide-react";

const initialState = {
  type: "work",
  title: "",
  start_time: "",
  end_time: "",
  priority: "medium",
  description: "",
};

export default function TaskForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.title || !form.start_time || !form.end_time) {
      setError("Nama task, jam mulai, dan jam selesai wajib diisi");
      return;
    }
    if (new Date(form.end_time) <= new Date(form.start_time)) {
      setError("Jam selesai harus setelah jam mulai");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(form);
      setForm(initialState);
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal menambahkan task");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="font-semibold text-navy mb-4">Tambah Task Baru</h3>

      {error && (
        <div className="mb-4 text-sm text-rose-600 bg-rose-50 rounded-xl px-4 py-2.5">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-field">Jenis Task</label>
          <select name="type" value={form.type} onChange={handleChange} className="input-field">
            <option value="work">Work</option>
            <option value="course">Course</option>
          </select>
        </div>

        <div>
          <label className="label-field">Prioritas</label>
          <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
            <option value="low">Rendah</option>
            <option value="medium">Sedang</option>
            <option value="high">Tinggi</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="label-field">Nama Task</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Contoh: Meeting mingguan / Tugas Statistika"
            className="input-field"
          />
        </div>

        <div>
          <label className="label-field">Jam Mulai</label>
          <input
            type="datetime-local"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="label-field">Jam Selesai</label>
          <input
            type="datetime-local"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label-field">Deskripsi (opsional)</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            className="input-field"
            placeholder="Catatan tambahan untuk task ini"
          />
        </div>
      </div>

      <button type="submit" disabled={submitting} className="btn-primary mt-5 w-full sm:w-auto flex items-center justify-center gap-2">
        <Plus size={18} />
        {submitting ? "Menyimpan..." : "Tambah Task"}
      </button>
    </form>
  );
}
