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

// 2. Proses Login dengan API Backend
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault(); 
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMessage');
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        // Disable button during request
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        }

        try {
            // Call backend API
            const response = await AuthAPI.login(username, password);
            
            // Save token to localStorage
            setAuthToken(response.token);
            
            alert('Login berhasil! Mengalihkan ke dashboard...');
            window.location.href = 'dashboard.html';
        } catch (error) {
            errorMsg.textContent = error.message || 'Username atau password salah. Silakan coba lagi.';
            errorMsg.style.display = 'block';
            
            setTimeout(() => {
                errorMsg.style.display = 'none';
            }, 3000);
        } finally {
            // Re-enable button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            }
        }
    });
}