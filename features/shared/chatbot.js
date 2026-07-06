(function initChatbot() {
    // Exclude from admin pages and public pages
    const currentPath = window.location.pathname.toLowerCase();
    const isPublicPage = ['login.html', 'register.html', 'forgot-password.html', 'landing-page.html'].some(p => currentPath.includes(p));
    const isAdminPage = currentPath.includes('/admin/');
    
    if (isPublicPage || isAdminPage) {
        return; 
    }

    // --- Chatbot Q&A Dataset ---
    const qaData = {
        "buy_policy": {
            q: "How do I buy a policy?",
            a: "To buy a policy, navigate to the 'Plans' page from the top menu. Browse our available Motor, Health, and Life insurance plans. Click 'View Details' on a plan you like, and then click the 'Purchase Plan' button to proceed with the secure checkout process."
        },
        "file_claim": {
            q: "How can I file a claim?",
            a: "Filing a claim is easy! Go to the 'Claims' page and click the 'File a Claim' button in the top right. Select your active policy, provide the incident details and date, and upload any necessary initial evidence. You can track your claim status directly on the same page."
        },
        "claim_docs": {
            q: "What documents are required for a claim?",
            a: "Required documents vary by policy type. For Motor: Police report and garage estimate. For Health: Hospital bills and discharge summary. For Life: Death certificate and nominee ID. You will be prompted to upload these specific documents during the claim review process."
        },
        "renew_policy": {
            q: "How do I renew my policy?",
            a: "Policies approaching expiration will appear in the 'Premium Due' widget on your Dashboard. Simply click 'Pay Now' next to the policy, or visit the 'Payments' page to view all pending dues and process your renewal payment securely."
        },
        "update_nominee": {
            q: "How can I update nominee details?",
            a: "To update your nominee details, please visit the 'My Policies' page, select the specific policy, and click on 'Policy Actions' > 'Update Nominee'. Note that changes may require officer approval."
        },
        "download_receipt": {
            q: "How do I download my policy receipt?",
            a: "Go to the 'Payments' page and select the 'Transaction History' tab. You will see a list of all your successful payments. Click the 'Download Receipt' button next to the relevant transaction to save a PDF copy."
        },
        "claim_process": {
            q: "What is the claim settlement process?",
            a: "Once you file a claim, it moves to 'Under Review'. An Insurance Officer will evaluate it and may request additional documents. Once verified, it moves to 'Approved', and the funds are disbursed, marking the claim as 'Settled'. This usually takes 3-5 business days."
        },
        "contact_support": {
            q: "How can I contact support?",
            a: "For complex issues, you can reach our 24/7 support team by calling 1-800-NEXSURE, or email us at support@nexsure.com. You can also visit your nearest branch office for in-person assistance."
        }
    };

    // --- Inject HTML Structure ---
    const chatbotHTML = `
        <!-- Floating Button -->
        <button id="chatbot-fab" title="Chat with Support" aria-label="Open support chat" aria-haspopup="dialog" aria-expanded="false" style="border:none;">
            <i class="fa-solid fa-message"></i>
        </button>

        <!-- Chat Window -->
        <div id="chatbot-window" role="dialog" aria-label="Support Chat Window" aria-modal="false">
            <div class="chatbot-header">
                <div class="chatbot-header-info">
                    <div class="chatbot-avatar" aria-hidden="true">
                        <i class="fa-solid fa-robot"></i>
                    </div>
                    <div>
                        <h4 class="chatbot-title">NexBot Assistant</h4>
                        <div class="chatbot-status" aria-live="polite">Online</div>
                    </div>
                </div>
                <button class="chatbot-close" id="chatbot-close-btn" aria-label="Close chat window">&times;</button>
            </div>
            
            <div class="chatbot-body" id="chatbot-body" aria-live="polite" aria-relevant="additions">
                <!-- Welcome Message -->
                <div class="chatbot-message bot">
                    <div class="chatbot-bubble">
                        Hi there! 👋 I'm NexBot, your virtual assistant. How can I help you today?
                    </div>
                </div>
                
                <!-- Quick Replies Container -->
                <div class="chatbot-message bot mt-1" id="chatbot-options-container">
                    <div class="chatbot-quick-replies" id="chatbot-main-options">
                        ${Object.keys(qaData).map(key => 
                            `<button class="chatbot-btn-reply main-qa-btn" data-qa-key="${key}">${qaData[key].q}</button>`
                        ).join('')}
                    </div>
                </div>
            </div>
            
            <div class="chatbot-footer">
                <form id="chatbot-form" class="w-100 d-flex align-items-center gap-2 m-0 p-0">
                    <label for="chatbot-input" class="visually-hidden">Type a message</label>
                    <input type="text" id="chatbot-input" class="chatbot-input" placeholder="Type a message..." autocomplete="off">
                    <button type="submit" class="chatbot-send-btn" aria-label="Send message"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i></button>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    // --- Interaction Logic ---
    const fab = document.getElementById('chatbot-fab');
    const chatWindow = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const chatBody = document.getElementById('chatbot-body');
    const optionsContainer = document.getElementById('chatbot-options-container');
    const chatForm = document.getElementById('chatbot-form');
    const chatInput = document.getElementById('chatbot-input');
    
    // Toggle Chat Window
    fab.addEventListener('click', () => {
        chatWindow.classList.add('active');
        fab.style.transform = 'scale(0)';
        fab.setAttribute('aria-expanded', 'true');
        setTimeout(() => {
            scrollToBottom();
            chatInput.focus();
        }, 300);
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('active');
        fab.style.transform = 'scale(1)';
        fab.setAttribute('aria-expanded', 'false');
        fab.focus();
    });

    // Handle Quick Reply Clicks
    document.querySelectorAll('.main-qa-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const key = this.getAttribute('data-qa-key');
            const data = qaData[key];
            
            if (data) {
                // Hide main options temporarily
                optionsContainer.style.display = 'none';

                // Add User Message
                appendMessage('user', data.q);

                // Simulate slight delay for bot typing feel
                setTimeout(() => {
                    // Add Bot Answer
                    appendMessage('bot', data.a);
                    
                    // Show followup question after short delay
                    setTimeout(() => {
                        askFollowUp();
                    }, 800);

                }, 500);
            }
        });
    });

    // Handle Custom Form Submit
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        
        chatInput.value = '';
        
        // Hide options if they are visible
        if (optionsContainer.style.display !== 'none') {
            optionsContainer.style.display = 'none';
        }
        
        // Add User Message
        appendMessage('user', text);
        
        // Simulate bot typing
        setTimeout(() => {
            const fallbackHTML = `
                Sorry, I couldn't find an answer to your question. Please visit our Help Center for further assistance or contact our support team.
                <div class="mt-3">
                    <a href="../help-center/customer-help.html" class="chatbot-action-link"><i class="fa-solid fa-circle-info me-1"></i> Go to Help Center</a>
                </div>
            `;
            appendMessage('bot', fallbackHTML);
            
            // Show followup after delay
            setTimeout(() => {
                askFollowUp();
            }, 800);
        }, 600);
    });

    function appendMessage(sender, htmlContent) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chatbot-message ${sender} mt-2`;
        msgDiv.innerHTML = `<div class="chatbot-bubble">${htmlContent}</div>`;
        
        // Insert before options container
        chatBody.insertBefore(msgDiv, optionsContainer);
        scrollToBottom();
    }
    
    function askFollowUp() {
        const followUpId = 'followup-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.className = `chatbot-message bot mt-2`;
        msgDiv.innerHTML = `
            <div class="chatbot-bubble">
                Do you have any other questions?
                <div class="chatbot-quick-replies mt-2 flex-row gap-2" id="${followUpId}">
                    <button class="chatbot-btn-reply w-auto px-4 fw-medium btn-yes">Yes</button>
                    <button class="chatbot-btn-reply w-auto px-4 fw-medium btn-no">No</button>
                </div>
            </div>
        `;
        chatBody.insertBefore(msgDiv, optionsContainer);
        scrollToBottom();
        
        // Bind events
        const yesBtn = msgDiv.querySelector('.btn-yes');
        const noBtn = msgDiv.querySelector('.btn-no');
        
        yesBtn.addEventListener('click', () => {
            appendMessage('user', 'Yes');
            msgDiv.querySelector('.chatbot-quick-replies').remove(); // Remove buttons to prevent re-clicking
            
            setTimeout(() => {
                optionsContainer.style.display = 'block';
                chatBody.appendChild(optionsContainer); // Move to bottom
                scrollToBottom();
            }, 400);
        });
        
        noBtn.addEventListener('click', () => {
            appendMessage('user', 'No');
            msgDiv.querySelector('.chatbot-quick-replies').remove(); 
            
            setTimeout(() => {
                appendMessage('bot', 'Thank you for contacting NexSure Support. Have a great day!');
            }, 400);
        });
    }

    function scrollToBottom() {
        chatBody.scrollTo({
            top: chatBody.scrollHeight,
            behavior: 'smooth'
        });
    }
})();