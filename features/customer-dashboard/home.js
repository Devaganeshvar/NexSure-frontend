document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Navbar Scroll Effect ─────────────────────────────────────────────
    const navbar = document.querySelector('.dashboard-nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
            navbar.classList.toggle('shadow-sm', window.scrollY > 50);
        });
    }

    // ── 2. Animated Counters for Stats Strip ────────────────────────────────
    const counters = document.querySelectorAll('.stats-strip .stat-number');
    const speed = 50;

    const animateCounters = () => {
        counters.forEach(counter => {
            if (counter.getAttribute('data-animated')) return;
            counter.setAttribute('data-animated', 'true');

            const targetText = counter.getAttribute('data-target-text') || counter.innerText;
            counter.setAttribute('data-target-text', targetText);
            const target = +targetText.replace(/,/g, '').replace(/\+/g, '').replace(/%/g, '');
            const hasPlus    = targetText.includes('+');
            const hasPercent = targetText.includes('%');
            const inc = Math.max(1, Math.ceil(target / speed));
            let current = 0;
            counter.innerText = '0';

            const tick = () => {
                current = Math.min(current + inc, target);
                let displayVal = current.toLocaleString('en-IN');
                if (hasPlus)    displayVal += '<span class="text-green">+</span>';
                if (hasPercent) displayVal += '<span class="text-green">%</span>';
                counter.innerHTML = displayVal;
                if (current < target) setTimeout(tick, 20);
            };
            tick();
        });
    };

    // ── 3. Intersection Observer (Fade-in + Counter Trigger) ────────────────
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                if (entry.target.classList.contains('stats-strip')) animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.summary-card, .quick-action-card, .policy-card, .stats-strip').forEach(el => {
        el.classList.add('fade-in-hidden');
        observer.observe(el);
    });

    // ── 4. Toast helper ─────────────────────────────────────────────────────
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '1055';
        document.body.appendChild(toastContainer);
    }

    function showToast(message, type = 'success') {
        const id  = 'toast-' + Date.now();
        const bgClass = type === 'success' ? 'text-bg-success' : 'text-bg-primary';
        const icon    = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
        toastContainer.insertAdjacentHTML('beforeend', `
            <div id="${id}" class="toast align-items-center ${bgClass} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body"><i class="fa-solid ${icon} me-2"></i>${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>`);
        const el = document.getElementById(id);
        const toast = new bootstrap.Toast(el, { delay: 3000 });
        toast.show();
        el.addEventListener('hidden.bs.toast', () => el.remove());
    }

    // ── 5. Wire up all dashboard buttons with real navigation ───────────────

    // Helper: navigate with a loading spinner on the button
    function navigateTo(btn, url) {
        const orig = btn.innerHTML;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
        btn.disabled = true;
        setTimeout(() => { window.location.href = url; }, 300);
    }

    // ── Hero section buttons ─────────────────────────────────────────────────
    const btnBuyNewPolicy = document.getElementById('btn-buy-new-policy');
    const btnFileAClaim   = document.getElementById('btn-file-a-claim');
    const btnPayPremium   = document.getElementById('btn-pay-premium');

    if (btnBuyNewPolicy) btnBuyNewPolicy.addEventListener('click', () => navigateTo(btnBuyNewPolicy, '../plan-listings/plans.html'));
    if (btnFileAClaim)   btnFileAClaim.addEventListener('click',   () => navigateTo(btnFileAClaim,   '../policy-management/claims.html'));
    if (btnPayPremium)   btnPayPremium.addEventListener('click',   () => navigateTo(btnPayPremium,   '../payment/payments.html'));

    // ── Quick Action cards ───────────────────────────────────────────────────
    const qaMap = {
        'qa-buy-policy':    '../plan-listings/plans.html',
        'qa-pay-premium':   '../payment/payments.html',
        'qa-file-claim':    '../policy-management/claims.html',
        'qa-download-policy': '../policy-management/my-policies.html',
    };
    Object.entries(qaMap).forEach(([id, url]) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => { window.location.href = url; });
    });

    // ── My Policies buttons ──────────────────────────────────────────────────
    const policyBtns = {
        'btn-view-lif':      '../policy-management/my-policies.html',
        'btn-download-lif':  '../policy-management/my-policies.html',
        'btn-renew-mot':     '../payment/payments.html',
        'btn-view-mot':      '../policy-management/my-policies.html',
        'btn-renew-hlt':     '../payment/payments.html',
        'btn-view-hlt':      '../policy-management/my-policies.html',
        'btn-view-all-policies': '../policy-management/my-policies.html',
    };
    Object.entries(policyBtns).forEach(([id, url]) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => { window.location.href = url; });
    });

    // ── Premium Due sidebar ──────────────────────────────────────────────────
    const btnPayAll = document.getElementById('btn-pay-all');
    const btnPayNow = document.getElementById('btn-pay-now');
    if (btnPayAll) btnPayAll.addEventListener('click', () => { window.location.href = '../payment/payments.html'; });
    if (btnPayNow) btnPayNow.addEventListener('click', () => { window.location.href = '../payment/payments.html'; });

    // ── KYC Widget ───────────────────────────────────────────────────────────
    const btnKyc = document.getElementById('btn-kyc-now');
    if (btnKyc) btnKyc.addEventListener('click', () => { window.location.href = '../kyc/kyc.html'; });

    // ── Renew Now (contextual alert card) ────────────────────────────────────
    const btnRenewAlert = document.getElementById('btn-renew-alert');
    if (btnRenewAlert) btnRenewAlert.addEventListener('click', () => { window.location.href = '../payment/payments.html'; });

    // ── View All Recent Activity ─────────────────────────────────────────────
    const btnViewActivity = document.getElementById('btn-view-activity');
    if (btnViewActivity) btnViewActivity.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Activity history coming soon!', 'primary');
    });

});