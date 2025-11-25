const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://the-bliss-portal-backend.onrender.com';

const handleResponse = async (response) => {
    let data;
    try {
        data = await response.json();
    } catch (e) {
        throw new Error('Server error. Please try again.');
    }
    
    if (!response.ok) {
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
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/api/products/getAll`);
        return handleResponse(response);
    },

    getById: async (productId) => {
        const response = await fetch(`${API_BASE_URL}/api/products/getById/${productId}`);
        return handleResponse(response);
    },

    getByCategory: async (categoryName) => {
        const response = await fetch(`${API_BASE_URL}/api/products/getByCategory/${categoryName}`);
        return handleResponse(response);
    },

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

    delete: async (productId) => {
        const response = await fetch(`${API_BASE_URL}/api/products/delete/${productId}`, {
            method: 'DELETE',
        });
        return handleResponse(response);
    },
};
