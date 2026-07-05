document.addEventListener('DOMContentLoaded', () => {

    // Help Center Knowledge Base
    const articlesDB = {
        // --- CATEGORIES ---
        "claims": {
            title: "Claims & Refunds Guide",
            category: "Claims & Refunds",
            date: "June 15, 2026",
            readTime: "5 min read",
            content: `
                <p class="lead">Navigating the claims process shouldn't be stressful. Here is a comprehensive guide to filing, tracking, and settling your insurance claims with NexSure.</p>
                <h5 class="fw-bold mt-4">1. How to File a New Claim</h5>
                <p>Filing a claim is completely digital. Follow these steps:</p>
                <ul>
                    <li>Navigate to the <strong>Claims</strong> page from your dashboard.</li>
                    <li>Click the <strong>File a Claim</strong> button in the top right.</li>
                    <li>Select the active policy related to the incident.</li>
                    <li>Fill out the incident report (date, time, location, and description).</li>
                </ul>
                <h5 class="fw-bold mt-4">2. Required Documentation</h5>
                <p>Depending on your policy type, you will need to upload specific evidence:</p>
                <ul>
                    <li><strong>Motor Insurance:</strong> Police FIR, garage estimate, and photos of the damage.</li>
                    <li><strong>Health Insurance:</strong> Original hospital bills, discharge summary, and diagnostic reports.</li>
                </ul>
                <div class="alert alert-info mt-4">
                    <i class="fa-solid fa-circle-info me-2"></i><strong>Tip:</strong> Submitting clear, high-resolution photos of your documents will speed up the review process by 30%.
                </div>
            `,
            related: [
                { id: "claim_timeline", title: "What is the claim settlement timeline?" }
            ]
        },
        "payments": {
            title: "Managing Payments & Billing",
            category: "Payments",
            date: "May 22, 2026",
            readTime: "4 min read",
            content: `
                <p class="lead">Keep your policies active by managing your premiums efficiently. This guide covers payment methods, due dates, and receipts.</p>
                <h5 class="fw-bold mt-4">Payment Methods Accepted</h5>
                <p>NexSure supports a wide variety of secure payment methods to ensure you can pay your premiums effortlessly:</p>
                <ul>
                    <li>Credit and Debit Cards (Visa, Mastercard, Amex)</li>
                    <li>Net Banking (All major banks)</li>
                    <li>UPI and Mobile Wallets</li>
                </ul>
                <h5 class="fw-bold mt-4">Grace Periods</h5>
                <p>If you miss a premium due date, NexSure offers a standard <strong>15-day grace period</strong> for monthly policies and a <strong>30-day grace period</strong> for annual policies. During this time, your coverage remains active, but you must clear the dues to avoid policy lapse.</p>
            `,
            related: [
                { id: "download_receipt", title: "How to download my premium receipt" }
            ]
        },
        "kyc": {
            title: "KYC & Identity Verification",
            category: "KYC & Documents",
            date: "July 01, 2026",
            readTime: "3 min read",
            content: `
                <p class="lead">Know Your Customer (KYC) is a mandatory regulatory requirement for issuing insurance policies. Learn how to complete it swiftly.</p>
                <h5 class="fw-bold mt-4">Accepted Documents</h5>
                <p>To verify your identity and address, you must upload one of the following government-issued documents:</p>
                <ul>
                    <li>Aadhaar Card (Front and Back)</li>
                    <li>PAN Card</li>
                    <li>Passport</li>
                    <li>Voter ID</li>
                </ul>
                <h5 class="fw-bold mt-4">The Verification Process</h5>
                <p>Once you upload your documents on the KYC page, our automated system attempts to verify them instantly. If manual review is required, our verification officers will process it within 24-48 business hours.</p>
            `,
            related: [
                { id: "kyc_pending", title: "Why is my KYC still pending?" }
            ]
        },
        "policy": {
            title: "Complete Policy Management",
            category: "Policy Management",
            date: "April 10, 2026",
            readTime: "6 min read",
            content: `
                <p class="lead">Your Dashboard provides full control over your active and expired policies. Learn how to manage your coverage.</p>
                <h5 class="fw-bold mt-4">Viewing Policy Details</h5>
                <p>Click on any active policy card in your Dashboard to view the detailed breakdown, including coverage limits, deductibles, and inclusions/exclusions.</p>
                <h5 class="fw-bold mt-4">Policy Endorsements</h5>
                <p>Need to make changes? You can request endorsements directly from the portal for:</p>
                <ul>
                    <li>Address changes</li>
                    <li>Vehicle registration number updates (for Motor policies)</li>
                    <li>Adding dependents (for Health policies)</li>
                </ul>
                <p>Note that endorsements may result in a recalculation of your premium.</p>
            `,
            related: []
        },
        "account": {
            title: "Account & Profile Configuration",
            category: "Account & Profile",
            date: "June 28, 2026",
            readTime: "3 min read",
            content: `
                <p class="lead">Customize your NexSure experience by configuring your profile settings, communications, and localization preferences.</p>
                <h5 class="fw-bold mt-4">Updating Contact Information</h5>
                <p>It is crucial to keep your email and phone number updated so you never miss a renewal reminder. Navigate to <strong>Settings &gt; Profile</strong> to edit your primary contact details.</p>
                <h5 class="fw-bold mt-4">Nominee Updates</h5>
                <p>To change a nominee on a life or health policy, select the specific policy from the 'My Policies' page and choose 'Update Nominee'. This action will require OTP verification.</p>
            `,
            related: []
        },
        "security": {
            title: "Platform Security & Privacy",
            category: "Security",
            date: "March 05, 2026",
            readTime: "4 min read",
            content: `
                <p class="lead">Protecting what matters most includes your digital identity. Learn about our enterprise-grade security features.</p>
                <h5 class="fw-bold mt-4">Two-Factor Authentication (2FA)</h5>
                <p>We highly recommend enabling 2FA in your Account Settings. When enabled, logging in from a new device will require a one-time password sent to your registered mobile number.</p>
                <h5 class="fw-bold mt-4">Data Privacy</h5>
                <p>NexSure complies with global data protection regulations. We do not sell your personal data to third-party marketers. You can request a complete export of your data archive at any time from the Settings page.</p>
            `,
            related: []
        },
        // --- POPULAR ARTICLES ---
        "kyc_pending": {
            title: "Why is my KYC still pending?",
            category: "KYC & Documents",
            date: "July 02, 2026",
            readTime: "2 min read",
            content: `
                <p>If your KYC status has been "Pending" for more than 48 hours, it is usually due to one of the following reasons:</p>
                <ul>
                    <li><strong>Blurry Images:</strong> The uploaded ID card photos are illegible or affected by glare.</li>
                    <li><strong>Name Mismatch:</strong> The name on your NexSure profile does not exactly match the name on your government ID.</li>
                    <li><strong>Expired Document:</strong> The submitted passport or driving license has expired.</li>
                </ul>
                <p>Please check your email inbox for a communication from our verification team detailing the exact reason and providing a link to re-upload the documents.</p>
            `,
            related: [
                { id: "kyc", title: "KYC & Identity Verification Guide" }
            ]
        },
        "download_receipt": {
            title: "How to download my premium receipt",
            category: "Payments",
            date: "June 10, 2026",
            readTime: "1 min read",
            content: `
                <p>Premium receipts are generated instantly upon successful payment. To download yours:</p>
                <ol>
                    <li>Log in to your NexSure account.</li>
                    <li>Navigate to the <strong>Payments</strong> section using the top navigation bar.</li>
                    <li>Scroll down to <strong>Transaction History</strong>.</li>
                    <li>Locate the successful payment and click the <strong>Download Receipt</strong> button on the right side of the row.</li>
                </ol>
                <p>The receipt will download as a PDF file, which is digitally signed and valid for tax deduction purposes.</p>
            `,
            related: [
                { id: "payments", title: "Managing Payments & Billing" }
            ]
        },
        "claim_timeline": {
            title: "What is the claim settlement timeline?",
            category: "Claims & Refunds",
            date: "May 18, 2026",
            readTime: "4 min read",
            content: `
                <p>At NexSure, we pride ourselves on industry-leading claim settlement speeds. Here is what to expect once you submit a claim:</p>
                <h5 class="fw-bold mt-4">Day 1: Submission & Initial Review</h5>
                <p>Your claim enters our system and is assigned to an Insurance Officer within 4 hours. They will conduct a preliminary review of your documents.</p>
                <h5 class="fw-bold mt-4">Day 2-3: Verification & Assessment</h5>
                <p>For motor or property claims, a surveyor may be dispatched. For health and life claims, documents are verified with the respective hospitals or authorities.</p>
                <h5 class="fw-bold mt-4">Day 4-5: Approval & Disbursement</h5>
                <p>Once verified, the claim is marked 'Approved'. The approved settlement amount is disbursed to your registered bank account via NEFT/RTGS within 24 hours of approval.</p>
            `,
            related: [
                { id: "claims", title: "Claims & Refunds Guide" }
            ]
        }
    };

    // --- Modal Logic ---
    const articleTriggers = document.querySelectorAll('.help-article-trigger');
    const modalTitle = document.getElementById('articleModalTitle');
    const modalCategory = document.getElementById('articleModalCategory');
    const modalDate = document.getElementById('articleModalDate');
    const modalReadTime = document.getElementById('articleModalReadTime');
    const modalContent = document.getElementById('articleModalContent');
    const modalRelatedContainer = document.getElementById('articleModalRelated');
    
    let articleModalInstance = null;
    const modalEl = document.getElementById('articleModal');
    if (modalEl) {
        articleModalInstance = new bootstrap.Modal(modalEl);
    }

    // Bind clicks to all triggers
    articleTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('data-article-id');
            openArticle(id);
        });
    });

    // Delegate clicks for related articles inside the modal
    if (modalRelatedContainer) {
        modalRelatedContainer.addEventListener('click', function(e) {
            const link = e.target.closest('.related-article-link');
            if (link) {
                e.preventDefault();
                const id = link.getAttribute('data-article-id');
                openArticle(id);
            }
        });
    }

    function openArticle(id) {
        const article = articlesDB[id];
        if (!article) return;

        // Populate Modal DOM
        modalTitle.textContent = article.title;
        modalCategory.textContent = article.category;
        modalDate.textContent = article.date;
        modalReadTime.textContent = article.readTime;
        modalContent.innerHTML = article.content;

        // Populate Related
        if (article.related && article.related.length > 0) {
            let relatedHTML = `<h6 class="fw-bold mt-5 mb-3 border-top pt-4">Suggested Reading</h6><div class="list-group list-group-flush">`;
            article.related.forEach(rel => {
                relatedHTML += `
                    <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center related-article-link px-0 border-light-subtle" data-article-id="${rel.id}">
                        <span class="text-primary fw-medium">${rel.title}</span>
                        <i class="fa-solid fa-arrow-right text-muted small"></i>
                    </a>
                `;
            });
            relatedHTML += `</div>`;
            modalRelatedContainer.innerHTML = relatedHTML;
        } else {
            modalRelatedContainer.innerHTML = '';
        }

        // Show Modal
        if (articleModalInstance) {
            articleModalInstance.show();
            // Reset scroll position
            const modalBody = modalEl.querySelector('.modal-body');
            if (modalBody) modalBody.scrollTop = 0;
        }
    }

});