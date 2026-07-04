// Script untuk membuat akun admin default
// Jalankan dengan: npm run seed
require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("../config/db");

async function seedAdmin() {
  const name = process.env.ADMIN_NAME || "Admin Planify";
  const email = process.env.ADMIN_EMAIL || "admin@planify.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

    if (existing.rows.length > 0) {
      console.log(`Admin dengan email ${email} sudah ada. Seed dibatalkan.`);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin')`,
      [name, email, passwordHash]
    );

    console.log("Akun admin default berhasil dibuat:");
    console.log(`  Email    : ${email}`);
    console.log(`  Password : ${password}`);
    process.exit(0);
  } catch (err) {
    console.error("Gagal membuat admin default:", err);
    process.exit(1);
  }
}

seedAdmin();
