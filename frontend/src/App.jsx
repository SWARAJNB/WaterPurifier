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
                <Route path="*" element={
                    <>
                        <Header />
                        <main>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/product/:id" element={<ProductDetail />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/profile" element={user ? <Profile /> : <Login />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/checkout" element={user ? <Checkout /> : <Login />} />
                                <Route path="/order-success/:id" element={<OrderSuccess />} />
                                <Route path="/wishlist" element={<Wishlist />} />
                                <Route path="/compare" element={<Compare />} />
                                <Route path="/services" element={<Services />} />
                                <Route path="/contact" element={<Contact />} />
                            </Routes>
                        </main>
                        <Footer />
                    </>
                } />
            </Routes>
        </>
    );
}

export default App;
