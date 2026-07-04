const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const feedbackRoutes = require("./routes/feedback");
const adminRoutes = require("./routes/admin");

const app = express();

// Izinkan akses dari alamat frontend yang sudah online (CLIENT_URL).
// Kalau CLIENT_URL belum diisi (misal saat masih coba-coba di komputer sendiri),
// semua alamat tetap diizinkan supaya tidak error.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Planify API berjalan dengan baik" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Terjadi kesalahan pada server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Planify API berjalan di http://localhost:${PORT}`);
});
