// ==========================================
// DASHBOARD NAVIGATION & DYNAMIC LOADER
// ==========================================

const navItems = document.querySelectorAll('.nav-item:not(.logout-btn)');
const pageTitle = document.getElementById('page-title');
const contentArea = document.getElementById('content-area');
const menuCssLink = document.getElementById('menu-css');
const menuJsScript = document.getElementById('menu-js');

// Map menu ke file CSS/JS yang sesuai
const menuFiles = {
    overview: { css: '', js: '' }, // Overview tidak butuh file khusus
    projects: { css: 'Frontend/admin/css/projects.css', js: 'Frontend/admin/js/projects.js' },
    skills: { css: 'Frontend/admin/css/skills.css', js: 'Frontend/admin/js/skills.js' },
    experience: { css: 'Frontend/admin/css/experience.css', js: 'Frontend/admin/js/experience.js' }
};

function loadMenu(menuName) {
    // Update judul
    const menuItem = document.querySelector(`.nav-item[data-menu="${menuName}"]`);
    if (pageTitle && menuItem) {
        pageTitle.textContent = menuItem.textContent.trim();
    }

    // Load CSS & JS dinamis
    if (menuFiles[menuName]) {
        menuCssLink.href = menuFiles[menuName].css || '';
        menuJsScript.src = menuFiles[menuName].js || '';
        
        // Hapus script lama jika ada (untuk mencegah duplikasi event listener)
        const oldScript = document.getElementById('dynamic-menu-js');
        if (oldScript) oldScript.remove();
        
        // Buat script baru dengan ID unik
        if (menuFiles[menuName].js) {
            const newScript = document.createElement('script');
            newScript.id = 'dynamic-menu-js';
            newScript.src = menuFiles[menuName].js;
            document.body.appendChild(newScript);
        }
    }

    // TODO: Nanti ganti ini dengan fetch konten dari Flask API
    // Untuk sekarang, tampilkan placeholder
    contentArea.innerHTML = `<div class="welcome-card"><h3>${menuItem ? menuItem.textContent.trim() : 'Menu'}</h3><p>Konten untuk menu ini akan dimuat dari backend Flask.</p></div>`;
}

// Event Listener untuk Navigasi
if (navItems.length > 0) {
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Load menu
            const menuName = this.getAttribute('data-menu');
            loadMenu(menuName);
        });
    });
}

// Load default menu saat pertama kali dibuka
loadMenu('overview');