// =========================================
// AKUN PAGE LOGIC - Profile & Password Management
// =========================================

const profileForm = document.getElementById('profileForm');
const passwordForm = document.getElementById('passwordForm');
const profilePreview = document.getElementById('profilePreview');
let currentFotoBase64 = ''; 

// 1. Preview Image Function
function previewImage(input) {
  const previewContainer = document.getElementById('previewContainer');
  const previewImg = document.getElementById('preview-img');
  
  if (!input.files || !input.files[0]) return;
  
  const file = input.files[0];
  if (file.size > 500 * 1024) {
    alert('Ukuran file terlalu besar! Maksimal 500KB.');
    input.value = ''; 
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    currentFotoBase64 = e.target.result;
    if (previewImg) previewImg.src = currentFotoBase64;
    if (previewContainer) previewContainer.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

// 2. Load Profile Data (FIXED DATE & SEMESTER)
async function loadProfileData() {
  try {
    const response = await ProfileAPI.get();
    const profile = response.data;
    
    if (profile && Object.keys(profile).length > 0) {
      // Helper setValue yang cerdas
      const setValue = (id, val) => {
        const el = document.getElementById(id);
        if (!el) return;

        if (el.type === 'date') {
            // Fix: Konversi ke YYYY-MM-DD agar diterima input HTML
            if (val) el.value = new Date(val).toISOString().split('T')[0];
        } else if (el.type === 'number') {
            // Fix: Ambil angka saja dari "Semester 7" -> "7"
            el.value = String(val).replace(/\D/g, '');
        } else {
            el.value = val || '';
        }
      };

      setValue('namaLengkap', profile.nama_lengkap);
      setValue('namaPanggilan', profile.nama_panggilan);
      setValue('tempatLahir', profile.tempat_lahir);
      setValue('tanggalLahir', profile.tanggal_lahir);
      setValue('email', profile.email);
      setValue('telepon', profile.telepon);
      setValue('universitas', profile.universitas);
      setValue('fakultas', profile.fakultas);
      setValue('programStudi', profile.prodi);
      setValue('semester', profile.semester);
      setValue('alamat', profile.alamat);
      
      // Handle Foto
      if (profile.foto_url) {
        currentFotoBase64 = profile.foto_url;
        const previewContainer = document.getElementById('previewContainer');
        const previewImg = document.getElementById('preview-img');
        if (previewImg) previewImg.src = profile.foto_url;
        if (previewContainer) previewContainer.style.display = 'block';
      }
      
      showProfilePreview(profile);
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }
}

// 3. Show Profile Preview
function showProfilePreview(profile) {
  if (!profilePreview) return;
  if (!profile || Object.keys(profile).length === 0) {
    profilePreview.innerHTML = '<p class="empty-state">Belum ada data</p>';
    return;
  }
  
  const fotoDisplay = profile.foto_url 
    ? `<img src="${profile.foto_url}" class="profile-preview-img" />`
    : `<div class="profile-placeholder"><i class="fas fa-user"></i></div>`;
  
  const display = (val) => val ? escapeHtml(val) : '-';

  profilePreview.innerHTML = `
    <div class="profile-header-preview">${fotoDisplay}</div>
    <div class="profile-details-grid">
      <div class="info-item"><span class="info-label">Nama:</span><span class="info-value">${display(profile.nama_lengkap)}</span></div>
      <div class="info-item"><span class="info-label">Panggilan:</span><span class="info-value">${display(profile.nama_panggilan)}</span></div>
      <div class="info-item"><span class="info-label">Email:</span><span class="info-value">${display(profile.email)}</span></div>
      <div class="info-item"><span class="info-label">Telepon:</span><span class="info-value">${display(profile.telepon)}</span></div>
      <div class="info-item"><span class="info-label">Univ:</span><span class="info-value">${display(profile.universitas)}</span></div>
      <div class="info-item"><span class="info-label">Prodi:</span><span class="info-value">${display(profile.prodi)}</span></div>
      <div class="info-item full-width"><span class="info-label">Alamat:</span><span class="info-value">${display(profile.alamat)}</span></div>
    </div>
  `;
}

// 4. Handle Submit Profile
if (profileForm) {
    profileForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const submitBtn = profileForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
      
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
        alert('Data berhasil disimpan!');
        showProfilePreview(profile);
      } catch (error) {
        alert(`Gagal menyimpan: ${error.message}`);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
}

// 5. Handle Password Change
if (passwordForm) {
    passwordForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const newPass = document.getElementById('newPassword').value;
      const confirmPass = document.getElementById('confirmPassword').value;
      
      if (newPass !== confirmPass) return alert('Password tidak cocok!');
      
      try {
        await AkunAPI.changePassword(document.getElementById('currentPassword').value, newPass);
        alert('Password diubah! Silakan login ulang.');
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
      } catch (error) {
        alert(error.message);
      }
    });
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);
}

document.addEventListener('DOMContentLoaded', loadProfileData);