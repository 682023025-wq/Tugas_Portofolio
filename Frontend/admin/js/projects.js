// =========================================
// PROJECTS PAGE LOGIC - CRUD Operations
// =========================================

const projectForm = document.getElementById('projectForm');
const projectListEl = document.getElementById('projectList');
const cancelBtn = document.getElementById('cancelBtn');

let isEditing = false;

// Load projects data from localStorage
function loadProjects() {
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  
  if (projects.length === 0) {
    projectListEl.innerHTML = '<p style="color: var(--text-gray);">Belum ada data proyek</p>';
    return;
  }
  
  projectListEl.innerHTML = projects.map((proj, index) => `
    <div class="data-card" data-index="${index}">
      <div class="data-card-header">
        <h4>${proj.title}</h4>
      </div>
      <div class="data-card-body">
        ${proj.description}
      </div>
      <div class="data-card-tags">
        ${proj.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <div class="data-card-actions">
        <button class="btn btn-sm btn-edit" onclick="editProject(${index})">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-sm btn-delete" onclick="deleteProject(${index})">
          <i class="fas fa-trash"></i> Hapus
        </button>
      </div>
    </div>
  `).join('');
}

// Save project (add or update)
projectForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const id = document.getElementById('projId').value;
  const title = document.getElementById('projTitle').value;
  const description = document.getElementById('projDescription').value;
  const tagsInput = document.getElementById('projTags').value;
  const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t);
  
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  
  if (isEditing && id) {
    // Update existing
    const index = parseInt(id);
    projects[index] = { id: index + 1, title, description, tags };
  } else {
    // Add new
    const newProj = {
      id: Date.now(),
      title,
      description,
      tags
    };
    projects.push(newProj);
  }
  
  localStorage.setItem('projects', JSON.stringify(projects));
  resetForm();
  loadProjects();
  
  alert(isEditing ? 'Proyek berhasil diperbarui!' : 'Proyek berhasil ditambahkan!');
});

// Edit project
window.editProject = function(index) {
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  const proj = projects[index];
  
  document.getElementById('projId').value = index;
  document.getElementById('projTitle').value = proj.title;
  document.getElementById('projDescription').value = proj.description;
  document.getElementById('projTags').value = proj.tags.join(', ');
  
  isEditing = true;
  document.getElementById('saveBtn').innerHTML = '<i class="fas fa-sync"></i> Update';
  cancelBtn.style.display = 'inline-flex';
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Delete project
window.deleteProject = function(index) {
  if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return;
  
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  projects.splice(index, 1);
  localStorage.setItem('projects', JSON.stringify(projects));
  loadProjects();
};

// Cancel edit
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  projectForm.reset();
  document.getElementById('projId').value = '';
  isEditing = false;
  document.getElementById('saveBtn').innerHTML = '<i class="fas fa-save"></i> Simpan';
  cancelBtn.style.display = 'none';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadProjects();
});
