// admin-reports.js
// Handles the dynamic report UI and Chart rendering for the Admin Reports page

let currentReportType = 'Audit Log';
let currentDateRange = '30'; // default Last 30 Days
let currentDataset = [];
let currentPage = 1;
const rowsPerPage = 6;
let auditChartInstance = null;

function selectReport(el) {
    document.querySelectorAll('.report-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    currentReportType = el.innerText.trim();
    showAdminToast(`Switched to ${currentReportType}`);
    
    // Also reset page when switching
    currentPage = 1;
    updateReportData();
}

function handleDateRangeChange() {
    const select = document.getElementById('dateRangeFilter');
    currentDateRange = select.value;
    currentPage = 1;
    updateReportData();
}

function updateReportData() {
    // Fetch filtered data from engine
    currentDataset = ReportsEngine.filterData(currentReportType, currentDateRange);
    
    // Update chart
    updateChart();
    
    // Update table header & rows
    renderTableHeader();
    renderTableRows();
    
    // Update summary text
    const summaryEl = document.getElementById('filterSummaryText');
    if (summaryEl) {
        summaryEl.innerText = `${currentDataset.length.toLocaleString()} records match current filters`;
    }
}

function updateChart() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    const ctx = document.getElementById('auditChart').getContext('2d');
    
    if (auditChartInstance) {
        auditChartInstance.destroy();
    }
    
    if (currentDataset.length === 0) {
        // Show empty chart or handle empty state visually (we still draw the chart but with 0s)
        drawEmptyChart(ctx, textColor, gridColor);
        return;
    }

    // Group data by some metric for the chart (e.g. by week or day)
    // For simplicity, we just divide the dataset into bins or show recent days
    const bins = {};
    currentDataset.forEach(item => {
        const d = new Date(item.timestamp);
        const label = `${d.getMonth()+1}/${d.getDate()}`; // M/D format
        bins[label] = (bins[label] || 0) + 1;
    });
    
    // Sort labels by date
    let labels = Object.keys(bins).sort((a,b) => {
        const [m1,d1] = a.split('/').map(Number);
        const [m2,d2] = b.split('/').map(Number);
        return (m1 - m2) || (d1 - d2);
    });
    
    // Take max 12 points for visual clarity
    if (labels.length > 12) labels = labels.slice(-12);
    
    const data = labels.map(l => bins[l]);

    auditChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Events',
                data: data,
                backgroundColor: '#1e3a8a',
                borderRadius: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.raw + ' events';
                        }
                    }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    ticks: { color: textColor },
                    grid: { color: gridColor, drawBorder: false }
                },
                x: {
                    ticks: { color: textColor },
                    grid: { display: false, drawBorder: true, borderColor: gridColor }
                }
            }
        },
        plugins: [{
            id: 'topLabels',
            afterDatasetsDraw(chart, args, pluginOptions) {
                const { ctx, data } = chart;
                ctx.save();
                chart.getDatasetMeta(0).data.forEach((datapoint, index) => {
                    const value = data.datasets[0].data[index];
                    ctx.font = 'bold 10px Inter';
                    ctx.fillStyle = textColor;
                    ctx.textAlign = 'center';
                    ctx.fillText(value, datapoint.x, datapoint.y - 5);
                });
                ctx.restore();
            }
        }]
    });
}

function drawEmptyChart(ctx, textColor, gridColor) {
    // Creates a placeholder chart when no data exists
    auditChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['No Data'],
            datasets: [{ data: [0] }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { display: false }, x: { display: false } },
            plugins: {
                title: { display: true, text: 'No data available for the selected date range', color: textColor, padding: 50 },
                legend: { display: false }
            }
        }
    });
}

