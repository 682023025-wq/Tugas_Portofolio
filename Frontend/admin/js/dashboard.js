// =========================================
// DASHBOARD LOGIC - Load data from Backend API
// =========================================

// Load and display dashboard data
async function loadDashboardData() {
  try {
    // Get stats from backend
    const statsResponse = await DashboardAPI.getStats();
    const stats = statsResponse.data;
    
    // Update stats
    document.getElementById('experience-count').textContent = stats.experiences_count || 0;
    document.getElementById('projects-count').textContent = stats.projects_count || 0;
    document.getElementById('skills-count').textContent = stats.skills_count || 0;
    
    // Get recent activity
    const activityResponse = await DashboardAPI.getRecentActivity();
    const activities = activityResponse.data || [];
    
    // Separate activities by type
    const experiences = activities.filter(a => a.type === 'experience');
    const projects = activities.filter(a => a.type === 'project');
    
    // Display recent experience
    const recentExperienceEl = document.getElementById('recent-experience');
    if (recentExperienceEl) {
      if (experiences.length > 0) {
        recentExperienceEl.innerHTML = experiences.slice(0, 3).map(exp => `
          <div class="data-item">
            <h5>${exp.posisi}</h5>
            <p>${exp.perusahaan} | ${exp.durasi}</p>
          </div>
        `).join('');
      } else {
        recentExperienceEl.innerHTML = '<p>Belum ada data pengalaman</p>';
      }
    }
    
    // Display recent projects
    const recentProjectsEl = document.getElementById('recent-projects');
    if (recentProjectsEl) {
      if (projects.length > 0) {
        recentProjectsEl.innerHTML = projects.slice(0, 3).map(proj => `
          <div class="data-item">
            <h5>${proj.judul}</h5>
            <p>${proj.deskripsi}</p>
          </div>
        `).join('');
      } else {
        recentProjectsEl.innerHTML = '<p>Belum ada data proyek</p>';
      }
    }
    
    // Display skills count in profile section if available
    if (stats.profile) {
      const profileNameEl = document.querySelector('.dashboard-header h2');
      if (profileNameEl && stats.profile.nama_lengkap) {
        profileNameEl.textContent = `Halo, ${stats.profile.nama_lengkap}`;
      }
    }
    
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    // Show error message to user
    const dashboardContent = document.querySelector('.dashboard-content');
    if (dashboardContent) {
      dashboardContent.innerHTML = `<p style="color: red;">Gagal memuat data: ${error.message}</p>`;
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
  await checkAuth();
  loadDashboardData();
});
