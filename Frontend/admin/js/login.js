// ==========================================
// LOGIKA KHUSUS HALAMAN LOGIN
// ==========================================

const loginForm = document.getElementById('loginForm');
const togglePasswordBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const eyeOpen = document.getElementById('eye-open');
const eyeClosed = document.getElementById('eye-closed');

// 1. Fitur Lihat/Sembunyikan Password (Menggunakan SVG)
if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle tampilan antara mata terbuka dan tertutup
        if (type === 'text') {
            eyeOpen.style.display = 'none';
            eyeClosed.style.display = 'block';
        } else {
            eyeOpen.style.display = 'block';
            eyeClosed.style.display = 'none';
        }
    });
}

// 2. Simulasi Proses Login
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMessage');

        if (username === 'admin' && password === 'admin123') {
            alert('Login berhasil! Mengalihkan ke dashboard...');
            // window.location.href = 'dashboard.html'; 
        } else {
            errorMsg.textContent = 'Username atau password salah. Silakan coba lagi.';
            errorMsg.style.display = 'block';
            
            setTimeout(() => {
                errorMsg.style.display = 'none';
            }, 3000);
        }
    });
}