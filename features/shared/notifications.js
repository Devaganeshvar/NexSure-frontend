/**
 * NexSure — Shared Notification Dropdown
 * Initialises the bell icon as a Bootstrap dropdown with
 * Mark All as Read and Clear All functionality.
 */
(function () {
    'use strict';

    // ── Sample notifications (replace with API data in production) ──────────
    const DEFAULT_NOTIFICATIONS = [
        {
            id: 1,
            icon: 'fa-rotate',
            iconBg: 'bg-warning',
            iconColor: 'text-dark',
            title: 'Motor policy renews in 7 days',
            body: 'MOT-5587 — Annual premium of ₹9,800 due on 12 Jul 2026.',
            time: '2 hours ago',
            read: false,
            action: '../payment/payments.html',
        },
        {
            id: 2,
            icon: 'fa-file-contract',
            iconBg: 'bg-primary',
            iconColor: 'text-white',
            title: 'Claim CLM-1042 moved to Under Review',
            body: 'Your motor accident claim is now under officer review.',
            time: '5 days ago',
            read: false,
            action: '../policy-management/claims.html',
        },
        {
            id: 3,
            icon: 'fa-id-card',
            iconBg: 'bg-danger',
            iconColor: 'text-white',
            title: 'KYC verification pending',
            body: 'Please upload your PAN card to complete KYC verification.',
            time: '1 week ago',
            read: false,
            action: '../kyc/kyc.html',
        },
    ];

    // ── Storage helpers ──────────────────────────────────────────────────────
    const STORAGE_KEY = 'nexsure_notifications';

    function loadNotifs() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS));
        } catch (e) {
            return JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS));
        }
    }

    function saveNotifs(notifs) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
    }

    // ── Render helpers ────────────────────────────────────────────────────────
    function unreadCount(notifs) {
        return notifs.filter(n => !n.read).length;
    }

    function renderBadge(badge, count) {
        if (!badge) return;
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = '';
        } else {
            badge.style.display = 'none';
        }
    }

    function renderList(listEl, notifs) {
        if (notifs.length === 0) {
            listEl.innerHTML = `
                <div class="text-center py-5 px-3">
                    <i class="fa-regular fa-bell-slash fa-2x text-muted mb-3 d-block"></i>
                    <p class="text-muted small mb-0">No notifications</p>
                </div>`;
            return;
        }

        listEl.innerHTML = notifs.map(n => `
            <div class="notif-item d-flex gap-3 px-3 py-3 border-bottom ${n.read ? '' : 'notif-unread'}"
                 data-id="${n.id}" style="cursor:pointer; transition: background 0.15s;">
                <div class="flex-shrink-0 rounded-circle ${n.iconBg} ${n.iconColor} d-flex align-items-center justify-content-center"
                     style="width:38px;height:38px;min-width:38px;">
                    <i class="fa-solid ${n.icon} fs-6"></i>
                </div>
                <div class="flex-grow-1 min-w-0">
                    <div class="d-flex justify-content-between align-items-start gap-2">
                        <span class="fw-semibold text-dark" style="font-size:0.85rem;">${n.title}</span>
                        ${!n.read ? '<span class="flex-shrink-0 rounded-circle bg-primary" style="width:8px;height:8px;min-width:8px;margin-top:5px;"></span>' : ''}
                    </div>
                    <p class="text-muted mb-1" style="font-size:0.78rem;line-height:1.4;">${n.body}</p>
                    <span class="text-muted" style="font-size:0.72rem;">${n.time}</span>
                </div>
            </div>`).join('');

        // Click to mark read + navigate
        listEl.querySelectorAll('.notif-item').forEach(el => {
            el.addEventListener('mouseenter', () => el.style.background = '#f8fafc');
            el.addEventListener('mouseleave', () => el.style.background = '');
            el.addEventListener('click', () => {
                const id = +el.dataset.id;
                const notifs = loadNotifs();
                const n = notifs.find(x => x.id === id);
                if (n) {
                    n.read = true;
                    saveNotifs(notifs);
                    init(); // re-render
                    if (n.action) window.location.href = n.action;
                }
            });
        });
    }

    // ── Inject dropdown HTML into bell wrapper ───────────────────────────────
    function buildDropdown(wrapper) {
        const notifs = loadNotifs();
        const count  = unreadCount(notifs);

        wrapper.classList.add('dropdown');
        wrapper.innerHTML = `
            <style>
                .notif-unread { background: #f0f7ff; }
                .notif-dropdown-menu { min-width: 360px; border-radius: 0.75rem; overflow: hidden; }
                @media (max-width: 480px) { .notif-dropdown-menu { min-width: calc(100vw - 2rem); } }
            </style>
            <a href="#" class="text-white text-decoration-none position-relative d-flex"
               data-bs-toggle="dropdown" aria-expanded="false" id="notifBell">
                <i class="fa-regular fa-bell fs-5"></i>
                <span id="notif-badge"
                      class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-dark"
                      style="font-size:0.6rem;display:${count > 0 ? '' : 'none'};">${count}</span>
            </a>
            <div class="dropdown-menu dropdown-menu-end shadow border-0 p-0 notif-dropdown-menu" style="max-height:480px;"
                 aria-labelledby="notifBell" id="notif-dropdown">

                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center px-3 pt-3 pb-2 border-bottom">
                    <h6 class="mb-0 fw-bold text-dark" style="font-size:0.95rem;">
                        Notifications
                        <span id="notif-count-label" class="badge bg-primary rounded-pill ms-1" style="font-size:0.65rem;">${count}</span>
                    </h6>
                    <div class="d-flex gap-2 align-items-center">
                        <button id="btn-mark-all-read" class="btn btn-link btn-sm p-0 text-decoration-none fw-medium" style="color:#3b82f6;font-size:0.8rem;">Mark all read</button>
                        <span class="text-muted" style="font-size:0.7rem;">·</span>
                        <button id="btn-clear-all" class="btn btn-link btn-sm p-0 text-decoration-none fw-medium text-danger" style="font-size:0.8rem;">Clear all</button>
                    </div>
                </div>

                <!-- List -->
                <div id="notif-list" style="max-height:370px;overflow-y:auto;"></div>
            </div>`;

        // Render items
        const listEl = wrapper.querySelector('#notif-list');
        renderList(listEl, notifs);

        // Mark all read
        wrapper.querySelector('#btn-mark-all-read').addEventListener('click', (e) => {
            e.stopPropagation();
            const n = loadNotifs();
            n.forEach(x => x.read = true);
            saveNotifs(n);
            init();
        });

        // Clear all
        wrapper.querySelector('#btn-clear-all').addEventListener('click', (e) => {
            e.stopPropagation();
            saveNotifs([]);
            init();
        });
    }

    // ── Main init ────────────────────────────────────────────────────────────
    function init() {
        const wrapper = document.querySelector('.notification-bell');
        if (!wrapper) return;
        buildDropdown(wrapper);
    }

    // Run after DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
