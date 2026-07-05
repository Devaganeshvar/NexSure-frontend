// officer-reports.js
// Handles the dynamic report UI for the Officer Reports page using HTML-based charts

let currentReportType = 'Policy Report';
let currentDateRange = '30'; // default Last 30 Days
let currentDataset = [];

function selectReport(el) {
    document.querySelectorAll('.report-tab-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    currentReportType = el.innerText.trim();
    updateReportData();
}

function handleDateRangeChange() {
    const select = document.getElementById('dateRangeFilter');
    currentDateRange = select.value;
    updateReportData();
}

function updateReportData() {
    // Fetch filtered data from engine
    currentDataset = ReportsEngine.filterData(currentReportType, currentDateRange);
    
    // Update chart
    updateHtmlChart();
    
    // Update summary text
    const summaryEl = document.getElementById('filterSummaryText');
    if (summaryEl) {
        summaryEl.innerText = `${currentDataset.length.toLocaleString()} records match current filters`;
    }
}

function updateHtmlChart() {
    const chartContainer = document.getElementById('htmlChartContainer');
    if (!chartContainer) return;
    
    // Update title
    const titleEl = document.getElementById('chartTitle');
    if (titleEl) {
        let period = currentDateRange === 'all' ? 'All Time' : `Last ${currentDateRange} Days`;
        titleEl.innerText = `${currentReportType} Data — ${period}`;
    }

    if (currentDataset.length === 0) {
        chartContainer.innerHTML = `<div class="d-flex align-items-center justify-content-center w-100 h-100 text-muted fs-5">No data available for the selected date range</div>`;
        return;
    }

    // Bin the data
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
    
    // Take max 7 points for this UI
    if (labels.length > 7) labels = labels.slice(-7);
    
    const maxVal = Math.max(...labels.map(l => bins[l]), 10);
    // Round max to nearest 50 for clean scale
    const scaleMax = Math.ceil(maxVal / 50) * 50;
    
    // Rebuild HTML
    let html = `
        <!-- Grid lines -->
        <div class="position-absolute w-100 border-top" style="top: 20px; left: 0; border-color:#e2e8f0!important;"></div>
        <div class="position-absolute w-100 border-top" style="top: 50%; left: 0; border-color:#e2e8f0!important;"></div>
        <div class="position-absolute w-100 border-top" style="bottom: 30px; left: 0; border-color:#e2e8f0!important;"></div>
        
        <!-- Y axis labels -->
        <div class="position-absolute text-muted" style="top: 10px; left: 10px; font-size: 0.65rem;">${scaleMax}</div>
        <div class="position-absolute text-muted" style="top: calc(50% - 10px); left: 10px; font-size: 0.65rem;">${scaleMax/2}</div>
        <div class="position-absolute text-muted" style="bottom: 35px; left: 10px; font-size: 0.65rem;">0</div>
    `;

    labels.forEach((label, index) => {
        const value = bins[label];
        // Calculate height percentage based on scaleMax, max pixel height is approx 280px
        const heightPx = Math.floor((value / scaleMax) * 280);
        
        const marginLeft = index === 0 ? 'style="margin-left: 20px;"' : '';
        const marginRight = index === labels.length - 1 ? 'style="margin-right: 10px;"' : '';
        
        html += `
            <div class="text-center z-1 w-100 px-3" ${marginLeft} ${marginRight}>
                <div class="fw-bold text-dark mb-1" style="font-size: 0.75rem;">${value}</div>
                <div class="bg-dark rounded-top mx-auto" style="height: ${heightPx}px; background-color: #1c385c !important; width: 100%; max-width: 50px;"></div>
                <div class="mt-2 text-muted small">${label}</div>
            </div>
        `;
    });
    
    chartContainer.innerHTML = html;
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
