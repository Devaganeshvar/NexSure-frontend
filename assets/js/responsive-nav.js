/* responsive-nav.js - Handles mobile sidebar toggling */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we have an admin or officer sidebar
    const sidebars = document.querySelectorAll('.admin-sidebar, .officer-sidebar');
    
    if (sidebars.length > 0) {
        // Create overlay element
        const overlay = document.createElement('div');
        overlay.className = 'mobile-sidebar-overlay';
        document.body.appendChild(overlay);

        // Find all mobile toggle buttons
        const togglers = document.querySelectorAll('.mobile-nav-toggler');
        
        function toggleSidebar() {
            sidebars.forEach(sidebar => {
                sidebar.classList.toggle('sidebar-open');
            });
            overlay.classList.toggle('active');
            
            // Prevent body scroll when sidebar is open
            if (overlay.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }

        function closeSidebar() {
            sidebars.forEach(sidebar => {
                sidebar.classList.remove('sidebar-open');
            });
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Attach events
        togglers.forEach(toggler => {
            toggler.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleSidebar();
            });
        });

        overlay.addEventListener('click', closeSidebar);
        
        // Also close sidebar on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                closeSidebar();
            }
        });
    }
});