function renderTableHeader() {
    const thead = document.querySelector('.admin-table thead tr');
    let html = '';
    
    if (currentReportType.includes('Policy')) {
        html = `
            <th class="bg-transparent text-white" style="border-bottom:none">Date</th>
            <th class="bg-transparent text-white" style="border-bottom:none">Policy ID</th>
            <th class="bg-transparent text-white" style="border-bottom:none">Customer</th>
            <th class="bg-transparent text-white" style="border-bottom:none">Type & Status</th>
            <th class="bg-transparent text-white" style="border-bottom:none">Premium</th>
        `;
    } else if (currentReportType.includes('Claim')) {
        html = `
            <th class="bg-transparent text-white" style="border-bottom:none">Date</th>
            <th class="bg-transparent text-white" style="border-bottom:none">Claim ID</th>
            <th class="bg-transparent text-white" style="border-bottom:none">Policy ID</th>
            <th class="bg-transparent text-white" style="border-bottom:none">Amount</th>
            <th class="bg-transparent text-white" style="border-bottom:none">Status</th>
        `;
    } else { // Audit Logs, Bulk Import, etc.
        html = `
            <th class="bg-transparent text-white" style="border-bottom:none">Timestamp</th>
            <th class="bg-transparent text-white" style="border-bottom:none">Actor</th>
            <th class="bg-transparent text-white" style="border-bottom:none">Action</th>
            <th class="bg-transparent text-white" style="border-bottom:none">Module</th>
        `;
    }
    
    thead.innerHTML = html;
}

function renderTableRows() {
    const tbody = document.getElementById('auditTable');
    tbody.innerHTML = '';
    
    if (currentDataset.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">No data available for the selected date range</td></tr>`;
        renderPagination(1);
        return;
    }
    
    const totalPages = Math.ceil(currentDataset.length / rowsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginated = currentDataset.slice(start, end);

    paginated.forEach(item => {
        let rowHtml = '';
        const dateStr = ReportsEngine.formatDate(item.timestamp);
        
        if (currentReportType.includes('Policy')) {
            rowHtml = `
                <tr>
                    <td class="text-muted small">${dateStr}</td>
                    <td class="text-dark fw-bold">${item.id}</td>
                    <td class="text-muted">${item.customer}</td>
                    <td class="text-muted">${item.type} <span class="badge bg-light text-dark ms-1">${item.status}</span></td>
                    <td class="text-dark fw-medium">₹${item.premium.toLocaleString()}</td>
                </tr>
            `;
        } else if (currentReportType.includes('Claim')) {
            rowHtml = `
                <tr>
                    <td class="text-muted small">${dateStr}</td>
                    <td class="text-dark fw-bold">${item.id}</td>
                    <td class="text-muted">${item.policyId}</td>
                    <td class="text-dark fw-medium">₹${item.amount.toLocaleString()}</td>
                    <td class="text-muted"><span class="badge ${item.status === 'Approved' ? 'bg-success' : 'bg-secondary'}">${item.status}</span></td>
                </tr>
            `;
        } else {
            rowHtml = `
                <tr>
                    <td class="text-muted small">${dateStr}</td>
                    <td class="text-dark fw-medium">${item.actor}</td>
                    <td class="text-muted">${item.action}</td>
                    <td class="text-muted"><span class="badge bg-light text-dark">${item.module}</span></td>
                </tr>
            `;
        }
        tbody.innerHTML += rowHtml;
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const controls = document.getElementById('paginationControls');
    let html = `<a href="javascript:void(0)" class="admin-page-link" onclick="changePage(${currentPage - 1})">&lsaquo;</a>`;
    
    // Calculate range of pages to show (max 5)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4 && startPage > 1) {
        startPage = Math.max(1, endPage - 4);
    }
    
    if (startPage > 1) {
        html += `<a href="javascript:void(0)" class="admin-page-link" onclick="changePage(1)">1</a>`;
        if (startPage > 2) html += `<span class="text-muted mx-1">...</span>`;
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `<a href="javascript:void(0)" class="admin-page-link ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</a>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) html += `<span class="text-muted mx-1">...</span>`;
        html += `<a href="javascript:void(0)" class="admin-page-link" onclick="changePage(${totalPages})">${totalPages}</a>`;
    }

    html += `<a href="javascript:void(0)" class="admin-page-link" onclick="changePage(${currentPage + 1}, ${totalPages})">&rsaquo;</a>`;
    controls.innerHTML = html;
}

function changePage(page, maxPage = null) {
    if (page < 1 || (maxPage && page > maxPage)) return;
    const totalPages = Math.ceil(currentDataset.length / rowsPerPage) || 1;
    if (page > totalPages) return;
    
    currentPage = page;
    renderTableRows(); // Only re-render rows when paginating, no need to redraw chart
}

function logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    window.location.href = '/features/auth/login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // Add event listener to Date Range select
    const dateSelect = document.getElementById('dateRangeFilter');
    if (dateSelect) {
        dateSelect.addEventListener('change', handleDateRangeChange);
    }
    
    // Initial Load
    updateReportData();
});
