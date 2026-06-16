// ==========================================
// DASHBOARD LOGIC - Load data from Backend API
// ==========================================

(function() {
    'use strict';

    // Definisi API Wrapper (scoped dalam IIFE)
    const DashboardAPI = {
        async getStats() {
            const res = await fetch('/api/dashboard/stats', { 
                headers: { 'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}` } 
            });
            if (!res.ok) throw new Error('Gagal memuat statistik');
            return await res.json();
        },
        
        async getRecentActivity() {
            const res = await fetch('/api/dashboard/recent', { 
                headers: { 'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}` } 
            });
            if (!res.ok) throw new Error('Gagal memuat aktivitas terbaru');
            return await res.json();
        }
    };

    async function loadDashboardData() {
        try {
            // 1. Load Stats
            const statsResponse = await DashboardAPI.getStats();
            const stats = statsResponse.data || {};
            
            document.getElementById('experience-count').textContent = stats.experiences_count ?? 0;
            document.getElementById('projects-count').textContent = stats.projects_count ?? 0;
            document.getElementById('skills-count').textContent = stats.skills_count ?? 0;
            
            // Update nama admin di header jika tersedia
            if (stats.admin_name) {
                document.getElementById('admin-name').textContent = `Halo, ${stats.admin_name}`;
            }
            
            // 2. Load Recent Activity
            const activityResponse = await DashboardAPI.getRecentActivity();
            const activities = activityResponse.data || [];
            
            const experiences = activities.filter(a => a.type === 'experience');
            const projects = activities.filter(a => a.type === 'project');
            
            // Render Recent Experience
            const recentExpEl = document.getElementById('recent-experience');
            recentExpEl.innerHTML = experiences.length > 0 
              ? experiences.slice(0, 3).map(exp => `
                  <div class="data-item">
                    <h5>${escapeHtml(exp.posisi)}</h5>
                    <p>${escapeHtml(exp.perusahaan)} | ${escapeHtml(exp.durasi)}</p>
                  </div>`).join('')
              : '<p class="empty-state">Belum ada data pengalaman</p>';
            
            // Render Recent Projects
            const recentProjEl = document.getElementById('recent-projects');
            recentProjEl.innerHTML = projects.length > 0 
              ? projects.slice(0, 3).map(proj => `
                  <div class="data-item">
                    <h5>${escapeHtml(proj.judul)}</h5>
                    <p>${escapeHtml(proj.deskripsi?.substring(0, 80))}...</p>
                  </div>`).join('')
              : '<p class="empty-state">Belum ada data proyek</p>';

        } catch (error) {
            console.error('Dashboard Error:', error);
            document.querySelector('.dashboard-content').innerHTML = 
              `<div class="error-box"><i class="fas fa-exclamation-triangle"></i> Gagal memuat data: ${error.message}</div>`;
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
        document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await fetch('/api/logout', { method: 'POST' });
                sessionStorage.clear();
                window.location.href = '../../index.html';
            } catch (err) {
                alert('Gagal logout. Silakan hapus cache browser.');
            }
        });
    });

})();