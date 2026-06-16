document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();

    try {
        const response = await fetch('/api/profil');
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        
        const res = await response.json();
        
        // Validasi wrapper JSON dari Flask jsonify
        if (!res.success || !res.data) {
            showError('Format data dari server tidak valid.');
            return;
        }

        // Destructuring sesuai struktur backend profil.py
        const { skills, experiences, projects } = res.data;
        const profile = res.data; // Data profil ada di level 'data' langsung

        if (!profile.nama_lengkap && !profile.nama_panggilan) {
            showError('Data profil belum diisi oleh admin.');
            return;
        }

        renderHero(profile);
        renderAbout(profile);
        renderSkills(skills || []);
        renderExperiences(experiences || []);
        renderProjects(projects || []);
        renderContact(profile);

    } catch (error) {
        console.error('Fetch Error:', error);
        showError('Gagal terhubung ke server portofolio.');
    }
});

function showError(msg) {
    const heroContent = document.getElementById('hero-content');
    if (heroContent) {
        heroContent.innerHTML = `<div class="error-state"><i class="fas fa-exclamation-circle"></i> ${msg}</div>`;
    }
}

function renderHero(p) {
    const hero = document.getElementById('hero-content');
    if (!hero) return;

    // PERBAIKAN 3: Fallback aman jika field null/undefined
    hero.innerHTML = `
        <h4>Selamat Datang di Portofolio Saya</h4>
        <h1>Halo, Saya <span>${escapeHtml(p.nama_lengkap || p.nama_panggilan || 'Admin')}</span></h1>
        <p>${escapeHtml(p.prodi || '')} - ${escapeHtml(p.universitas || '')}</p>
        <a href="#projects" class="btn">Lihat Proyek Saya</a>
    `;
}

function renderAbout(p) {
    // Foto Profil
    const img = document.getElementById('profile-photo');
    const placeholder = document.getElementById('photo-placeholder');
    
    if (img && placeholder) {
        if (p.foto_url) {
            img.src = p.foto_url;
            img.style.display = 'block';
            placeholder.style.display = 'none';
        } else {
            img.style.display = 'none';
            placeholder.style.display = 'flex';
        }
    }

    // Teks About
    const aboutText = document.getElementById('about-text');
    if (aboutText) {
        aboutText.innerHTML = `
            <h3>${escapeHtml(p.nama_lengkap)} - ${escapeHtml(p.prodi)}</h3>
            <p>Mahasiswa Sistem Informasi di ${escapeHtml(p.universitas)}, Fakultas ${escapeHtml(p.fakultas)}. 
               Saat ini berada di semester ${escapeHtml(p.semester)}.</p>
            <p>Berdomisili di ${escapeHtml(p.alamat)}. Memiliki ketertarikan besar dalam pengembangan backend, 
               manajemen database, dan arsitektur aplikasi web yang skalabel.</p>
            <a href="#contact" class="btn">Hubungi Saya</a>
        `;
    }
}

function renderSkills(skills) {
    const container = document.getElementById('skills-container');
    if (!container) return;

    if (!skills.length) {
        container.innerHTML = '<p class="empty-state">Belum ada data skill.</p>';
        return;
    }
    
    container.innerHTML = skills.map(s => `
        <div class="skill-card">
            <i class="${escapeHtml(s.icon_class || 'fas fa-code')}"></i>
            <h4>${escapeHtml(s.nama_skill)}</h4>
        </div>
    `).join('');
}

function renderExperiences(exps) {
    const container = document.getElementById('experience-container');
    if (!container) return;

    if (!exps.length) {
        container.innerHTML = '<p class="empty-state">Belum ada pengalaman.</p>';
        return;
    }

    container.innerHTML = exps.map(e => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <span class="timeline-date">${escapeHtml(e.durasi)}</span>
                <h3>${escapeHtml(e.posisi)}</h3>
                <h4>${escapeHtml(e.perusahaan)}</h4>
                <p>${escapeHtml(e.deskripsi)}</p>
            </div>
        </div>
    `).join('');
}

function renderProjects(projs) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    if (!projs.length) {
        container.innerHTML = '<p class="empty-state">Belum ada proyek.</p>';
        return;
    }

    container.innerHTML = projs.map(p => `
        <div class="project-card">
            <div class="project-img">
                ${p.gambar_url 
                    ? `<img src="${escapeHtml(p.gambar_url)}" alt="${escapeHtml(p.judul)}" loading="lazy">` 
                    : '<i class="fas fa-box-open"></i>'}
            </div>
            <div class="project-info">
                <h3>${escapeHtml(p.judul)}</h3>
                <p>${escapeHtml(p.deskripsi?.substring(0, 120))}${p.deskripsi?.length > 120 ? '...' : ''}</p>
                <div class="project-links">
                    ${p.link_project ? `<a href="${escapeHtml(p.link_project)}" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function renderContact(p) {
    const emailDisplay = document.getElementById('contact-email-display');
    if (emailDisplay && p.email) {
        emailDisplay.innerHTML = `Tertarik berkolaborasi? Kirim pesan ke <strong>${escapeHtml(p.email)}</strong>`;
    }
}

// Fungsi keamanan dasar untuk mencegah XSS saat render innerHTML
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}