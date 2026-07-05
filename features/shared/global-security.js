/**
 * Global Security Utility
 * Prevents double-submission of forms by disabling submit buttons
 * after the first click.
 */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            // Only disable if the form is actually valid and will be submitted,
            // or if it doesn't use HTML5 validation.
            if (this.checkValidity()) {
                const submitButtons = this.querySelectorAll('button[type="submit"], input[type="submit"]');
                submitButtons.forEach(btn => {
                    // Prevent modifying if already processing
                    if (!btn.disabled) {
                        // Store original text
                        const originalContent = btn.innerHTML || btn.value;
                        btn.dataset.originalContent = originalContent;
                        
                        // Disable and show spinner
                        btn.disabled = true;
                        if (btn.tagName === 'BUTTON') {
                            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
                        } else {
                            btn.value = 'Processing...';
                        }
                    }
                });
            }
        });
    });
});
