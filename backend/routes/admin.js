const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");

const router = express.Router();
router.use(authMiddleware, roleMiddleware("admin"));

// GET /api/admin/dashboard-stats - ringkasan statistik untuk dashboard admin
router.get("/dashboard-stats", async (req, res) => {
  try {
    const [
      totalUsers,
      totalWork,
      totalCourse,
      totalFeedback,
      totalCompleted,
      totalActive,
      feedbackByCategory,
      taskByType,
      topUsers,
      skippedTasks,
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users WHERE role = 'user'"),
      pool.query("SELECT COUNT(*) FROM tasks WHERE type = 'work'"),
      pool.query("SELECT COUNT(*) FROM tasks WHERE type = 'course'"),
      pool.query("SELECT COUNT(*) FROM feedbacks"),
      pool.query("SELECT COUNT(*) FROM tasks WHERE status = 'completed'"),
      pool.query("SELECT COUNT(*) FROM tasks WHERE status IN ('pending', 'active')"),
      pool.query("SELECT category, COUNT(*) FROM feedbacks GROUP BY category"),
      pool.query("SELECT type, COUNT(*) FROM tasks GROUP BY type"),
      pool.query(
        `SELECT u.name, COUNT(t.id) AS task_count
         FROM users u LEFT JOIN tasks t ON t.user_id = u.id
         WHERE u.role = 'user'
         GROUP BY u.id, u.name ORDER BY task_count DESC LIMIT 5`
      ),
      pool.query("SELECT COUNT(*) FROM tasks WHERE status = 'skipped'"),
    ]);

    res.json({
      totalUsers: Number(totalUsers.rows[0].count),
      totalWorkTasks: Number(totalWork.rows[0].count),
      totalCourseTasks: Number(totalCourse.rows[0].count),
      totalFeedback: Number(totalFeedback.rows[0].count),
      totalCompletedTasks: Number(totalCompleted.rows[0].count),
      totalActiveTasks: Number(totalActive.rows[0].count),
      totalSkippedTasks: Number(skippedTasks.rows[0].count),
      feedbackByCategory: feedbackByCategory.rows,
      taskByType: taskByType.rows,
      topUsers: topUsers.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// GET /api/admin/users - daftar semua user
router.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json({ users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// GET /api/admin/tasks - daftar semua task dari semua user
router.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.name AS user_name
       FROM tasks t JOIN users u ON u.id = t.user_id
       ORDER BY t.start_time DESC`
    );
    res.json({ tasks: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// GET /api/admin/feedbacks - daftar semua feedback (sama dengan endpoint feedback untuk admin)
router.get("/feedbacks", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT f.*, u.name AS user_name, u.email AS user_email
       FROM feedbacks f JOIN users u ON u.id = f.user_id
       ORDER BY f.created_at DESC`
    );
    res.json({ feedbacks: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

module.exports = router;
