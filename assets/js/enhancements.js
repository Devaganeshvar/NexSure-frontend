/**
 * enhancements.js
 * Professional UI/UX Additions for NexSure
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Button Ripple Effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousedown', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('nexsure-ripple');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // 2. Scroll Reveal Observer (Professional Fade-Up)
    // Dynamically add reveal-up class to cards that don't have it yet, 
    // to automatically enhance existing layouts without touching HTML.
    const autoRevealElements = document.querySelectorAll('.card:not(.no-reveal), .policy-card, .list-card, .dashboard-card');
    autoRevealElements.forEach((el, index) => {
        // Only apply if it's below the fold initially to avoid jumping,
        // or just apply it and let the observer handle it quickly.
        el.classList.add('reveal-up');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -30px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a tiny stagger if multiple elements appear at once
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, 50);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up');
    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Simulated Skeleton Loading for Dashboard Elements
    // Gives a premium "fetching data" feel on fresh page loads
    const dataContainers = document.querySelectorAll('.table-responsive, .chart-container, .kpi-card');
    if (dataContainers.length > 0) {
        dataContainers.forEach(container => {
            container.classList.add('skeleton-loading');
        });
        
        // Remove skeleton after a brief, professional delay
        setTimeout(() => {
            dataContainers.forEach(container => {
                container.classList.remove('skeleton-loading');
                // Optional: add a tiny fade-in here
                container.style.animation = 'nexsure-fade-in 0.3s ease forwards';
            });
        }, 600);
    }
});
