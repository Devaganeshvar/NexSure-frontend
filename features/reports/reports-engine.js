// reports-engine.js
// Centralized Data Mocking & Filtering Engine for NexSure Reports

const ReportsEngine = {
    data: {
        policies: [],
        claims: [],
        audit: [],
        import: [],
        customers: [],
        revenue: []
    },
    
    init() {
        this.generateMockData();
    },
    
    generateMockData() {
        const today = new Date();
        
        // Helper to generate dates
        const getRandomDate = (daysBack) => {
            const d = new Date();
            d.setDate(today.getDate() - Math.floor(Math.random() * daysBack));
            d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
            return d;
        };

        const actors = ['Gokul K', 'Solai (Admin)', 'System', 'Admin', 'Hephzibha A'];
        const modules = ['Policies', 'Bulk Import', 'Batch', 'Products', 'Customers', 'Backup'];
        const statuses = ['Active', 'Expired', 'Cancelled', 'Pending'];
        const claimStatuses = ['Approved', 'Rejected', 'Under Review', 'Settled'];
        const policyTypes = ['Health', 'Vehicle', 'Life', 'Property'];

        // Generate Audit Logs (300 records)
        for (let i = 0; i < 300; i++) {
            this.data.audit.push({
                id: 'AUD-' + (1000 + i),
                timestamp: getRandomDate(365),
                actor: actors[Math.floor(Math.random() * actors.length)],
                action: 'System action recorded ' + Math.floor(Math.random() * 1000),
                module: modules[Math.floor(Math.random() * modules.length)]
            });
        }
        // Ensure some recent audit logs for default view
        for (let i = 0; i < 20; i++) {
            this.data.audit.push({
                id: 'AUD-R' + i,
                timestamp: getRandomDate(7),
                actor: 'System',
                action: 'Routine backup check',
                module: 'Backup'
            });
        }
        
        // Generate Policies (200 records)
        for (let i = 0; i < 200; i++) {
            this.data.policies.push({
                id: 'POL-' + (5000 + i),
                timestamp: getRandomDate(365),
                customer: 'Customer ' + i,
                type: policyTypes[Math.floor(Math.random() * policyTypes.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                premium: Math.floor(Math.random() * 10000) + 1000
            });
        }

        // Generate Claims (150 records)
        for (let i = 0; i < 150; i++) {
            this.data.claims.push({
                id: 'CLM-' + (8000 + i),
                timestamp: getRandomDate(365),
                policyId: 'POL-' + (5000 + Math.floor(Math.random() * 200)),
                amount: Math.floor(Math.random() * 50000) + 5000,
                status: claimStatuses[Math.floor(Math.random() * claimStatuses.length)]
            });
        }

        // Sort all arrays by date descending
        Object.keys(this.data).forEach(key => {
            this.data[key].sort((a, b) => b.timestamp - a.timestamp);
        });
    },
    
    filterData(reportType, dateRangeDays) {
        let dataset = [];
        if (reportType.includes('Policy')) dataset = this.data.policies;
        else if (reportType.includes('Claim')) dataset = this.data.claims;
        else if (reportType.includes('Audit')) dataset = this.data.audit;
        else if (reportType.includes('Bulk')) dataset = this.data.audit.filter(a => a.module === 'Bulk Import');
        else if (reportType.includes('Receipt') || reportType.includes('Revenue')) dataset = this.data.policies;
        else dataset = this.data.audit; // fallback Dashboard Summary
        
        if (!dateRangeDays || dateRangeDays === 'all') {
            return dataset;
        }
        
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - parseInt(dateRangeDays));
        
        return dataset.filter(item => item.timestamp >= cutoff);
    },
    
    formatDate(dateObj) {
        const d = new Date(dateObj);
        return d.getFullYear() + '-' + 
            String(d.getMonth() + 1).padStart(2, '0') + '-' + 
            String(d.getDate()).padStart(2, '0') + ' ' + 
            String(d.getHours()).padStart(2, '0') + ':' + 
            String(d.getMinutes()).padStart(2, '0') + ':' + 
            String(d.getSeconds()).padStart(2, '0');
    }
};

ReportsEngine.init();
