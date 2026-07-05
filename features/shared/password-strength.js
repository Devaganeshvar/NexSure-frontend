// Password Strength & Caps Lock Warning
document.addEventListener('DOMContentLoaded', () => {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
        // Create Caps Lock Warning
        const capsWarning = document.createElement('div');
        capsWarning.className = 'text-warning small fw-medium mt-1 d-none';
        capsWarning.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Caps Lock is ON';
        input.parentNode.appendChild(capsWarning);
        
        input.addEventListener('keyup', (e) => {
            if (e.getModifierState && e.getModifierState('CapsLock')) {
                capsWarning.classList.remove('d-none');
            } else {
                capsWarning.classList.add('d-none');
            }
        });
        
        // If this is a register page, add strength meter
        if (window.location.href.includes('register')) {
            const meterContainer = document.createElement('div');
            meterContainer.className = 'progress mt-2';
            meterContainer.style.height = '5px';
            
            const meterBar = document.createElement('div');
            meterBar.className = 'progress-bar bg-danger';
            meterBar.style.width = '0%';
            
            meterContainer.appendChild(meterBar);
            input.parentNode.appendChild(meterContainer);
            
            input.addEventListener('input', (e) => {
                const val = e.target.value;
                let strength = 0;
                
                if (val.length > 5) strength += 25;
                if (val.length > 8) strength += 25;
                if (/[A-Z]/.test(val)) strength += 25;
                if (/[0-9]/.test(val)) strength += 25;
                
                meterBar.style.width = strength + '%';
                
                if (strength <= 25) {
                    meterBar.className = 'progress-bar bg-danger';
                } else if (strength <= 50) {
                    meterBar.className = 'progress-bar bg-warning';
                } else if (strength <= 75) {
                    meterBar.className = 'progress-bar bg-info';
                } else {
                    meterBar.className = 'progress-bar bg-success';
                }
            });
        }
    });
});
