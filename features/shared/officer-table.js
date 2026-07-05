class OfficerTable {
    constructor(config) {
        this.data = config.data || [];
        this.columns = config.columns || [];
        this.itemsPerPage = config.itemsPerPage || 10;
        this.currentPage = 1;
        this.filteredData = [...this.data];
        
        this.tableBody = document.getElementById(config.tableBodyId);
        this.paginationContainer = document.getElementById(config.paginationContainerId);
        
        this.searchInput = config.searchInputId ? document.getElementById(config.searchInputId) : null;
        if(this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        this.filterSelects = config.filterSelectIds ? config.filterSelectIds.map(id => document.getElementById(id)) : [];
        this.filterSelects.forEach(select => {
            if(select) {
                select.addEventListener('change', () => this.applyFilters());
            }
        });

        // Optional logic to handle complex filtering based on dropdowns
        this.filterLogic = config.filterLogic || null;
        this.sortLogic = config.sortLogic || null;

        this.render();
    }

    handleSearch(term) {
        this.applyFilters(term);
    }

    applyFilters(searchTerm = null) {
        if(searchTerm === null && this.searchInput) {
            searchTerm = this.searchInput.value;
        }
        searchTerm = (searchTerm || '').toLowerCase();
        
        this.filteredData = this.data.filter(item => {
            // Text Search Match
            let matchSearch = true;
            if(searchTerm) {
                matchSearch = Object.values(item).some(val => 
                    String(val).toLowerCase().includes(searchTerm)
                );
            }
            
            // Dropdown/Custom Filter Match
            let matchFilter = true;
            if(this.filterLogic) {
                matchFilter = this.filterLogic(item, this.filterSelects);
            }
            
            return matchSearch && matchFilter;
        });

        if(this.sortLogic) {
            this.filteredData.sort((a, b) => this.sortLogic(a, b, this.filterSelects));
        }

        this.currentPage = 1;
        this.render();
    }

    render() {
        if(!this.tableBody) return;
        
        this.tableBody.innerHTML = '';
        
        if(this.filteredData.length === 0) {
            this.tableBody.innerHTML = `<tr><td colspan="${this.columns.length}" class="text-center text-muted py-4">No records found matching your filters.</td></tr>`;
            if(this.paginationContainer) this.paginationContainer.innerHTML = '';
            
            // Optional records count update
            const recordsCount = document.getElementById('records-count');
            if(recordsCount) recordsCount.textContent = '0 records found';
            return;
        }

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedData = this.filteredData.slice(startIndex, endIndex);

        paginatedData.forEach(item => {
            const tr = document.createElement('tr');
            this.columns.forEach(col => {
                const td = document.createElement('td');
                if(col.render) {
                    td.innerHTML = col.render(item);
                } else {
                    td.textContent = item[col.key] || '';
                }
                tr.appendChild(td);
            });
            this.tableBody.appendChild(tr);
        });

        this.renderPagination();
        
        // Optional records count update
        const recordsCount = document.getElementById('records-count');
        if(recordsCount) recordsCount.textContent = `${this.filteredData.length} records match current filters`;
    }

    renderPagination() {
        if(!this.paginationContainer) return;
        this.paginationContainer.innerHTML = '';
        
        const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
        if(totalPages <= 1) return;

        // Prev btn
        const prevBtn = document.createElement('a');
        prevBtn.href = 'javascript:void(0)';
        prevBtn.className = `page-btn ${this.currentPage === 1 ? 'disabled opacity-50' : ''}`;
        prevBtn.innerHTML = '&lsaquo;';
        prevBtn.onclick = () => {
            if(this.currentPage > 1) {
                this.currentPage--;
                this.render();
            }
        };
        this.paginationContainer.appendChild(prevBtn);

        // Page Numbers
        for(let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('a');
            pageBtn.href = 'javascript:void(0)';
            pageBtn.className = `page-btn ${this.currentPage === i ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => {
                this.currentPage = i;
                this.render();
            };
            this.paginationContainer.appendChild(pageBtn);
        }

        // Next btn
        const nextBtn = document.createElement('a');
        nextBtn.href = 'javascript:void(0)';
        nextBtn.className = `page-btn ${this.currentPage === totalPages ? 'disabled opacity-50' : ''}`;
        nextBtn.innerHTML = '&rsaquo;';
        nextBtn.onclick = () => {
            if(this.currentPage < totalPages) {
                this.currentPage++;
                this.render();
            }
        };
        this.paginationContainer.appendChild(nextBtn);
    }
}

window.OfficerTable = OfficerTable;
