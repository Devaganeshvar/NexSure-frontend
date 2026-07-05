document.addEventListener('DOMContentLoaded', () => {
    // Dynamic Pricing Update
    const sumInsuredSelect = document.querySelector('.custom-select');
    const priceDisplay = document.querySelector('.display-5.fw-bold');
    
    if (sumInsuredSelect && priceDisplay) {
        sumInsuredSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            let newPrice = '₹9,999'; // default for 10L
            
            if (val === '5') {
                newPrice = '₹6,499';
            } else if (val === '25') {
                newPrice = '₹16,999';
            }
            
            // Update the display text while keeping the /yr suffix
            priceDisplay.innerHTML = `${newPrice}<span class="fs-5 fw-normal text-white-50"> / yr</span>`;
            
            // Add a small bounce animation
            priceDisplay.style.transform = 'scale(1.1)';
            priceDisplay.style.transition = 'transform 0.2s';
            setTimeout(() => {
                priceDisplay.style.transform = 'scale(1)';
            }, 200);
        });
    }
});