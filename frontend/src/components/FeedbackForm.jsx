import React, { useState } from "react";
import { Send } from "lucide-react";

const categories = [
  { value: "bug", label: "Bug" },
  { value: "suggestion", label: "Saran" },
  { value: "complaint", label: "Keluhan" },
  { value: "other", label: "Lainnya" },
];

export default function FeedbackForm({ onSubmit }) {
  const [form, setForm] = useState({ title: "", message: "", category: "suggestion" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title || !form.message) {
      setError("Judul dan isi feedback wajib diisi");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(form);
      setForm({ title: "", message: "", category: "suggestion" });
      setSuccess("Feedback berhasil dikirim, terima kasih!");
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal mengirim feedback");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="font-semibold text-navy mb-4">Kirim Feedback</h3>

      {error && <div className="mb-4 text-sm text-rose-600 bg-rose-50 rounded-xl px-4 py-2.5">{error}</div>}
      {success && <div className="mb-4 text-sm text-emerald-600 bg-emerald-50 rounded-xl px-4 py-2.5">{success}</div>}

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="label-field">Kategori</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-field">
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-field">Judul Feedback</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ringkasan singkat feedback Anda"
            className="input-field"
          />
        </div>

        <div>
          <label className="label-field">Isi Feedback</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Jelaskan lebih detail di sini..."
            className="input-field"
          />
        </div>
      </div>

      <button type="submit" disabled={submitting} className="btn-primary mt-5 w-full sm:w-auto flex items-center justify-center gap-2">
        <Send size={16} />
        {submitting ? "Mengirim..." : "Kirim Feedback"}
      </button>
    </form>
  );
}
