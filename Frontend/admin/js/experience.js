// =========================================
// EXPERIENCE PAGE LOGIC - CRUD Operations with Backend API
// =========================================

const experienceForm = document.getElementById('experienceForm');
const experienceListEl = document.getElementById('experienceList');
const cancelBtn = document.getElementById('cancelBtn');

let isEditing = false;
let editingId = null;

// Load experience data from Backend API
async function loadExperience() {
  try {
    const response = await ExperienceAPI.getAll();
    const experience = response.data || [];
    
    if (experience.length === 0) {
      experienceListEl.innerHTML = '<p style="color: var(--text-gray);">Belum ada data pengalaman</p>';
      return;
    }
    
    experienceListEl.innerHTML = experience.map((exp) => `
      <div class="data-card" data-id="${exp.id}">
        <div class="data-card-header">
          <div>
            <h4>${exp.posisi}</h4>
            <p>${exp.perusahaan} | ${exp.durasi}</p>
          </div>
        </div>
        <div class="data-card-body">
          ${exp.deskripsi}
        </div>
        <div class="data-card-actions">
          <button class="btn btn-sm btn-edit" onclick="editExperience(${exp.id})">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-sm btn-delete" onclick="deleteExperience(${exp.id})">
            <i class="fas fa-trash"></i> Hapus
          </button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading experience:', error);
    experienceListEl.innerHTML = `<p style="color: red;">Gagal memuat data: ${error.message}</p>`;
  }
}

// Save experience (add or update)
experienceForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const period = document.getElementById('expPeriod').value;
  const title = document.getElementById('expTitle').value;
  const company = document.getElementById('expCompany').value;
  const description = document.getElementById('expDescription').value;
  
  const submitBtn = document.getElementById('saveBtn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
  
  try {
    const data = {
      posisi: title,
      perusahaan: company,
      durasi: period,
      deskripsi: description
    };
    
    if (isEditing && editingId) {
      // Update existing
      await ExperienceAPI.update(editingId, data);
      alert('Pengalaman berhasil diperbarui!');
    } else {
      // Add new
      await ExperienceAPI.create(data);
      alert('Pengalaman berhasil ditambahkan!');
    }
    
    resetForm();
    loadExperience();
  } catch (error) {
    console.error('Error saving experience:', error);
    alert(`Gagal menyimpan: ${error.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Simpan';
  }
});

// Edit experience
window.editExperience = async function(id) {
  try {
    const response = await ExperienceAPI.getById(id);
    const exp = response.data;
    
    document.getElementById('expId').value = id;
    document.getElementById('expPeriod').value = exp.durasi;
    document.getElementById('expTitle').value = exp.posisi;
    document.getElementById('expCompany').value = exp.perusahaan;
    document.getElementById('expDescription').value = exp.deskripsi;
    
    isEditing = true;
    editingId = id;
    document.getElementById('saveBtn').innerHTML = '<i class="fas fa-sync"></i> Update';
    cancelBtn.style.display = 'inline-flex';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error('Error loading experience for edit:', error);
    alert(`Gagal memuat data: ${error.message}`);
  }
};

// Delete experience
window.deleteExperience = async function(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus pengalaman ini?')) return;
  
  try {
    await ExperienceAPI.delete(id);
    alert('Pengalaman berhasil dihapus!');
    loadExperience();
  } catch (error) {
    console.error('Error deleting experience:', error);
    alert(`Gagal menghapus: ${error.message}`);
  }
};

// Cancel edit
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  experienceForm.reset();
  document.getElementById('expId').value = '';
  isEditing = false;
  editingId = null;
  document.getElementById('saveBtn').innerHTML = '<i class="fas fa-save"></i> Simpan';
  cancelBtn.style.display = 'none';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadExperience();
});
