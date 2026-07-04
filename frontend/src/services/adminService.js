import api from "./api";

export const adminService = {
  async getDashboardStats() {
    const { data } = await api.get("/admin/dashboard-stats");
    return data;
  },

  async getUsers() {
    const { data } = await api.get("/admin/users");
    return data.users;
  },

  async getTasks() {
    const { data } = await api.get("/admin/tasks");
    return data.tasks;
  },

  async getFeedbacks() {
    const { data } = await api.get("/admin/feedbacks");
    return data.feedbacks;
  },
};
