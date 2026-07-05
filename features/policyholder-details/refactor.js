const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve('d:/.Net/NexSureFrontEnd/features/policies/buy-policy/wizard.html');
const jsPath = path.resolve('d:/.Net/NexSureFrontEnd/features/policies/buy-policy/wizard.js');

let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Remove Step 2 HTML completely
const step2Start = html.indexOf('<!-- Step 2: Plan -->');
const step3Start = html.indexOf('<!-- Step 3: Cover -->');
if (step2Start > -1 && step3Start > -1) {
    html = html.substring(0, step2Start) + html.substring(step3Start);
}

// 2. Renumber remaining steps in HTML
html = html.replace(/<!-- Step 3: Cover -->/g, '<!-- Step 2: Coverage -->');
html = html.replace(/id="step3"/g, 'id="step2"');

html = html.replace(/<!-- Step 4: Riders -->/g, '<!-- Step 3: Riders -->');
html = html.replace(/id="step4"/g, 'id="step3"');

html = html.replace(/<!-- Step 5: Nominee -->/g, '<!-- Step 4: Nominee -->');
html = html.replace(/id="step5"/g, 'id="step4"');

html = html.replace(/<!-- Step 6: Review & Submit -->/g, '<!-- Step 5: Review & Submit -->');
html = html.replace(/id="step6"/g, 'id="step5"');

html = html.replace(/<!-- Step 7: Payment -->/g, '<!-- Step 6: Payment -->');
html = html.replace(/id="step7"/g, 'id="step6"');

// Fix nextStep/prevStep button calls
html = html.replace(/nextStep\(3\)/g, 'nextStep(2)');
html = html.replace(/prevStep\(3\)/g, 'prevStep(2)');
html = html.replace(/nextStep\(4\)/g, 'nextStep(3)');
html = html.replace(/prevStep\(4\)/g, 'prevStep(3)');
html = html.replace(/nextStep\(5\)/g, 'nextStep(4)');
html = html.replace(/prevStep\(5\)/g, 'prevStep(4)');
html = html.replace(/nextStep\(6\)/g, 'nextStep(5)');
html = html.replace(/prevStep\(6\)/g, 'prevStep(5)');
html = html.replace(/nextStep\(7\)/g, 'nextStep(6)');
html = html.replace(/prevStep\(7\)/g, 'prevStep(6)');

// 3. Update the Stepper UI at the top
// Remove step 2 stepper div
const stepper2Regex = /<div class="step text-center position-relative z-3" data-step="2">[\s\S]*?<\/div>/;
html = html.replace(stepper2Regex, '');

// Renumber remaining stepper data-steps
html = html.replace(/data-step="3"/g, 'data-step="2"');
html = html.replace(/data-step="4"/g, 'data-step="3"');
html = html.replace(/data-step="5"/g, 'data-step="4"');
html = html.replace(/data-step="6"/g, 'data-step="5"');
html = html.replace(/data-step="7"/g, 'data-step="6"');
html = html.replace(/<div class="step-label small fw-medium text-muted">Cover<\/div>/g, '<div class="step-label small fw-medium text-muted">Coverage</div>');


// 4. Update the Review Step to have specific IDs for injection
html = html.replace('<span class="fw-bold text-dark">Life Insurance</span>', '<span class="fw-bold text-dark" id="reviewInsuranceType">Life Insurance</span>');
html = html.replace('<div class="d-flex justify-content-between mb-3">\r\n                          <span class="text-muted">Coverage Plan</span>\r\n                          <span class="fw-bold text-dark">Standard Plan</span>\r\n                      </div>', '');
html = html.replace('<span class="fw-bold text-dark">&#8377;25,00,000</span>', '<span class="fw-bold text-dark" id="reviewSumInsured">&#8377;25,00,000</span>');

// Replace review riders breakdown with a dynamic container
const oldRidersList = `<div class="d-flex justify-content-between mb-2">
                          <span class="text-muted"><i class="fa-solid fa-check text-green me-2"></i> Critical Illness</span>
                          <span class="fw-medium text-dark">&#8377;5,000</span>
                      </div>
                      <div class="d-flex justify-content-between mb-2">
                          <span class="text-muted"><i class="fa-solid fa-check text-green me-2"></i> Accidental Death</span>
                          <span class="fw-medium text-dark">&#8377;2,500</span>
                      </div>`;
html = html.replace(oldRidersList, '<div id="reviewRidersList"></div>');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log("HTML refactored successfully.");

// Now refactor wizard.js
let js = fs.readFileSync(jsPath, 'utf8');

js = js.replace('const totalSteps = 7;', 'const totalSteps = 6;');

