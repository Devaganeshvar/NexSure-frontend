// Theme Initialization
(function() {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();
// Officer Module Global Scripts

// 1. Initialize Mock Database
const initializeMockData = () => {
    // Claims Data
    if (!localStorage.getItem('mockClaims')) {
        const claims = [
            { id: 'CLM-1042', name: 'Rahul Mehta', type: 'Accident Damage', date: '12 Jun 2026', amount: '₹45,000', status: 'Under Review' },
            { id: 'CLM-1043', name: 'Priya Sharma', type: 'Hospitalization', date: '13 Jun 2026', amount: '₹80,000', status: 'Submitted' },
            { id: 'CLM-1044', name: 'Arjun Kumar', type: 'Critical Illness', date: '14 Jun 2026', amount: '₹2,00,000', status: 'Approved' },
            { id: 'CLM-1045', name: 'Meera Raman', type: 'Theft', date: '15 Jun 2026', amount: '₹30,000', status: 'Under Review' },
            { id: 'CLM-1046', name: 'Sneha Patel', type: 'Accident Damage', date: '16 Jun 2026', amount: '₹12,000', status: 'Open' },
            { id: 'CLM-1047', name: 'Vikram Singh', type: 'Health', date: '16 Jun 2026', amount: '₹55,000', status: 'Approved' },
            { id: 'CLM-1048', name: 'Anita Roy', type: 'Life', date: '17 Jun 2026', amount: '₹5,00,000', status: 'Open' },
            { id: 'CLM-1049', name: 'Rahul Mehta', type: 'Motor', date: '18 Jun 2026', amount: '₹8,500', status: 'Submitted' }
        ];
        localStorage.setItem('mockClaims', JSON.stringify(claims));
    }

    // KYC Data
    if (!localStorage.getItem('mockKyc')) {
        const kyc = [
            { id: 'K-001', name: 'Priya S.', policy: 'HLT-3321', docs: 'Aadhaar, PAN', status: 'Pending', date: '14 Jun 2026' },
            { id: 'K-002', name: 'Arjun K.', policy: 'MOT-5587', docs: 'Aadhaar, RC', status: 'Pending', date: '15 Jun 2026' },
            { id: 'K-003', name: 'Meera R.', policy: 'LIF-1190', docs: 'Aadhaar, PAN', status: 'Pending', date: '16 Jun 2026' },
            { id: 'K-004', name: 'Rahul M.', policy: 'PRO-2204', docs: 'Aadhaar, PAN, Sale Deed', status: 'Pending', date: '17 Jun 2026' },
            { id: 'K-005', name: 'Vikram S.', policy: 'HLT-1011', docs: 'Aadhaar, Passport', status: 'Verified', date: '10 Jun 2026' },
            { id: 'K-006', name: 'Sneha P.', policy: 'LIF-9022', docs: 'PAN, Voter ID', status: 'Rejected', date: '12 Jun 2026' }
        ];
        localStorage.setItem('mockKyc', JSON.stringify(kyc));
    }

    // Applications Data
    if (!localStorage.getItem('mockApps')) {
        const apps = [
            { id: 'APP-2281', name: 'Rahul Mehta', product: 'Motor — 4W', premium: '₹9,800', date: '17 Jun 2026', status: 'Pending' },
            { id: 'APP-2282', name: 'Priya Sharma', product: 'Health', premium: '₹6,500', date: '17 Jun 2026', status: 'Pending' },
            { id: 'APP-2283', name: 'Arjun Kumar', product: 'Life', premium: '₹12,000', date: '18 Jun 2026', status: 'Pending' },
            { id: 'APP-2284', name: 'Meera Raman', product: 'Property', premium: '₹5,000', date: '18 Jun 2026', status: 'Pending' },
            { id: 'APP-2285', name: 'Sneha Patel', product: 'Health', premium: '₹7,200', date: '15 Jun 2026', status: 'Approved' },
            { id: 'APP-2286', name: 'Vikram Singh', product: 'Motor — 2W', premium: '₹1,500', date: '14 Jun 2026', status: 'Rejected' }
        ];
        localStorage.setItem('mockApps', JSON.stringify(apps));
    }
};

// 2. Global Helper Functions
const showOfficerToast = (message, type = 'success') => {
    // Check if toast container exists
    let container = document.getElementById('officerToastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'officerToastContainer';
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1055';
        document.body.appendChild(container);
    }

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body fw-medium">
                ${type === 'success' ? '<i class="fa-solid fa-check-circle me-2"></i>' : '<i class="fa-solid fa-circle-exclamation me-2"></i>'}
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    container.appendChild(toastEl);
    const bsToast = new bootstrap.Toast(toastEl, { delay: 3000 });
    bsToast.show();

    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
};

const getBadgeClass = (status) => {
    const s = status.toLowerCase();
    if (s === 'approved' || s === 'verified' || s === 'settled') return 'status-approved';
    if (s === 'rejected' || s === 'declined') return 'bg-danger text-white';
    if (s === 'open') return 'status-open';
    if (s === 'submitted') return 'status-submitted';
    return 'status-pending'; // pending, under review
};

// 3. Setup Mobile Sidebar Toggle
const setupMobileSidebar = () => {
    const navbar = document.querySelector('.officer-navbar .d-flex.align-items-center.gap-5');
    if (navbar && !document.getElementById('mobileMenuToggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'mobileMenuToggle';
        toggleBtn.className = 'btn text-white d-lg-none me-2 p-0';
        toggleBtn.innerHTML = '<i class="fa-solid fa-bars fs-4"></i>';
        
        navbar.prepend(toggleBtn);

        const sidebar = document.querySelector('.officer-sidebar');
        
        // Add overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('show');
            overlay.classList.toggle('show');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
        });
    }
};

// 4. Global Search Handler
const handleGlobalSearch = (event) => {
    if (event.key === 'Enter') {
        const query = event.target.value.trim();
        if (query) {
            showOfficerToast(`Searching globally for "${query}"...`);
            // Clear input after search
            setTimeout(() => {
                event.target.value = '';
            }, 1000);
        }
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeMockData();
    setupMobileSidebar();
});




// Global Theme Initialization
(function() {
    const storedTheme = localStorage.getItem('officerTheme');
    if (storedTheme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }
})();
