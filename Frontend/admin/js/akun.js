// =========================================
// AKUN PAGE LOGIC
// =========================================

const profileForm = document.getElementById('profileForm');
const passwordForm = document.getElementById('passwordForm');
const profilePreview = document.getElementById('profilePreview');
let currentFotoBase64 = ''; // Store base64 image data

// Preview image function
function previewImage(input) {
  const previewContainer = document.getElementById('previewContainer');
  const previewImg = document.getElementById('preview-img');
  
  if (input.files && input.files[0]) {
    const file = input.files[0];
    
    // Check file size (max 500KB recommended)
    if (file.size > 500 * 1024) {
      alert('Ukuran file terlalu besar! Disarankan maksimal 500KB agar penyimpanan lokal tidak penuh.');
      input.value = ''; // Reset input
      previewContainer.style.display = 'none';
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
      currentFotoBase64 = e.target.result;
      previewImg.src = currentFotoBase64;
      previewContainer.style.display = 'block';
    };
    
    reader.readAsDataURL(file);
  }
}

// Load profile data from localStorage
function loadProfileData() {
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');
  
  if (Object.keys(profile).length > 0) {
    // Fill form fields
    document.getElementById('namaLengkap').value = profile.namaLengkap || '';
    document.getElementById('namaPanggilan').value = profile.namaPanggilan || '';
    document.getElementById('tempatLahir').value = profile.tempatLahir || '';
    document.getElementById('tanggalLahir').value = profile.tanggalLahir || '';
    document.getElementById('email').value = profile.email || '';
    document.getElementById('telepon').value = profile.telepon || '';
    document.getElementById('universitas').value = profile.universitas || '';
    document.getElementById('fakultas').value = profile.fakultas || '';
    document.getElementById('programStudi').value = profile.programStudi || '';
    document.getElementById('semester').value = profile.semester || '';
    document.getElementById('alamat').value = profile.alamat || '';
    
    // Handle foto (could be base64 or URL)
    if (profile.fotoUrl && profile.fotoUrl.startsWith('data:image')) {
      currentFotoBase64 = profile.fotoUrl;
      const previewContainer = document.getElementById('previewContainer');
      const previewImg = document.getElementById('preview-img');
      previewImg.src = currentFotoBase64;
      previewContainer.style.display = 'block';
    } else if (profile.fotoUrl) {
      // For backward compatibility with URL
      currentFotoBase64 = profile.fotoUrl;
    }
    
    // Show preview
    showProfilePreview(profile);
  }
}

// Show profile preview
function showProfilePreview(profile) {
  if (!profile || Object.keys(profile).length === 0) {
    profilePreview.innerHTML = '<p style="color: var(--text-gray); text-align: center;">Belum ada data yang disimpan</p>';
    return;
  }
  
  const fotoDisplay = profile.fotoUrl 
    ? `<img src="${profile.fotoUrl}" alt="Foto Profil" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem;" />`
    : '<div style="width: 150px; height: 150px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 3rem; color: #94a3b8;"><i class="fas fa-user"></i></div>';
  
  profilePreview.innerHTML = `
    <div style="text-align: center;">
      ${fotoDisplay}
    </div>
    <div class="info-item">
      <span class="info-label">Nama Lengkap:</span>
      <span class="info-value">${profile.namaLengkap || '-'}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Nama Panggilan:</span>
      <span class="info-value">${profile.namaPanggilan || '-'}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Tempat, Tanggal Lahir:</span>
      <span class="info-value">${profile.tempatLahir || ''}${profile.tanggalLahir ? ', ' + new Date(profile.tanggalLahir).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Email:</span>
      <span class="info-value">${profile.email || '-'}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Telepon/WA:</span>
      <span class="info-value">${profile.telepon || '-'}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Universitas:</span>
      <span class="info-value">${profile.universitas || '-'}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Fakultas:</span>
      <span class="info-value">${profile.fakultas || '-'}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Program Studi:</span>
      <span class="info-value">${profile.programStudi || '-'}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Semester:</span>
      <span class="info-value">${profile.semester ? 'Semester ' + profile.semester : '-'}</span>
    </div>
    <div class="info-item" style="flex-direction: column; align-items: flex-start;">
      <span class="info-label">Alamat:</span>
      <span class="info-value">${profile.alamat || '-'}</span>
    </div>
  `;
}

// Handle profile form submit
profileForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const profile = {
    namaLengkap: document.getElementById('namaLengkap').value,
    namaPanggilan: document.getElementById('namaPanggilan').value,
    tempatLahir: document.getElementById('tempatLahir').value,
    tanggalLahir: document.getElementById('tanggalLahir').value,
    email: document.getElementById('email').value,
    telepon: document.getElementById('telepon').value,
    universitas: document.getElementById('universitas').value,
    fakultas: document.getElementById('fakultas').value,
    programStudi: document.getElementById('programStudi').value,
    semester: document.getElementById('semester').value,
    alamat: document.getElementById('alamat').value,
    fotoUrl: currentFotoBase64 // Save base64 image data
  };
  
  localStorage.setItem('profile', JSON.stringify(profile));
  showProfilePreview(profile);
  
  alert('Data diri berhasil disimpan!');
});

// Handle password change form
passwordForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  // Get stored password or default
  const storedPassword = localStorage.getItem('adminPassword') || 'admin123';
  
  if (currentPassword === storedPassword) {
    if (newPassword === confirmPassword) {
      if (newPassword.length >= 6) {
        localStorage.setItem('adminPassword', newPassword);
        alert('Password berhasil diubah! Silakan login ulang dengan password baru.');
        passwordForm.reset();
        // Redirect to login
        window.location.href = 'login.html';
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadProfileData();
});
