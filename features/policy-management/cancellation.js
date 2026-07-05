document.addEventListener('DOMContentLoaded', () => {
    const toastEl = document.getElementById('cancelToast');
    const toast = toastEl ? new bootstrap.Toast(toastEl, { delay: 3000 }) : null;
    
    function showToast(msg, isSuccess = true) {
        if (!toastEl) return;
        const body = toastEl.querySelector('.toast-body');
        const icon = isSuccess ? '<i class="fa-solid fa-circle-check text-success fs-5"></i>' : '<i class="fa-solid fa-spinner fa-spin text-info fs-5"></i>';
        body.innerHTML = icon + ' <span>' + msg + '</span>';
        toast.show();
    }

    
    // Populate active policies dynamically in the cancellation modal
    const cancelSelect = document.querySelector('#cancelModal select');
    if (cancelSelect && window.DataStore) {
        const activePolicies = window.DataStore.getPolicies().filter(p => p.status === 'Active');
        let optionsHTML = '<option value="" selected disabled>Select...</option>';
        if (activePolicies.length === 0) {
            optionsHTML = '<option value="" disabled>No active policies available</option>';
        } else {
            activePolicies.forEach(p => {
                optionsHTML += `<option value="${p.id}">${p.type} (${p.id})</option>`;
            });
        }
        cancelSelect.innerHTML = optionsHTML;
    }

    // Cancel Form Submission
    const cancelForm = document.getElementById('cancelForm');
    if (cancelForm) {
        cancelForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!this.checkValidity()) {
                e.stopPropagation();
            } else {
                const btn = document.getElementById('btnSubmitCancel');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
                btn.disabled = true;
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    const modalEl = document.getElementById('cancelModal');
                    bootstrap.Modal.getInstance(modalEl).hide();
                    showToast('Cancellation request submitted successfully.', true);
                }, 1500);
            }
            this.classList.add('was-validated');
        });
    }

    // Withdraw Confirm
    const btnConfirmWithdraw = document.getElementById('btnConfirmWithdraw');
    if (btnConfirmWithdraw) {
        btnConfirmWithdraw.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>...';
            this.disabled = true;
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                const modalEl = document.getElementById('withdrawModal');
                bootstrap.Modal.getInstance(modalEl).hide();
                showToast('Request withdrawn. Policy remains active.', true);
                
                // Simulate UI removal
                const reqCard = document.querySelector('.card.border-warning');
                if(reqCard) reqCard.remove();
            }, 1000);
        });
    }

    // Download
    document.querySelectorAll('.btn-download').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
            this.disabled = true;
            
            showToast('Generating document...', false);
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                showToast('Document downloaded successfully.', true);
            }, 1200);
        });
    });
});