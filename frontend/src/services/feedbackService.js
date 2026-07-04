import api from "./api";

export const feedbackService = {
  async getAll() {
    const { data } = await api.get("/feedbacks");
    return data.feedbacks;
  },

  async create(payload) {
    const { data } = await api.post("/feedbacks", payload);
    return data.feedback;
  },

  async updateStatus(id, status) {
    const { data } = await api.put(`/feedbacks/${id}/status`, { status });
    return data.feedback;
  },

  async remove(id) {
    const { data } = await api.delete(`/feedbacks/${id}`);
    return data;
  },
};
