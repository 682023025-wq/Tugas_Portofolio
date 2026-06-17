// =========================================
// PROJECTS PAGE LOGIC - With Cloudinary Upload
// =========================================

const projectForm = document.getElementById('projectForm');
const projectListEl = document.getElementById('projectList');
const cancelBtn = document.getElementById('cancelBtn');
const imageInput = document.getElementById('projImageFile');
const imagePreview = document.getElementById('imagePreview');
const previewContainer = document.getElementById('previewContainer');

let isEditing = false;
let editingId = null;
let currentImageUrl = ''; // Menyimpan URL gambar lama saat edit

// 1. Handle Preview Gambar Saat File Dipilih
if (imageInput) {
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                previewContainer.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });
}

// 2. Load Data Projects
async function loadProjects() {
  try {
    const response = await ProjectsAPI.getAll();
    const projects = response.data || [];
    
    if (projects.length === 0) {
      projectListEl.innerHTML = '<p class="empty-state">Belum ada data proyek</p>';
      return;
    }
    
    projectListEl.innerHTML = projects.map((proj) => `
      <div class="data-card">
        ${proj.gambar_url 
            ? `<img src="${proj.gambar_url}" class="card-img" alt="${proj.judul}">` 
            : `<div class="card-img-placeholder"><i class="fas fa-image"></i></div>`}
        
        <div class="card-body">
          <h4>${escapeHtml(proj.judul)}</h4>
          <p>${escapeHtml(proj.deskripsi?.substring(0, 100))}...</p>
        </div>
        
        <div class="card-actions">
          ${proj.link_project ? `<a href="${proj.link_project}" target="_blank" class="btn btn-sm" style="background:#333; color:white;"><i class="fab fa-github"></i> Link</a>` : ''}
          <button class="btn btn-sm btn-edit" onclick="editProject(${proj.id})">Edit</button>
          <button class="btn btn-sm btn-delete" onclick="deleteProject(${proj.id})">Hapus</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error(error);
    projectListEl.innerHTML = `<p class="error-msg">Gagal memuat data: ${error.message}</p>`;
  }
}

// 3. Handle Submit Form (Upload + Save)
if (projectForm) {
    projectForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const title = document.getElementById('projTitle').value;
      const description = document.getElementById('projDescription').value;
      const projectLink = document.getElementById('projLink').value;
      const fileToUpload = imageInput.files[0];
      
      const submitBtn = document.getElementById('saveBtn');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
      
      try {
        let finalImageUrl = currentImageUrl; // Default pakai URL lama

        // STEP A: Jika ada file baru, upload ke Cloudinary dulu
        if (fileToUpload) {
            const formData = new FormData();
            formData.append('file', fileToUpload);
            
            // Panggil endpoint upload backend
            const uploadRes = await fetch('/api/upload/image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Kirim token juga
                },
                body: formData
            });
            
            if (!uploadRes.ok) throw new Error('Gagal upload gambar ke server');
            
            const uploadData = await uploadRes.json();
            finalImageUrl = uploadData.url; // Ambil URL dari Cloudinary
        }

        // STEP B: Simpan data project ke Database
        const data = {
          judul: title,
          deskripsi: description,
          gambar_url: finalImageUrl,
          link_project: projectLink || null
        };
        
        if (isEditing && editingId) {
          await ProjectsAPI.update(editingId, data);
          alert('Proyek berhasil diperbarui!');
        } else {
          await ProjectsAPI.create(data);
          alert('Proyek berhasil ditambahkan!');
        }
        
        resetForm();
        loadProjects();
      } catch (error) {
        console.error(error);
        alert(`Error: ${error.message}`);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
}

// 4. Edit Project
window.editProject = async function(id) {
  try {
    const response = await ProjectsAPI.getById(id);
    const proj = response.data;
    
    document.getElementById('projId').value = id;
    document.getElementById('projTitle').value = proj.judul;
    document.getElementById('projDescription').value = proj.deskripsi;
    document.getElementById('projLink').value = proj.link_project || '';
    
    // Set state gambar
    currentImageUrl = proj.gambar_url || '';
    if (currentImageUrl) {
        imagePreview.src = currentImageUrl;
        previewContainer.style.display = 'block';
    } else {
        imagePreview.src = '';
        previewContainer.style.display = 'none';
    }
    
    isEditing = true;
    editingId = id;
    document.getElementById('saveBtn').innerHTML = '<i class="fas fa-sync"></i> Update';
    if (cancelBtn) cancelBtn.style.display = 'inline-flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    alert(`Gagal memuat data: ${error.message}`);
  }
};

// 5. Delete Project
window.deleteProject = async function(id) {
  if (!confirm('Yakin ingin menghapus proyek ini?')) return;
  try {
    await ProjectsAPI.delete(id);
    loadProjects();
  } catch (error) { alert(error.message); }
};

// 6. Reset & Helper
if (cancelBtn) cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  if (projectForm) projectForm.reset();
  document.getElementById('projId').value = '';
  previewContainer.style.display = 'none';
  imagePreview.src = '';
  currentImageUrl = '';
  isEditing = false;
  editingId = null;
  document.getElementById('saveBtn').innerHTML = '<i class="fas fa-save"></i> Simpan';
  if (cancelBtn) cancelBtn.style.display = 'none';
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);
}

document.addEventListener('DOMContentLoaded', loadProjects);