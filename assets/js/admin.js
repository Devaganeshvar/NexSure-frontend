// Theme & Branding Initialization
(function() {
    // Admin module is strictly Light Theme.
    document.documentElement.setAttribute('data-bs-theme', 'light');
    
    const savedColor = localStorage.getItem('nexsure_primary_color');
    if (savedColor) {
        document.documentElement.style.setProperty('--admin-primary', savedColor);
    }
})();

// Provide a mock setTheme for the admin settings page to save global preferences without breaking admin layout
window.setTheme = function(theme) {
    localStorage.setItem('nexsure_theme', theme);
    if (typeof showAdminToast === 'function') {
        showAdminToast('Theme preference saved for Customer/Officer portals.', 'success');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Check Authentication
    if (typeof checkAuth === 'function') {
        checkAuth(['admin', 'super_admin']);
    } else {
        const isAuth = localStorage.getItem('isAuthenticated');
        if (isAuth !== 'true') {
            window.location.href = '/features/auth/login.html';
        }
    }

    // Apply Global Branding
    const savedLogo = localStorage.getItem('nexsure_logo');
    if (savedLogo) {
        const logoImg = document.querySelector('.navbar-brand img');
        if (logoImg) logoImg.src = savedLogo;
    }
    
    const savedName = localStorage.getItem('nexsure_platform_name');
    if (savedName) {
        document.title = savedName;
    }

    // Sidebar Toggle for Mobile
    const sidebar = document.querySelector('.admin-sidebar');
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn text-white d-lg-none me-3';
    toggleBtn.innerHTML = '<i class="fa-solid fa-bars fs-4"></i>';
    toggleBtn.onclick = () => {
        sidebar.classList.toggle('show');
        if(!document.querySelector('.sidebar-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.onclick = () => {
                sidebar.classList.remove('show');
                overlay.classList.remove('show');
            };
            document.body.appendChild(overlay);
            setTimeout(() => overlay.classList.add('show'), 10);
        } else {
            const overlay = document.querySelector('.sidebar-overlay');
            overlay.classList.toggle('show');
        }
    };
    
    const brandContainer = document.querySelector('.admin-navbar .d-flex');
    if (brandContainer && window.innerWidth < 992) {
        brandContainer.prepend(toggleBtn);
    }
});

// Global Toast Notification
function showAdminToast(message, type = 'success') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '1080';
        document.body.appendChild(toastContainer);
    }

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body fw-medium">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    toastContainer.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
    
    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
}

function handleGlobalSearch(event) {
    if (event.key === 'Enter') {
        const query = event.target.value.trim();
        if (query) {
            showAdminToast(`Searching for "${query}" across all modules...`, 'primary');
            setTimeout(() => {
                event.target.value = '';
            }, 1000);
        }
    }
}
