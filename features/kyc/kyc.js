document.addEventListener('DOMContentLoaded', () => {
    // Buttons
    const viewAadhaarBtn = document.getElementById('viewAadhaarBtn');
    const reuploadPanBtn = document.getElementById('reuploadPanBtn');
    const reuploadAddressBtn = document.getElementById('reuploadAddressBtn');
    
    // Upload Zone
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const viewDocModal = new bootstrap.Modal(document.getElementById('viewDocModal'));

    let currentUploadTarget = null; // 'pan' or 'address'

    // Handle View Doc
    if (viewAadhaarBtn) {
        viewAadhaarBtn.addEventListener('click', () => {
            viewDocModal.show();
        });
    }

    // Handle Re-upload Buttons
    const handleReupload = (target) => {
        currentUploadTarget = target;
        if (uploadZone) {
            uploadZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Temporary highlight effect
            const originalBorder = uploadZone.style.border || '';
            uploadZone.style.border = '2px dashed #0d6efd';
            uploadZone.style.backgroundColor = 'rgba(13, 110, 253, 0.05)';
            
            setTimeout(() => {
                uploadZone.style.border = originalBorder;
                uploadZone.style.backgroundColor = '';
            }, 1500);
        }
    };

    if (reuploadPanBtn) {
        reuploadPanBtn.addEventListener('click', () => handleReupload('pan'));
    }
    
    if (reuploadAddressBtn) {
        reuploadAddressBtn.addEventListener('click', () => handleReupload('address'));
    }

    const processUpload = (file) => {
        if (!currentUploadTarget) {
            // Default to PAN if not explicitly set
            currentUploadTarget = 'pan';
        }

        if (currentUploadTarget === 'pan') {
            const btn = document.getElementById('reuploadPanBtn');
            const badge = document.getElementById('panBadge');
            if (btn) {
                btn.textContent = 'View Doc';
                btn.className = 'btn btn-sm border bg-white px-3 fw-medium';
            }
            if (badge) {
                badge.textContent = 'Under Review';
                badge.className = 'badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-medium';
            }
        } else if (currentUploadTarget === 'address') {
            const btn = document.getElementById('reuploadAddressBtn');
            const badge = document.getElementById('addressBadge');
            const docItem = document.getElementById('addressDocItem');
            
            if (docItem) {
                docItem.classList.remove('border-danger', 'border-opacity-50');
                // Also hide the reason for rejection alert right below it if we can find it
                const alert = docItem.nextElementSibling;
                if (alert && alert.classList.contains('alert-danger')) {
                    alert.style.display = 'none';
                }
            }
            if (btn) {
                btn.textContent = 'View Doc';
                btn.className = 'btn btn-sm border bg-white px-3 fw-medium';
            }
            if (badge) {
                badge.textContent = 'Under Review';
                badge.className = 'badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-medium';
            }
        }

        // Show toast or alert
        const toastElList = [].slice.call(document.querySelectorAll('.toast'));
        const toastList = toastElList.map(function(toastEl) {
            return new bootstrap.Toast(toastEl);
        });
        if (toastList.length > 0) {
            toastList[0].show();
        } else {
            alert(`Document uploaded successfully: ${file.name}`);
        }
        
        currentUploadTarget = null;
    };

    // Handle Click Upload
    if (uploadZone && fileInput) {
        uploadZone.addEventListener('click', () => {
            fileInput.click();
        });

        // Handle File Selection
        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                processUpload(e.target.files[0]);
            }
        });

        // Handle Drag and Drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.style.border = '2px dashed #0d6efd';
            uploadZone.style.backgroundColor = 'rgba(13, 110, 253, 0.05)';
        });

        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.style.border = '';
            uploadZone.style.backgroundColor = '';
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.style.border = '';
            uploadZone.style.backgroundColor = '';
            
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                processUpload(e.dataTransfer.files[0]);
            }
        });
    }
});