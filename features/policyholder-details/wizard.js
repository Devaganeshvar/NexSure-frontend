// Buy Policy Wizard Logic

let currentStep = 1;
const totalSteps = 6;

function updateStepper() {
    // Update progress bar width
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    document.getElementById('stepperProgress').style.width = `${progress}%`;

    // Update icons
    for (let i = 1; i <= totalSteps; i++) {
        const stepEl = document.querySelector(`.step[data-step="${i}"] .step-icon`);
        
        // Remove all classes first
        stepEl.classList.remove('step-active', 'step-completed');
        stepEl.innerHTML = i; // Default to number

        if (i < currentStep) {
            stepEl.classList.add('step-completed');
            stepEl.innerHTML = '<i class="fa-solid fa-check"></i>'; // Checkmark
        } else if (i === currentStep) {
            stepEl.classList.add('step-active');
        }
    }
}

function showStep(stepNum) {
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(el => el.classList.add('d-none'));
    
    // Show target step
    document.getElementById(`step${stepNum}`).classList.remove('d-none');
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep(current) {
    if (current < totalSteps) {
        currentStep = current + 1;
        updateStepper();
        showStep(currentStep);
    }
}

function showStep(stepNum) {
    document.querySelectorAll('.wizard-step').forEach(el => el.classList.add('d-none'));
    const step = document.getElementById(`step${stepNum}`);
    if(step) step.classList.remove('d-none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if(stepNum === 3) {
        updateRiderTabs();
    }
    if(stepNum === 4) {
        renderNominees();
    }
    if(stepNum === 5 || stepNum === 6) {
        updateReview();
    }
}

function prevStep(current) {
    if (current > 1) {
        currentStep = current - 1;
        updateStepper();
        showStep(currentStep);
    }
}

// Selection logic
function toggleSelection(element) {
    element.classList.toggle('active-select');
}

function singleSelection(element, groupClass) {
    document.querySelectorAll(`.${groupClass}`).forEach(el => el.classList.remove('active-select'));
    element.classList.add('active-select');
}

// Generate Riders (Mock Data)
const healthRiders = [
    { icon: '💀', name: 'Accidental Death', price: 500, selected: true },
    { icon: '💊', name: 'Waiver of Premium', price: 500, selected: false },
    { icon: '💰', name: 'Income Benefit', price: 500, selected: false },
    { icon: '🫀', name: 'Critical Illness', price: 500, selected: true },
    { icon: '🫁', name: 'Organ Transplant', price: 500, selected: false },
    { icon: '🧠', name: 'Terminal Illness', price: 500, selected: false },
    { icon: '♿', name: 'Disability Rider', price: 500, selected: false },
    { icon: '🔄', name: 'Return of Premium', price: 500, selected: false },
    { icon: '👩‍❤️‍👨', name: 'Spouse Cover', price: 500, selected: false },
    { icon: '👁️', name: 'Blindness', price: 500, selected: false }
];

const motorRiders = [
    { icon: '🛡️', name: 'Zero Depreciation', price: 500, selected: false },
    { icon: '⚙️', name: 'Engine Protection', price: 500, selected: false },
    { icon: '📄', name: 'Return to Invoice', price: 500, selected: false },
    { icon: '🧰', name: 'Roadside Assistance', price: 500, selected: false },
    { icon: '🏆', name: 'Rider Plus', price: 500, selected: false },
    { icon: '🔩', name: 'Tyre Protection', price: 500, selected: false },
    { icon: '🔧', name: 'Consumables Cover', price: 500, selected: false },
    { icon: '🚗', name: 'Third Party', price: 500, selected: false },
    { icon: '⭐', name: 'NCB Protection', price: 500, selected: false },
    { icon: '🔑', name: 'Key Replacement', price: 500, selected: false }
];

const propertyRiders = [
    { icon: '🔥', name: 'Fire Cover', price: 500, selected: true },
    { icon: '🌊', name: 'Flood & Earthquake', price: 500, selected: false },
    { icon: '🔒', name: 'Burglary & Theft', price: 500, selected: true },
    { icon: '💍', name: 'Valuables Cover', price: 500, selected: false },
    { icon: '⚡', name: 'Electronic Equipment', price: 500, selected: false },
    { icon: '🏠', name: 'Alternate Accommodation', price: 500, selected: false }
];

const travelRiders = [
    { icon: '🏥', name: 'Overseas Medical', price: 500, selected: true },
    { icon: '🧳', name: 'Baggage Loss', price: 500, selected: true },
    { icon: '✈️', name: 'Flight Delay', price: 500, selected: false },
    { icon: '🛂', name: 'Passport Loss', price: 500, selected: false },
    { icon: '❌', name: 'Trip Cancellation', price: 500, selected: false }
];

function renderRiders(containerId, ridersData) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let html = '';
    ridersData.forEach((rider, index) => {
        const activeClass = rider.selected ? 'active-select' : '';
        html += `
            <div class="col-md-4 col-lg-3">
                <div class="card select-card border rounded-4 p-3 h-100 text-center cursor-pointer ${activeClass}" onclick="toggleRider(this)">
                    <div class="fs-2 mb-2">${rider.icon}</div>
                    <h6 class="fw-bold text-dark mb-1" style="font-size: 0.9rem;">${rider.name}</h6>
                    <div class="text-muted small">₹${rider.price}/lakh</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function toggleRider(element) {
    element.classList.toggle('active-select');
    calculateRiderTotal();
}

function calculateRiderTotal() {
    // Just count active cards across all visible tabs for mock purposes
    const activeRiders = document.querySelectorAll('#riderTabsContent .active-select').length;
    const pricePerRider = 500;
    const total = activeRiders * pricePerRider;
    
    document.getElementById('riderTotalCost').innerText = `₹${total.toLocaleString()}`;
    document.getElementById('riderCalculationText').innerText = `₹${pricePerRider} × ${activeRiders}`;
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize stepper
    updateStepper();
    
    // Render mock riders
    renderRiders('healthRiderGrid', healthRiders);
    renderRiders('motorRiderGrid', motorRiders);
    renderRiders('propertyRiderGrid', propertyRiders);
    renderRiders('travelRiderGrid', travelRiders);
    
    // Initial calculation
    calculateRiderTotal();
    
    // Custom Sum Insured focus logic
    const customSumInput = document.getElementById('customSum');
    if(customSumInput) {
        customSumInput.addEventListener('focus', function() {
            document.querySelectorAll('.cover-select').forEach(el => el.classList.remove('active-select'));
            this.closest('.card').classList.add('border-primary');
        });
    
        customSumInput.addEventListener('blur', function() {
            this.closest('.card').classList.remove('border-primary');
        });
    }
});


function updateRiderTabs() {
    // 1. Get selected insurance types from Step 1
    const selectedCards = document.querySelectorAll('#step1 .select-card.active-select');
    const selectedTypes = Array.from(selectedCards).map(card => card.getAttribute('data-type'));
    
    // 2. Hide all tabs
    const allTabs = document.querySelectorAll('#riderTabs .nav-item');
    allTabs.forEach(tab => tab.style.display = 'none');
    
    const allPanes = document.querySelectorAll('#riderTabsContent .tab-pane');
    allPanes.forEach(pane => pane.classList.remove('show', 'active'));
    
    const navLinks = document.querySelectorAll('#riderTabs .nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    // 3. Determine which tabs to show based on selected types
    let firstTabToShow = null;
    let firstPaneToShow = null;

    if (selectedTypes.includes('Health') || selectedTypes.includes('Life')) {
        const tab = document.getElementById('health-tab');
        if (tab) {
            tab.parentElement.style.display = 'block';
            if (!firstTabToShow) {
                firstTabToShow = tab;
                firstPaneToShow = document.getElementById('health-riders');
            }
        }
    }
    if (selectedTypes.includes('Motor')) {
        const tab = document.getElementById('motor-tab');
        if (tab) {
            tab.parentElement.style.display = 'block';
            if (!firstTabToShow) {
                firstTabToShow = tab;
                firstPaneToShow = document.getElementById('motor-riders');
            }
        }
    }
    if (selectedTypes.includes('Property')) {
        const tab = document.getElementById('property-tab');
        if (tab) {
            tab.parentElement.style.display = 'block';
            if (!firstTabToShow) {
                firstTabToShow = tab;
                firstPaneToShow = document.getElementById('property-riders');
            }
        }
    }
    if (selectedTypes.includes('Travel')) {
        const tab = document.getElementById('travel-tab');
        if (tab) {
            tab.parentElement.style.display = 'block';
            if (!firstTabToShow) {
                firstTabToShow = tab;
                firstPaneToShow = document.getElementById('travel-riders');
            }
        }
    }

    // 4. Activate the first visible tab
    if (firstTabToShow && firstPaneToShow) {
        firstTabToShow.classList.add('active');
        firstPaneToShow.classList.add('show', 'active');
    } else {
        // Fallback if none selected, show health
        const tab = document.getElementById('health-tab');
        if (tab) {
            tab.parentElement.style.display = 'block';
            tab.classList.add('active');
            document.getElementById('health-riders').classList.add('show', 'active');
        }
    }
}
