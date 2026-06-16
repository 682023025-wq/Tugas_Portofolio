// =========================================
// AKUN PAGE LOGIC - Connected to Backend API
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

// Load profile data from Backend API
async function loadProfileData() {
  try {
    const response = await ProfileAPI.get();
    const profile = response.data;
    
    if (profile && Object.keys(profile).length > 0) {
      // Fill form fields
      document.getElementById('namaLengkap').value = profile.nama_lengkap || '';
      document.getElementById('namaPanggilan').value = profile.nama_panggilan || '';
      document.getElementById('tempatLahir').value = profile.tempat_lahir || '';
      document.getElementById('tanggalLahir').value = profile.tanggal_lahir || '';
      document.getElementById('email').value = profile.email || '';
      document.getElementById('telepon').value = profile.telepon || '';
      document.getElementById('universitas').value = profile.universitas || '';
      document.getElementById('fakultas').value = profile.fakultas || '';
      document.getElementById('programStudi').value = profile.prodi || '';
      document.getElementById('semester').value = profile.semester || '';
      document.getElementById('alamat').value = profile.alamat || '';
      
      // Handle foto (could be base64 or URL)
      if (profile.foto_url && profile.foto_url.startsWith('data:image')) {
        currentFotoBase64 = profile.foto_url;
        const previewContainer = document.getElementById('previewContainer');
        const previewImg = document.getElementById('preview-img');
        previewImg.src = currentFotoBase64;
        previewContainer.style.display = 'block';
      } else if (profile.foto_url) {
        // For backward compatibility with URL
        currentFotoBase64 = profile.foto_url;
      }
      
      // Show preview
      showProfilePreview(profile);
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    profilePreview.innerHTML = `<p style="color: red;">Gagal memuat data: ${error.message}</p>`;
  }
}

// Show profile preview
function showProfilePreview(profile) {
  if (!profile || Object.keys(profile).length === 0) {
    profilePreview.innerHTML = '<p style="color: var(--text-gray); text-align: center;">Belum ada data yang disimpan</p>';
    return;
  }
  
  const fotoDisplay = profile.foto_url 
    ? `<img src="${profile.foto_url}" alt="Foto Profil" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem;" />`
    : '<div style="width: 150px; height: 150px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 3rem; color: #94a3b8;"><i class="fas fa-user"></i></div>';
  
  profilePreview.innerHTML = `
    <div style="text-align: center;">
      ${fotoDisplay}
    </div>
    <div class="info-item">
      <span class="info-label">Nama Lengkap:</span>
      <span class="info-value">${profile.nama_lengkap || '-'}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Nama Panggilan:</span>
      <span class="info-value">${profile.nama_panggilan || '-'}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Tempat, Tanggal Lahir:</span>
      <span class="info-value">${profile.tempat_lahir || ''}${profile.tanggal_lahir ? ', ' + new Date(profile.tanggal_lahir).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
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
      <span class="info-value">${profile.prodi || '-'}</span>
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
profileForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const submitBtn = profileForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
  
  try {
    const profile = {
      nama_lengkap: document.getElementById('namaLengkap').value,
      nama_panggilan: document.getElementById('namaPanggilan').value,
      tempat_lahir: document.getElementById('tempatLahir').value,
      tanggal_lahir: document.getElementById('tanggalLahir').value,
      email: document.getElementById('email').value,
      telepon: document.getElementById('telepon').value,
      universitas: document.getElementById('universitas').value,
      fakultas: document.getElementById('fakultas').value,
      prodi: document.getElementById('programStudi').value,
      semester: document.getElementById('semester').value,
      alamat: document.getElementById('alamat').value,
      foto_url: currentFotoBase64
    };
    
    await ProfileAPI.update(profile);
    showProfilePreview(profile);
    alert('Data diri berhasil disimpan!');
  } catch (error) {
    console.error('Error saving profile:', error);
    alert(`Gagal menyimpan: ${error.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Simpan';
  }
});

// Handle password change form
passwordForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  const submitBtn = passwordForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
  
  try {
    if (newPassword !== confirmPassword) {
      throw new Error('Konfirmasi password tidak cocok!');
    }
    
    if (newPassword.length < 6) {
      throw new Error('Password baru minimal 6 karakter!');
    }
    
    await AkunAPI.changePassword(currentPassword, newPassword);
    alert('Password berhasil diubah! Silakan login ulang dengan password baru.');
    passwordForm.reset();
    
    // Clear token and redirect to login
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Error changing password:', error);
    alert(error.message || 'Gagal mengubah password');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-key"></i> Ubah Password';
  }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadProfileData();
});