const stateMgmtAndValidation = `
const wizardState = {
    insuranceType: '',
    sumInsured: 0,
    sumInsuredText: '',
    riders: [],
    basePremium: 10000
};

function updateStepper() {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    const progressEl = document.getElementById('stepperProgress');
    if(progressEl) progressEl.style.width = \`\${progress}%\`;

    for (let i = 1; i <= totalSteps; i++) {
        const stepEl = document.querySelector(\`.step[data-step="\${i}"] .step-icon\`);
        if(!stepEl) continue;
        stepEl.classList.remove('step-active', 'step-completed');
        stepEl.innerHTML = i; 

        if (i < currentStep) {
            stepEl.classList.add('step-completed');
            stepEl.innerHTML = '&#10003;'; 
            stepEl.parentElement.querySelector('.step-label').classList.replace('text-muted', 'text-dark-blue');
        } else if (i === currentStep) {
            stepEl.classList.add('step-active');
            stepEl.parentElement.querySelector('.step-label').classList.replace('text-muted', 'text-dark-blue');
        } else {
            stepEl.parentElement.querySelector('.step-label').classList.replace('text-dark-blue', 'text-muted');
        }
    }
}

function nextStep(current) {
    // Validation
    if (current === 1) {
        const selectedType = document.querySelector('#step1 .select-card.active-select');
        if (!selectedType) {
            alert('Please select an Insurance Type.');
            return;
        }
        wizardState.insuranceType = selectedType.getAttribute('data-type');
    }
    
    if (current === 2) {
        const selectedCover = document.querySelector('#step2 .select-card.active-select');
        const customSum = document.getElementById('customSum');
        if (!selectedCover && (!customSum || !customSum.value)) {
            alert('Please select or enter a Sum Insured amount.');
            return;
        }
        if (selectedCover) {
            wizardState.sumInsured = parseInt(selectedCover.getAttribute('data-cover'));
            wizardState.sumInsuredText = selectedCover.querySelector('h3').innerText;
        } else {
            wizardState.sumInsuredText = '₹' + customSum.value;
        }
    }
    
    if (current === 4) {
        if (nominees.length === 0) {
            alert('Please add at least one nominee.');
            return;
        }
        let currentTotal = nominees.reduce((acc, curr) => acc + curr.percent, 0);
        if (currentTotal !== 100) {
            alert('Total nominee share must equal exactly 100%.');
            return;
        }
    }

    if (current < totalSteps) {
        currentStep = current + 1;
        updateStepper();
        showStep(currentStep);
    }
}
`;

js = js.replace(/function updateStepper\(\) \{[\s\S]*?\}\n\nfunction nextStep\(current\) \{[\s\S]*?\}\n/m, stateMgmtAndValidation);

const oldShowStep = /function showStep\(stepNum\) \{[\s\S]*?\}\n/m;
const newShowStep = `function showStep(stepNum) {
    document.querySelectorAll('.wizard-step').forEach(el => el.classList.add('d-none'));
    const step = document.getElementById(\`step\${stepNum}\`);
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
`;
js = js.replace(oldShowStep, newShowStep);


const oldUpdateReview = /function updateReview\(\) \{[\s\S]*?\}\n/m;
const newUpdateReview = `function updateReview() {
    // Collect active riders
    const activeRidersEls = document.querySelectorAll('#riderTabsContent .active-select');
    wizardState.riders = [];
    activeRidersEls.forEach(el => {
        wizardState.riders.push({
            name: el.querySelector('h6').innerText,
            cost: 500
        });
    });

    const riderTotalCost = wizardState.riders.length * 500;
    const subtotal = wizardState.basePremium + riderTotalCost;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    // Update Step 5: Review
    const reviewTypeEl = document.getElementById('reviewInsuranceType');
    if (reviewTypeEl) reviewTypeEl.innerText = wizardState.insuranceType + ' Insurance';
    
    const reviewSumEl = document.getElementById('reviewSumInsured');
    if (reviewSumEl) reviewSumEl.innerText = wizardState.sumInsuredText;

    const reviewRidersList = document.getElementById('reviewRidersList');
    if (reviewRidersList) {
        let rHtml = '';
        wizardState.riders.forEach(r => {
            rHtml += \`
            <div class="d-flex justify-content-between mb-2">
                <span class="text-muted"><i class="fa-solid fa-check text-green me-2"></i> \${r.name}</span>
                <span class="fw-medium text-dark">&#8377;\${r.cost.toLocaleString()}</span>
            </div>\`;
        });
        reviewRidersList.innerHTML = rHtml;
    }

    const reviewTotalEl = document.querySelector('#step5 h2');
    if(reviewTotalEl) reviewTotalEl.innerHTML = \`&#8377;\${total.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})} / yr\`;
    
    const nomineeReviewEl = document.getElementById('reviewNomineeCount');
    if(nomineeReviewEl) nomineeReviewEl.innerHTML = \`\${nominees.length} Nominee(s) Added\`;

    // Update Step 6: Payment Button & Breakdown
    const payBtn = document.getElementById('payBtnFinal');
    if(payBtn) payBtn.innerHTML = \`<i class="fa-solid fa-lock me-2"></i> Pay &#8377;\${total.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})} Securely\`;
}
`;
js = js.replace(oldUpdateReview, newUpdateReview);


fs.writeFileSync(jsPath, js, 'utf8');
console.log("JS refactored successfully.");

