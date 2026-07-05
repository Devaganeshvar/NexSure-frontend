document.addEventListener('DOMContentLoaded', () => {
    const toastEl = document.getElementById('authToast');
    const toast = toastEl ? new bootstrap.Toast(toastEl, { delay: 3000 }) : null;
    
    function showToast(msg, isSuccess = true) {
        if (!toastEl) return;
        const body = toastEl.querySelector('.toast-body');
        const icon = isSuccess ? '<i class="fa-solid fa-circle-check text-success fs-5"></i>' : '<i class="fa-solid fa-spinner fa-spin text-info fs-5"></i>';
        body.innerHTML = icon + ' <span>' + msg + '</span>';
        toast.show();
    }

    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.classList.add('needs-validation');
        form.setAttribute('novalidate', '');
        
        // ensure inputs are required
        form.querySelectorAll('input:not([type="checkbox"])').forEach(i => i.setAttribute('required', 'true'));

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // special check for register
            const p1 = document.getElementById('password');
            const p2 = document.getElementById('confirmPassword');
            if(p1 && p2) {
                if(p1.value !== p2.value) {
                    p2.setCustomValidity('Passwords must match');
                } else {
                    p2.setCustomValidity('');
                }
            }

            if (!this.checkValidity()) {
                e.stopPropagation();
            } else {
                const btn = this.querySelector('button[type="submit"]') || this.querySelector('a.btn-dark-blue');
                if(btn) {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
                    btn.style.pointerEvents = 'none';
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.pointerEvents = 'auto';
                        
                        let targetUrl = '../customer-dashboard/home.html';
                        if(window.location.pathname.includes('register')) targetUrl = '../kyc/kyc.html';
                        if(window.location.pathname.includes('forgot')) targetUrl = '../auth/login.html';
                        if(window.location.pathname.includes('kyc')) targetUrl = '../customer-dashboard/home.html';
                        
                        showToast('Success! Redirecting...', true);
                        setTimeout(() => window.location.href = targetUrl, 1000);
                        
                    }, 1500);
                }
            }
            this.classList.add('was-validated');
        });
    });

    // KYC file upload simulation
    const dropzone = document.querySelector('.border-dashed');
    if(dropzone) {
        dropzone.addEventListener('click', () => {
            const btn = document.querySelector('form button[type="submit"]');
            dropzone.innerHTML = '<div class="text-center"><i class="fa-solid fa-spinner fa-spin fs-1 text-primary mb-3"></i><p>Uploading...</p></div>';
            setTimeout(() => {
                dropzone.innerHTML = '<div class="text-center"><i class="fa-solid fa-circle-check fs-1 text-success mb-3"></i><p>Document Uploaded Successfully</p></div>';
                dropzone.classList.add('border-success');
                dropzone.classList.remove('border-primary');
                if(btn) btn.disabled = false;
            }, 1500);
        });
    }
});