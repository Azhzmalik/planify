import api from "./api";

export const taskService = {
  async getAll(type) {
    const params = type && type !== "all" ? { type } : {};
    const { data } = await api.get("/tasks", { params });
    return data.tasks;
  },

  async create(payload) {
    const { data } = await api.post("/tasks", payload);
    return data.task;
  },

  async update(id, payload) {
    const { data } = await api.put(`/tasks/${id}`, payload);
    return data.task;
  },

  async updateStatus(id, status) {
    const { data } = await api.put(`/tasks/${id}/status`, { status });
    return data.task;
  },

  async remove(id) {
    const { data } = await api.delete(`/tasks/${id}`);
    return data;
  },
};
