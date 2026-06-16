// ==========================================
// LOGIKA KHUSUS HALAMAN LOGIN
// ==========================================

const API_BASE = '/api'; // Sesuaikan dengan url_prefix di app.py

// Helper: Simpan token ke localStorage/sessionStorage
function setAuthToken(token) {
    sessionStorage.setItem('auth_token', token); // Gunakan sessionStorage untuk keamanan lebih baik
}

// Helper: AuthAPI wrapper (jika belum ada, buat ini)
const AuthAPI = {
    async login(username, password) {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include' // Penting jika pakai cookie-based auth
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Login gagal');
        }
        
        return await response.json();
    }
};

// 1. Fitur Lihat/Sembunyikan Password
const togglePasswordBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const eyeOpen = document.getElementById('eye-open');
const eyeClosed = document.getElementById('eye-closed');

if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        if (type === 'text') {
            eyeOpen.style.display = 'none';
            eyeClosed.style.display = 'block';
        } else {
            eyeOpen.style.display = 'block';
            eyeClosed.style.display = 'none';
        }
    });
}

// 2. Proses Login dengan API Backend
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault(); 
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMessage');
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        // Validasi client-side dasar
        if (!username || !password) {
            showError(errorMsg, 'Username dan password wajib diisi.');
            return;
        }

        // Disable button during request
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        }

        try {
            const response = await AuthAPI.login(username, password);
            
            // Simpan token DAN role (penting untuk redirect)
            setAuthToken(response.token);
            if (response.role) {
                sessionStorage.setItem('user_role', response.role);
            }
            
            // Redirect berdasarkan role (opsional)
            const redirectUrl = response.role === 'admin' 
                ? 'dashboard.html' 
                : '../index.html';
                
            window.location.href = redirectUrl;
            
        } catch (error) {
            showError(errorMsg, error.message || 'Username atau password salah.');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            }
        }
    });
}

// Helper: Tampilkan error message
function showError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.style.display = 'block';
    
    // Auto-hide setelah 3 detik
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}