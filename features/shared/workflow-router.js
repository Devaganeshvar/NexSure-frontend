/**
 * Dynamic Workflow Router
 * Intercepts specific actions (Cancel, Claim, Renew) and loads specific templates
 * based on the active policy type stored in localStorage.
 */
document.addEventListener('DOMContentLoaded', () => {
    // We look for any button/link that triggers these actions
    // For this prototype, we'll bind to anything with specific hrefs or target modals
    
    function getActivePolicyType() {
        const activeStr = localStorage.getItem('nexsureActivePolicy');
        if (!activeStr) return null;
        try {
            const pol = JSON.parse(activeStr);
            if(pol && pol.type) {
                return pol.type.toLowerCase();
            }
        } catch(e) {}
        return null;
    }

    // Example intercept for Cancel Policy
    const cancelLinks = document.querySelectorAll('a[href*="policy-cancellation.html"]');
    cancelLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const type = getActivePolicyType();
            if (type) {
                // If it's a specific type, append query param to load specific template
                if (type.includes('motor')) {
                    link.href = '../policy-management/policy-cancellation.html?type=motor';
                } else if (type.includes('health')) {
                    link.href = '../policy-management/policy-cancellation.html?type=health';
                } else if (type.includes('life')) {
                    link.href = '../policy-management/policy-cancellation.html?type=life';
                }
            }
        });
    });

    // We can also build dynamic modal injectors here if requested, 
    // but the easiest approach is passing the context via query parameters 
    // to the existing pages and having those pages adapt dynamically.
});