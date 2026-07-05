document.addEventListener('DOMContentLoaded', () => {
    // Intercept clicks on policy cards to set active context
    document.querySelectorAll('.policy-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Only set context if they clicked a button or link inside the card
            const target = e.target.closest('button, a');
            if (!target) return;

            // Extract details from the card
            try {
                const titleEl = card.querySelector('h4');
                const titleText = titleEl ? titleEl.innerText : '';
                // e.g., "Health Insurance (HLT-3321)"
                let id = 'Unknown';
                let type = titleText;
                const match = titleText.match(/\(([^)]+)\)/);
                if (match) {
                    id = match[1];
                    type = titleText.replace(`(${id})`, '').trim();
                }

                const statusEl = card.querySelector('.badge');
                const status = statusEl ? statusEl.innerText.trim() : 'Unknown';

                let premium = '--';
                const labels = card.querySelectorAll('.detail-label');
                labels.forEach((label, idx) => {
                    if (label.innerText.toLowerCase().includes('premium')) {
                        const valEl = card.querySelectorAll('.detail-value')[idx];
                        if (valEl) {
                            // Strip non-numeric except comma
                            const matches = valEl.innerText.match(/[\d,]+/);
                            if (matches) premium = matches[0];
                        }
                    }
                });

                if (window.setNexsureActivePolicy) {
                    window.setNexsureActivePolicy(id, type, status, premium);
                }
            } catch (err) {
                console.error('Error setting policy context:', err);
            }
        });
    });

    // Handle toast messages for dummy buttons
    const btnDownloads = document.querySelectorAll('.btn-download');
    btnDownloads.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Document download initiated.');
        });
    });
});