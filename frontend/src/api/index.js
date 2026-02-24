import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const API = axios.create({ 
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Request interceptor - attach token to every request
API.interceptors.request.use(
    (config) => {
        try {
            const user = JSON.parse(localStorage.getItem('aquapure_user') || 'null');
            if (user?.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        } catch (e) {
            console.error("⚠️ Token interceptor error:", e);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear user data and redirect to login
            localStorage.removeItem('aquapure_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ============ AUTH ENDPOINTS ============
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const logoutUser = () => API.post('/auth/logout');
export const verifyToken = () => API.post('/auth/verify-token');
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email });
export const resetPassword = (data) => API.post('/auth/reset-password', data);

// ============ USER PROFILE & CART ============
export const getProfile = () => API.get('/user/profile');
export const updateProfile = (data) => API.put('/user/profile', data);
export const toggleWishlist = (productId) => API.post(`/user/wishlist/${productId}`);
export const getWishlist = () => API.get('/user/wishlist');
export const addToCart = (productId, quantity) => API.post('/user/cart', { productId, quantity });
export const removeFromCart = (productId) => API.delete(`/user/cart/${productId}`);
export const getCart = () => API.get('/user/cart');
export const clearCart = () => API.delete('/user/cart');
export const syncCart = (items) => API.post('/user/cart/sync', { items });
export const addToSavedForLater = (productId) => API.post('/user/saved', { productId });
export const getSavedForLater = () => API.get('/user/saved');

// ============ PRODUCTS ENDPOINTS ============
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const getBrands = () => API.get('/products/brands');
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// ============ SERVICES ENDPOINTS ============
export const getServices = () => API.get('/services');
export const bookService = (data) => API.post('/services/book', data);
export const getUserBookings = () => API.get('/services/my-bookings');
export const cancelBooking = (bookingId) => API.post(`/services/book/${bookingId}/cancel`);

// ============ REVIEWS ENDPOINTS ============
export const getReviews = (productId) => API.get(`/reviews/${productId}`);
export const createReview = (data) => API.post('/reviews', data);
export const updateReview = (reviewId, data) => API.put(`/reviews/${reviewId}`, data);
export const deleteReview = (reviewId) => API.delete(`/reviews/${reviewId}`);

// ============ ORDERS & PAYMENTS ============
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/myorders');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const cancelOrder = (id) => API.post(`/orders/${id}/cancel`);
export const createRazorpayOrder = (amount) => API.post('/payments/create-order', { amount });
export const verifyPayment = (data) => API.post('/payments/verify', data);

// ============ INFO ENDPOINTS ============
export const getBusinessInfo = () => API.get('/info');
export const updateBusinessInfo = (data) => API.put('/info', data);
export const submitContact = (data) => API.post('/info/contact', data);

// ============ ADMIN ENDPOINTS ============
export const getDashboardStats = () => API.get('/admin/stats');
export const getAllOrders = (params) => API.get('/admin/orders', { params });
export const getAllUsers = (params) => API.get('/admin/users', { params });
export const updateUserRole = (userId, role) => API.put(`/admin/users/${userId}/role`, { role });
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });
export const getAdminServices = () => API.get('/services');
export const validateCoupon = (data) => API.post('/coupons/validate', data);

export default API;
