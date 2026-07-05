document.addEventListener('DOMContentLoaded', () => {
    // Input filled state handling (to mimic design where filled inputs have slight background color)
    const inputs = document.querySelectorAll('.custom-input-group input');
    inputs.forEach(input => {
        const updateFilledState = () => {
            if (input.value.trim() !== '') {
                input.closest('.custom-input-group').classList.add('filled');
            } else {
                // For forgot password, the design shows it filled even when placeholder is visible.
                // But typically we remove it if empty. We'll leave it filled by default via HTML class,
                // and if they type and delete, we'll let it remove just for interactivity,
                // but if we want it strictly like design, we can just let CSS handle it.
                // For now, let's keep the dynamic filled class logic just like login/register.
                input.closest('.custom-input-group').classList.remove('filled');
            }
        };
        
        // On change
        input.addEventListener('input', updateFilledState);
    });

    // Handle form submission
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const resetBtn = document.querySelector('.btn-reset');
            const originalText = resetBtn.innerHTML;
            resetBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending Link...';
            resetBtn.disabled = true;
            
            setTimeout(() => {
                resetBtn.innerHTML = '<i class="fa-solid fa-check me-2"></i>Link Sent!';
                resetBtn.classList.remove('btn-primary-auth');
                resetBtn.classList.add('btn-success');
                resetBtn.style.backgroundColor = '#10B981';
                resetBtn.style.borderColor = '#10B981';
                
                setTimeout(() => {
                    resetBtn.innerHTML = originalText;
                    resetBtn.disabled = false;
                    resetBtn.classList.add('btn-primary-auth');
                    resetBtn.classList.remove('btn-success');
                    resetBtn.style.backgroundColor = '';
                    resetBtn.style.borderColor = '';
                }, 3000);
            }, 1500);
        });
    }
});