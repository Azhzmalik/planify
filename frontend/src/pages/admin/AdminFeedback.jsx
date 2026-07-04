import React, { useEffect, useState, useCallback } from "react";
import Header from "../../components/Header";
import FeedbackTable from "../../components/FeedbackTable";
import { feedbackService } from "../../services/feedbackService";

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFeedbacks = useCallback(async () => {
    const data = await feedbackService.getAll();
    setFeedbacks(data);
  }, []);

  useEffect(() => {
    loadFeedbacks().finally(() => setLoading(false));
  }, [loadFeedbacks]);

  async function handleStatusChange(id, status) {
    await feedbackService.updateStatus(id, status);
    await loadFeedbacks();
  }

  async function handleDelete(id) {
    if (!window.confirm("Hapus feedback ini? Tindakan ini tidak dapat dibatalkan.")) return;
    await feedbackService.remove(id);
    await loadFeedbacks();
  }

  return (
    <div>
      <Header title="Feedback" subtitle="Kelola seluruh feedback yang masuk dari pengguna" />

      {loading ? (
        <div className="card text-center text-slate-400 py-10">Memuat feedback...</div>
      ) : (
        <FeedbackTable
          feedbacks={feedbacks}
          isAdmin
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
