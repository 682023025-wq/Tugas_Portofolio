USE Portofolio;

-- 1. Tabel Users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,      -- NUMBER(2) diganti INT AUTO_INCREMENT
    username VARCHAR(50) NOT NULL UNIQUE,   -- VARCHAR2 diganti VARCHAR
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(10) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_username_uk UNIQUE (username)
);

-- 2. Tabel Profiles
CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                   -- NUMBER diganti INT
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
    alamat TEXT,                            -- VARCHAR2(4000) terlalu panjang, gunakan TEXT
    foto_url VARCHAR(255),
    CONSTRAINT profiles_users_fk FOREIGN KEY (user_id) 
        REFERENCES users(id)
        ON UPDATE CASCADE                   -- MySQL mendukung ON UPDATE CASCADE
);

-- 3. Tabel Experiences
CREATE TABLE experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    posisi VARCHAR(100),
    perusahaan VARCHAR(100),
    durasi VARCHAR(50),
    deskripsi TEXT,                         -- Deskripsi panjang gunakan TEXT
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT experiences_users_fk FOREIGN KEY (user_id) 
        REFERENCES users(id)
);

-- 4. Tabel Projects
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    judul VARCHAR(100),
    deskripsi TEXT,                         -- Deskripsi proyek biasanya panjang
    gambar_url VARCHAR(255),
    link_project VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT projects_users_fk FOREIGN KEY (user_id) 
        REFERENCES users(id)
);

-- 5. Tabel Skills
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nama_skill VARCHAR(50),
    icon_class VARCHAR(50),
    CONSTRAINT skills_users_fk FOREIGN KEY (user_id) 
        REFERENCES users(id)
);

-- Index untuk performa
CREATE INDEX idx_profiles_user ON profiles(user_id);
CREATE INDEX idx_experiences_user ON experiences(user_id);
CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_skills_user ON skills(user_id);