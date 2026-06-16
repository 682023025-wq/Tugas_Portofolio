// =========================================
// SKILLS PAGE LOGIC - CRUD Operations with Backend API
// =========================================

const skillForm = document.getElementById('skillForm');
const skillListEl = document.getElementById('skillList');
const cancelBtn = document.getElementById('cancelBtn');

let isEditing = false;
let editingId = null;

// Load skills data from Backend API
async function loadSkills() {
  try {
    const response = await SkillsAPI.getAll();
    const skills = response.data || [];
    
    if (skills.length === 0) {
      skillListEl.innerHTML = '<p style="color: var(--text-gray);">Belum ada data skills</p>';
      return;
    }
    
    skillListEl.innerHTML = skills.map((skill) => `
      <div class="skill-card" data-id="${skill.id}">
        <i class="${skill.icon_class || 'fas fa-code'}"></i>
        <h4>${skill.nama_skill}</h4>
        <div class="skill-card-actions">
          <button class="btn btn-sm btn-edit" onclick="editSkill(${skill.id})">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-sm btn-delete" onclick="deleteSkill(${skill.id})">
            <i class="fas fa-trash"></i> Hapus
          </button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading skills:', error);
    skillListEl.innerHTML = `<p style="color: red;">Gagal memuat data: ${error.message}</p>`;
  }
}

// Save skill (add or update)
skillForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const name = document.getElementById('skillName').value;
  const icon = document.getElementById('skillIcon').value;
  
  const submitBtn = document.getElementById('saveBtn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
  
  try {
    const data = {
      nama_skill: name,
      icon_class: icon
    };
    
    if (isEditing && editingId) {
      // Update existing
      await SkillsAPI.update(editingId, data);
      alert('Skill berhasil diperbarui!');
    } else {
      // Add new
      await SkillsAPI.create(data);
      alert('Skill berhasil ditambahkan!');
    }
    
    resetForm();
    loadSkills();
  } catch (error) {
    console.error('Error saving skill:', error);
    alert(`Gagal menyimpan: ${error.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Simpan';
  }
});

// Edit skill
window.editSkill = async function(id) {
  try {
    const response = await SkillsAPI.getById(id);
    const skill = response.data;
    
    document.getElementById('skillId').value = id;
    document.getElementById('skillName').value = skill.nama_skill;
    document.getElementById('skillIcon').value = skill.icon_class || '';
    
    isEditing = true;
    editingId = id;
    document.getElementById('saveBtn').innerHTML = '<i class="fas fa-sync"></i> Update';
    cancelBtn.style.display = 'inline-flex';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error('Error loading skill for edit:', error);
    alert(`Gagal memuat data: ${error.message}`);
  }
};

// Delete skill
window.deleteSkill = async function(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus skill ini?')) return;
  
  try {
    await SkillsAPI.delete(id);
    alert('Skill berhasil dihapus!');
    loadSkills();
  } catch (error) {
    console.error('Error deleting skill:', error);
    alert(`Gagal menghapus: ${error.message}`);
  }
};

// Cancel edit
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  skillForm.reset();
  document.getElementById('skillId').value = '';
  isEditing = false;
  editingId = null;
  document.getElementById('saveBtn').innerHTML = '<i class="fas fa-save"></i> Simpan';
  cancelBtn.style.display = 'none';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadSkills();
});
