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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  checkAuth();
});
