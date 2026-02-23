import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Wishlist from './pages/Wishlist';
import Compare from './pages/Compare';
import Services from './pages/Services';
import Contact from './pages/Contact';

// Admin Sub-pages
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminBookings from './pages/AdminBookings';
import AdminServices from './pages/AdminServices';
import AdminOffers from './pages/AdminOffers';

import { useAuth } from './context/AuthContext';
import './Admin.css';

function App() {
    const { user, loading } = useAuth();
    const isAdmin = user?.role === 'admin';

    if (loading) return null; // Or a global loader

    return (
        <>
            <Toaster position="top-center" toastOptions={{ duration: 3000, style: { borderRadius: '12px', background: '#1a1a2e', color: '#fff', padding: '12px 20px' } }} />
            <Routes>
                {/* Admin Dashboard Routes */}
                <Route path="/admin" element={isAdmin ? <AdminLayout /> : <Navigate to="/login" />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="bookings" element={<AdminBookings />} />
                    <Route path="services" element={<AdminServices />} />
                    <Route path="offers" element={<AdminOffers />} />
                </Route>

                {/* Public Site Routes */}
                <Route path="/" element={<><Header /><main><Home /></main><Footer /></>} />
                <Route path="/about" element={<><Header /><main><About /></main><Footer /></>} />
                <Route path="/products" element={<><Header /><main><Products /></main><Footer /></>} />
                <Route path="/product/:id" element={<><Header /><main><ProductDetail /></main><Footer /></>} />
                <Route path="/login" element={<><Header /><main><Login /></main><Footer /></>} />
                <Route path="/register" element={<><Header /><main><Register /></main><Footer /></>} />
                <Route path="/forgot-password" element={<><Header /><main><ForgotPassword /></main><Footer /></>} />
                <Route path="/profile" element={user ? <><Header /><main><Profile /></main><Footer /></> : <Navigate to="/login" />} />
                <Route path="/cart" element={<><Header /><main><Cart /></main><Footer /></>} />
                <Route path="/checkout" element={user ? <><Header /><main><Checkout /></main><Footer /></> : <Navigate to="/login" />} />
                <Route path="/order-success/:id" element={<><Header /><main><OrderSuccess /></main><Footer /></>} />
                <Route path="/wishlist" element={<><Header /><main><Wishlist /></main><Footer /></>} />
                <Route path="/compare" element={<><Header /><main><Compare /></main><Footer /></>} />
                <Route path="/services" element={<><Header /><main><Services /></main><Footer /></>} />
                <Route path="/contact" element={<><Header /><main><Contact /></main><Footer /></>} />

                {/* Catch-all redirect to Home */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default App;
