// ==========================================
// DASHBOARD LOGIC - Load data from Backend API
// ==========================================

(function() {
    'use strict';

    // Helper untuk mendapatkan token (Sesuaikan dengan cara login kamu menyimpan token)
    function getAuthToken() {
        // Coba cek localStorage dulu, kalau tidak ada coba sessionStorage
        return localStorage.getItem('authToken') || sessionStorage.getItem('auth_token');
    }

    // Definisi API Wrapper (Scoped dalam IIFE)
    const DashboardAPI = {
        async getStats() {
            const token = getAuthToken();
            if (!token) throw new Error('Silakan login kembali');

            const res = await fetch('/api/dashboard/stats', { 
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                } 
            });
            
            if (res.status === 401) {
                window.location.href = '../../index.html'; // Redirect jika token invalid
                throw new Error('Sesi berakhir');
            }
            if (!res.ok) throw new Error('Gagal memuat statistik');
            
            return await res.json();
        },
        
        async getRecentActivity() {
            const token = getAuthToken();
            if (!token) throw new Error('Silakan login kembali');

            const res = await fetch('/api/dashboard/recent', { 
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                } 
            });

            if (res.status === 401) {
                window.location.href = '../../index.html';
                throw new Error('Sesi berakhir');
            }
            if (!res.ok) throw new Error('Gagal memuat aktivitas terbaru');
            
            return await res.json();
        }
    };

    async function loadDashboardData() {
        try {
            // 1. Load Stats
            const statsResponse = await DashboardAPI.getStats();
            const stats = statsResponse.data || {};
            
            // Safe update DOM elements
            const updateText = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.textContent = val ?? 0;
            };

            updateText('experience-count', stats.experiences_count);
            updateText('projects-count', stats.projects_count);
            updateText('skills-count', stats.skills_count);
            
            // Update nama admin di header jika tersedia
            if (stats.admin_name) {
                const adminNameEl = document.getElementById('admin-name');
                if (adminNameEl) adminNameEl.textContent = `Halo, ${stats.admin_name}`;
            }
            
            // 2. Load Recent Activity
            const activityResponse = await DashboardAPI.getRecentActivity();
            const activities = activityResponse.data || [];
            
            const experiences = activities.filter(a => a.type === 'experience');
            const projects = activities.filter(a => a.type === 'project');
            
            // Render Recent Experience
            const recentExpEl = document.getElementById('recent-experience');
            if (recentExpEl) {
                recentExpEl.innerHTML = experiences.length > 0 
                  ? experiences.slice(0, 3).map(exp => `
                      <div class="data-item">
                        <h5>${escapeHtml(exp.posisi)}</h5>
                        <p>${escapeHtml(exp.perusahaan)} | ${escapeHtml(exp.durasi)}</p>
                      </div>`).join('')
                  : '<p class="empty-state">Belum ada data pengalaman</p>';
            }
            
            // Render Recent Projects
            const recentProjEl = document.getElementById('recent-projects');
            if (recentProjEl) {
                recentProjEl.innerHTML = projects.length > 0 
                  ? projects.slice(0, 3).map(proj => `
                      <div class="data-item">
                        <h5>${escapeHtml(proj.judul)}</h5>
                        <p>${escapeHtml(proj.deskripsi?.substring(0, 80))}...</p>
                      </div>`).join('')
                  : '<p class="empty-state">Belum ada data proyek</p>';
            }

        } catch (error) {
            console.error('Dashboard Error:', error);
            const contentEl = document.querySelector('.dashboard-content');
            if (contentEl) {
                contentEl.innerHTML = 
                  `<div class="error-box"><i class="fas fa-exclamation-triangle"></i> Gagal memuat data: ${error.message}</div>`;
            }
        }
    }

    // Helper keamanan XSS
    function escapeHtml(text) {
        if (!text) return '';
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', async function() {
        // Pastikan checkAuth() sudah didefinisikan di base.js
        if (typeof checkAuth === 'function') {
            await checkAuth();
        }
        
        loadDashboardData();
        
        // Handle Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    await fetch('/api/logout', { method: 'POST' });
                } catch (err) {
                    console.error('Logout API error', err);
                } finally {
                    // Bersihkan semua penyimpanan lokal
                    localStorage.removeItem('authToken');
                    sessionStorage.clear();
                    
                    // Redirect ke index.html (halaman utama)
                    window.location.href = '../../index.html';
                }
            });
        }
    });

})();