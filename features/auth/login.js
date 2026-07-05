document.addEventListener('DOMContentLoaded', () => {
    // Password visibility toggle
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            const icon = togglePassword.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    }

    // Handle form submission (placeholder)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Typically this would call an authentication service
            console.log('Login submitted');
            
            // Example of getting values
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (email && password) {
                // Default hardcoded credentials for various roles
                const roles = {
                    admin: { email: 'admin@imps.in', pass: 'Admin@123', redirect: '../admin-dashboard/dashboard.html' },
                    officer: { email: 'kavitha@imps.in', pass: 'Deva@2005', redirect: '../admin-dashboard/officer-dashboard.html' },
                    customer: { email: 'devaganeshvar@gmail.com', pass: 'Deva@2005', redirect: '../customer-dashboard/home.html' }
                };
                
                // Allow Customer Profile settings to override the default customer credentials
                try {
                    const stored = localStorage.getItem('nexsure_customer_profile');
                    if(stored) {
                        const profile = JSON.parse(stored);
                        roles.customer.email = profile.email;
                        roles.customer.password = profile.password;
                    }
                } catch(e) {}
                
                // Check which role the user is logging in as
                let targetRedirect = null;
                let userRole = null;
                
                if (email === roles.admin.email && password === roles.admin.pass) {
                    targetRedirect = roles.admin.redirect;
                    userRole = 'admin';
                } else if (email === roles.officer.email && password === roles.officer.pass) {
                    targetRedirect = roles.officer.redirect;
                    userRole = 'officer';
                } else if (email === roles.customer.email && password === roles.customer.pass) {
                    targetRedirect = roles.customer.redirect;
                    userRole = 'customer';
                }
                
                if (targetRedirect && userRole) {
                    // Set local storage for auth-guard
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('userRole', userRole);
                    // Simulate login
                    const loginBtn = document.querySelector('.btn-login');
                    const originalText = loginBtn.innerText;
                    loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Logging in...';
                    loginBtn.disabled = true;
                    
                    setTimeout(() => {
                        loginBtn.innerHTML = originalText;
                        loginBtn.disabled = false;
                        const cacheBuster = targetRedirect.includes('?') ? '&cb=' : '?cb=';
                        window.location.href = targetRedirect + cacheBuster + new Date().getTime();
                    }, 1500);
                } else {
                    alert('Invalid email or password. Please try again.');
                }
            }
        });
    }

    // Input filled state handling (to mimic design where filled inputs have slight background color)
    const emailInput = document.getElementById('email');
    if (emailInput) {
        const updateEmailFilledState = () => {
            if (emailInput.value.trim() !== '') {
                emailInput.closest('.custom-input-group').classList.add('filled');
            } else {
                emailInput.closest('.custom-input-group').classList.remove('filled');
            }
        };
        
        // Initial check
        updateEmailFilledState();
        
        // On change
        emailInput.addEventListener('input', updateEmailFilledState);
    }
});