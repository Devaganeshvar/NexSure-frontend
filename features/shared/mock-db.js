window.NEXSURE_MOCK_DB = {
    applications: [
        {
            id: 'APP-9901',
            type: 'Health Insurance',
            policyholder: 'Devaganeshvar',
            coverage: '10,00,000',
            premium: '12,450',
            date: '2026-06-10',
            status: 'Pending Review'
        }
    ],
    customers: [
        {
            id: 'CUST-1001',
            name: 'Devaganeshvar',
            email: 'rahul.mehta@example.com',
            phone: '+91 98765 43210',
            dob: '1985-05-15',
            gender: 'Male',
            address: '123, Palm Grove, Mumbai, Maharashtra 400001'
        },
        {
            id: 'CUST-1002',
            name: 'Priya Sharma',
            email: 'priya.s@example.com',
            phone: '+91 98765 12345',
            dob: '1990-08-22',
            gender: 'Female',
            address: '45, Rosewood Lane, Delhi 110001'
        }
    ],
    policies: [
        {
            id: 'HLT-3321',
            type: 'Health Insurance',
            policyholder: 'Devaganeshvar',
            coverage: '5,00,000',
            premium: '8,450/yr',
            dueDate: '30 June 2026',
            status: 'Active',
            icon: 'fa-heart-pulse',
            color: 'success'
        },
        {
            id: 'MOT-5587',
            type: 'Motor Insurance (Private Car)',
            policyholder: 'Devaganeshvar',
            coverage: '4,20,000',
            coverageLabel: 'Insured Declared Value (IDV)',
            premium: '12,300/yr',
            dueDate: '12 Sept 2026',
            status: 'Active',
            icon: 'fa-car',
            color: 'primary'
        },
        {
            id: 'LIF-1190',
            type: 'Term Life Insurance',
            policyholder: 'Devaganeshvar',
            coverage: '1,00,00,000',
            coverageLabel: 'Sum Assured',
            premium: '18,200/yr',
            dueDate: '15 Oct 2026',
            status: 'Active',
            icon: 'fa-shield-halved',
            color: 'info'
        },
        {
            id: 'TRV-9012',
            type: 'Travel Insurance',
            policyholder: 'Devaganeshvar',
            coverage: '50,000',
            premium: '1,200/trip',
            dueDate: '01 Jan 2026',
            status: 'Expired',
            icon: 'fa-umbrella',
            color: 'secondary'
        }
    ],
    claims: [
        {
            id: 'CLM-1042',
            policyId: 'MOT-5587',
            title: 'Motor Accident Damage',
            status: 'Under Review',
            filedDate: '20 June 2026',
            claimedAmount: '45,000',
            settledAmount: null,
            paymentDate: null,
            steps: ['Submitted', 'Under Review', 'Approved', 'Settled', 'Closed'],
            currentStep: 2,
            actionRequired: 'Please upload the Final Garage Estimate to proceed with the review.',
            rejectionReason: null
        },
        {
            id: 'CLM-0988',
            policyId: 'LIF-1190',
            title: 'Life Critical Illness',
            status: 'Settled',
            filedDate: '10 Feb 2026',
            claimedAmount: '1,50,000',
            settledAmount: '1,50,000',
            paymentDate: '28 Feb 2026',
            steps: ['Submitted', 'Under Review', 'Approved', 'Settled', 'Closed'],
            currentStep: 5,
            actionRequired: null,
            rejectionReason: null
        },
        {
            id: 'CLM-0901',
            policyId: 'HLT-3321',
            title: 'Health Hospitalization',
            status: 'Rejected',
            filedDate: '05 Jan 2026',
            claimedAmount: '35,000',
            settledAmount: null,
            paymentDate: null,
            steps: ['Submitted', 'Under Review', 'Approved', 'Settled', 'Closed'],
            currentStep: 2,
            actionRequired: null,
            rejectionReason: 'Claim rejected due to pre-existing condition non-disclosure. Please review policy terms.'
        }
    ],
    payments: [
        {
            id: 'TXN-8829',
            policyId: 'HLT-3321',
            date: '10 June 2026',
            amount: '8,450',
            method: 'Credit Card (ends in 4242)',
            status: 'Completed'
        },
        {
            id: 'TXN-7731',
            policyId: 'MOT-5587',
            date: '15 May 2026',
            amount: '12,300',
            method: 'UPI',
            status: 'Completed'
        },
        {
            id: 'TXN-6612',
            policyId: 'LIF-1190',
            date: '02 April 2026',
            amount: '18,200',
            method: 'Net Banking',
            status: 'Failed'
        }
    ],
    notifications: [
        {
            id: 'NOTIF-1',
            type: 'Policy Renewed',
            message: 'Your health insurance policy has been successfully renewed.',
            time: 'Just now',
            icon: 'fa-file-invoice',
            color: 'primary'
        },
        {
            id: 'NOTIF-2',
            type: 'Claim Approved',
            message: 'Your recent claim CLM-9021 has been approved.',
            time: '2 hours ago',
            icon: 'fa-check-circle',
            color: 'success'
        },
        {
            id: 'NOTIF-3',
            type: 'KYC Pending',
            message: 'Please complete your KYC verification to avoid interruption.',
            time: '1 day ago',
            icon: 'fa-triangle-exclamation',
            color: 'warning'
        }
    ]
};