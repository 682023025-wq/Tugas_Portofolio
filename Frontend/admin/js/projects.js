// =========================================
// PROJECTS PAGE LOGIC - CRUD Operations with Backend API
// =========================================

const projectForm = document.getElementById('projectForm');
const projectListEl = document.getElementById('projectList');
const cancelBtn = document.getElementById('cancelBtn');

let isEditing = false;
let editingId = null;

// Load projects data from Backend API
async function loadProjects() {
  try {
    const response = await ProjectsAPI.getAll();
    const projects = response.data || [];
    
    if (projects.length === 0) {
      projectListEl.innerHTML = '<p style="color: var(--text-gray);">Belum ada data proyek</p>';
      return;
    }
    
    projectListEl.innerHTML = projects.map((proj) => `
      <div class="data-card" data-id="${proj.id}">
        <div class="data-card-header">
          <h4>${proj.judul}</h4>
        </div>
        <div class="data-card-body">
          ${proj.deskripsi}
        </div>
        <div class="data-card-tags">
          ${proj.tags ? proj.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('') : ''}
        </div>
        <div class="data-card-actions">
          <button class="btn btn-sm btn-edit" onclick="editProject(${proj.id})">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-sm btn-delete" onclick="deleteProject(${proj.id})">
            <i class="fas fa-trash"></i> Hapus
          </button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading projects:', error);
    projectListEl.innerHTML = `<p style="color: red;">Gagal memuat data: ${error.message}</p>`;
  }
}

// Save project (add or update)
projectForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const title = document.getElementById('projTitle').value;
  const description = document.getElementById('projDescription').value;
  const tagsInput = document.getElementById('projTags').value;
  const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t).join(',');
  
  const submitBtn = document.getElementById('saveBtn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
  
  try {
    const data = {
      judul: title,
      deskripsi: description,
      tags: tags
    };
    
    if (isEditing && editingId) {
      // Update existing
      await ProjectsAPI.update(editingId, data);
      alert('Proyek berhasil diperbarui!');
    } else {
      // Add new
      await ProjectsAPI.create(data);
      alert('Proyek berhasil ditambahkan!');
    }
    
    resetForm();
    loadProjects();
  } catch (error) {
    console.error('Error saving project:', error);
    alert(`Gagal menyimpan: ${error.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Simpan';
  }
});

// Edit project
window.editProject = async function(id) {
  try {
    const response = await ProjectsAPI.getById(id);
    const proj = response.data;
    
    document.getElementById('projId').value = id;
    document.getElementById('projTitle').value = proj.judul;
    document.getElementById('projDescription').value = proj.deskripsi;
    document.getElementById('projTags').value = proj.tags || '';
    
    isEditing = true;
    editingId = id;
    document.getElementById('saveBtn').innerHTML = '<i class="fas fa-sync"></i> Update';
    cancelBtn.style.display = 'inline-flex';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error('Error loading project for edit:', error);
    alert(`Gagal memuat data: ${error.message}`);
  }
};

// Delete project
window.deleteProject = async function(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return;
  
  try {
    await ProjectsAPI.delete(id);
    alert('Proyek berhasil dihapus!');
    loadProjects();
  } catch (error) {
    console.error('Error deleting project:', error);
    alert(`Gagal menghapus: ${error.message}`);
  }
};

// Cancel edit
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  projectForm.reset();
  document.getElementById('projId').value = '';
  isEditing = false;
  editingId = null;
  document.getElementById('saveBtn').innerHTML = '<i class="fas fa-save"></i> Simpan';
  cancelBtn.style.display = 'none';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadProjects();
});
