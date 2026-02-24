import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Header() {
    const { user, logout, isAdmin } = useAuth();
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const [search, setSearch] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) { navigate(`/products?search=${encodeURIComponent(search.trim())}`); setSearch(''); }
    };

    return (
        <header className="header">
            <div className="header-inner">
                <Link to="/" className="logo">
                    <div className="logo-icon">💧</div>
                    <div className="logo-text">Aqua<span>Pure</span></div>
                </Link>

                <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
                    <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
                    <NavLink to="/products" onClick={() => setMenuOpen(false)}>Products</NavLink>
                    <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
                    <NavLink to="/services" onClick={() => setMenuOpen(false)}>Services</NavLink>
                    <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
                    {isAdmin && <NavLink to="/admin-panel" onClick={() => setMenuOpen(false)}>Admin</NavLink>}
                </nav>

                <form className="header-search" onSubmit={handleSearch}>
                    <input type="text" placeholder="Search water purifiers..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    <button type="submit"><FiSearch /></button>
                </form>

                <div className="header-actions">
                    <Link to="/wishlist" className="header-icon">
                        <FiHeart />
                        {wishlistCount > 0 && <span className="header-badge">{wishlistCount}</span>}
                    </Link>
                    <Link to="/cart" className="header-icon">
                        <FiShoppingCart />
                        {cartCount > 0 && <span className="header-badge">{cartCount}</span>}
                    </Link>

                    {user ? (
                        <div className="user-menu">
                            <button className="user-menu-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                                <FiUser /> {user?.name?.split(' ')[0] || 'User'}
                            </button>
                            {userMenuOpen && (
                                <div className="user-dropdown" onClick={() => setUserMenuOpen(false)}>
                                    <Link to="/profile"><FiUser /> My Profile</Link>
                                    <Link to="/profile"><FiPackage /> My Orders</Link>
                                    {isAdmin && <Link to="/admin-panel"><FiSettings /> Admin Panel</Link>}
                                    <button onClick={() => { logout(); navigate('/'); }}><FiLogOut /> Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
                    )}

                    <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>
        </header>
    );
}
