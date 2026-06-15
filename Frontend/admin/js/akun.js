// =========================================
// AKUN PAGE LOGIC
// =========================================

const passwordForm = document.getElementById('passwordForm');

// Handle password change form
passwordForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  // Simple validation (in real app, this would check against backend)
  if (currentPassword === 'admin123') {
    if (newPassword === confirmPassword) {
      if (newPassword.length >= 6) {
        alert('Password berhasil diubah! Silakan login ulang dengan password baru.');
        passwordForm.reset();
        // In real app, redirect to login or update session
      } else {
        alert('Password baru minimal 6 karakter!');
      }
    } else {
      alert('Konfirmasi password tidak cocok!');
    }
  } else {
    alert('Password saat ini salah!');
  }
});

// Display last login time
document.addEventListener('DOMContentLoaded', function() {
  const lastLoginEl = document.getElementById('lastLogin');
  const now = new Date();
  const formattedDate = now.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  lastLoginEl.textContent = formattedDate;
});
