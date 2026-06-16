// ... (kode helper apiRequest tetap sama) ...

// ==========================================
// API DEFINITIONS (SESUAI RENAME)
// ==========================================

// 1. DASHBOARD API
const DashboardAPI = {
    async getStats() { return apiRequest('/api/dashboard/stats'); },
    async getRecentActivity() { return apiRequest('/api/dashboard/recent'); }
};

// 2. EXPERIENCE API
const ExperienceAPI = {
    async getAll() { return apiRequest('/api/experiences'); },
    async getById(id) { return apiRequest(`/api/experiences/${id}`); },
    async create(data) { return apiRequest('/api/experiences', { method: 'POST', body: JSON.stringify(data) }); },
    async update(id, data) { return apiRequest(`/api/experiences/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    async delete(id) { return apiRequest(`/api/experiences/${id}`, { method: 'DELETE' }); }
};

// 3. PROJECTS API
const ProjectsAPI = {
    async getAll() { return apiRequest('/api/projects'); },
    async getById(id) { return apiRequest(`/api/projects/${id}`); },
    async create(data) { return apiRequest('/api/projects', { method: 'POST', body: JSON.stringify(data) }); },
    async update(id, data) { return apiRequest(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    async delete(id) { return apiRequest(`/api/projects/${id}`, { method: 'DELETE' }); }
};

// 4. SKILLS API
const SkillsAPI = {
    async getAll() { return apiRequest('/api/skills'); },
    async getById(id) { return apiRequest(`/api/skills/${id}`); },
    async create(data) { return apiRequest('/api/skills', { method: 'POST', body: JSON.stringify(data) }); },
    async update(id, data) { return apiRequest(`/api/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    async delete(id) { return apiRequest(`/api/skills/${id}`, { method: 'DELETE' }); }
};

// 5. PROFILE API (KHUSUS ADMIN - profiles.py)
// Dipakai di: js/akun.js atau js/profiles.js (halaman dashboard admin)
const ProfileAPI = {
    async get() {
        return apiRequest('/api/profil'); // Route di profiles.py
    },
    async update(data) {
        return apiRequest('/api/profil', { 
            method: 'PUT', 
            body: JSON.stringify(data) 
        });
    }
};

// 6. PUBLIC PROFILE API (KHUSUS INDEX - utama.py)
// Dipakai di: js/script.js (halaman depan index.html)
const PublicProfileAPI = {
    async get() {
        return apiRequest('/api/main-profile'); // Route di utama.py
    }
};

// 7. AUTH & ACCOUNT API
const AuthAPI = {
    async login(u, p) { return apiRequest('/api/login', { method: 'POST', body: JSON.stringify({ username: u, password: p }) }); },
    async logout() { return apiRequest('/api/logout', { method: 'POST' }); },
    async checkAuth() { return apiRequest('/api/auth/check'); }
};

const AkunAPI = {
    async changePassword(oldPass, newPass) {
        return apiRequest('/api/profiles/change-password', {
            method: 'POST',
            body: JSON.stringify({ old_password: oldPass, new_password: newPass })
        });
    }
};