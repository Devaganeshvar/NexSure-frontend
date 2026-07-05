document.addEventListener('DOMContentLoaded', () => {
    // Password visibility toggle for multiple fields
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            
            if (passwordInput) {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                // Toggle icon logic
                const icon = btn.querySelector('i');
                if (type === 'text') {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                } else {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                }
            }
        });
    });

    // Handle OTP Button simulation
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', () => {
            const originalText = sendOtpBtn.innerText;
            sendOtpBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
            sendOtpBtn.disabled = true;
            
            setTimeout(() => {
                sendOtpBtn.innerHTML = 'Sent!';
                sendOtpBtn.classList.remove('btn-primary-auth');
                sendOtpBtn.classList.add('btn-success');
                sendOtpBtn.style.backgroundColor = '#10B981';
                sendOtpBtn.style.borderColor = '#10B981';
                
                setTimeout(() => {
                    sendOtpBtn.innerHTML = originalText;
                    sendOtpBtn.disabled = false;
                    sendOtpBtn.classList.add('btn-primary-auth');
                    sendOtpBtn.classList.remove('btn-success');
                    sendOtpBtn.style.backgroundColor = '';
                    sendOtpBtn.style.borderColor = '';
                }, 3000);
            }, 1000);
        });
    }

    // Input filled state handling (to mimic design where filled inputs have slight background color)
    const inputs = document.querySelectorAll('.custom-input-group input');
    inputs.forEach(input => {
        const updateFilledState = () => {
            if (input.value.trim() !== '') {
                input.closest('.custom-input-group').classList.add('filled');
            } else {
                input.closest('.custom-input-group').classList.remove('filled');
            }
        };
        
        // Initial check
        updateFilledState();
        
        // On change
        input.addEventListener('input', updateFilledState);
    });

    // Password Strength Logic
    const passwordInputEl = document.getElementById('password');
    const strengthBar = document.getElementById('passwordStrengthBar');
    const strengthText = document.getElementById('passwordStrengthText');

    if (passwordInputEl && strengthBar && strengthText) {
        passwordInputEl.addEventListener('input', (e) => {
            const val = e.target.value;
            let strength = 0;
            
            if (val.length > 0) {
                if (val.length >= 8) strength += 1;
                if (val.match(/[a-z]+/)) strength += 1;
                if (val.match(/[A-Z]+/)) strength += 1;
                if (val.match(/[0-9]+/)) strength += 1;
                if (val.match(/[$@#&!]+/)) strength += 1;
            }

            switch(strength) {
                case 0:
                    strengthBar.style.width = '0%';
                    strengthBar.className = 'progress-bar';
                    strengthText.textContent = 'Enter password';
                    strengthText.style.color = '#94a3b8';
                    break;
                case 1:
                case 2:
                    strengthBar.style.width = '33%';
                    strengthBar.className = 'progress-bar bg-danger';
                    strengthText.textContent = 'Weak password';
                    strengthText.style.color = '#dc3545';
                    break;
                case 3:
                case 4:
                    strengthBar.style.width = '66%';
                    // In screenshot it's green at ~60%
                    strengthBar.className = 'progress-bar bg-success';
                    strengthText.textContent = 'Strong password';
                    strengthText.style.color = '#10B981';
                    break;
                case 5:
                    strengthBar.style.width = '100%';
                    strengthBar.className = 'progress-bar bg-success';
                    strengthText.textContent = 'Very strong password';
                    strengthText.style.color = '#10B981';
                    break;
            }
        });
    }

    // Handle form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const registerBtn = document.querySelector('.btn-register');
            const originalText = registerBtn.innerText;
            registerBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creating account...';
            registerBtn.disabled = true;
            
            setTimeout(() => {
                registerBtn.innerHTML = originalText;
                registerBtn.disabled = false;
                
                // Fetch latest privacy policy from localStorage
                const privacyModalEl = document.getElementById('privacyModal');
                const dynamicContent = document.getElementById('dynamicPrivacyContent');
                
                if (privacyModalEl && dynamicContent) {
                    const savedPoliciesStr = localStorage.getItem('termsPoliciesPublished');
                    let policyHtml = '';
                    
                    if (savedPoliciesStr) {
                        try {
                            const policies = JSON.parse(savedPoliciesStr);
                            const activePolicies = policies.filter(p => p.enabled);
                            
                            if (activePolicies.length > 0) {
                                activePolicies.forEach(p => {
                                    policyHtml += `
                                        <div class="mb-4">
                                            <h6 class="fw-bold text-dark border-bottom pb-2">${p.title}</h6>
                                            <div class="text-muted">${p.content}</div>
                                        </div>
                                    `;
                                });
                            } else {
                                policyHtml = '<p class="text-muted">No policies are currently active.</p>';
                            }
                        } catch (e) {
                            policyHtml = '<p class="text-danger">Error loading policies.</p>';
                        }
                    } else {
                        policyHtml = `
                            <div class="mb-4" id="policy-1">
                                <h6 class="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                                    <i class="fa-solid fa-circle-1 fs-5 text-secondary"></i> General Policy
                                </h6>
                                <p class="text-muted">This policy governs the access and usage of the Insurance Policy Management System (IPMS). Access is restricted strictly to authorized users (Policyholders, Insurance Officers, and Administrators). All user interactions, logins, password changes, and transaction attempts are strictly monitored, audited, and logged to immutable security ledgers. Users must adhere to account security protocols, including regular password rotation and immediate reporting of any suspected credential compromises.</p>
                            </div>
                            <div class="mb-4" id="policy-2">
                                <h6 class="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                                    <i class="fa-solid fa-circle-2 fs-5 text-secondary"></i> Issuance Policy
                                </h6>
                                <p class="text-muted">Policies are generated based on verified customer information, mandatory KYC submission, and subsequent underwriting review. Any intentional or negligent misrepresentation of material facts during the application or quotation phase will result in the immediate invalidation of the policy. All adjustments, endorsements, or changes to policy coverage require formal underwriting approval before they become effective.</p>
                            </div>
                            <div class="mb-4" id="policy-3">
                                <h6 class="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                                    <i class="fa-solid fa-circle-3 fs-5 text-secondary"></i> Cancellation Policy
                                </h6>
                                <p class="text-muted">Only active insurance policies are eligible for cancellation. Cancellation requests may be initiated by the policyholder or triggered by the system due to non-payment of premiums. Once cancelled, a policy cannot be reinstated or reactivated. Users must type the exact confirmation phrase and acknowledge the computed refund amount and cancellation charges before the request is finalized. A formal Cancellation Certificate and Refund Advice will be generated upon completion.</p>
                            </div>
                            <div class="mb-4" id="policy-4">
                                <h6 class="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                                    <i class="fa-solid fa-circle-4 fs-5 text-secondary"></i> Payment Policy
                                </h6>
                                <p class="text-muted">Premium payments must be processed using approved electronic channels, including UPI, debit/credit cards, netbanking, or NEFT/RTGS. Premium calculations are performed server-side based on actuarial algorithms and cannot be modified. The system will automatically reject any payments that do not exactly match the outstanding premium amount. Successful payments will generate a GST Premium Receipt and a corresponding payment ledger entry.</p>
                            </div>
                            <div class="mb-4" id="policy-5">
                                <h6 class="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                                    <i class="fa-solid fa-circle-5 fs-5 text-secondary"></i> Refund Policy
                                </h6>
                                <p class="text-muted">Refund eligibility and amounts are calculated automatically based on the elapsed tenure of the policy using the following standard slabs: 80% refund if less than 25% of the tenure has elapsed; 50% refund if 25% to 50% has elapsed; 25% refund if 50% to 75% has elapsed; and 0% refund if more than 75% of the tenure has elapsed. Applicable administrative cancellation charges will be deducted from the calculated refund. Failed refunds will trigger an immediate alert to system administrators.</p>
                            </div>
                            <div class="mb-4" id="policy-6">
                                <h6 class="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                                    <i class="fa-solid fa-circle-6 fs-5 text-secondary"></i> Claims Policy
                                </h6>
                                <p class="text-muted">All First Notice of Loss (FNOL) claims must be submitted truthfully under absolute legal declaration. Users must review and accept the Truthful FNOL Declaration before filing. The system enforces a strict state transition sequence for claims: Submitted → Under Review → Approved/Rejected → Settled → Closed. Out-of-sequence updates are blocked, and all processing actions require underwriter validation and audit logging.</p>
                            </div>
                            <div class="mb-4" id="policy-7">
                                <h6 class="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                                    <i class="fa-solid fa-circle-7 fs-5 text-secondary"></i> Renewal Policy
                                </h6>
                                <p class="text-muted">Policies must be renewed prior to their expiration date to maintain continuous coverage and avoid a break in policy benefits. A grace period of 15 days is provided post-expiration; however, claims arising during this uninsured grace period are strictly excluded from coverage. Renewals are subject to reassessment based on claims history and updated tariff rates.</p>
                            </div>
                        `;
                    }
                    
                    dynamicContent.innerHTML = policyHtml;
                    
                    const privacyModal = new bootstrap.Modal(privacyModalEl);
                    privacyModal.show();
                    
                    // Logic for Scroll Progress and Checkbox
                    const scrollBody = document.getElementById('modalScrollBody');
                    const progressBar = document.getElementById('modalProgressBar');
                    const progressText = document.getElementById('modalProgressText');
                    const acceptCheckbox = document.getElementById('acceptTermsCheckbox');
                    const btnAcceptPolicy = document.getElementById('btnAcceptPolicy');

                    if (scrollBody && progressBar && progressText) {
                        scrollBody.addEventListener('scroll', () => {
                            // Calculate scroll percentage
                            const scrollTop = scrollBody.scrollTop;
                            const scrollHeight = scrollBody.scrollHeight - scrollBody.clientHeight;
                            const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 100;
                            
                            const percentStr = Math.min(100, Math.round(scrollPercent)) + '%';
                            progressBar.style.width = percentStr;
                            progressText.textContent = percentStr;
                        });
                        
                        // Trigger once to set initial state
                        scrollBody.dispatchEvent(new Event('scroll'));
                    }

                    if (acceptCheckbox && btnAcceptPolicy) {
                        acceptCheckbox.addEventListener('change', (e) => {
                            btnAcceptPolicy.disabled = !e.target.checked;
                        });
                    }

                    if (btnAcceptPolicy) {
                        btnAcceptPolicy.onclick = function() {
                            privacyModal.hide();
                            // Redirect would happen here
                            window.location.href = '../customer-dashboard/home.html';
                        };
                    }
                } else {
                    // Fallback redirect if modal missing
                    window.location.href = '../customer-dashboard/home.html';
                }
            }, 1500);
        });
    }
});