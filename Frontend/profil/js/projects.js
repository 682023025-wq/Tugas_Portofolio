// ==========================================
// PROJECTS MODULE LOGIC
// ==========================================

(function() {
    console.log('✅ Projects module loaded');
    
    // DOM Elements
    const btnAdd = document.getElementById('btnAddProject');
    const modal = document.getElementById('projectModal');
    const btnClose = document.getElementById('btnCloseModal');
    const btnCancel = document.getElementById('btnCancelModal');
    const form = document.getElementById('projectForm');
    const modalTitle = document.getElementById('modalTitle');
    const tableBody = document.getElementById('projectsTableBody');
    
    let isEditing = false;
    let editId = null;

    // Open Modal (Add Mode)
    if (btnAdd) {
        btnAdd.addEventListener('click', () => openModal());
    }

    // Close Modal
    [btnClose, btnCancel].forEach(btn => {
        if (btn) btn.addEventListener('click', closeModal);
    });

    // Close on overlay click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    function openModal(id = null) {
        modal.classList.add('active');
        if (id) {
            // Edit Mode
            isEditing = true;
            editId = id;
            modalTitle.textContent = 'Edit Proyek';
            // TODO: Fetch data by ID and populate form
            document.getElementById('projTitle').value = 'Sistem Manajemen Inventaris'; // Dummy
            document.getElementById('projDesc').value = 'Aplikasi web untuk melacak stok...';
            document.getElementById('projTech').value = 'Python, Flask';
            document.getElementById('projLink').value = '#';
        } else {
            // Add Mode
            isEditing = false;
            editId = null;
            modalTitle.textContent = 'Tambah Proyek Baru';
            form.reset();
        }
    }

    function closeModal() {
        modal.classList.remove('active');
        form.reset();
    }

    // Handle Form Submit
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const data = {
                title: document.getElementById('projTitle').value,
                desc: document.getElementById('projDesc').value,
                tech: document.getElementById('projTech').value,
                link: document.getElementById('projLink').value
            };

            if (isEditing) {
                console.log('📝 Updating project ID:', editId, data);
                alert(`Proyek "${data.title}" berhasil diperbarui!`);
            } else {
                console.log('➕ Adding new project:', data);
                addRowToTable(data);
                alert(`Proyek "${data.title}" berhasil ditambahkan!`);
            }
            closeModal();
        });
    }

    // Delegate Edit/Delete clicks
    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-action');
            if (!btn) return;
            
            const id = btn.getAttribute('data-id');
            if (btn.classList.contains('btn-edit')) {
                openModal(id);
            } else if (btn.classList.contains('btn-delete')) {
                if (confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
                    btn.closest('tr').remove();
                    console.log('️ Deleted project ID:', id);
                }
            }
        });
    }

    // Helper: Add row dynamically (simulation)
    function addRowToTable(data) {
        const rowCount = tableBody.rows.length + 1;
        const techBadges = data.tech.split(',').map(t => `<span class="tech-badge">${t.trim()}</span>`).join(' ');
        
        const newRow = `
            <tr>
                <td>${rowCount}</td>
                <td><strong>${data.title}</strong></td>
                <td>${techBadges}</td>
                <td><a href="${data.link}" target="_blank" class="link-demo">🔗 Lihat Demo</a></td>
                <td class="action-cell">
                    <button class="btn-action btn-edit" data-id="${rowCount}">Edit</button>
                    <button class="btn-action btn-delete" data-id="${rowCount}">Hapus</button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', newRow);
    }

})();