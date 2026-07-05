// Role-based Access Control Route Guard
(function() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole'); // 'customer', 'officer', or 'admin'
    const currentPath = window.location.pathname.toLowerCase();

    // Pages that do not require authentication
    const publicPages = [
        'login.html',
        'register.html',
        'forgot-password.html',
        'landing-page.html',
        'about.html',
        'contact.html',
        'plans.html',
        'help.html',
        'customer-help.html'
    ];

    const authOnlyPages = [
        'login.html',
        'register.html',
        'forgot-password.html'
    ];

    const isPublicPage = publicPages.some(page => currentPath.includes(page));
    const isAuthOnlyPage = authOnlyPages.some(page => currentPath.includes(page));

    // Exclude the root domain redirect or when running in some local server without full path
    if (currentPath.endsWith('/') || currentPath === '' || currentPath.endsWith('index.html')) {
        return; 
    }

    // Attempt to determine correct base path dynamically
    // e.g. if path is /NexSureFrontEnd/features/auth/login.html
    const basePathMatch = window.location.pathname.match(/^(.*\/features\/)/i);
    const basePath = basePathMatch ? basePathMatch[1] : '/features/';

    if (!isAuthenticated && !isPublicPage) {
        // Not authenticated, trying to access protected page
        window.location.href = basePath + 'auth/login.html';
        return;
    }

    if (isAuthenticated && isAuthOnlyPage) {
        // Authenticated, trying to access login/register, redirect to their dashboard
        if (userRole === 'officer') {
            window.location.href = basePath + 'admin-dashboard/officer-dashboard.html';
        } else if (userRole === 'admin') {
            window.location.href = basePath + 'admin-dashboard/dashboard.html';
        } else {
            window.location.href = basePath + 'customer-dashboard/home.html';
        }
        return;
    }
})();

// Global logout function
window.logout = function() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    
    const basePathMatch = window.location.pathname.match(/^(.*\/features\/)/i);
    const basePath = basePathMatch ? basePathMatch[1] : '/features/';
    window.location.href = basePath + 'auth/login.html';
};