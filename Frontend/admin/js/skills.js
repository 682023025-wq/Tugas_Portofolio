// =========================================
// SKILLS PAGE LOGIC - CRUD Operations
// =========================================

const skillForm = document.getElementById('skillForm');
const skillListEl = document.getElementById('skillList');
const cancelBtn = document.getElementById('cancelBtn');

let isEditing = false;

// Load skills data from localStorage
function loadSkills() {
  const skills = JSON.parse(localStorage.getItem('skills') || '[]');
  
  if (skills.length === 0) {
    skillListEl.innerHTML = '<p style="color: var(--text-gray);">Belum ada data skills</p>';
    return;
  }
  
  skillListEl.innerHTML = skills.map((skill, index) => `
    <div class="skill-card" data-index="${index}">
      <i class="${skill.icon}"></i>
      <h4>${skill.name}</h4>
      <div class="skill-card-actions">
        <button class="btn btn-sm btn-edit" onclick="editSkill(${index})">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-sm btn-delete" onclick="deleteSkill(${index})">
          <i class="fas fa-trash"></i> Hapus
        </button>
      </div>
    </div>
  `).join('');
}

// Save skill (add or update)
skillForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const id = document.getElementById('skillId').value;
  const name = document.getElementById('skillName').value;
  const icon = document.getElementById('skillIcon').value;
  
  const skills = JSON.parse(localStorage.getItem('skills') || '[]');
  
  if (isEditing && id) {
    // Update existing
    const index = parseInt(id);
    skills[index] = { id: index + 1, name, icon };
  } else {
    // Add new
    const newSkill = {
      id: Date.now(),
      name,
      icon
    };
    skills.push(newSkill);
  }
  
  localStorage.setItem('skills', JSON.stringify(skills));
  resetForm();
  loadSkills();
  
  alert(isEditing ? 'Skill berhasil diperbarui!' : 'Skill berhasil ditambahkan!');
});

// Edit skill
window.editSkill = function(index) {
  const skills = JSON.parse(localStorage.getItem('skills') || '[]');
  const skill = skills[index];
  
  document.getElementById('skillId').value = index;
  document.getElementById('skillName').value = skill.name;
  document.getElementById('skillIcon').value = skill.icon;
  
  isEditing = true;
  document.getElementById('saveBtn').innerHTML = '<i class="fas fa-sync"></i> Update';
  cancelBtn.style.display = 'inline-flex';
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Delete skill
window.deleteSkill = function(index) {
  if (!confirm('Apakah Anda yakin ingin menghapus skill ini?')) return;
  
  const skills = JSON.parse(localStorage.getItem('skills') || '[]');
  skills.splice(index, 1);
  localStorage.setItem('skills', JSON.stringify(skills));
  loadSkills();
};

// Cancel edit
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  skillForm.reset();
  document.getElementById('skillId').value = '';
  isEditing = false;
  document.getElementById('saveBtn').innerHTML = '<i class="fas fa-save"></i> Simpan';
  cancelBtn.style.display = 'none';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadSkills();
});
