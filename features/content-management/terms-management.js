// Terms & Policies Management Script

let quillEditor;
let termsDraft = [];
let termsPublished = [];
let termsHistory = [];

const DEFAULT_POLICIES = [
    {
        id: 1,
        title: "General Policy",
        content: "<p>This policy governs the access and usage of the Insurance Policy Management System (IPMS). Access is restricted strictly to authorized users (Policyholders, Insurance Officers, and Administrators). All user interactions, logins, password changes, and transaction attempts are strictly monitored, audited, and logged to immutable security ledgers. Users must adhere to account security protocols, including regular password rotation and immediate reporting of any suspected credential compromises.</p>",
        enabled: true,
        lastUpdated: new Date().toISOString()
    },
    {
        id: 2,
        title: "Issuance Policy",
        content: "<p>Policies are generated based on verified customer information, mandatory KYC submission, and subsequent underwriting review. Any intentional or negligent misrepresentation of material facts during the application or quotation phase will result in the immediate invalidation of the policy. All adjustments, endorsements, or changes to policy coverage require formal underwriting approval before they become effective.</p>",
        enabled: true,
        lastUpdated: new Date().toISOString()
    },
    {
        id: 3,
        title: "Cancellation Policy",
        content: "<p>Only active insurance policies are eligible for cancellation. Cancellation requests may be initiated by the policyholder or triggered by the system due to non-payment of premiums. Once cancelled, a policy cannot be reinstated or reactivated. Users must type the exact confirmation phrase and acknowledge the computed refund amount and cancellation charges before the request is finalized. A formal Cancellation Certificate and Refund Advice will be generated upon completion.</p>",
        enabled: true,
        lastUpdated: new Date().toISOString()
    },
    {
        id: 4,
        title: "Payment Policy",
        content: "<p>Premium payments must be processed using approved electronic channels, including UPI, debit/credit cards, netbanking, or NEFT/RTGS. Premium calculations are performed server-side based on actuarial algorithms and cannot be modified. The system will automatically reject any payments that do not exactly match the outstanding premium amount. Successful payments will generate a GST Premium Receipt and a corresponding payment ledger entry.</p>",
        enabled: true,
        lastUpdated: new Date().toISOString()
    },
    {
        id: 5,
        title: "Refund Policy",
        content: "<p>Refund eligibility and amounts are calculated automatically based on the elapsed tenure of the policy using the following standard slabs: 80% refund if less than 25% of the tenure has elapsed; 50% refund if 25% to 50% has elapsed; 25% refund if 50% to 75% has elapsed; and 0% refund if more than 75% of the tenure has elapsed. Applicable administrative cancellation charges will be deducted from the calculated refund. Failed refunds will trigger an immediate alert to system administrators.</p>",
        enabled: true,
        lastUpdated: new Date().toISOString()
    },
    {
        id: 6,
        title: "Claims Policy",
        content: "<p>All First Notice of Loss (FNOL) claims must be submitted truthfully under absolute legal declaration. Users must review and accept the Truthful FNOL Declaration before filing. The system enforces a strict state transition sequence for claims: Submitted &rarr; Under Review &rarr; Approved/Rejected &rarr; Settled &rarr; Closed. Out-of-sequence updates are blocked, and all processing actions require underwriter validation and audit logging.</p>",
        enabled: true,
        lastUpdated: new Date().toISOString()
    },
    {
        id: 7,
        title: "Renewal Policy",
        content: "<p>Policies must be renewed prior to their expiration date to maintain continuous coverage and avoid a break in policy benefits. A grace period of 15 days is provided post-expiration; however, claims arising during this uninsured grace period are strictly excluded from coverage. Renewals are subject to reassessment based on claims history and updated tariff rates.</p>",
        enabled: true,
        lastUpdated: new Date().toISOString()
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Quill Editor
    if (document.getElementById('quillEditor')) {
        quillEditor = new Quill('#quillEditor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'clean']
                ]
            }
        });
    }

    loadTermsData();
});

function loadTermsData() {
    const pub = localStorage.getItem('termsPoliciesPublished');
    const drf = localStorage.getItem('termsPoliciesDraft');
    const hist = localStorage.getItem('termsPoliciesHistory');

    if (!pub && !drf) {
        // Initialize default
        termsPublished = JSON.parse(JSON.stringify(DEFAULT_POLICIES));
        localStorage.setItem('termsPoliciesPublished', JSON.stringify(termsPublished));
    } else {
        termsPublished = pub ? JSON.parse(pub) : [];
    }

    if (drf) {
        termsDraft = JSON.parse(drf);
    } else {
        termsDraft = JSON.parse(JSON.stringify(termsPublished));
    }

    termsHistory = hist ? JSON.parse(hist) : [];
    
    // Seed history if empty for demonstration purposes
    if (termsHistory.length === 0 && termsPublished.length > 0) {
        termsHistory.push({
            versionId: 'v1',
            date: new Date('2026-01-01T10:00:00Z').toISOString(),
            policies: JSON.parse(JSON.stringify(termsPublished))
        });
        localStorage.setItem('termsPoliciesHistory', JSON.stringify(termsHistory));
    }
    
    renderPoliciesTable();
    renderAdminLegalPolicy();
    window.updateTermsHeaderState();
}

