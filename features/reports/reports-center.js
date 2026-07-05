document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. DUMMY DATA SETS
    // ==========================================
    const datasets = {
        policy: [
            { id: 'HLT-3321', product: 'Health Insurance Standard', sum: '₹5,00,000', premium: '₹8,450', status: 'Active', expiry: '30 Jun 2026', type: 'Health', year: '2026' },
            { id: 'MOT-5587', product: 'Motor Private Car', sum: '₹4,20,000', premium: '₹12,300', status: 'Active', expiry: '12 Sep 2026', type: 'Motor', year: '2026' },
            { id: 'LIF-1190', product: 'Term Life Protection', sum: '₹1,00,00,000', premium: '₹18,200', status: 'Active', expiry: '15 Oct 2026', type: 'Life', year: '2026' },
            { id: 'MOT-1122', product: 'Two Wheeler Comprehensive', sum: '₹85,000', premium: '₹1,200', status: 'Expired', expiry: '05 Jan 2025', type: 'Motor', year: '2025' }
        ],
        payment: [
            { id: 'INV-8891', date: '12 Jan 2026', policy: 'MOT-5587', amount: '₹12,300', method: 'Credit Card', status: 'Paid', year: '2026' },
            { id: 'INV-8892', date: '05 Feb 2026', policy: 'HLT-3321', amount: '₹8,450', method: 'UPI', status: 'Paid', year: '2026' },
            { id: 'INV-8893', date: '20 Mar 2026', policy: 'LIF-1190', amount: '₹18,200', method: 'Net Banking', status: 'Pending', year: '2026' },
            { id: 'INV-7741', date: '15 Dec 2025', policy: 'MOT-1122', amount: '₹1,200', method: 'Debit Card', status: 'Paid', year: '2025' }
        ],
        claim: [
            { id: 'CLM-901', policy: 'HLT-3321', date: '10 Feb 2026', amount: '₹45,000', status: 'Approved', payout: '₹45,000', year: '2026' },
            { id: 'CLM-902', policy: 'MOT-5587', date: '22 Mar 2026', amount: '₹12,500', status: 'In Progress', payout: '₹0', year: '2026' },
            { id: 'CLM-850', policy: 'MOT-1122', date: '14 Nov 2025', amount: '₹8,000', status: 'Rejected', payout: '₹0', year: '2025' }
        ],
        renewal: [
            { id: 'HLT-3321', product: 'Health Insurance Standard', premium: '₹8,450', due: '30 Jun 2026', grace: '30 Jul 2026', status: 'Upcoming', type: 'Health', year: '2026' },
            { id: 'MOT-5587', product: 'Motor Private Car', premium: '₹12,300', due: '12 Sep 2026', grace: '12 Oct 2026', status: 'Upcoming', type: 'Motor', year: '2026' },
            { id: 'LIF-1190', product: 'Term Life Protection', premium: '₹18,200', due: '15 Oct 2026', grace: '14 Nov 2026', status: 'Upcoming', type: 'Life', year: '2026' },
            { id: 'MOT-1122', product: 'Two Wheeler Comprehensive', premium: '₹1,200', due: '05 Jan 2025', grace: '05 Feb 2025', status: 'Overdue', type: 'Motor', year: '2025' }
        ]
    };

    let currentReport = 'policy';

    // ==========================================
    // 2. DOM ELEMENTS
    // ==========================================
    const reportCards = document.querySelectorAll('.report-type-card');
    const tableHead = document.querySelector('.table thead tr');
    const tableBody = document.querySelector('.table tbody');
    const recordsText = document.getElementById('records-matched-text');
    const previewTitle = document.querySelector('.preview-card h5');
    const filtersContainer = document.querySelector('.report-filters');

    // ==========================================
    // 3. RENDER FUNCTIONS
    // ==========================================
    function renderFilters(type) {
        let html = '';
        if (type === 'policy' || type === 'renewal') {
            html += `
                <select class="form-select w-auto border-0 bg-light fw-medium shadow-none filter-type" id="filter1">
                    <option value="All">Policy Type: All</option>
                    <option value="Health">Policy Type: Health</option>
                    <option value="Motor">Policy Type: Motor</option>
                    <option value="Life">Policy Type: Life</option>
                </select>
            `;
        }
        
        html += `
            <select class="form-select w-auto border-0 bg-light fw-medium shadow-none filter-year" id="filter2">
                <option value="All">Year: All</option>
                <option value="2026">Year: 2026</option>
                <option value="2025">Year: 2025</option>
            </select>
        `;

        if (type === 'policy') {
            html += `
                <select class="form-select w-auto border-0 bg-light fw-medium shadow-none filter-status" id="filter3">
                    <option value="All">Status: All</option>
                    <option value="Active">Status: Active</option>
                    <option value="Expired">Status: Expired</option>
                </select>
            `;
        } else if (type === 'payment') {
            html += `
                <select class="form-select w-auto border-0 bg-light fw-medium shadow-none filter-status" id="filter3">
                    <option value="All">Status: All</option>
                    <option value="Paid">Status: Paid</option>
                    <option value="Pending">Status: Pending</option>
                </select>
            `;
        } else if (type === 'claim') {
            html += `
                <select class="form-select w-auto border-0 bg-light fw-medium shadow-none filter-status" id="filter3">
                    <option value="All">Status: All</option>
                    <option value="Approved">Status: Approved</option>
                    <option value="In Progress">Status: In Progress</option>
                    <option value="Rejected">Status: Rejected</option>
                </select>
            `;
        } else if (type === 'renewal') {
            html += `
                <select class="form-select w-auto border-0 bg-light fw-medium shadow-none filter-status" id="filter3">
                    <option value="All">Status: All</option>
                    <option value="Upcoming">Status: Upcoming</option>
                    <option value="Overdue">Status: Overdue</option>
                </select>
            `;
        }

        filtersContainer.innerHTML = html;

        // Add event listeners to new dropdowns
        document.querySelectorAll('.report-filters select').forEach(select => {
            select.addEventListener('change', () => applyFilters(currentReport));
        });
    }

    function getBadgeClass(status) {
        switch(status) {
            case 'Active': case 'Paid': case 'Approved': return 'badge-active';
            case 'Expired': case 'Rejected': case 'Overdue': return 'bg-danger text-white border-danger';
            case 'Pending': case 'In Progress': case 'Upcoming': return 'bg-warning text-dark border-warning';
            default: return 'bg-secondary text-white';
        }
    }

    function renderTable(type, data) {
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';

        if (type === 'policy') {
            tableHead.innerHTML = `<th>POLICY NO</th><th>PRODUCT</th><th>SUM INSURED</th><th>PREMIUM</th><th>STATUS</th><th>EXPIRY</th>`;
            data.forEach(row => {
                tableBody.innerHTML += `<tr>
                    <td class="fw-bold">${row.id}</td>
                    <td>${row.product}</td>
                    <td class="fw-medium">${row.sum}</td>
                    <td>${row.premium}</td>
                    <td><span class="badge ${getBadgeClass(row.status)} px-3 py-2 rounded-pill">${row.status}</span></td>
                    <td>${row.expiry}</td>
                </tr>`;
            });
        } else if (type === 'payment') {
            tableHead.innerHTML = `<th>INVOICE ID</th><th>DATE</th><th>POLICY NO</th><th>AMOUNT</th><th>METHOD</th><th>STATUS</th>`;
            data.forEach(row => {
                tableBody.innerHTML += `<tr>
                    <td class="fw-bold">${row.id}</td>
                    <td>${row.date}</td>
                    <td class="fw-medium">${row.policy}</td>
                    <td>${row.amount}</td>
                    <td>${row.method}</td>
                    <td><span class="badge ${getBadgeClass(row.status)} px-3 py-2 rounded-pill">${row.status}</span></td>
                </tr>`;
            });
        } else if (type === 'claim') {
            tableHead.innerHTML = `<th>CLAIM NO</th><th>POLICY NO</th><th>DATE</th><th>CLAIM AMOUNT</th><th>STATUS</th><th>PAYOUT</th>`;
            data.forEach(row => {
                tableBody.innerHTML += `<tr>
                    <td class="fw-bold">${row.id}</td>
                    <td>${row.policy}</td>
                    <td>${row.date}</td>
                    <td class="fw-medium">${row.amount}</td>
                    <td><span class="badge ${getBadgeClass(row.status)} px-3 py-2 rounded-pill">${row.status}</span></td>
                    <td class="fw-bold text-success">${row.payout}</td>
                </tr>`;
            });
        } else if (type === 'renewal') {
            tableHead.innerHTML = `<th>POLICY NO</th><th>PRODUCT</th><th>PREMIUM</th><th>DUE DATE</th><th>GRACE PERIOD</th><th>STATUS</th>`;
            data.forEach(row => {
                tableBody.innerHTML += `<tr>
                    <td class="fw-bold">${row.id}</td>
                    <td>${row.product}</td>
                    <td class="fw-medium">${row.premium}</td>
                    <td>${row.due}</td>
                    <td class="text-muted">${row.grace}</td>
                    <td><span class="badge ${getBadgeClass(row.status)} px-3 py-2 rounded-pill">${row.status}</span></td>
                </tr>`;
            });
        }

        recordsText.textContent = `Showing ${data.length} records matched`;
    }

    // ==========================================
    // 4. FILTER LOGIC
    // ==========================================
    function applyFilters(type) {
        let filtered = datasets[type];
        
        const filter1 = document.getElementById('filter1'); // Type
        const filter2 = document.getElementById('filter2'); // Year
        const filter3 = document.getElementById('filter3'); // Status

        if (filter1 && filter1.value !== 'All') {
            filtered = filtered.filter(item => item.type === filter1.value);
        }
        if (filter2 && filter2.value !== 'All') {
            filtered = filtered.filter(item => item.year === filter2.value);
        }
        if (filter3 && filter3.value !== 'All') {
            filtered = filtered.filter(item => item.status === filter3.value);
        }

        renderTable(type, filtered);
    }

    // ==========================================
    // 5. EVENT LISTENERS
    // ==========================================
    reportCards.forEach(card => {
        card.addEventListener('click', () => {
            reportCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const title = card.querySelector('.report-title').textContent;
            previewTitle.textContent = `${title} Preview`;

            if (title.includes('Policy')) currentReport = 'policy';
            else if (title.includes('Payment')) currentReport = 'payment';
            else if (title.includes('Claim')) currentReport = 'claim';
            else if (title.includes('Renewal')) currentReport = 'renewal';

            renderFilters(currentReport);
            applyFilters(currentReport);
        });
    });

    // ==========================================
    // 6. EXPORT FUNCTIONALITY
    // ==========================================
    function downloadFile(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function generateCSV() {
        const rows = [];
        const headers = Array.from(tableHead.querySelectorAll('th')).map(th => th.textContent);
        rows.push(headers.join(','));
        
        tableBody.querySelectorAll('tr').forEach(tr => {
            const rowData = Array.from(tr.querySelectorAll('td')).map(td => `"${td.textContent.trim()}"`);
            rows.push(rowData.join(','));
        });
        
        downloadFile(rows.join('\n'), `${currentReport}-report.csv`, 'text/csv');
    }

    function generateTXT() {
        const rows = [];
        const headers = Array.from(tableHead.querySelectorAll('th')).map(th => th.textContent.padEnd(20));
        rows.push(headers.join(' | '));
        rows.push('-'.repeat(headers.length * 23));
        
        tableBody.querySelectorAll('tr').forEach(tr => {
            const rowData = Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim().padEnd(20));
            rows.push(rowData.join(' | '));
        });
        
        downloadFile(rows.join('\n'), `${currentReport}-report.txt`, 'text/plain');
    }

    document.querySelectorAll('.export-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const format = e.target.textContent.trim();
            if (format === 'CSV') {
                generateCSV();
            } else if (format === 'TXT') {
                generateTXT();
            } else if (format === 'Excel') {
                // For dummy excel, we just export a CSV with a .xls extension
                downloadFile(document.querySelector('.table-responsive').innerHTML, `${currentReport}-report.xls`, 'application/vnd.ms-excel');
            } else if (format === 'PDF') {
                window.print();
            }
        });
    });
    
    document.querySelector('.btn-outline-secondary').addEventListener('click', () => {
        window.print(); // Simple preview using print dialog
    });

    document.querySelector('.btn-dark-blue').addEventListener('click', () => {
        window.print(); // Simple pdf download using print dialog
    });

    // Initialize
    renderFilters(currentReport);
    applyFilters(currentReport);

});
