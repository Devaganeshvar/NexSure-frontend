/**
 * theme-manager.js
 * Handles global theme switching (Light, Dark, System) using Bootstrap 5.3.
 */
(function() {
    'use strict';
    
    const THEME_STORAGE_KEY = 'nexsure_theme_v2';

    const getPreferredTheme = () => {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme) {
            return storedTheme;
        }
        return 'light'; // Default to light theme
    };

    const setTheme = theme => {
        let activeTheme = theme;
        if (theme === 'system') {
            activeTheme = 'light';
        }
        document.documentElement.setAttribute('data-bs-theme', activeTheme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        
        // Custom logic to handle the hardcoded dark blue navbars in light mode
        const navbars = document.querySelectorAll('.dashboard-nav, .page-header');
        navbars.forEach(nav => {
            if (activeTheme === 'dark') {
                nav.classList.add('bg-dark');
                // Remove custom blue background if present via inline style
                if (nav.style.backgroundColor) {
                    nav.dataset.originalBg = nav.style.backgroundColor;
                    nav.style.backgroundColor = '';
                }
            } else {
                nav.classList.remove('bg-dark');
                if (nav.dataset.originalBg && nav.classList.contains('dashboard-nav')) {
                    nav.style.backgroundColor = nav.dataset.originalBg;
                } else if (!nav.classList.contains('bg-white') && nav.classList.contains('dashboard-nav')) {
                    nav.style.backgroundColor = '#16213e'; // Default light mode blue
                }
            }
        });
        
        // Dispatch event for other scripts
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: activeTheme } }));
    };

    // Apply early to prevent FOUC
    setTheme(getPreferredTheme());

    window.ThemeManager = {
        setTheme: setTheme,
        getTheme: () => localStorage.getItem(THEME_STORAGE_KEY) || 'system'
    };

    // Listen for OS theme changes if set to system
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (localStorage.getItem(THEME_STORAGE_KEY) === 'system' || !localStorage.getItem(THEME_STORAGE_KEY)) {
            setTheme('system');
        }
    });

    // Run again on DOMContentLoaded just in case some elements weren't caught
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTheme(getPreferredTheme());
        });
    }

// Google Translate Integration
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,ta',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
};

window.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('google_translate_element')) {
        const div = document.createElement('div');
        div.id = 'google_translate_element';
        div.style.display = 'none'; // Hidden widget
        document.body.appendChild(div);
        
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(script);
        
        // Hide google top banner
        const style = document.createElement('style');
        style.textContent = `
            body { top: 0 !important; }
            .goog-te-banner-frame { display: none !important; }
        `;
        document.head.appendChild(style);
    }
});

})();
