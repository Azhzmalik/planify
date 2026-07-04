// Koneksi ke PostgreSQL menggunakan pg Pool
const { Pool } = require("pg");
require("dotenv").config();

// Jika DATABASE_URL tersedia (dipakai saat hosting online, misal di Neon/Render),
// gunakan itu. Jika tidak ada, pakai kredensial lokal (DB_HOST, dst) seperti biasa
// untuk pengembangan di komputer sendiri.
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

pool.on("connect", () => {
  console.log("Terhubung ke database PostgreSQL");
});

pool.on("error", (err) => {
  console.error("Error koneksi database:", err);
  process.exit(-1);
});

module.exports = pool;
