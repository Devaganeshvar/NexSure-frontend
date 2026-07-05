document.addEventListener('DOMContentLoaded', () => {
    const toastEl = document.getElementById('policiesToast');
    const toast = toastEl ? new bootstrap.Toast(toastEl, { delay: 3000 }) : null;
    
    function showToast(msg, isSuccess = true) {
        if (!toastEl) return;
        const body = toastEl.querySelector('.toast-body');
        const icon = isSuccess ? '<i class="fa-solid fa-circle-check text-success fs-5"></i>' : '<i class="fa-solid fa-spinner fa-spin text-info fs-5"></i>';
        body.innerHTML = icon + ' <span>' + msg + '</span>';
        toast.show();
    }

    // --- Dynamic Rendering Logic ---
    function renderPolicies() {
        const activeContainer = document.getElementById('activePoliciesContainer');
        const expiredContainer = document.getElementById('expiredPoliciesContainer');
        
        if (!activeContainer || !expiredContainer) return;
        
        activeContainer.innerHTML = '';
        expiredContainer.innerHTML = '';
        
        const policies = window.DataStore ? window.DataStore.getPolicies() : [];
        if (!policies || policies.length === 0) {
            activeContainer.innerHTML = '<div class="alert alert-danger">No policies found. DataStore available: ' + (!!window.DataStore) + '</div>';
            return;
        }
        
        policies.forEach(policy => {
            const isActive = policy.status.toLowerCase() === 'active';
            const badgeClass = isActive ? 'bg-success text-success border-success' : 'bg-secondary text-secondary border-secondary';
            
            // Build dynamic row content based on properties
            let rowHtml = `
                <div class="col-sm-6 col-md-3">
                    <div class="detail-label">Policyholder</div>
                    <div class="detail-value ${!isActive ? 'text-muted' : ''}">${policy.policyholder}</div>
                </div>
            `;
            
            if (policy.coverage) {
                rowHtml += `
                    <div class="col-sm-6 col-md-3">
                        <div class="detail-label">${policy.coverageLabel || 'Sum Insured'}</div>
                        <div class="detail-value ${!isActive ? 'text-muted' : ''}">&#8377;${policy.coverage}</div>
                    </div>
                `;
            }
            
            if (isActive) {
                rowHtml += `
                    <div class="col-sm-6 col-md-3">
                        <div class="detail-label">Base Premium</div>
                        <div class="detail-value">&#8377;${policy.premium}</div>
                    </div>
                    <div class="col-sm-6 col-md-3">
                        <div class="detail-label">Next Due Date</div>
                        <div class="detail-value text-danger">${policy.dueDate}</div>
                    </div>
                `;
            } else {
                rowHtml += `
                    <div class="col-sm-6 col-md-3">
                        <div class="detail-label">Expired On</div>
                        <div class="detail-value text-muted">${policy.dueDate}</div>
                    </div>
                `;
            }
            
            // Action buttons
            let actionsHtml = '';
            if (isActive) {
                actionsHtml = `<div class="d-flex flex-wrap gap-3 pt-4 border-top">`;
                
                if (policy.type.toLowerCase().includes('health')) {
                    actionsHtml += `
                        <button class="btn btn-dark-blue px-4 py-2 fw-medium rounded-3" data-bs-toggle="modal" data-bs-target="#renewModal">Renew Policy</button>
                    `;
                }
                if (policy.type.toLowerCase().includes('life')) {
                    actionsHtml += `
                        <button class="btn border px-4 py-2 fw-medium rounded-3 bg-light hover-bg-white text-dark" data-bs-toggle="modal" data-bs-target="#editNomineeModal">Edit Nominee</button>
                    `;
                }
                
                actionsHtml += `
                    <a href="../claims/claims.html" class="btn border px-4 py-2 fw-medium rounded-3 bg-light hover-bg-white text-dark text-decoration-none">File Claim</a>
                    <button class="btn border px-4 py-2 fw-medium rounded-3 bg-light hover-bg-white text-dark btn-download">Download Certificate</button>
                    <button class="btn border px-4 py-2 fw-medium rounded-3 bg-light hover-bg-white text-dark" data-bs-toggle="modal" data-bs-target="#policyDetailsModal">View Details</button>
                </div>`;
            }

            const cardHtml = `
                <div class="col-12 policy-card-container">
                    <div class="policy-card p-4 p-md-5 ${!isActive ? 'bg-light' : ''}" ${!isActive ? 'style="opacity: 0.8;"' : ''}>
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <div class="d-flex align-items-center gap-3">
                                <div class="bg-${policy.color} bg-opacity-10 text-${policy.color} rounded-circle d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; font-size: 1.5rem;">
                                    <i class="fa-solid ${policy.icon}"></i>
                                </div>
                                <h4 class="fw-bold mb-0 ${isActive ? 'text-dark-blue' : 'text-secondary'}">${policy.type} (${policy.id})</h4>
                            </div>
                            <span class="badge ${badgeClass} bg-opacity-10 border border-opacity-25 px-3 py-2 rounded-pill">${policy.status}</span>
                        </div>

                        <div class="row g-4 mb-4">
                            ${rowHtml}
                        </div>
                        ${actionsHtml}
                    </div>
                </div>
            `;
            
            if (isActive) {
                activeContainer.innerHTML += cardHtml;
            } else {
                expiredContainer.innerHTML += cardHtml;
            }
        });
    }

    renderPolicies();

    // Event Delegation for dynamic buttons
    document.body.addEventListener('click', function(e) {
        // Download Buttons
        if (e.target.closest('.btn-download')) {
            const btn = e.target.closest('.btn-download');
            e.preventDefault();
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
            btn.disabled = true;
            showToast('Generating document...', false);
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                showToast('Document downloaded successfully!', true);
            }, 1500);
        }

        // Active Policy Context Setter
        const card = e.target.closest('.policy-card');
        if (card) {
            const target = e.target.closest('button, a');
            if (target) {
                try {
                    const titleEl = card.querySelector('h4');
                    const titleText = titleEl ? titleEl.innerText : '';
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
                        if (label.innerText.toLowerCase().includes('premium') || label.innerText.toLowerCase().includes('sum')) {
                            const valEl = card.querySelectorAll('.detail-value')[idx];
                            if (valEl && label.innerText.toLowerCase().includes('premium')) {
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
            }
        }
    });

    // Renew Modal action
    const btnConfirmRenew = document.getElementById('btnConfirmRenew');
    if(btnConfirmRenew) {
        btnConfirmRenew.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Redirecting...';
            setTimeout(() => {
                window.location.href = '../payment/payments.html';
            }, 1000);
        });
    }

    // Edit Nominee Validation
    const editNomineeForm = document.getElementById('editNomineeForm');
    if(editNomineeForm) {
        editNomineeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!this.checkValidity()) {
                e.stopPropagation();
            } else {
                const modalEl = document.getElementById('editNomineeModal');
                const modal = bootstrap.Modal.getInstance(modalEl);
                modal.hide();
                showToast('Nominee details updated successfully!', true);
            }
            this.classList.add('was-validated');
        });
    }
});