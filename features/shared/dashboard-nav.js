/**
 * NexSure — Shared Customer Dashboard Navbar
 * Generates and injects the same navbar as on the claims page (the reference).
 *
 * Usage:
 *   <script src="../shared/dashboard-nav.js"></script>
 *   <script>NexNav.init({ active: 'payments' });</script>
 *
 * Active keys: 'dashboard' | 'my-policies' | 'plans' | 'claims' | 'payments' | 'kyc' | 'policy-cancellation' | 'reports'
 */
(function () {
    'use strict';

    // ── Resolve asset base path relative to the calling page ──────────────────
    function resolveBase() {
        const scripts = document.querySelectorAll('script[src*="dashboard-nav.js"]');
        if (!scripts.length) return '../../';
        const src = scripts[scripts.length - 1].getAttribute('src');
        const depth = (src.match(/\.\.\//g) || []).length;
        return '../'.repeat(depth);
    }

    const BASE = resolveBase();

    // ── Nav links builder ──────────────────────────────────────────────────────
    function navLinks(active) {
        const links = [
            { key: 'dashboard',   label: 'Dashboard',   href: `${BASE}customer-dashboard/home.html` },
            { key: 'my-policies', label: 'My Policies', href: `${BASE}policy-management/my-policies.html` },
            { key: 'plans',       label: 'Plans',        href: `${BASE}plan-listings/plans.html` },
            { key: 'claims',      label: 'Claims',       href: `${BASE}policy-management/claims.html` },
            { key: 'payments',    label: 'Payments',     href: `${BASE}payment/payments.html` },
        ];

        const moreItems = [
            { key: 'kyc',                 label: 'KYC Verification',    href: `${BASE}kyc/kyc.html` },
            { key: 'reports',             label: 'Report Management',   href: `${BASE}reports/reports.html` },
            { key: 'policy-cancellation', label: 'Policy Cancellation', href: `${BASE}policy-management/policy-cancellation.html` },
        ];

        const mainLinks = links.map(l => `
            <li class="nav-item">
                <a class="nav-link${l.key === active ? ' active' : ''}" href="${l.href}">${l.label}</a>
            </li>`).join('');

        const moreActiveKeys = moreItems.map(m => m.key);
        const moreIsActive   = moreActiveKeys.includes(active);

        const dropdown = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle${moreIsActive ? ' active' : ''}" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">More</a>
                <ul class="dropdown-menu shadow border-0 mt-2">
                    ${moreItems.map(m => `
                    <li><a class="dropdown-item${m.key === active ? ' active' : ''}" href="${m.href}">${m.label}</a></li>`).join('')}
                </ul>
            </li>`;

        return mainLinks + dropdown;
    }

    // ── Right-side (bell + user) ───────────────────────────────────────────────
    function rightSide() {
        return `
        <div class="d-flex align-items-center gap-4 ms-auto">
            <!-- Notification Bell -->
            <div class="position-relative notification-bell">
                <a href="#" class="text-white text-decoration-none">
                    <i class="fa-regular fa-bell fs-5"></i>
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-dark" style="font-size:0.6rem;">3</span>
                </a>
            </div>
            <!-- User Profile Dropdown -->
            <div class="dropdown user-dropdown">
                <a class="d-flex align-items-center text-white text-decoration-none dropdown-toggle gap-2 glass-pill px-2 py-1 rounded-pill"
                   href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="${BASE}assets/images/LandingPage/landing11.png" alt="User"
                         class="rounded-circle border border-2 border-light" width="32" height="32" style="object-fit:cover;">
                    <span class="fw-medium small pe-1">Devaganeshvar</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                    <li><a class="dropdown-item" href="${BASE}profile/profile.html"><i class="fa-regular fa-user me-2"></i>Profile</a></li>
                    <li><a class="dropdown-item" href="${BASE}profile/settings.html"><i class="fa-solid fa-gear me-2"></i>Settings</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="${BASE}auth/login.html" id="nexnav-signout"><i class="fa-solid fa-arrow-right-from-bracket me-2"></i>Sign Out</a></li>
                </ul>
            </div>
        </div>`;
    }

    // ── Build full nav HTML ────────────────────────────────────────────────────
    function buildNavHTML(active) {
        return `
        <nav class="navbar navbar-expand-lg py-1 dashboard-nav sticky-top" id="nexsure-dashboard-nav">
            <div class="container-fluid px-4 px-xl-5">
                <a class="navbar-brand" href="${BASE}customer-dashboard/home.html">
                    <img src="${BASE}assets/images/Logo.png" alt="NexSure" height="75">
                </a>
                <button class="navbar-toggler bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#nexNavbar" aria-controls="nexNavbar" aria-expanded="false">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="nexNavbar">
                    <ul class="navbar-nav mx-auto gap-4">
                        ${navLinks(active)}
                    </ul>
                    ${rightSide()}
                </div>
            </div>
        </nav>`;
    }

    // ── Public API ─────────────────────────────────────────────────────────────
    window.NexNav = {
        /**
         * @param {Object} options
         * @param {string} options.active  - Active nav key
         */
        init: function (options = {}) {
            const active = (options.active || '').toLowerCase();

            // Insert nav at the very top of <body>
            const wrapper = document.createElement('div');
            wrapper.innerHTML = buildNavHTML(active);
            document.body.insertBefore(wrapper.firstElementChild, document.body.firstChild);

            // Sign-out
            const signoutBtn = document.getElementById('nexnav-signout');
            if (signoutBtn) {
                signoutBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    localStorage.removeItem('nexsure_user');
                    window.location.href = signoutBtn.getAttribute('href');
                });
            }
        }
    };

})();
