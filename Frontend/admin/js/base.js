// =========================================
// BASE JS - Shared Authentication Logic
// =========================================

// Cek apakah user sudah login
async function checkAuth() {
  // Ambil token (cek localStorage dulu, fallback ke sessionStorage)
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('auth_token');
  const currentPage = window.location.pathname;
  
  // Jangan redirect jika sedang di halaman login
  if (currentPage.includes('login.html') || currentPage.includes('index.html')) {
    return;
  }
  
  if (!token) {
    window.location.href = 'login.html';
    return;
  }
  
  // Opsional: Verifikasi token ke backend (jika AuthAPI sudah didefinisikan di api.js)
  try {
    if (typeof AuthAPI !== 'undefined') {
        const response = await AuthAPI.checkAuth();
        if (!response.authenticated) {
            throw new Error('Token invalid');
        }
    }
  } catch (error) {
    console.warn('Auth check failed:', error);
    // Jika gagal verifikasi, hapus token dan redirect
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    window.location.href = 'login.html';
  }
}

// Panggil checkAuth saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
  checkAuth();
});