// =========================================
// BASE JS - Shared functionality for admin panel
// =========================================

// Check if user is logged in (simple session check)
function checkAuth() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const currentPage = window.location.pathname;
  
  // Don't redirect on login page
  if (currentPage.includes('login.html')) {
    return;
  }
  
  if (!isLoggedIn || isLoggedIn !== 'true') {
    // Redirect to login page
    window.location.href = 'login.html';
  }
}

// Logout function
function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// Initialize default data from index.html if not exists
function initializeDefaultData() {
  // Initialize skills if empty
  const existingSkills = localStorage.getItem('skills');
  if (!existingSkills || existingSkills === '[]') {
    const defaultSkills = [
      { id: 1, name: 'HTML', icon: 'fab fa-html5' },
      { id: 2, name: 'CSS', icon: 'fab fa-css3-alt' },
      { id: 3, name: 'JavaScript', icon: 'fab fa-js' },
      { id: 4, name: 'React', icon: 'fab fa-react' }
    ];
    localStorage.setItem('skills', JSON.stringify(defaultSkills));
  }
  
  // Initialize experience if empty
  const existingExperience = localStorage.getItem('experience');
  if (!existingExperience || existingExperience === '[]') {
    const defaultExperience = [
      {
        id: 1,
        title: 'Frontend Developer Intern',
        company: 'Tech Company',
        date: '2023 - Present',
        description: 'Developing responsive web applications using React and modern CSS.'
      }
    ];
    localStorage.setItem('experience', JSON.stringify(defaultExperience));
  }
  
  // Initialize projects if empty
  const existingProjects = localStorage.getItem('projects');
  if (!existingProjects || existingProjects === '[]') {
    const defaultProjects = [
      {
        id: 1,
        title: 'Portfolio Website',
        description: 'Personal portfolio built with HTML, CSS, and JavaScript',
        tags: ['HTML', 'CSS', 'JS'],
        image: '',
        demoLink: '#',
        repoLink: '#'
      }
    ];
    localStorage.setItem('projects', JSON.stringify(defaultProjects));
  }
  
  // Initialize profile if empty
  const existingProfile = localStorage.getItem('profile');
  if (!existingProfile || existingProfile === '{}') {
    const defaultProfile = {
      namaLengkap: 'Your Full Name',
      namaPanggilan: 'Your Nickname',
      tempatLahir: 'City',
      tanggalLahir: '2000-01-01',
      email: 'your.email@example.com',
      telepon: '08123456789',
      universitas: 'University Name',
      fakultas: 'Faculty Name',
      programStudi: 'Study Program',
      semester: '5',
      alamat: 'Your Address',
      fotoUrl: ''
    };
    localStorage.setItem('profile', JSON.stringify(defaultProfile));
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  checkAuth();
  initializeDefaultData();
});
