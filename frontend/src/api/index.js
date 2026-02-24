import axios from 'axios';

const API = axios.create({ baseURL: '/api/v1' });

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
export const logoutUser = () => API.post('/auth/logout');

// User Profile, Cart & Wishlist
export const getProfile = () => API.get('/user/profile');
export const updateProfile = (data) => API.put('/user/profile', data);
export const toggleWishlist = (productId) => API.post(`/user/wishlist/${productId}`);
export const getCart = () => API.get('/user/cart');
export const syncCart = (items) => API.post('/user/cart/sync', items);

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);

// Services
export const getServices = () => API.get('/services');
export const bookService = (data) => API.post('/services/book', data);

// Reviews
export const getReviews = (productId) => API.get(`/reviews/${productId}`);
export const createReview = (data) => API.post('/reviews', data);

// Orders & Payments
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/myorders');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const createRazorpayOrder = (amount) => API.post('/payments/create-order', null, { params: { amount } });
export const verifyPayment = (data) => API.post('/payments/verify', data);

// Company Info
export const getBusinessInfo = () => API.get('/info');
export const updateBusinessInfo = (data) => API.put('/info', data);

// Admin
export const getAdminDashboard = () => API.get('/admin/dashboard');
export const createAdminProduct = (data) => API.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateAdminProduct = (id, data) => API.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteAdminProduct = (id) => API.delete(`/products/${id}`);
export const getAdminOrders = () => API.get('/orders');
export const updateAdminOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });
export const getAdminServices = () => API.get('/services');

export default API;
