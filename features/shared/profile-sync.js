/**
 * profile-sync.js
 * Handles global state management for the customer profile.
 */
(function() {
    'use strict';

    const PROFILE_STORAGE_KEY = 'nexsure_customer_profile';

    const DEFAULT_PROFILE = {
        name: 'Rahul M.',
        email: 'devaganeshvar@gmail.com',
        password: 'Deva@2005',
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
                    return JSON.parse(stored);
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
            document.querySelectorAll('.profile-avatar, .user-dropdown .bg-black').forEach(el => {
                if (hasPhoto) {
                    el.style.backgroundImage = `url(${profile.photoBase64})`;
                    el.style.backgroundSize = 'cover';
                    el.style.backgroundPosition = 'center';
                } else {
                    el.style.backgroundImage = '';
                }
            });
            
            // Process img-based avatars (if any still exist)
            document.querySelectorAll('.user-dropdown img, img.profile-avatar').forEach(el => {
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