function renderAdminLegalPolicy() {
    const dynamicContent = document.getElementById('dynamicAdminPrivacyContent');
    if (!dynamicContent) return;

    let policyHtml = '';
    const activePolicies = termsPublished.filter(p => p.enabled);
    
    if (activePolicies.length > 0) {
        activePolicies.forEach((p, index) => {
            policyHtml += `
                <div class="mb-4" id="policy-${index + 1}">
                    <h6 class="fw-bold text-dark d-flex align-items-center gap-2 mb-2 border-bottom pb-2">
                        <i class="fa-solid fa-circle-${index + 1} fs-5 text-secondary" style="font-size: 1.1rem;"></i> ${p.title}
                    </h6>
                    <div class="text-muted">${p.content}</div>
                </div>
            `;
        });
    } else {
        policyHtml = '<p class="text-muted">No policies are currently published.</p>';
    }

    dynamicContent.innerHTML = policyHtml;
}

window.updateTermsHeaderState = function() {
    const drfStr = localStorage.getItem('termsPoliciesDraft');
    const pubStr = localStorage.getItem('termsPoliciesPublished');
    
    const draftStatusEl = document.getElementById('draft-status');
    const btnDiscard = document.getElementById('btn-discard');
    const btnPublish = document.getElementById('btn-publish');

    if (drfStr && drfStr !== pubStr) {
        draftStatusEl.textContent = 'Unpublished Draft';
        draftStatusEl.className = 'badge bg-warning text-dark px-3 py-2';
        btnDiscard.style.display = 'inline-block';
        btnPublish.disabled = false;
    } else {
        draftStatusEl.textContent = 'Published / Synced';
        draftStatusEl.className = 'badge bg-secondary px-3 py-2';
        btnDiscard.style.display = 'none';
        btnPublish.disabled = true;
    }
}

