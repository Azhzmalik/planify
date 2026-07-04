const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

// GET /api/tasks - ambil semua task milik user yang login
// Query param opsional: ?type=work|course
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    let query = "SELECT * FROM tasks WHERE user_id = $1";
    const params = [req.user.id];

    if (type && (type === "work" || type === "course")) {
      query += " AND type = $2";
      params.push(type);
    }

    query += " ORDER BY start_time ASC";

    const result = await pool.query(query, params);
    res.json({ tasks: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// POST /api/tasks - buat task baru
router.post("/", async (req, res) => {
  try {
    const { type, title, description, start_time, end_time, priority } = req.body;

    if (!type || !title || !start_time || !end_time) {
      return res.status(400).json({ message: "Jenis, nama, jam mulai, dan jam selesai wajib diisi" });
    }
    if (!["work", "course"].includes(type)) {
      return res.status(400).json({ message: "Jenis task tidak valid" });
    }

    const start = new Date(start_time);
    const end = new Date(end_time);
    if (isNaN(start) || isNaN(end) || end <= start) {
      return res.status(400).json({ message: "Rentang waktu task tidak valid" });
    }
    const durationMinutes = Math.round((end - start) / 60000);

    const result = await pool.query(
      `INSERT INTO tasks (user_id, type, title, description, start_time, end_time, duration_minutes, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [req.user.id, type, title, description || null, start, end, durationMinutes, priority || "medium"]
    );

    res.status(201).json({ message: "Task berhasil dibuat", task: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// PUT /api/tasks/:id - update task
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, description, start_time, end_time, priority } = req.body;

    const existing = await pool.query("SELECT * FROM tasks WHERE id = $1 AND user_id = $2", [id, req.user.id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Task tidak ditemukan" });
    }

    const current = existing.rows[0];
    const newStart = start_time ? new Date(start_time) : current.start_time;
    const newEnd = end_time ? new Date(end_time) : current.end_time;
    const durationMinutes = Math.round((new Date(newEnd) - new Date(newStart)) / 60000);

    const result = await pool.query(
      `UPDATE tasks SET
        type = COALESCE($1, type),
        title = COALESCE($2, title),
        description = $3,
        start_time = $4,
        end_time = $5,
        duration_minutes = $6,
        priority = COALESCE($7, priority),
        updated_at = NOW()
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [type, title, description, newStart, newEnd, durationMinutes, priority, id, req.user.id]
    );

    res.json({ message: "Task berhasil diperbarui", task: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// PUT /api/tasks/:id/status - update status task (pending/active/completed/skipped)
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "active", "completed", "skipped"].includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const result = await pool.query(
      `UPDATE tasks SET status = $1, updated_at = NOW()
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [status, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task tidak ditemukan" });
    }

    res.json({ message: "Status task berhasil diperbarui", task: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// DELETE /api/tasks/:id - hapus task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task tidak ditemukan" });
    }
    res.json({ message: "Task berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

module.exports = router;
