document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (contactForm.checkValidity()) {
                const submitBtn = document.getElementById('btnContactSubmit');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fa-solid fa-check me-2"></i>Message Sent!';
                    submitBtn.classList.remove('btn-primary-auth');
                    submitBtn.classList.add('btn-success');
                    submitBtn.style.backgroundColor = '#10B981';
                    submitBtn.style.borderColor = '#10B981';
                    
                    // Add toast
                    let toastContainer = document.querySelector('.toast-container');
                    if (!toastContainer) {
                        toastContainer = document.createElement('div');
                        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
                        toastContainer.style.zIndex = '1055';
                        document.body.appendChild(toastContainer);
                    }
                    
                    const toastId = 'toast-' + Date.now();
                    const toastHTML = `
                        <div id="${toastId}" class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                            <div class="d-flex">
                                <div class="toast-body">
                                    <i class="fa-solid fa-circle-check me-2"></i> We have received your message! We'll get back to you shortly.
                                </div>
                                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                        </div>
                    `;
                    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
                    
                    const toastEl = document.getElementById(toastId);
                    const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
                    toast.show();
                    
                    toastEl.addEventListener('hidden.bs.toast', () => {
                        toastEl.remove();
                    });
                    
                    setTimeout(() => {
                        contactForm.reset();
                        contactForm.classList.remove('was-validated');
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        submitBtn.classList.add('btn-primary-auth');
                        submitBtn.classList.remove('btn-success');
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.borderColor = '';
                    }, 3000);
                }, 1500);
            } else {
                contactForm.classList.add('was-validated');
            }
        });
    }
});