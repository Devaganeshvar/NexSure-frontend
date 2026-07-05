document.addEventListener('DOMContentLoaded', () => {
    // Wait a brief moment to ensure mockData is initialized by officer.js
    setTimeout(() => {
        const apps = JSON.parse(localStorage.getItem('mockApps') || '[]');
        const kyc = JSON.parse(localStorage.getItem('mockKyc') || '[]');
        const claims = JSON.parse(localStorage.getItem('mockClaims') || '[]');
        
        const pendingApps = apps.filter(a => a.status.toLowerCase() === 'pending').length;
        const pendingKyc = kyc.filter(k => k.status.toLowerCase() === 'pending').length;
        const reviewClaims = claims.filter(c => c.status.toLowerCase() === 'under review').length;
        
        // Random customers count for demo
        const totalCustomers = 1248;

        document.getElementById('kpi-apps').textContent = pendingApps;
        document.getElementById('kpi-kyc').textContent = pendingKyc;
        document.getElementById('kpi-claims').textContent = reviewClaims;
        document.getElementById('kpi-customers').textContent = totalCustomers.toLocaleString();
    }, 100);
});