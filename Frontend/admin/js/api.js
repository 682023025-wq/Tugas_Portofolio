// =========================================
// API CONFIGURATION - Base URL for Backend
// =========================================

const API_BASE_URL = '';

// Helper function to get auth token from localStorage
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Helper function to set auth token
function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

// Helper function to remove auth token
function removeAuthToken() {
    localStorage.removeItem('authToken');
}

// Helper function to make authenticated API requests
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    // Add auth token if available
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        ...options,
        headers
    };
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || data.message || 'Request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Auth API calls
const AuthAPI = {
    async login(username, password) {
        const response = await apiRequest('/api/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        return response;
    },
    
    async logout() {
        const response = await apiRequest('/api/logout', {
            method: 'POST'
        });
        return response;
    },
    
    async checkAuth() {
        const response = await apiRequest('/api/auth/check');
        return response;
    }
};

// Dashboard API calls
const DashboardAPI = {
    async getStats() {
        const response = await apiRequest('/api/dashboard/stats');
        return response;
    },
    
    async getRecentActivity() {
        const response = await apiRequest('/api/dashboard/recent-activity');
        return response;
    }
};

// Experience API calls
const ExperienceAPI = {
    async getAll() {
        const response = await apiRequest('/api/experiences');
        return response;
    },
    
    async getById(id) {
        const response = await apiRequest(`/api/experiences/${id}`);
        return response;
    },
    
    async create(data) {
        const response = await apiRequest('/api/experiences', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return response;
    },
    
    async update(id, data) {
        const response = await apiRequest(`/api/experiences/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return response;
    },
    
    async delete(id) {
        const response = await apiRequest(`/api/experiences/${id}`, {
            method: 'DELETE'
        });
        return response;
    }
};

// Projects API calls
const ProjectsAPI = {
    async getAll() {
        const response = await apiRequest('/api/projects');
        return response;
    },
    
    async getById(id) {
        const response = await apiRequest(`/api/projects/${id}`);
        return response;
    },
    
    async create(data) {
        const response = await apiRequest('/api/projects', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return response;
    },
    
    async update(id, data) {
        const response = await apiRequest(`/api/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return response;
    },
    
    async delete(id) {
        const response = await apiRequest(`/api/projects/${id}`, {
            method: 'DELETE'
        });
        return response;
    }
};

// Skills API calls
const SkillsAPI = {
    async getAll() {
        const response = await apiRequest('/api/skills');
        return response;
    },
    
    async getById(id) {
        const response = await apiRequest(`/api/skills/${id}`);
        return response;
    },
    
    async create(data) {
        const response = await apiRequest('/api/skills', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return response;
    },
    
    async update(id, data) {
        const response = await apiRequest(`/api/skills/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return response;
    },
    
    async delete(id) {
        const response = await apiRequest(`/api/skills/${id}`, {
            method: 'DELETE'
        });
        return response;
    }
};

// Profile/profiles API calls
const ProfileAPI = {
    async get() {
        const response = await apiRequest('/api/utama');
        return response;
    },
    
    async update(data) {
        const response = await apiRequest('/api/utama_bp', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return response;
    },
    
    async create(data) {
        const response = await apiRequest('/api/utama_bp', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return response;
    }
};

const AkunAPI = {
    async get() {
        const response = await apiRequest('/api/profiles');
        return response;
    },
    
    async update(data) {
        const response = await apiRequest('/api/profiles', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return response;
    },
    
    async changePassword(oldPassword, newPassword) {
        const response = await apiRequest('/api/profiles/change-password', {
            method: 'POST',
            body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
        });
        return response;
    }
};
