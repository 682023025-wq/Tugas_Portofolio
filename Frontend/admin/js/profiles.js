// =========================================
// AKUN PAGE LOGIC - Profile & Password Management
// =========================================

const profileForm = document.getElementById('profileForm');
const passwordForm = document.getElementById('passwordForm');
const profilePreview = document.getElementById('profilePreview');
const imageInput = document.getElementById('fotoInput'); // Pastikan ID ini sesuai di HTML
let currentFotoUrl = ''; // Menyimpan URL final (bukan base64 lagi)

// 1. Preview Image Function
function previewImage(input) {
  const previewContainer = document.getElementById('previewContainer');
  const previewImg = document.getElementById('preview-img');
  
  if (!input.files || !input.files[0]) return;
  
  const file = input.files[0];
  if (file.size > 2 * 1024 * 1024) { // Max 2MB
    alert('Ukuran file terlalu besar! Maksimal 2MB.');
    input.value = ''; 
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    // Tampilkan preview sementara
    if (previewImg) previewImg.src = e.target.result;
    if (previewContainer) previewContainer.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

// 2. Load Profile Data
async function loadProfileData() {
  try {
    const response = await ProfileAPI.get();
    const profile = response.data;
    
    if (profile && Object.keys(profile).length > 0) {
      const setValue = (id, val) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.type === 'date' && val) el.value = new Date(val).toISOString().split('T')[0];
        else if (el.type === 'number') el.value = String(val).replace(/\D/g, '');
        else el.value = val || '';
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
      
      // Simpan URL foto lama
      currentFotoUrl = profile.foto_url || '';
      
      // Tampilkan preview foto
      if (currentFotoUrl) {
        const previewContainer = document.getElementById('previewContainer');
        const previewImg = document.getElementById('preview-img');
        if (previewImg) previewImg.src = currentFotoUrl;
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
      <div class="info-item"><span class="info-label">Email:</span><span class="info-value">${display(profile.email)}</span></div>
      <div class="info-item"><span class="info-label">Telepon:</span><span class="info-value">${display(profile.telepon)}</span></div>
      <div class="info-item"><span class="info-label">Univ:</span><span class="info-value">${display(profile.universitas)}</span></div>
      <div class="info-item full-width"><span class="info-label">Alamat:</span><span class="info-value">${display(profile.alamat)}</span></div>
    </div>
  `;
}

// 4. Handle Submit Profile (DENGAN UPLOAD)
if (profileForm) {
    profileForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const submitBtn = profileForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
      
      try {
        let finalImageUrl = currentFotoUrl; // Default pakai URL lama

        // STEP A: Jika ada file baru dipilih, upload ke Cloudinary dulu
        if (imageInput && imageInput.files.length > 0) {
            const formData = new FormData();
            formData.append('file', imageInput.files[0]);
            
            // Panggil endpoint upload backend
            const uploadRes = await fetch('/api/upload/image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: formData
            });
            
            if (!uploadRes.ok) throw new Error('Gagal upload gambar');
            
            const uploadData = await uploadRes.json();
            finalImageUrl = uploadData.url; // Ambil URL dari Cloudinary
        }

        // STEP B: Siapkan data profil
        const profileData = {
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
          foto_url: finalImageUrl // Gunakan URL hasil upload
        };
        
        // STEP C: Simpan ke Database
        await ProfileAPI.update(profileData);
        
        alert('Data berhasil disimpan!');
        loadProfileData(); // Reload data untuk refresh preview
        
      } catch (error) {
        console.error(error);
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