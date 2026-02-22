import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <div className="logo" style={{ marginBottom: 16 }}>
                            <div className="logo-icon">💧</div>
                            <div className="logo-text" style={{ color: '#fff' }}>Aqua<span style={{ color: '#90E0EF' }}>Pure</span></div>
                        </div>
                        <p>India's leading destination for premium water purifiers. We offer the best brands with expert installation, maintenance, and AMC plans.</p>
                        <div className="footer-social">
                            <a href="#"><FiFacebook /></a>
                            <a href="#"><FiTwitter /></a>
                            <a href="#"><FiInstagram /></a>
                            <a href="#"><FiYoutube /></a>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h3>Quick Links</h3>
                        <Link to="/">Home</Link>
                        <Link to="/products">Products</Link>
                        <Link to="/about">About Us</Link>
                        <Link to="/services">Services</Link>
                        <Link to="/contact">Contact</Link>
                    </div>
                    <div className="footer-col">
                        <h3>Customer Service</h3>
                        <Link to="/profile">My Account</Link>
                        <Link to="/cart">Shopping Cart</Link>
                        <Link to="/wishlist">Wishlist</Link>
                        <Link to="/compare">Compare</Link>
                        <a href="#">Return Policy</a>
                        <a href="#">Privacy Policy</a>
                    </div>
                    <div className="footer-col">
                        <h3>Contact Info</h3>
                        <p style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <FiPhone /> <a href="tel:+919999999999">+91 99999 99999</a>
                        </p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <FiMail /> <a href="mailto:info@aquapure.com">info@aquapure.com</a>
                        </p>
                        <p style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <FiMapPin style={{ flexShrink: 0, marginTop: 3 }} /> 123, Water Street, Clean City, India - 400001
                        </p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} AquaPure. All rights reserved. Made with 💙 for clean water.</p>
                </div>
            </div>
        </footer>
    );
}
