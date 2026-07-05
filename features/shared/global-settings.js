/**
 * Global Settings Synchronization
 * This script runs on every page load to synchronize global settings (like the Logo)
 * from localStorage across all 45+ pages in the application.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Synchronize Logo
    const savedLogo = localStorage.getItem('nexsure_logo');
    
    if (savedLogo) {
        // Target common logo locations: Navbar, Sidebar, Authentication pages
        const logoElements = document.querySelectorAll('.navbar-brand img, .sidebar-brand img, .auth-brand img, img[alt="NexSure Logo"]');
        
        logoElements.forEach(img => {
            img.src = savedLogo;
            
            // Optionally remove constraints that might distort a custom logo
            img.style.objectFit = 'contain';
        });
    }

    // 2. Synchronize Theme Color
    const savedPrimaryColor = localStorage.getItem('nexsure_primary_color');
    if (savedPrimaryColor) {
        document.documentElement.style.setProperty('--admin-primary', savedPrimaryColor);
        document.documentElement.style.setProperty('--primary-blue', savedPrimaryColor);
    }
});