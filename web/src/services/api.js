import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor for JWT
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('kolay_auth_user'));
        if (user && user.accessToken) {
            config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const AuthService = {
    login: (credentials) => api.post('/auth/signin', credentials),
    signup: (userData) => api.post('/auth/signup', userData),
    logout: () => { localStorage.removeItem('kolay_auth_user'); },
};

export const MenuService = {
    getCategories: () => api.get('/menu/categories'),
    getProducts: () => api.get('/menu/products'),
    getCategoryProducts: (id) => api.get(`/menu/categories/${id}/products`),
    createProduct: (productData) => api.post('/menu/products', productData),
    updateProduct: (id, productData) => api.put(`/menu/products/${id}`, productData),
    deleteProduct: (id) => api.delete(`/menu/products/${id}`),
};

export const OrderService = {
    placeOrder: (orderData) => api.post('/orders', orderData),
    getActiveOrders: () => api.get('/orders/active'),
    updateStatus: (id, status) => api.patch(`/orders/${id}/status`, null, { params: { status } }),
};

export const InventoryService = {
    getAll: () => api.get('/inventory'),
    getLowStock: () => api.get('/inventory/low-stock'),
    updateStock: (id, amount, isAddition) =>
        api.patch(`/inventory/${id}/stock`, null, { params: { amount, isAddition } }),
};

export const ReservationService = {
    create: (reservationData) => api.post('/reservations', reservationData),
    getAll: () => api.get('/reservations'),
    getByDate: (date) => api.get(`/reservations/date/${date}`),
    updateStatus: (id, status) => api.patch(`/reservations/${id}/status`, null, { params: { status } }),
};

export default api;
