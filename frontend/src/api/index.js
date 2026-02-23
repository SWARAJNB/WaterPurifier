import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach token to every request
API.interceptors.request.use((config) => {
    try {
        const user = JSON.parse(localStorage.getItem('aquapure_user') || 'null');
        if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
    } catch (e) {
        console.error("Token interceptor error:", e);
    }
    return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email });
export const resetPassword = (data) => API.post('/auth/reset-password', data);
export const toggleWishlist = (productId) => API.post(`/auth/wishlist/${productId}`);

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const getBrands = () => API.get('/products/brands');

// Reviews
export const getReviews = (productId) => API.get(`/reviews/${productId}`);
export const createReview = (data) => API.post('/reviews', data);

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/myorders');
export const getOrder = (id) => API.get(`/orders/${id}`);

// Coupons
export const validateCoupon = (data) => API.post('/coupons/validate', data);

// Services & Contact
export const submitServiceRequest = (data) => API.post('/services', data);
export const submitContact = (data) => API.post('/contact', data);

// Admin
export const getAdminDashboard = () => API.get('/admin/dashboard');
export const getAdminUsers = () => API.get('/admin/users');
export const deleteAdminUser = (id) => API.delete(`/admin/users/${id}`);
export const createProduct = (data) => API.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, data) => API.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const getAdminOrders = () => API.get('/orders');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });
export const getAdminCoupons = () => API.get('/coupons');
export const createCoupon = (data) => API.post('/coupons', data);
export const deleteCoupon = (id) => API.delete(`/coupons/${id}`);

export default API;
