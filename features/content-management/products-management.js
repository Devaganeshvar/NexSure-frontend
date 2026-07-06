// Products Management Script

let mockProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    loadProductsData();
});

function loadProductsData() {
    const data = localStorage.getItem('mockProducts');
    if (data) {
        mockProducts = JSON.parse(data);
    }
    renderProductsTable();
}

function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    mockProducts.forEach((prod, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="text-muted fw-medium">${index + 1}</td>
            <td class="fw-bold text-dark">${prod.name}</td>
            <td><span class="badge bg-secondary">${prod.type}</span></td>
            <td class="fw-medium">₹${prod.price}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-secondary me-2" onclick="openProductModal('${prod.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${prod.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openProductModal(id = null) {
    const form = document.getElementById('productForm');
    form.reset();
    
    if (id) {
        const prod = mockProducts.find(p => p.id === id);
        if (prod) {
            document.getElementById('productId').value = prod.id;
            document.getElementById('productName').value = prod.name;
            document.getElementById('productType').value = prod.type;
            document.getElementById('productPrice').value = prod.price;
            document.getElementById('productDesc').value = prod.description || '';
            document.getElementById('productFeatures').value = (prod.features || []).join(', ');
            document.getElementById('productModalTitle').textContent = 'Edit Product';
        }
    } else {
        document.getElementById('productId').value = '';
        document.getElementById('productModalTitle').textContent = 'Add New Product';
    }
    
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

function saveProduct() {
    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const type = document.getElementById('productType').value;
    const price = document.getElementById('productPrice').value;
    const desc = document.getElementById('productDesc').value;
    const featuresStr = document.getElementById('productFeatures').value;
    
    if(!name || !type || !price) {
        alert("Please fill in required fields.");
        return;
    }
    
    const features = featuresStr.split(',').map(f => f.trim()).filter(f => f);
    
    // Choose an image based on type as a simple default
    const imgMap = {
        'Life': '../../assets/images/LandingPage/landing1.png',
        'Health': '../../assets/images/LandingPage/landing2.png',
        'Motor': '../../assets/images/LandingPage/landing3.png',
        'Property': '../../assets/images/LandingPage/landing4.png',
        'Travel': '../../assets/images/LandingPage/landing5.png'
    };
    const image = imgMap[type] || imgMap['Life'];

    if (id) {
        // Edit
        const index = mockProducts.findIndex(p => p.id === id);
        if (index > -1) {
            mockProducts[index] = {
                ...mockProducts[index],
                name,
                type,
                price: parseInt(price),
                description: desc,
                features,
                image: mockProducts[index].image || image
            };
        }
    } else {
        // Add
        const newId = 'PROD-' + Date.now();
        mockProducts.push({
            id: newId,
            name,
            type,
            price: parseInt(price),
            description: desc,
            features,
            image
        });
    }
    
    localStorage.setItem('mockProducts', JSON.stringify(mockProducts));
    renderProductsTable();
    
    const modalElement = document.getElementById('productModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if(modal) modal.hide();
}

function deleteProduct(id) {
    if(confirm("Are you sure you want to delete this product?")) {
        mockProducts = mockProducts.filter(p => p.id !== id);
        localStorage.setItem('mockProducts', JSON.stringify(mockProducts));
        renderProductsTable();
    }
}
