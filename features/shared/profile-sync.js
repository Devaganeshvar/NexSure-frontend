/**
 * profile-sync.js
 * Handles global state management for the customer profile.
 */
(function() {
    'use strict';

    const PROFILE_STORAGE_KEY = 'nexsure_customer_profile';

    const DEFAULT_PROFILE = {
        name: 'Devaganeshvar',
        email: 'devaganeshvar@gmail.com',
        password: '2005',
        phone: '+91 98765 43210',
        dob: '15 Aug 1990',
        age: 35,
        address: '123, Maple Street, Tech Park Area\nBengaluru, Karnataka - 560001',
        photoBase64: null // null means use default black circle
    };

    window.CustomerProfile = {
        get: function() {
            try {
                const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed.name === 'Rahul Mehta' || parsed.name === 'Rahul M.' || parsed.name !== 'Devaganeshvar') {
                        parsed.name = 'Devaganeshvar';
                        parsed.password = '2005';
                        parsed.email = 'devaganeshvar@gmail.com';
                        this.set(parsed);
                        return parsed;
                    }
                    return parsed;
                }
            } catch (e) {
                console.error("Error reading profile from local storage", e);
            }
            // Initialize if not present
            this.set(DEFAULT_PROFILE);
            return DEFAULT_PROFILE;
        },
        
        set: function(profileObj) {
            try {
                localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileObj));
            } catch (e) {
                console.error("Error saving profile to local storage (file might be too large)", e);
                // If it fails, maybe the photo is too big. Try stripping the photo.
                if (e.name === 'QuotaExceededError') {
                    alert('Profile photo is too large to be saved. Please try a smaller image.');
                    profileObj.photoBase64 = null;
                    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileObj));
                }
            }
        },

        updateField: function(key, value) {
            const profile = this.get();
            profile[key] = value;
            this.set(profile);
            this.syncUI();
        },

        syncUI: function() {
            const profile = this.get();
            
            // 1. Update text fields globally
            document.querySelectorAll('.profile-name, .user-name-display').forEach(el => {
                el.textContent = profile.name;
            });
            document.querySelectorAll('.profile-email').forEach(el => {
                el.textContent = profile.email;
            });
            
            // Short name for navbar (e.g. "Rahul M.")
            document.querySelectorAll('.user-dropdown .fw-medium.small').forEach(el => {
                if(el.textContent.trim().toLowerCase() !== 'user') { // Don't replace fixed labels arbitrarily, but do replace standard nav labels
                    el.textContent = profile.name;
                }
            });

            // 2. Update avatars
            // Some avatars are div backgrounds (like in the new profile page)
            // Some are img tags (like in the old layout)
            const hasPhoto = profile.photoBase64 !== null && profile.photoBase64 !== '';
            
            // Process div-based avatars (the large ones and navbar ones)
            document.querySelectorAll('.profile-avatar, .user-dropdown .bg-black, .user-dropdown .rounded-circle.bg-black').forEach(el => {
                if (hasPhoto) {
                    el.style.backgroundImage = `url(${profile.photoBase64})`;
                    el.style.backgroundSize = 'cover';
                    el.style.backgroundPosition = 'center';
                } else {
                    el.style.backgroundImage = 'url(../../assets/images/LandingPage/landing11.png)';
                    el.style.backgroundSize = 'cover';
                    el.style.backgroundPosition = 'center';
                }
            });
            
            // Process img-based avatars (if any still exist)
            document.querySelectorAll('.user-dropdown img, img.profile-avatar, .profile-sync-img').forEach(el => {
                if (hasPhoto) {
                    el.src = profile.photoBase64;
                } else {
                    // Fallback to default user image
                    if(!el.src.includes('LandingPage/landing11.png')) {
                       el.src = '../../assets/images/LandingPage/landing11.png';
                    }
                }
            });
        }
    };

    // Run sync on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.CustomerProfile.syncUI());
    } else {
        window.CustomerProfile.syncUI();
    }
})();

