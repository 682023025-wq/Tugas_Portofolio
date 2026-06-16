// =========================================
// 1. HELPER FUNCTIONS (WAJIB DI ATAS)
// =========================================

const API_BASE_URL = '';

function getAuthToken() {
    return localStorage.getItem('authToken');
}

// ✅ TAMBAHKAN KEMBALI FUNGSI INI
function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

function removeAuthToken() {
    localStorage.removeItem('authToken');
}

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    
    const token = getAuthToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    try {
        const response = await fetch(url, { ...options, headers });
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Server Error: ${response.status}`);
        }
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Request failed');
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// =========================================
// 2. API OBJECTS (NAMA BARU SEMUA)
// =========================================

// Auth API
const AuthAPI = {
    async login(username, password) {
        const res = await apiRequest('/api/login', { method: 'POST', body: JSON.stringify({ username, password }) });
        // Simpan token otomatis setelah login berhasil
        if (res.token) setAuthToken(res.token);
        return res;
    },
    async logout() {
        removeAuthToken();
        return apiRequest('/api/logout', { method: 'POST' });
    },
    async checkAuth() {
        return apiRequest('/api/auth/check');
    }
};

// Dashboard API
const DashboardAPI = {
    async getStats() { return apiRequest('/api/dashboard/stats'); },
    async getRecentActivity() { return apiRequest('/api/dashboard/recent'); }
};

// Experience API
const ExperienceAPI = {
    async getAll() { return apiRequest('/api/experiences'); },
    async getById(id) { return apiRequest(`/api/experiences/${id}`); },
    async create(data) { return apiRequest('/api/experiences', { method: 'POST', body: JSON.stringify(data) }); },
    async update(id, data) { return apiRequest(`/api/experiences/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    async delete(id) { return apiRequest(`/api/experiences/${id}`, { method: 'DELETE' }); }
};

// Projects API
const ProjectsAPI = {
    async getAll() { return apiRequest('/api/projects'); },
    async getById(id) { return apiRequest(`/api/projects/${id}`); },
    async create(data) { return apiRequest('/api/projects', { method: 'POST', body: JSON.stringify(data) }); },
    async update(id, data) { return apiRequest(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    async delete(id) { return apiRequest(`/api/projects/${id}`, { method: 'DELETE' }); }
};

// Skills API
const SkillsAPI = {
    async getAll() { return apiRequest('/api/skills'); },
    async getById(id) { return apiRequest(`/api/skills/${id}`); },
    async create(data) { return apiRequest('/api/skills', { method: 'POST', body: JSON.stringify(data) }); },
    async update(id, data) { return apiRequest(`/api/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    async delete(id) { return apiRequest(`/api/skills/${id}`, { method: 'DELETE' }); }
};

// ==========================================
// PROFILES & UTAMA API (NAMA BARU)
// ==========================================

// 1. ProfilesAPI -> Untuk ADMIN (profiles.py)
const ProfilesAPI = {
    async get() {
        return apiRequest('/api/profiles'); 
    },
    async update(data) {
        return apiRequest('/api/profiles', { 
            method: 'PUT', 
            body: JSON.stringify(data) 
        });
    },
    async changePassword(oldPass, newPass) {
        return apiRequest('/api/profiles/change-password', {
            method: 'POST',
            body: JSON.stringify({ old_password: oldPass, new_password: newPass })
        });
    }
};

// 2. UtamaAPI -> Untuk HALAMAN DEPAN (utama.py)
const UtamaAPI = {
    async get() {
        return apiRequest('/api/main-profile'); 
    }
};