function renderPoliciesTable() {
    const tbody = document.getElementById('policiesTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    if (termsDraft.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">No policies found. Click "Add Policy" to create one.</td></tr>';
        return;
    }

    termsDraft.forEach((policy, index) => {
        const dateStr = new Date(policy.lastUpdated).toLocaleString('en-GB', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
        
        tbody.innerHTML += `
            <tr>
                <td class="text-muted fw-bold">${index + 1}</td>
                <td class="fw-medium text-dark">${policy.title}</td>
                <td>
                    <div class="form-check form-switch m-0">
                        <input class="form-check-input" type="checkbox" onchange="togglePolicyEnabled(${policy.id})" ${policy.enabled ? 'checked' : ''} style="cursor:pointer">
                        <label class="form-check-label ms-1 small ${policy.enabled ? 'text-success' : 'text-muted'}">${policy.enabled ? 'Active' : 'Disabled'}</label>
                    </div>
                </td>
                <td class="text-muted small">${dateStr}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editPolicy(${policy.id})"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deletePolicy(${policy.id})"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function saveDraftToStorage() {
    localStorage.setItem('termsPoliciesDraft', JSON.stringify(termsDraft));
    renderPoliciesTable();
    window.updateTermsHeaderState();
}

function openPolicyModal(id = null) {
    const modal = new bootstrap.Modal(document.getElementById('policyModal'));
    
    if (id) {
        const policy = termsDraft.find(p => p.id === id);
        document.getElementById('policyModalTitle').textContent = 'Edit Policy';
        document.getElementById('policyId').value = policy.id;
        document.getElementById('policyTitle').value = policy.title;
        document.getElementById('policyEnabled').checked = policy.enabled;
        quillEditor.root.innerHTML = policy.content;
    } else {
        document.getElementById('policyModalTitle').textContent = 'Add New Policy';
        document.getElementById('policyId').value = '';
        document.getElementById('policyTitle').value = '';
        document.getElementById('policyEnabled').checked = true;
        quillEditor.root.innerHTML = '';
    }
    
    modal.show();
}

window.editPolicy = function(id) {
    openPolicyModal(id);
}

window.savePolicy = function() {
    const id = document.getElementById('policyId').value;
    const title = document.getElementById('policyTitle').value.trim();
    const content = quillEditor.root.innerHTML;
    const enabled = document.getElementById('policyEnabled').checked;
    
    if (!title) {
        showAdminToast('Policy Title is required', 'warning');
        return;
    }
    
    if (id) {
        // Update existing
        const policyIndex = termsDraft.findIndex(p => p.id == id);
        if (policyIndex > -1) {
            termsDraft[policyIndex].title = title;
            termsDraft[policyIndex].content = content;
            termsDraft[policyIndex].enabled = enabled;
            termsDraft[policyIndex].lastUpdated = new Date().toISOString();
        }
    } else {
        // Create new
        const newId = termsDraft.length > 0 ? Math.max(...termsDraft.map(p => p.id)) + 1 : 1;
        termsDraft.push({
            id: newId,
            title: title,
            content: content,
            enabled: enabled,
            lastUpdated: new Date().toISOString()
        });
    }
    
    saveDraftToStorage();
    bootstrap.Modal.getInstance(document.getElementById('policyModal')).hide();
    showAdminToast('Policy saved to draft successfully!', 'success');
}

window.deletePolicy = function(id) {
    if (confirm('Are you sure you want to delete this policy?')) {
        termsDraft = termsDraft.filter(p => p.id !== id);
        saveDraftToStorage();
        showAdminToast('Policy deleted from draft.', 'info');
    }
}

window.togglePolicyEnabled = function(id) {
    const policyIndex = termsDraft.findIndex(p => p.id == id);
    if (policyIndex > -1) {
        termsDraft[policyIndex].enabled = !termsDraft[policyIndex].enabled;
        termsDraft[policyIndex].lastUpdated = new Date().toISOString();
        saveDraftToStorage();
    }
}

window.publishTermsChanges = function() {
    if (confirm('Are you sure you want to publish these Terms & Policies to the live customer application?')) {
        
        // Save to history before overwriting published
        if (termsPublished.length > 0) {
            const versionId = 'v' + (termsHistory.length + 1);
            termsHistory.push({
                versionId: versionId,
                date: new Date().toISOString(),
                policies: JSON.parse(JSON.stringify(termsPublished))
            });
            localStorage.setItem('termsPoliciesHistory', JSON.stringify(termsHistory));
        }

        // Publish
        termsPublished = JSON.parse(JSON.stringify(termsDraft));
        localStorage.setItem('termsPoliciesPublished', JSON.stringify(termsPublished));
        
        // Clear draft distinction since they match now
        window.updateTermsHeaderState();
        renderAdminLegalPolicy();
        showAdminToast('Terms & Policies published successfully!', 'success');
    }
}

window.discardTermsDraft = function() {
    if (confirm('Are you sure you want to discard your draft? This will revert to the currently published version.')) {
        termsDraft = JSON.parse(JSON.stringify(termsPublished));
        localStorage.removeItem('termsPoliciesDraft');
        renderPoliciesTable();
        window.updateTermsHeaderState();
        showAdminToast('Draft discarded.', 'info');
    }
}

window.openVersionHistoryModal = function() {
    const modal = new bootstrap.Modal(document.getElementById('versionHistoryModal'));
    const list = document.getElementById('versionHistoryList');
    
    if (termsHistory.length === 0) {
        list.innerHTML = '<div class="text-center p-4 text-muted">No version history available.</div>';
    } else {
        list.innerHTML = '';
        [...termsHistory].reverse().forEach(hist => {
            const dateStr = new Date(hist.date).toLocaleString('en-GB', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
            list.innerHTML += `
                <div class="list-group-item d-flex justify-content-between align-items-center py-3">
                    <div>
                        <h6 class="mb-1 fw-bold text-dark">Version ${hist.versionId}</h6>
                        <small class="text-muted">Published on ${dateStr}</small>
                        <div class="small text-muted mt-1">${hist.policies.length} policies included</div>
                    </div>
                    <button class="btn btn-sm btn-outline-primary" onclick="restoreVersion('${hist.versionId}')">Restore</button>
                </div>
            `;
        });
    }
    
    modal.show();
}

window.restoreVersion = function(versionId) {
    if (confirm(`Are you sure you want to restore Version ${versionId}? This will overwrite your current draft.`)) {
        const hist = termsHistory.find(h => h.versionId === versionId);
        if (hist) {
            termsDraft = JSON.parse(JSON.stringify(hist.policies));
            saveDraftToStorage();
            bootstrap.Modal.getInstance(document.getElementById('versionHistoryModal')).hide();
            showAdminToast(`Restored Version ${versionId} to draft.`, 'success');
        }
    }
}
