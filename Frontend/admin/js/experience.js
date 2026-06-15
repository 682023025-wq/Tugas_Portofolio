// =========================================
// EXPERIENCE PAGE LOGIC - CRUD Operations
// =========================================

const experienceForm = document.getElementById('experienceForm');
const experienceListEl = document.getElementById('experienceList');
const cancelBtn = document.getElementById('cancelBtn');

let isEditing = false;

// Load experience data from localStorage
function loadExperience() {
  const experience = JSON.parse(localStorage.getItem('experience') || '[]');
  
  if (experience.length === 0) {
    experienceListEl.innerHTML = '<p style="color: var(--text-gray);">Belum ada data pengalaman</p>';
    return;
  }
  
  experienceListEl.innerHTML = experience.map((exp, index) => `
    <div class="data-card" data-index="${index}">
      <div class="data-card-header">
        <div>
          <h4>${exp.title}</h4>
          <p>${exp.company} | ${exp.period}</p>
        </div>
      </div>
      <div class="data-card-body">
        ${exp.description}
      </div>
      <div class="data-card-actions">
        <button class="btn btn-sm btn-edit" onclick="editExperience(${index})">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-sm btn-delete" onclick="deleteExperience(${index})">
          <i class="fas fa-trash"></i> Hapus
        </button>
      </div>
    </div>
  `).join('');
}

// Save experience (add or update)
experienceForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const id = document.getElementById('expId').value;
  const period = document.getElementById('expPeriod').value;
  const title = document.getElementById('expTitle').value;
  const company = document.getElementById('expCompany').value;
  const description = document.getElementById('expDescription').value;
  
  const experience = JSON.parse(localStorage.getItem('experience') || '[]');
  
  if (isEditing && id) {
    // Update existing
    const index = parseInt(id);
    experience[index] = { id: index + 1, period, title, company, description };
  } else {
    // Add new
    const newExp = {
      id: Date.now(),
      period,
      title,
      company,
      description
    };
    experience.push(newExp);
  }
  
  localStorage.setItem('experience', JSON.stringify(experience));
  resetForm();
  loadExperience();
  
  // Update dashboard
  alert(isEditing ? 'Pengalaman berhasil diperbarui!' : 'Pengalaman berhasil ditambahkan!');
});

// Edit experience
window.editExperience = function(index) {
  const experience = JSON.parse(localStorage.getItem('experience') || '[]');
  const exp = experience[index];
  
  document.getElementById('expId').value = index;
  document.getElementById('expPeriod').value = exp.period;
  document.getElementById('expTitle').value = exp.title;
  document.getElementById('expCompany').value = exp.company;
  document.getElementById('expDescription').value = exp.description;
  
  isEditing = true;
  document.getElementById('saveBtn').innerHTML = '<i class="fas fa-sync"></i> Update';
  cancelBtn.style.display = 'inline-flex';
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Delete experience
window.deleteExperience = function(index) {
  if (!confirm('Apakah Anda yakin ingin menghapus pengalaman ini?')) return;
  
  const experience = JSON.parse(localStorage.getItem('experience') || '[]');
  experience.splice(index, 1);
  localStorage.setItem('experience', JSON.stringify(experience));
  loadExperience();
};

// Cancel edit
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  experienceForm.reset();
  document.getElementById('expId').value = '';
  isEditing = false;
  document.getElementById('saveBtn').innerHTML = '<i class="fas fa-save"></i> Simpan';
  cancelBtn.style.display = 'none';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadExperience();
});
