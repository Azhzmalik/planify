# Planify

Aplikasi web fullstack untuk membantu mahasiswa yang bekerja sambil kuliah mengatur waktu antara **Work** dan **Course**. Sistem menggabungkan semua task dalam satu tampilan monitoring dan merekomendasikan task mana yang harus dikerjakan lebih dulu berdasarkan jam mulai, prioritas, dan durasi.

## Struktur Project

```
planify/
├── backend/              # Node.js + Express + PostgreSQL
│   ├── config/db.js
│   ├── middleware/       # auth.js, role.js
│   ├── routes/           # auth.js, tasks.js, feedback.js, admin.js
│   ├── db/                # schema.sql, seed.js
│   ├── server.js
│   └── .env.example
└── frontend/              # React + Vite + Tailwind CSS
    └── src/
        ├── pages/          # login, register, user/*, admin/*
        ├── components/     # Sidebar, Header, StatCard, TaskForm, dll.
        ├── layouts/         # UserLayout, AdminLayout
        ├── context/          # AuthContext
        ├── services/          # axios API calls
        └── utils/              # scheduler logic, formatting
```

## Tech Stack

- **Frontend**: React 18 + Vite, Tailwind CSS, React Router, Axios, Recharts, Lucide Icons
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **Auth**: JWT + bcrypt, role-based access (admin/user)

## 1. Persiapan Database

1. Pastikan PostgreSQL sudah terpasang dan berjalan.
2. Buat database baru:
   ```sql
   CREATE DATABASE planify_db;
   ```
3. Jalankan schema untuk membuat tabel:
   ```bash
   psql -U postgres -d planify_db -f backend/db/schema.sql
   ```

## 2. Menjalankan Backend

```bash
cd backend
npm install
cp .env.example .env
```

Buka file `.env` dan sesuaikan kredensial database (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, dll.) serta `JWT_SECRET`.

Buat akun admin default (email & password diambil dari `.env`):

```bash
npm run seed
```

Jalankan server:

```bash
npm run dev      # mode development (nodemon)
# atau
npm start         # mode production
```

Backend berjalan di `http://localhost:5000`.

## 3. Menjalankan Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend berjalan di `http://localhost:5173` dan otomatis terhubung ke backend melalui `VITE_API_URL`.

## 4. Login

- **Admin** (dibuat dari `npm run seed`):
  - Email: sesuai `ADMIN_EMAIL` di `.env` (default `admin@planify.com`)
  - Password: sesuai `ADMIN_PASSWORD` di `.env` (default `admin123`)
- **User**: daftar akun baru melalui halaman **Register**.

Setelah login, sistem otomatis mengarahkan ke:
- `/admin/dashboard` untuk role admin
- `/user/dashboard` untuk role user

## Ringkasan Fitur

- **Login & Register** dengan validasi dan JWT.
- **User Dashboard**: statistik task, form tambah task (Work/Course), tabel monitoring dengan filter.
- **Scheduler**: area utama menampilkan task aktif, countdown real-time, tombol Mulai Jadwal/Selesai/Lewati, dan logika waktu istirahat ketika task diselesaikan lebih awal dari estimasi.
- **Feedback**: user mengirim feedback (Bug/Saran/Keluhan/Lainnya) dan melihat riwayatnya sendiri.
- **Admin Dashboard**: statistik keseluruhan, grafik Work vs Course dan feedback per kategori, user paling aktif.
- **Admin - Data User / Data Task / Feedback / Statistik**: kelola seluruh data pengguna, monitor semua task, ubah status & hapus feedback, lihat insight seperti tingkat task yang dilewati.

## Logika Scheduler

Task diurutkan berdasarkan:
1. Jam mulai paling awal
2. Prioritas tertinggi (high > medium > low)
3. Durasi terpendek

Saat **Mulai Jadwal** ditekan, task pertama pada antrian menjadi `active` dan countdown berjalan sesuai durasi. Jika countdown habis, status otomatis menjadi `completed` dan sistem merekomendasikan task berikutnya. Jika user menekan **Selesai** sebelum waktu habis, sisa waktu tetap berjalan sebagai waktu istirahat sampai task berikutnya siap direkomendasikan. Tombol **Lewati** menandai task sebagai `skipped` dan langsung merekomendasikan task selanjutnya.

## Catatan

- Semua password disimpan dalam bentuk hash menggunakan bcrypt, tidak pernah plain text.
- Endpoint admin dilindungi middleware role sehingga tidak bisa diakses oleh user biasa.
- Struktur folder frontend dan backend dipisah agar mudah dikembangkan lebih lanjut (misalnya ditambahkan Docker, testing, dsb).
