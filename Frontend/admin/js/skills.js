// =========================================
// SKILLS PAGE LOGIC - CRUD Operations
// NOTE: Menggunakan SkillsAPI dari api.js
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
    
    if (!skillListEl) return; // Safety check

    if (skills.length === 0) {
      skillListEl.innerHTML = '<p class="empty-state">Belum ada data skills</p>';
      return;
    }
    
    skillListEl.innerHTML = skills.map((skill) => `
      <div class="skill-card" data-id="${skill.id}">
        <div class="skill-icon-wrapper">
          <i class="${skill.icon_class || 'fas fa-code'}"></i>
        </div>
        <h4>${escapeHtml(skill.nama_skill)}</h4>
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
    if (skillListEl) {
        skillListEl.innerHTML = `<p class="error-msg">Gagal memuat data: ${error.message}</p>`;
    }
  }
}

// Save skill (add or update)
if (skillForm) {
    skillForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const name = document.getElementById('skillName').value;
      const icon = document.getElementById('skillIcon').value;
      
      const submitBtn = document.getElementById('saveBtn');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
      
      try {
        const data = {
          nama_skill: name,
          icon_class: icon || 'fas fa-code' // Default icon jika kosong
        };
        
        if (isEditing && editingId) {
          await SkillsAPI.update(editingId, data);
          alert('Skill berhasil diperbarui!');
        } else {
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
        submitBtn.innerHTML = originalText;
      }
    });
}

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
    
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) saveBtn.innerHTML = '<i class="fas fa-sync"></i> Update';
    
    if (cancelBtn) cancelBtn.style.display = 'inline-flex';
    
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
if (cancelBtn) {
    cancelBtn.addEventListener('click', resetForm);
}

function resetForm() {
  if (skillForm) skillForm.reset();
  
  const idField = document.getElementById('skillId');
  if (idField) idField.value = '';
  
  isEditing = false;
  editingId = null;
  
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) saveBtn.innerHTML = '<i class="fas fa-save"></i> Simpan';
  
  if (cancelBtn) cancelBtn.style.display = 'none';
}

// Helper keamanan XSS
function escapeHtml(text) {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadSkills();
});