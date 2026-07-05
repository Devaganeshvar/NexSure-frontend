/**
 * Global Data Store
 * Initializes and manages the mock database in localStorage
 */

window.DataStore = {
    init: function() {
        const existing = localStorage.getItem('nexsureDB');
        let parsed = null;
        try {
            if (existing) parsed = JSON.parse(existing);
        } catch(e) {}
        
        // If it doesn't exist or is corrupted (missing policies array)
        if (!parsed || !parsed.policies) {
            if (typeof NEXSURE_MOCK_DB !== 'undefined') {
                localStorage.setItem('nexsureDB', JSON.stringify(NEXSURE_MOCK_DB));
            } else {
                console.warn("NEXSURE_MOCK_DB not found. Ensure mock-db.js is loaded first.");
            }
        }
    },
    
    getDB: function() {
        const dbStr = localStorage.getItem('nexsureDB');
        try {
            return dbStr ? JSON.parse(dbStr) : null;
        } catch(e) {
            return null;
        }
    },
    
    saveDB: function(db) {
        localStorage.setItem('nexsureDB', JSON.stringify(db));
    },

    calculateAge: function(dobString) {
        if (!dobString) return null;
        const dob = new Date(dobString);
        if (isNaN(dob.getTime())) return null;
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    },

    getCustomers: function() {
        const db = this.getDB();
        const customers = (db && db.customers) ? db.customers : (typeof window.NEXSURE_MOCK_DB !== 'undefined' ? window.NEXSURE_MOCK_DB.customers || [] : []);
        // Dynamically append calculated age
        return customers.map(c => {
            c.age = this.calculateAge(c.dob);
            return c;
        });
    },

    getApplications: function() {
        const db = this.getDB();
        return (db && db.applications) ? db.applications : (typeof window.NEXSURE_MOCK_DB !== 'undefined' ? window.NEXSURE_MOCK_DB.applications || [] : []);
    },

    addApplication: function(app) {
        const db = this.getDB();
        if(!db.applications) db.applications = [];
        db.applications.unshift(app);
        this.saveDB(db);
        return app;
    },

    updateApplicationStatus: function(appId, newStatus) {
        const db = this.getDB();
        if(!db.applications) return false;
        const appIndex = db.applications.findIndex(a => a.id === appId);
        if (appIndex !== -1) {
            db.applications[appIndex].status = newStatus;
            this.saveDB(db);
            return true;
        }
        return false;
    },

    getPolicies: function() {
        const db = this.getDB();
        return (db && db.policies) ? db.policies : (typeof NEXSURE_MOCK_DB !== 'undefined' ? NEXSURE_MOCK_DB.policies : []);
    },

    getClaims: function() {
        const db = this.getDB();
        return (db && db.claims) ? db.claims : (typeof NEXSURE_MOCK_DB !== 'undefined' ? NEXSURE_MOCK_DB.claims : []);
    },

    getPayments: function() {
        const db = this.getDB();
        return (db && db.payments) ? db.payments : (typeof NEXSURE_MOCK_DB !== 'undefined' ? NEXSURE_MOCK_DB.payments : []);
    },

    getNotifications: function() {
        const db = this.getDB();
        return (db && db.notifications) ? db.notifications : (typeof NEXSURE_MOCK_DB !== 'undefined' ? NEXSURE_MOCK_DB.notifications : []);
    },

    addClaim: function(claim) {
        const db = this.getDB();
        if (db) {
            db.claims.unshift(claim);
            this.saveDB(db);
        }
    },
    
    addPayment: function(payment) {
        const db = this.getDB();
        if (db) {
            db.payments.unshift(payment);
            this.saveDB(db);
        }
    },
    
    updatePolicyStatus: function(policyId, status) {
        const db = this.getDB();
        if (db) {
            const policy = db.policies.find(p => p.id === policyId);
            if (policy) {
                policy.status = status;
                this.saveDB(db);
            }
        }
    }
};

// Initialize immediately on script load so it's ready for other scripts
window.DataStore.init();