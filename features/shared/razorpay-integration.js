// NexSure Frontend Razorpay Integration (Live SDK)

// Dynamically load the OFFICIAL Razorpay SDK
(function() {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.head.appendChild(script);
})();

/**
 * Initiates the Razorpay Payment Modal using the official SDK
 */
window.initiateRazorpayPayment = function(amount, policyId, description, successCallback) {
    if (typeof window.Razorpay === 'undefined') {
        alert("Payment gateway is still loading. Please try again in a few seconds.");
        return;
    }

    // Since this is a frontend-only prototype and we cannot securely store a secret key,
    // we need a valid Test Key to make the official SDK work without throwing the "Oops" error.
    let testKey = localStorage.getItem('rzp_test_key');
    
    if (!testKey) {
        testKey = prompt("To use the official Razorpay SDK, please enter your valid Razorpay Test Key (starts with rzp_test_):\n\nIf you don't have one, you can get it instantly for free at dashboard.razorpay.com");
        if (!testKey || !testKey.startsWith('rzp_test_')) {
            alert("A valid test key is required to launch the official Razorpay SDK.");
            return;
        }
        localStorage.setItem('rzp_test_key', testKey);
    }

    const options = {
        "key": testKey,
        "amount": amount * 100, // Razorpay expects amount in paise (multiply by 100)
        "currency": "INR",
        "name": "NexSure Insurance",
        "description": description + " for " + policyId,
        "image": "../../assets/images/Logo.png",
        "handler": function (response) {
            // Payment Success Callback
            const paymentId = response.razorpay_payment_id;
            
            // Save transaction to local storage
            saveTransaction({
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                policyId: policyId,
                description: description,
                amount: amount,
                mode: "Online Payment",
                status: "Successful",
                paymentId: paymentId
            });

            if (successCallback) {
                successCallback(response);
            }
        },
        "prefill": {
            "name": "Rahul Mehta",
            "email": "rahul.m@example.com",
            "contact": "9876543210"
        },
        "theme": {
            "color": "#16213e" // NexSure Primary Blue
        }
    };

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response){
        alert("Payment Failed. Reason: " + response.error.description);
        // If it failed because of an invalid key, offer to clear it
        if (confirm("Would you like to clear your saved Razorpay key and try a different one?")) {
            localStorage.removeItem('rzp_test_key');
        }
    });
    
    rzp.open();
};

/**
 * Saves a transaction object to LocalStorage
 */
function saveTransaction(transaction) {
    let transactions = [];
    const stored = localStorage.getItem('nexsure_transactions');
    if (stored) {
        try {
            transactions = JSON.parse(stored);
        } catch(e) { }
    }
    
    transactions.unshift(transaction);
    localStorage.setItem('nexsure_transactions', JSON.stringify(transactions));
}
