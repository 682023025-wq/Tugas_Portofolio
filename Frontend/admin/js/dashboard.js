// =========================================
// DASHBOARD LOGIC - Load data from localStorage
// =========================================

// Data default dari index.html (akan disimpan ke localStorage jika belum ada)
const defaultExperience = [
  {
    id: 1,
    period: "2024 - Sekarang",
    title: "Backend Developer (Freelance)",
    company: "Mandiri",
    description: "Membangun aplikasi web sederhana untuk klien menggunakan Python Flask dan SQLite. Bertanggung jawab atas desain database, REST API, dan integrasi frontend."
  },
  {
    id: 2,
    period: "2023 - 2024",
    title: "Anggota Divisi IT",
    company: "Himpunan Mahasiswa Informatika",
    description: "Mengelola website organisasi, membuat sistem pendaftaran event online, serta mendokumentasikan kegiatan teknis untuk anggota baru."
  },
  {
    id: 3,
    period: "2022 - Sekarang",
    title: "Mahasiswa Teknik Informatika",
    company: "Universitas [Nama Kampus]",
    description: "Mempelajari dasar-dasar ilmu komputer, algoritma, struktur data, basis data, dan rekayasa perangkat lunak. Aktif dalam berbagai proyek akademik berbasis web."
  },
  {
    id: 4,
    period: "2023",
    title: "Peserta Bootcamp Backend Development",
    company: "Platform Online (Dicoding/Alta/dll)",
    description: "Menyelesaikan kelas intensif tentang pengembangan backend dengan Python, termasuk pembuatan REST API, autentikasi JWT, dan deployment aplikasi."
  }
];

const defaultProjects = [
  {
    id: 1,
    title: "Sistem Manajemen Inventaris",
    description: "Aplikasi web untuk melacak stok barang masuk dan keluar dengan laporan bulanan otomatis.",
    tags: ["Python", "Flask", "SQLite"]
  },
  {
    id: 2,
    title: "REST API Mobile App",
    description: "Backend service yang menyediakan endpoint untuk autentikasi pengguna dan manajemen data profil.",
    tags: ["Flask-RESTful", "JWT", "PostgreSQL"]
  },
  {
    id: 3,
    title: "Web Scraper Data Harga",
    description: "Script otomatis untuk mengambil data harga produk dari berbagai marketplace dan menyimpannya ke database.",
    tags: ["Python", "BeautifulSoup", "Pandas"]
  }
];

const defaultSkills = [
  { id: 1, name: "Python", icon: "fab fa-python" },
  { id: 2, name: "SQL & Database", icon: "fas fa-database" },
  { id: 3, name: "Flask / Backend", icon: "fas fa-server" },
  { id: 4, name: "HTML & CSS", icon: "fab fa-html5" },
  { id: 5, name: "JavaScript", icon: "fab fa-js" },
  { id: 6, name: "Git & GitHub", icon: "fab fa-git-alt" }
];

// Initialize data in localStorage if not exists
function initializeData() {
  if (!localStorage.getItem('experience')) {
    localStorage.setItem('experience', JSON.stringify(defaultExperience));
  }
  if (!localStorage.getItem('projects')) {
    localStorage.setItem('projects', JSON.stringify(defaultProjects));
  }
  if (!localStorage.getItem('skills')) {
    localStorage.setItem('skills', JSON.stringify(defaultSkills));
  }
}

// Load and display dashboard data
function loadDashboardData() {
  const experience = JSON.parse(localStorage.getItem('experience') || '[]');
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  const skills = JSON.parse(localStorage.getItem('skills') || '[]');

  // Update stats
  document.getElementById('experience-count').textContent = experience.length;
  document.getElementById('projects-count').textContent = projects.length;
  document.getElementById('skills-count').textContent = skills.length;

  // Display recent experience
  const recentExperienceEl = document.getElementById('recent-experience');
  if (recentExperienceEl) {
    if (experience.length > 0) {
      recentExperienceEl.innerHTML = experience.slice(0, 3).map(exp => `
        <div class="data-item">
          <h5>${exp.title}</h5>
          <p>${exp.company} | ${exp.period}</p>
        </div>
      `).join('');
    } else {
      recentExperienceEl.innerHTML = '<p>Belum ada data pengalaman</p>';
    }
  }

  // Display recent projects
  const recentProjectsEl = document.getElementById('recent-projects');
  if (recentProjectsEl) {
    if (projects.length > 0) {
      recentProjectsEl.innerHTML = projects.slice(0, 3).map(proj => `
        <div class="data-item">
          <h5>${proj.title}</h5>
          <p>${proj.tags.join(', ')}</p>
        </div>
      `).join('');
    } else {
      recentProjectsEl.innerHTML = '<p>Belum ada data proyek</p>';
    }
  }

  // Display skills
  const skillsListEl = document.getElementById('skills-list');
  if (skillsListEl) {
    if (skills.length > 0) {
      skillsListEl.innerHTML = skills.map(skill => `
        <div class="data-item">
          <h5><i class="${skill.icon}"></i> ${skill.name}</h5>
        </div>
      `).join('');
    } else {
      skillsListEl.innerHTML = '<p>Belum ada data skills</p>';
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeData();
  loadDashboardData();
});
