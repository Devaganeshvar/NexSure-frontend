const articleData = [
    {
        title: "How to File and Track Your Insurance Claim",
        category: "Claims & Refunds",
        date: "Last Updated: June 15, 2026",
        image: "../../assets/images/help/claims.png",
        description: `
            <p>Filing a claim shouldn't be stressful. At NexSure, we have streamlined our claims process to be as fast and transparent as possible.</p>
            <p><strong>Step 1: Intimation</strong><br>Notify us about the incident within 48 hours. You can do this directly from your dashboard by clicking on "File a Claim".</p>
            <p><strong>Step 2: Document Submission</strong><br>Upload all required documents as requested by our claims team. Clear, scanned copies help speed up the process.</p>
            <p><strong>Step 3: Verification & Settlement</strong><br>Our team will verify your claim. Once approved, the settlement amount will be transferred to your registered bank account within 3-5 business days.</p>
        `,
        tips: "Keep original hard copies of all medical bills and police FIRs, as our physical verification team might require them in case of large claims."
    },
    {
        title: "Managing Premium Payments and Receipts",
        category: "Payments",
        date: "Last Updated: July 01, 2026",
        image: "../../assets/images/help/payments.png",
        description: `
            <p>Never miss a due date with NexSure's flexible payment options. We support UPI, Credit/Debit cards, and Net Banking for all premium payments.</p>
            <p><strong>Downloading Receipts</strong><br>Your payment receipts are automatically generated within 24 hours of a successful transaction. To download them, navigate to <em>Profile > Payment History</em> and click the download icon next to your recent transaction.</p>
            <p><strong>Auto-Pay Setup</strong><br>We highly recommend setting up Auto-Pay using your preferred payment method to avoid policy lapsation.</p>
        `,
        tips: "Setting up e-Mandate via your bank will automatically process your renewals without manual intervention."
    },
    {
        title: "Understanding the KYC Verification Process",
        category: "KYC & Documents",
        date: "Last Updated: May 20, 2026",
        image: "../../assets/images/help/kyc.png",
        description: `
            <p>KYC (Know Your Customer) is a mandatory step before any policy can be officially issued or a claim can be settled.</p>
            <p><strong>Required Documents:</strong><br>- Proof of Identity (Aadhaar, PAN Card, Passport)<br>- Proof of Address (Utility bill, Voter ID)<br>- A recent passport-sized photograph.</p>
            <p>Our verification process typically takes 24-48 hours. If your KYC is rejected, you will receive an email detailing the exact reason and steps to rectify the issue.</p>
        `,
        tips: "Ensure that the name on your KYC documents matches exactly with the name you provided during the policy application."
    },
    {
        title: "Comprehensive Guide to Policy Management",
        category: "Policy Management",
        date: "Last Updated: April 10, 2026",
        image: "../../assets/images/help/policy.png",
        description: `
            <p>Your NexSure dashboard provides complete control over your active and expired policies.</p>
            <p><strong>Policy Endorsements</strong><br>Need to change your address or update a nominee? You can request policy endorsements directly from the policy details page. Non-financial endorsements are usually processed within 24 hours.</p>
            <p><strong>Renewals</strong><br>You can renew your policy up to 30 days before the expiry date. Renewing early ensures there is no break in your coverage and protects your No Claim Bonus (NCB).</p>
        `,
        tips: "Always review your coverage limits during renewal. As your lifestyle changes, your insurance needs might change as well."
    },
    {
        title: "Updating Your Account and Profile Settings",
        category: "Account & Profile",
        date: "Last Updated: June 30, 2026",
        image: "../../assets/images/help/account.png",
        description: `
            <p>Keeping your contact information up-to-date is crucial for receiving timely policy updates, premium reminders, and claim notifications.</p>
            <p><strong>Password Resets</strong><br>If you've forgotten your password, click "Forgot Password" on the login screen. A secure reset link will be sent to your registered email address.</p>
            <p><strong>Communication Preferences</strong><br>You can choose to receive updates via Email, SMS, or WhatsApp. Adjust these settings in your Account Preferences panel.</p>
        `,
        tips: "Add a secondary contact number or email address to ensure you never miss critical updates if you lose access to your primary account."
    },
    {
        title: "Ensuring Your Data Privacy and Security",
        category: "Security",
        date: "Last Updated: July 05, 2026",
        image: "../../assets/images/help/security.png",
        description: `
            <p>At NexSure, your data security is our highest priority. We employ bank-grade encryption to protect your personal and financial information.</p>
            <p><strong>Two-Factor Authentication (2FA)</strong><br>We strongly encourage all users to enable 2FA on their accounts. This adds an extra layer of security by requiring an OTP sent to your phone alongside your password.</p>
            <p><strong>Session Management</strong><br>For your security, your session will automatically time out after 15 minutes of inactivity. You can view all active sessions from your Security settings and terminate any unrecognized devices.</p>
        `,
        tips: "Never share your OTP or password with anyone. NexSure representatives will never ask for your password over the phone."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const helpCards = document.querySelectorAll('.help-card');
    let activeModal = null;
    
    helpCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const data = articleData[index];
            if (!data) return;

            // Populate Modal
            document.getElementById('modalCategory').innerText = data.category;
            document.getElementById('modalDate').innerText = data.date;
            document.getElementById('modalTitle').innerText = data.title;
            document.getElementById('modalImage').src = data.image;
            document.getElementById('modalDescription').innerHTML = data.description;
            
            const tipsDiv = document.getElementById('modalTips');
            const tipsContent = document.getElementById('modalTipsContent');
            
            if (data.tips) {
                tipsContent.innerText = data.tips;
                tipsDiv.classList.remove('d-none');
            } else {
                tipsDiv.classList.add('d-none');
            }

            // Show Modal
            if (!activeModal) {
                activeModal = new bootstrap.Modal(document.getElementById('articleModal'));
            }
            activeModal.show();
        });
    });
});