// --- GLOBAL DATABASE INIT ---
(function initGlobalDB() {
    if (!localStorage.getItem('mockProducts')) {
        const DEFAULT_PRODUCTS = [
            { id: 'PROD-1', name: 'Life Insurance', type: 'Life', price: 4999, description: 'Comprehensive protection tailored to every aspect of your life.', features: ['Comprehensive life cover', 'Nominee protection guarantee', 'Critical illness add-on'], image: '../../assets/images/LandingPage/landing1.png' },
            { id: 'PROD-2', name: 'Health Insurance', type: 'Health', price: 6500, description: 'Comprehensive protection tailored to every aspect of your life.', features: ['Cashless hospitalization', '500+ network hospitals', 'Free annual checkup'], image: '../../assets/images/LandingPage/landing2.png' },
            { id: 'PROD-3', name: 'Motor Insurance', type: 'Motor', price: 2200, description: 'Comprehensive protection tailored to every aspect of your life.', features: ['Third-party + own damage', 'Zero depreciation cover', '24x7 roadside assistance'], image: '../../assets/images/LandingPage/landing3.png' },
            { id: 'PROD-4', name: 'Property Insurance', type: 'Property', price: 1800, description: 'Comprehensive protection tailored to every aspect of your life.', features: ['Fire and burglary cover', 'Natural disaster protection', 'Temporary relocation'], image: '../../assets/images/LandingPage/landing4.png' },
            { id: 'PROD-5', name: 'Travel Insurance', type: 'Travel', price: 1200, description: 'Comprehensive protection tailored to every aspect of your life.', features: ['Flight delay cover', 'Medical emergency cover', 'Loss of baggage'], image: '../../assets/images/LandingPage/landing5.png' }
        ];
        localStorage.setItem('mockProducts', JSON.stringify(DEFAULT_PRODUCTS));
    }
    
    if (!localStorage.getItem('mockApps_v3')) {
        const getMockDate = (offset) => {
            const d = new Date();
            d.setDate(d.getDate() + offset);
            return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        };
        const DEFAULT_APPS = [
            { id: 'APP-2281', customer: 'Devaganeshvar', product: 'Motor — 4W', premium: '₹9,800', date: getMockDate(-3), status: 'Pending' },
            { id: 'APP-2287', customer: 'Devaganeshvar', product: 'Property', premium: '₹4,500', date: getMockDate(-1), status: 'Pending' },
            { id: 'APP-2288', customer: 'Devaganeshvar', product: 'Life', premium: '₹15,000', date: getMockDate(-2), status: 'Pending' },
            { id: 'APP-2282', customer: 'Priya Sharma', product: 'Health', premium: '₹6,500', date: getMockDate(-3), status: 'Pending' },
            { id: 'APP-2283', customer: 'Arjun Kumar', product: 'Life', premium: '₹12,000', date: getMockDate(-2), status: 'Pending' },
            { id: 'APP-2284', customer: 'Meera Raman', product: 'Property', premium: '₹5,000', date: getMockDate(-2), status: 'Pending' },
            { id: 'APP-2285', customer: 'Sneha Patel', product: 'Health', premium: '₹7,200', date: getMockDate(-7), status: 'Approved' },
            { id: 'APP-2286', customer: 'Vikram Singh', product: 'Motor — 2W', premium: '₹1,500', date: getMockDate(-8), status: 'Rejected' }
        ];
        localStorage.setItem('mockApps', JSON.stringify(DEFAULT_APPS));
        localStorage.setItem('mockApps_v3', 'true');
    }

    if (!localStorage.getItem('mockPaymentHistory')) {
        const DEFAULT_PAYMENTS = [
            {
                id: 'TXN-98231',
                date: '24 May 2026',
                time: '10:30 AM',
                policy: 'HLT-3321',
                description: 'Renewal Premium',
                amount: '₹8,450',
                mode: 'Net Banking',
                status: 'Successful'
            },
            {
                id: 'TXN-98230',
                date: '12 Mar 2026',
                time: '02:15 PM',
                policy: 'MOT-5587',
                description: 'Annual Premium',
                amount: '₹12,300',
                mode: 'UPI',
                status: 'Successful'
            },
            {
                id: 'TXN-98229',
                date: '15 Jan 2026',
                time: '11:45 AM',
                policy: 'LIF-1190',
                description: 'Grace Payment',
                amount: '₹18,200',
                mode: 'Credit Card',
                status: 'Successful'
            }
        ];
        localStorage.setItem('mockPaymentHistory', JSON.stringify(DEFAULT_PAYMENTS));
    }

    if (!localStorage.getItem('mockPolicies_v3')) {
        const DEFAULT_POLICIES = [
            {
                id: 'HLT-3321',
                type: 'Health Insurance',
                policyholder: 'Devaganeshvar',
                coverage: '5,00,000',
                premium: '8,450/yr',
                dueDate: '30 June 2026',
                status: 'Active',
                icon: 'fa-heart-pulse',
                color: 'success'
            },
            {
                id: 'MOT-5587',
                type: 'Motor Insurance (Private Car)',
                policyholder: 'Devaganeshvar',
                coverage: '4,20,000',
                premium: '12,300/yr',
                dueDate: '12 Sept 2026',
                status: 'Active',
                icon: 'fa-car',
                color: 'primary'
            },
            {
                id: 'LIF-1190',
                type: 'Term Life Insurance',
                policyholder: 'Devaganeshvar',
                coverage: '1,00,00,000',
                premium: '18,200/yr',
                dueDate: '15 Oct 2026',
                status: 'Active',
                icon: 'fa-shield-halved',
                color: 'info'
            },
            {
                id: 'TRV-9012',
                type: 'Travel Insurance',
                policyholder: 'Devaganeshvar',
                coverage: '50,000',
                premium: '1,200/trip',
                dueDate: '01 Jan 2026',
                status: 'Expired',
                icon: 'fa-umbrella',
                color: 'secondary'
            },
            {
                id: 'APP-1001',
                type: 'Property Insurance',
                policyholder: 'Devaganeshvar',
                coverage: '45,00,000',
                premium: '5,000/yr',
                dueDate: '05 July 2026',
                status: 'Applied',
                icon: 'fa-house-chimney',
                color: 'warning'
            }
        ];
        localStorage.setItem('mockPolicies', JSON.stringify(DEFAULT_POLICIES));
        localStorage.setItem('mockPolicies_v3', 'true');
    }
})();

// Centralized Policy Management
window.PolicySync = {
    getPolicies: function() {
        try {
            return JSON.parse(localStorage.getItem('mockPolicies')) || [];
        } catch (e) {
            console.error("Error reading policies from local storage", e);
            return [];
        }
    },
    setPolicies: function(policies) {
        localStorage.setItem('mockPolicies', JSON.stringify(policies));
    },
    updatePolicyStatus: function(policyId, newStatus) {
        const policies = this.getPolicies();
        const policy = policies.find(p => p.id === policyId);
        if (policy) {
            policy.status = newStatus;
            this.setPolicies(policies);
        }
    },
    addPolicy: function(policyObj) {
        const policies = this.getPolicies();
        policies.push(policyObj);
        this.setPolicies(policies);
    }
};