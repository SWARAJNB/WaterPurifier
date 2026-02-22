import { NavLink } from 'react-router-dom';
import { FiHome, FiBox, FiClipboard, FiSettings, FiPercent, FiTool, FiUsers, FiLogOut } from 'react-icons/fi';

export default function AdminSidebar() {
    const menuItems = [
        { icon: <FiHome />, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: <FiBox />, label: 'Products', path: '/admin/products' },
        { icon: <FiClipboard />, label: 'Orders', path: '/admin/orders' },
        { icon: <FiTool />, label: 'Services', path: '/admin/services' },
        { icon: <FiUsers />, label: 'Bookings', path: '/admin/bookings' },
        { icon: <FiPercent />, label: 'Special Offers', path: '/admin/offers' },
        { icon: <FiSettings />, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-logo">
                <span className="logo-text">AquaPure <span>Admin</span></span>
            </div>
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="sidebar-footer">
                <button className="nav-item logout-btn">
                    <span className="nav-icon"><FiLogOut /></span>
                    <span className="nav-label">Logout</span>
                </button>
            </div>
        </aside>
    );
}
