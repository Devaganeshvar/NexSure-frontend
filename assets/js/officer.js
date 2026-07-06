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
    const getMockDate = (offset) => {
        const d = new Date();
        d.setDate(d.getDate() + offset);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Claims Data
    if (!localStorage.getItem('mockClaims')) {
        const claims = [
            { id: 'CLM-1042', policyId: 'MOT-5587', name: 'Devaganeshvar', type: 'Motor Accident Damage', date: getMockDate(-10), amount: '₹45,000', status: 'Under Review' },
            { id: 'CLM-1043', policyId: 'HLT-1022', name: 'Priya Sharma', type: 'Health Hospitalization', date: getMockDate(-9), amount: '₹80,000', status: 'Submitted' },
            { id: 'CLM-1044', policyId: 'HLT-2033', name: 'Arjun Kumar', type: 'Critical Illness', date: getMockDate(-8), amount: '₹2,00,000', status: 'Approved' },
            { id: 'CLM-1045', policyId: 'MOT-3044', name: 'Meera Raman', type: 'Motor Theft', date: getMockDate(-7), amount: '₹30,000', status: 'Under Review' },
            { id: 'CLM-1046', policyId: 'MOT-4055', name: 'Sneha Patel', type: 'Motor Accident Damage', date: getMockDate(-6), amount: '₹12,000', status: 'Open' },
            { id: 'CLM-1047', policyId: 'HLT-5066', name: 'Vikram Singh', type: 'Health', date: getMockDate(-6), amount: '₹55,000', status: 'Approved' },
            { id: 'CLM-1048', policyId: 'LIF-6077', name: 'Anita Roy', type: 'Life', date: getMockDate(-5), amount: '₹5,00,000', status: 'Open' },
            { id: 'CLM-1049', policyId: 'LIF-1190', name: 'Devaganeshvar', type: 'Life', date: getMockDate(-4), amount: '₹8,500', status: 'Submitted' },
            { id: 'CLM-0901', policyId: 'HLT-3321', name: 'Devaganeshvar', type: 'Health Hospitalization', date: getMockDate(-30), amount: '₹35,000', status: 'Rejected', rejectionReason: 'Claim rejected due to pre-existing condition non-disclosure.' }
        ];
        localStorage.setItem('mockClaims', JSON.stringify(claims));
    }

    // KYC Data
    if (!localStorage.getItem('mockKyc')) {
        const kyc = [
            { id: 'K-001', name: 'Priya S.', policy: 'HLT-3321', docs: 'Aadhaar, PAN', status: 'Pending', date: getMockDate(-8) },
            { id: 'K-002', name: 'Arjun K.', policy: 'MOT-5587', docs: 'Aadhaar, RC', status: 'Pending', date: getMockDate(-7) },
            { id: 'K-003', name: 'Meera R.', policy: 'LIF-1190', docs: 'Aadhaar, PAN', status: 'Pending', date: getMockDate(-6) },
            { id: 'K-004', name: 'Devaganeshvar', policy: 'PRO-2204', docs: 'Aadhaar, PAN, Sale Deed', status: 'Pending', date: getMockDate(-5) },
            { id: 'K-005', name: 'Vikram S.', policy: 'HLT-1011', docs: 'Aadhaar, Passport', status: 'Verified', date: getMockDate(-12) },
            { id: 'K-006', name: 'Sneha P.', policy: 'LIF-9022', docs: 'PAN, Voter ID', status: 'Rejected', date: getMockDate(-10) }
        ];
        localStorage.setItem('mockKyc', JSON.stringify(kyc));
    }

    // Applications Data
    if (!localStorage.getItem('mockApps_v3')) {
        const apps = [
            { id: 'APP-2281', customer: 'Devaganeshvar', product: 'Motor — 4W', premium: '₹9,800', date: getMockDate(-3), status: 'Pending' },
            { id: 'APP-2287', customer: 'Devaganeshvar', product: 'Property', premium: '₹4,500', date: getMockDate(-1), status: 'Pending' },
            { id: 'APP-2288', customer: 'Devaganeshvar', product: 'Life', premium: '₹15,000', date: getMockDate(-2), status: 'Pending' },
            { id: 'APP-2282', customer: 'Priya Sharma', product: 'Health', premium: '₹6,500', date: getMockDate(-3), status: 'Pending' },
            { id: 'APP-2283', customer: 'Arjun Kumar', product: 'Life', premium: '₹12,000', date: getMockDate(-2), status: 'Pending' },
            { id: 'APP-2284', customer: 'Meera Raman', product: 'Property', premium: '₹5,000', date: getMockDate(-2), status: 'Pending' },
            { id: 'APP-2285', customer: 'Sneha Patel', product: 'Health', premium: '₹7,200', date: getMockDate(-7), status: 'Approved' },
            { id: 'APP-2286', customer: 'Vikram Singh', product: 'Motor — 2W', premium: '₹1,500', date: getMockDate(-8), status: 'Rejected' }
        ];
        localStorage.setItem('mockApps', JSON.stringify(apps));
        localStorage.setItem('mockApps_v3', 'true');
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
