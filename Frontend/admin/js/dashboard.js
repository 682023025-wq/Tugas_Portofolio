// ==========================================
// LOGIKA NAVIGASI DASHBOARD
// ==========================================

const navItems = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('page-title');
const contentArea = document.getElementById('content-area');

if (navItems.length > 0) {
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Jangan jalankan jika ini tombol logout
            if (this.classList.contains('logout-btn')) return;
            
            e.preventDefault();
            
            // Hapus class active dari semua item
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Tambahkan class active ke item yang diklik
            this.classList.add('active');
            
            // Update judul halaman berdasarkan teks link
            const menuText = this.textContent.trim();
            if (pageTitle) {
                pageTitle.textContent = menuText;
            }
            
            // TODO: Di sini nanti kita load konten berbeda 
            // berdasarkan menu yang dipilih (via AJAX atau Flask routing)
            console.log(`Menu aktif: ${menuText}`);
        });
    });
}