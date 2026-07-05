/**
 * Global Policy Context
 * Automatically injects a sticky banner to show the currently selected policy.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Check if we have an active policy in localStorage
    const activePolicyStr = localStorage.getItem('nexsureActivePolicy');
    if (!activePolicyStr) return;

    try {
        const policy = JSON.parse(activePolicyStr);
        if (!policy.id || !policy.type || !policy.status) return;

        // Create the banner container
        const banner = document.createElement('div');
        banner.className = 'global-policy-context-banner';
        banner.id = 'globalPolicyContextBanner';

        // Determine badge color based on status
        let badgeClass = 'bg-success';
        if (policy.status.toLowerCase().includes('expired')) badgeClass = 'bg-danger';
        if (policy.status.toLowerCase().includes('pending')) badgeClass = 'bg-warning text-dark';

        // Use the rupee entity securely
        const premiumStr = policy.premium ? `&#8377;${policy.premium}` : '--';

        banner.innerHTML = `
            <div class="container-fluid px-4 px-xl-5">
                <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div class="d-flex align-items-center gap-4 flex-wrap">
                        <div class="d-flex align-items-center gap-2">
                            <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style="width: 32px; height: 32px;">
                                <i class="fa-solid fa-file-shield fs-6"></i>
                            </div>
                            <div>
                                <div class="gpc-label">Active Policy Context</div>
                                <div class="gpc-value">${policy.id} <span class="text-muted fw-normal mx-1">|</span> ${policy.type}</div>
                            </div>
                        </div>
                        <div class="d-none d-md-block" style="width: 1px; height: 24px; background-color: #cbd5e1;"></div>
                        <div class="d-none d-sm-block">
                            <div class="gpc-label">Status</div>
                            <div class="gpc-value"><span class="badge ${badgeClass} rounded-pill gpc-badge">${policy.status}</span></div>
                        </div>
                        <div class="d-none d-md-block" style="width: 1px; height: 24px; background-color: #cbd5e1;"></div>
                        <div class="d-none d-lg-block">
                            <div class="gpc-label">Premium</div>
                            <div class="gpc-value text-success">${premiumStr}</div>
                        </div>
                    </div>
                    
                    <div>
                        <button class="gpc-close-btn" id="btnClosePolicyContext" title="Clear Active Policy Context">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Inject banner right after the main nav, or at the top of the body
        const nav = document.querySelector('nav.navbar');
        if (nav && nav.parentNode) {
            // Check if nav has sticky-top to dynamically adjust top offset
            if (nav.classList.contains('sticky-top')) {
                // Wait a tiny bit for layout to settle, then set top
                setTimeout(() => {
                    const navHeight = nav.offsetHeight;
                    banner.style.top = `${navHeight}px`;
                }, 50);
            }
            nav.parentNode.insertBefore(banner, nav.nextSibling);
        } else {
            document.body.prepend(banner);
        }

        // Add clear functionality
        document.getElementById('btnClosePolicyContext').addEventListener('click', () => {
            localStorage.removeItem('nexsureActivePolicy');
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(-100%)';
            setTimeout(() => banner.remove(), 300);
        });

    } catch (e) {
        console.error('Error parsing active policy context', e);
    }
});

// Helper function for other scripts to easily set the active policy
window.setNexsureActivePolicy = function(id, type, status, premium) {
    const policy = { id, type, status, premium };
    localStorage.setItem('nexsureActivePolicy', JSON.stringify(policy));
    // Optional: reload the page or dispatch an event to show it immediately
    // location.reload();
};