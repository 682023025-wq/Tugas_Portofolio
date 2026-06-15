/**
 * init-data.js
 * Script untuk menginisialisasi skema database (localStorage) 
 * dan mengisi data dummy jika belum ada.
 */

// Kunci-kunci localStorage
const DB_KEYS = {
    USER: 'portfolio_user',
    EXPERIENCE: 'portfolio_experience',
    PROJECTS: 'portfolio_projects',
    SKILLS: 'portfolio_skills',
    ADMIN: 'portfolio_admin_auth'
};

// Data Dummy User 1 (Data Diri)
const dummyUser = {
    id: 1,
    username: 'user1', // Untuk referensi internal
    nama_lengkap: 'Budi Santoso',
    nama_panggilan: 'Budi',
    tempat_lahir: 'Jakarta',
    tanggal_lahir: '2000-05-15',
    email: 'budi.santoso@example.com',
    telepon: '081234567890',
    universitas: 'Universitas Teknologi Indonesia',
    fakultas: 'Fakultas Ilmu Komputer',
    program_studi: 'Teknik Informatika',
    semester: '5',
    alamat: 'Jl. Merdeka No. 45, Jakarta Selatan, DKI Jakarta',
    foto_url: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=0D8ABC&color=fff&size=256' // Placeholder image
};

// Data Dummy Experience
const dummyExperience = [
    {
        id: 1,
        posisi: 'Frontend Developer Intern',
        perusahaan: 'PT Startup Maju Jaya',
        lokasi: 'Jakarta',
        tanggal_mulai: '2023-06-01',
        tanggal_selesai: '2023-12-01',
        deskripsi: 'Mengembangkan antarmuka pengguna menggunakan React.js dan bekerja sama dengan tim backend untuk integrasi API.',
        teknologi: 'React, CSS, JavaScript'
    },
    {
        id: 2,
        posisi: 'Ketua Himpunan Mahasiswa',
        perusahaan: 'Himpunan Teknik Informatika',
        lokasi: 'Kampus',
        tanggal_mulai: '2022-01-01',
        tanggal_selesai: '2023-01-01',
        deskripsi: 'Memimpin organisasi himpunan, mengelola event kampus, dan meningkatkan kerjasama antar mahasiswa.',
        teknologi: 'Leadership, Event Management'
    }
];

// Data Dummy Projects
const dummyProjects = [
    {
        id: 1,
        judul: 'Website E-Commerce Sederhana',
        deskripsi: 'Platform belanja online dengan fitur keranjang, checkout, dan dashboard admin sederhana.',
        gambar_url: 'https://via.placeholder.com/600x400/0D8ABC/ffffff?text=E-Commerce',
        link_demo: 'https://demo-ecommerce.example.com',
        link_github: 'https://github.com/user1/ecommerce',
        teknologi: 'HTML, CSS, JS, LocalStorage'
    },
    {
        id: 2,
        judul: 'Aplikasi Manajemen Tugas',
        deskripsi: 'Aplikasi To-Do List dengan fitur drag-and-drop dan kategori tugas.',
        gambar_url: 'https://via.placeholder.com/600x400/28a745/ffffff?text=Task+Manager',
        link_demo: '#',
        link_github: 'https://github.com/user1/task-manager',
        teknologi: 'JavaScript, Bootstrap'
    },
    {
        id: 3,
        judul: 'Portfolio Pribadi',
        deskripsi: 'Website portofolio responsif untuk menampilkan pengalaman dan proyek.',
        gambar_url: 'https://via.placeholder.com/600x400/dc3545/ffffff?text=Portfolio',
        link_demo: '#',
        link_github: 'https://github.com/user1/portfolio',
        teknologi: 'HTML, CSS, JS'
    }
];

// Data Dummy Skills
const dummySkills = [
    { id: 1, nama: 'HTML5', icon: 'fa-brands fa-html5', level: 90 },
    { id: 2, nama: 'CSS3', icon: 'fa-brands fa-css3-alt', level: 85 },
    { id: 3, nama: 'JavaScript', icon: 'fa-brands fa-js', level: 80 },
    { id: 4, nama: 'React', icon: 'fa-brands fa-react', level: 70 },
    { id: 5, nama: 'Bootstrap', icon: 'fa-brands fa-bootstrap', level: 85 },
    { id: 6, nama: 'Git', icon: 'fa-brands fa-git-alt', level: 75 }
];

// Fungsi untuk mengambil data dari localStorage
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Fungsi untuk menyimpan data ke localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Fungsi Inisialisasi Utama
function initDatabase() {
    console.log('Memeriksa status database...');

    // 1. Inisialisasi Data User
    if (!getData(DB_KEYS.USER)) {
        console.log('Data user tidak ditemukan. Mengisi data dummy...');
        saveData(DB_KEYS.USER, dummyUser);
    }

    // 2. Inisialisasi Experience
    if (!getData(DB_KEYS.EXPERIENCE)) {
        console.log('Data experience tidak ditemukan. Mengisi data dummy...');
        saveData(DB_KEYS.EXPERIENCE, dummyExperience);
    }

    // 3. Inisialisasi Projects
    if (!getData(DB_KEYS.PROJECTS)) {
        console.log('Data projects tidak ditemukan. Mengisi data dummy...');
        saveData(DB_KEYS.PROJECTS, dummyProjects);
    }

    // 4. Inisialisasi Skills
    if (!getData(DB_KEYS.SKILLS)) {
        console.log('Data skills tidak ditemukan. Mengisi data dummy...');
        saveData(DB_KEYS.SKILLS, dummySkills);
    }

    // 5. Inisialisasi Admin Auth (Reset password default jika belum ada session aktif)
    // Kita hanya set default jika benar-benar kosong, tapi biarkan session login tetap jalan
    if (!localStorage.getItem('isLoggedIn')) {
         // Opsional: Reset kredensial admin ke default jika ingin memastikan akses
         // Tapi lebih aman tidak mereset password yang sudah diubah user kecuali ada tombol reset
         console.log('Siap untuk login.');
    }

    console.log('Inisialisasi database selesai.');
}

// Jalankan inisialisasi saat script dimuat
document.addEventListener('DOMContentLoaded', initDatabase);

// Export fungsi agar bisa dipakai di file lain jika perlu (untuk modul)
window.PortfolioDB = {
    keys: DB_KEYS,
    get: getData,
    save: saveData,
    reset: () => {
        if(confirm('Apakah Anda yakin ingin mereset semua data ke kondisi awal (dummy)? Data perubahan akan hilang.')) {
            localStorage.clear();
            location.reload();
        }
    }
};
