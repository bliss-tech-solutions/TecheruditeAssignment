const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://the-bliss-portal-backend.onrender.com';

// Helper function to handle API responses
const handleResponse = async (response) => {
    let data;
    try {
        data = await response.json();
    } catch (e) {
        throw new Error('Server error. Please try again.');
    }
    
    if (!response.ok) {
        // Handle different error formats from backend
        const errorMessage = 
            data.message || 
            data.error || 
            data.errors?.[0]?.message ||
            data.errors?.[0] ||
            (typeof data === 'string' ? data : null) ||
            `Request failed with status ${response.status}`;
        
        throw new Error(errorMessage);
    }
    return data;
};

export const productsAPI = {
    // GET /api/products/getAll - Get all products
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/api/products/getAll`);
        return handleResponse(response);
    },

    // GET /api/products/getById/:productId - Get product by ID
    getById: async (productId) => {
        const response = await fetch(`${API_BASE_URL}/api/products/getById/${productId}`);
        return handleResponse(response);
    },

    // GET /api/products/getByCategory/:categoryName - Get products by category
    getByCategory: async (categoryName) => {
        const response = await fetch(`${API_BASE_URL}/api/products/getByCategory/${categoryName}`);
        return handleResponse(response);
    },

    // POST /api/products/create - Create new product
    create: async (productData) => {
        const response = await fetch(`${API_BASE_URL}/api/products/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });
        return handleResponse(response);
    },

    // PUT /api/products/update/:productId - Update product
    update: async (productId, productData) => {
        const response = await fetch(`${API_BASE_URL}/api/products/update/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });
        return handleResponse(response);
    },

    // DELETE /api/products/delete/:productId - Delete product
    delete: async (productId) => {
        const response = await fetch(`${API_BASE_URL}/api/products/delete/${productId}`, {
            method: 'DELETE',
        });
        return handleResponse(response);
    },
};

