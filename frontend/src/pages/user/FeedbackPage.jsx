import React, { useEffect, useState, useCallback } from "react";
import Header from "../../components/Header";
import FeedbackForm from "../../components/FeedbackForm";
import FeedbackTable from "../../components/FeedbackTable";
import { feedbackService } from "../../services/feedbackService";

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFeedbacks = useCallback(async () => {
    const data = await feedbackService.getAll();
    setFeedbacks(data);
  }, []);

  useEffect(() => {
    loadFeedbacks().finally(() => setLoading(false));
  }, [loadFeedbacks]);

  async function handleSubmit(payload) {
    await feedbackService.create(payload);
    await loadFeedbacks();
  }

  return (
    <div>
      <Header title="Feedback" subtitle="Sampaikan masukan Anda kepada admin" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FeedbackForm onSubmit={handleSubmit} />
        </div>
        <div className="lg:col-span-2">
          {loading ? (
            <div className="card text-center text-slate-400 py-10">Memuat feedback...</div>
          ) : (
            <FeedbackTable feedbacks={feedbacks} isAdmin={false} />
          )}
        </div>
      </div>
    </div>
  );
}
