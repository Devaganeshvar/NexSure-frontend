document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. DUMMY DATA SETS
    // ==========================================
    const policies = window.PolicySync ? window.PolicySync.getPolicies() : [];
    const payments = JSON.parse(localStorage.getItem('mockPaymentHistory') || '[]');
    const claims = JSON.parse(localStorage.getItem('mockClaims') || '[]');

    const datasets = {
        policy: policies.map(p => {
            const yearMatch = (p.dueDate || '').match(/\d{4}/);
            const year = yearMatch ? yearMatch[0] : new Date().getFullYear().toString();
            return {
                id: p.id,
                product: p.type + ' Insurance',
                sum: '₹' + p.coverage,
                premium: '₹' + p.premium,
                status: p.status,
                expiry: p.dueDate || '-',
                type: p.type.split(' ')[0], // Life, Motor, Health
                year: year
            };
        }),
        payment: payments.map(pmt => {
            const yearMatch = (pmt.date || '').match(/\d{4}/);
            const year = yearMatch ? yearMatch[0] : new Date().getFullYear().toString();
            return {
                id: pmt.id,
                date: pmt.date,
                policy: pmt.policy,
                amount: pmt.amount,
                method: pmt.mode,
                status: pmt.status === 'Successful' ? 'Paid' : pmt.status,
                year: year
            };
        }),
        claim: claims.map(c => {
            const yearMatch = (c.date || '').match(/\d{4}/);
            const year = yearMatch ? yearMatch[0] : new Date().getFullYear().toString();
            return {
                id: c.id,
                policy: c.policyId || 'Unknown',
                date: c.date,
                amount: c.amount,
                status: c.status,
                payout: c.status === 'Settled' || c.status === 'Closed' ? c.amount : '₹0',
                year: year
            };
        }),
        renewal: policies.filter(p => p.status === 'Active' || p.status === 'Expired').map(p => {
            const yearMatch = (p.dueDate || '').match(/\d{4}/);
            const year = yearMatch ? yearMatch[0] : new Date().getFullYear().toString();
            return {
                id: p.id,
                product: p.type + ' Insurance',
                premium: '₹' + p.premium,
                due: p.dueDate,
                grace: p.dueDate, // Mock grace period same as due date for now
                status: p.status === 'Active' ? 'Upcoming' : 'Overdue',
                type: p.type.split(' ')[0],
                year: year
            };
        })
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
