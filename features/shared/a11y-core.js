document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject A11y Widget HTML if it doesn't exist
    if (!document.getElementById('a11y-widget-btn')) {
        const widgetHTML = `
            <button id="a11y-widget-btn" aria-label="Accessibility Options" aria-expanded="false" aria-controls="a11y-panel">
                <i class="fa-solid fa-universal-access"></i>
            </button>
            <div id="a11y-panel" role="dialog" aria-modal="true" aria-label="Accessibility Settings">
                <div class="a11y-panel-header">
                    <h3>Accessibility Options</h3>
                    <button id="a11y-close-btn" aria-label="Close Accessibility Options" style="background:none;border:none;color:white;cursor:pointer;font-size:18px;">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="a11y-panel-body">
                    <div class="a11y-toggle-row">
                        <label for="a11y-toggle-contrast" class="fw-medium text-dark">High Contrast</label>
                        <label class="a11y-switch">
                            <input type="checkbox" id="a11y-toggle-contrast">
                            <span class="a11y-slider"></span>
                        </label>
                    </div>
                    <div class="a11y-toggle-row">
                        <label for="a11y-toggle-text" class="fw-medium text-dark">Large Text</label>
                        <label class="a11y-switch">
                            <input type="checkbox" id="a11y-toggle-text">
                            <span class="a11y-slider"></span>
                        </label>
                    </div>
                    <div class="a11y-toggle-row">
                        <label for="a11y-toggle-motion" class="fw-medium text-dark">Reduce Motion</label>
                        <label class="a11y-switch">
                            <input type="checkbox" id="a11y-toggle-motion">
                            <span class="a11y-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    // 2. Logic
    const btn = document.getElementById('a11y-widget-btn');
    const panel = document.getElementById('a11y-panel');
    const closeBtn = document.getElementById('a11y-close-btn');
    
    const toggleContrast = document.getElementById('a11y-toggle-contrast');
    const toggleText = document.getElementById('a11y-toggle-text');
    const toggleMotion = document.getElementById('a11y-toggle-motion');

    // Load Prefs
    const prefs = JSON.parse(localStorage.getItem('nexsure_a11y')) || {
        contrast: false,
        text: false,
        motion: false
    };

    function applyPrefs() {
        toggleContrast.checked = prefs.contrast;
        toggleText.checked = prefs.text;
        toggleMotion.checked = prefs.motion;

        document.body.classList.toggle('a11y-high-contrast', prefs.contrast);
        document.body.classList.toggle('a11y-large-text', prefs.text);
        document.body.classList.toggle('a11y-reduced-motion', prefs.motion);
    }

    applyPrefs();

    function savePrefs() {
        prefs.contrast = toggleContrast.checked;
        prefs.text = toggleText.checked;
        prefs.motion = toggleMotion.checked;
        localStorage.setItem('nexsure_a11y', JSON.stringify(prefs));
        applyPrefs();
    }

    [toggleContrast, toggleText, toggleMotion].forEach(toggle => {
        if(toggle) toggle.addEventListener('change', savePrefs);
    });

    // Toggle Panel
    function togglePanel() {
        const isShowing = panel.classList.contains('show');
        if (isShowing) {
            panel.classList.remove('show');
            btn.setAttribute('aria-expanded', 'false');
            btn.focus();
        } else {
            panel.classList.add('show');
            btn.setAttribute('aria-expanded', 'true');
            closeBtn.focus();
        }
    }

    if(btn) btn.addEventListener('click', togglePanel);
    if(closeBtn) closeBtn.addEventListener('click', togglePanel);

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('show')) {
            togglePanel();
        }
    });

    // Make sure standard bootstrap modals return focus on close
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('hidden.bs.modal', function () {
            // Find the trigger button (heuristically, or just let browser handle default if data-bs-target was used)
            // Bootstrap usually handles this natively.
        });
        
        // Ensure standard roles
        if(!modal.getAttribute('role')) modal.setAttribute('role', 'dialog');
        if(!modal.getAttribute('aria-modal')) modal.setAttribute('aria-modal', 'true');
    });

});