-- Buat Database
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Tabel Users (untuk login admin)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Simpan password yang sudah di-hash (bcrypt)
    role ENUM('admin', 'user') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Profiles (Data diri lengkap, relasi 1:1 dengan users)
CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nama_lengkap VARCHAR(100),
    nama_panggilan VARCHAR(50),
    tempat_lahir VARCHAR(50),
    tanggal_lahir DATE,
    email VARCHAR(100),
    telepon VARCHAR(20),
    universitas VARCHAR(100),
    fakultas VARCHAR(100),
    prodi VARCHAR(100),
    semester VARCHAR(20),
    alamat TEXT,
    foto_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel Experiences
CREATE TABLE experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    posisi VARCHAR(100),
    perusahaan VARCHAR(100),
    durasi VARCHAR(50),
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel Projects
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    judul VARCHAR(100),
    deskripsi TEXT,
    gambar_url VARCHAR(255),
    link_project VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel Skills
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nama_skill VARCHAR(50),
    icon_class VARCHAR(50), -- Contoh: fa-brands fa-react
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

USE portfolio_db;

-- 1. Insert User
-- Password asli: user123 (Nanti di-hash di backend)
INSERT INTO users (username, password_hash, role) 
VALUES ('user1', '$2y$10$ContohHashPasswordUser123...', 'admin');

-- Ambil ID user yang baru dibuat untuk relasi (Asumsi ID nya adalah 1, atau gunakan LAST_INSERT_ID())
SET @user_id = LAST_INSERT_ID();

-- 2. Insert Profile Data
INSERT INTO profiles (
    user_id, nama_lengkap, nama_panggilan, tempat_lahir, tanggal_lahir, 
    email, telepon, universitas, fakultas, prodi, semester, alamat, foto_url
) VALUES (
    @user_id, 
    'Rizky Pratama', 
    'Rizky', 
    'Bandung', 
    '2000-05-20', 
    'rizky.pratama@student.ac.id', 
    '0812-3456-7890', 
    'Universitas Teknologi Digital', 
    'Fakultas Ilmu Komputer', 
    'Teknik Informatika', 
    '6 (Enam)', 
    'Jl. Dago Atas No. 12, Bandung, Jawa Barat', 
    'https://ui-avatars.com/api/?name=Rizky+Pratama&background=0D8ABC&color=fff&size=256'
);

-- 3. Insert Experiences
INSERT INTO experiences (user_id, posisi, perusahaan, durasi, deskripsi) VALUES
(@user_id, 'Staff Magang IT', 'Dinas Komunikasi & Informatika', 'Agustus 2023 - Desember 2023', 'Membantu maintenance website instansi dan pembuatan laporan bulanan.'),
(@user_id, 'Ketua Himpunan Mahasiswa', 'HMTI Universitas', '2022 - 2023', 'Memimpin organisasi himpunan, mengelola event seminar nasional, dan koordinasi divisi.');

-- 4. Insert Projects
INSERT INTO projects (user_id, judul, deskripsi, gambar_url, link_project) VALUES
(@user_id, 'Sistem Informasi Perpustakaan', 'Aplikasi web untuk manajemen peminjaman dan pengembalian buku dengan fitur denda otomatis.', 'https://via.placeholder.com/400x250/2563eb/ffffff?text=Perpustakaan', 'https://github.com/user1/perpus'),
(@user_id, 'Landing Page Coffee Shop', 'Desain landing page responsif untuk kedai kopi lokal dengan animasi CSS.', 'https://via.placeholder.com/400x250/d97706/ffffff?text=Coffee+Shop', '#'),
(@user_id, 'To-Do List App', 'Aplikasi manajemen tugas harian dengan fitur LocalStorage dan Dark Mode.', 'https://via.placeholder.com/400x250/059669/ffffff?text=ToDo+App', '#');

-- 5. Insert Skills
INSERT INTO skills (user_id, nama_skill, icon_class) VALUES
(@user_id, 'HTML & CSS', 'fa-brands fa-html5'),
(@user_id, 'JavaScript', 'fa-brands fa-js'),
(@user_id, 'React JS', 'fa-brands fa-react'),
(@user_id, 'Bootstrap', 'fa-brands fa-bootstrap'),
(@user_id, 'Git & Github', 'fa-brands fa-git-alt'),
(@user_id, 'Figma', 'fa-brands fa-figma');