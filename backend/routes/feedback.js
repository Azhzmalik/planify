const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");

const router = express.Router();
router.use(authMiddleware);

// GET /api/feedbacks
// - user biasa: hanya melihat feedback miliknya sendiri
// - admin: melihat semua feedback
router.get("/", async (req, res) => {
  try {
    let result;
    if (req.user.role === "admin") {
      result = await pool.query(
        `SELECT f.*, u.name AS user_name, u.email AS user_email
         FROM feedbacks f
         JOIN users u ON u.id = f.user_id
         ORDER BY f.created_at DESC`
      );
    } else {
      result = await pool.query(
        "SELECT * FROM feedbacks WHERE user_id = $1 ORDER BY created_at DESC",
        [req.user.id]
      );
    }
    res.json({ feedbacks: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// POST /api/feedbacks - kirim feedback baru (user)
router.post("/", async (req, res) => {
  try {
    const { title, message, category } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Judul dan isi feedback wajib diisi" });
    }
    const validCategories = ["bug", "suggestion", "complaint", "other"];
    const finalCategory = validCategories.includes(category) ? category : "other";

    const result = await pool.query(
      `INSERT INTO feedbacks (user_id, title, message, category)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.id, title, message, finalCategory]
    );

    res.status(201).json({ message: "Feedback berhasil dikirim", feedback: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// PUT /api/feedbacks/:id/status - admin mengubah status feedback
router.put("/:id/status", roleMiddleware("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["new", "read", "done"].includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const result = await pool.query(
      `UPDATE feedbacks SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Feedback tidak ditemukan" });
    }
    res.json({ message: "Status feedback berhasil diperbarui", feedback: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// DELETE /api/feedbacks/:id - hanya admin yang boleh menghapus feedback
router.delete("/:id", roleMiddleware("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM feedbacks WHERE id = $1 RETURNING id", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Feedback tidak ditemukan" });
    }
    res.json({ message: "Feedback berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

module.exports = router;
