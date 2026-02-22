import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiPackage, FiShoppingCart, FiUsers, FiX, FiLogOut, FiMenu } from 'react-icons/fi';
import { getAdminUsers } from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mobileMenu, setMobileMenu] = useState(false);
    const { logout } = useAuth();
    const location = useLocation();

    useEffect(() => { getAdminUsers().then(r => setUsers(r.data)).catch(() => { }).finally(() => setLoading(false)); }, []);

    const navItems = [
        { path: '/admin', icon: <FiHome />, label: 'Dashboard' },
        { path: '/admin/products', icon: <FiPackage />, label: 'Products' },
        { path: '/admin/orders', icon: <FiShoppingCart />, label: 'Orders' },
        { path: '/admin/users', icon: <FiUsers />, label: 'Users' },
    ];

    return (
        <div className="admin-layout">
            <aside className={`admin-sidebar ${mobileMenu ? 'open' : ''}`}>
                <div className="admin-logo"><Link to="/" className="logo"><div className="logo-icon" style={{ width: 32, height: 32, fontSize: '0.9rem' }}>💧</div><div className="logo-text" style={{ color: '#fff' }}>Aqua<span>Pure</span></div></Link><button className="mobile-menu-close" onClick={() => setMobileMenu(false)}><FiX /></button></div>
                <nav className="admin-nav">
                    {navItems.map(item => (<Link key={item.path} to={item.path} className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`} onClick={() => setMobileMenu(false)}>{item.icon} {item.label}</Link>))}
                    <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '16px 0' }} />
                    <Link to="/" className="admin-nav-item"><FiHome /> Back to Site</Link>
                    <button className="admin-nav-item" onClick={() => { logout(); window.location.href = '/'; }}><FiLogOut /> Logout</button>
                </nav>
            </aside>
            <div className="admin-main">
                <div className="admin-topbar"><button className="admin-mobile-btn" onClick={() => setMobileMenu(true)}><FiMenu /></button><h2>Users</h2><div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{users.length} total</div></div>
                <div className="admin-content">
                    {loading ? <div className="loading"><div className="spinner"></div></div> : (
                        <div className="admin-card">
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th></tr></thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u._id}>
                                                <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div className="review-avatar" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>{u.name?.[0]}</div><span style={{ fontWeight: 500 }}>{u.name}</span></div></td>
                                                <td>{u.email}</td>
                                                <td>{u.phone || '—'}</td>
                                                <td><span className={`status-badge ${u.role === 'admin' ? 'status-delivered' : 'status-processing'}`}>{u.role}</span></td>
                                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
