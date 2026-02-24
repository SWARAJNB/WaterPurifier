import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiPackage, FiShoppingCart, FiUsers, FiTrendingUp, FiDollarSign, FiAlertTriangle, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { getDashboardStats } from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mobileMenu, setMobileMenu] = useState(false);
    const { logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        getDashboardStats().then(r => setStats(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const navItems = [
        { path: '/admin', icon: <FiHome />, label: 'Dashboard' },
        { path: '/admin/products', icon: <FiPackage />, label: 'Products' },
        { path: '/admin/orders', icon: <FiShoppingCart />, label: 'Orders' },
        { path: '/admin/users', icon: <FiUsers />, label: 'Users' },
    ];

    return (
        <div className="admin-dashboard-content">
            <div className="admin-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Dashboard Overview</h1>
                <div style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Welcome back, Admin</div>
            </div>

            {loading ? (
                <div className="loading"><div className="spinner"></div></div>
            ) : stats ? (
                <>
                    <div className="admin-stats-grid">
                        <div className="admin-stat-card"><div className="admin-stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}><FiDollarSign /></div><div><div className="admin-stat-value">₹{(stats.totalRevenue || 0).toLocaleString()}</div><div className="admin-stat-label">Total Revenue</div></div></div>
                        <div className="admin-stat-card"><div className="admin-stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}><FiShoppingCart /></div><div><div className="admin-stat-value">{stats.totalOrders || 0}</div><div className="admin-stat-label">Total Orders</div></div></div>
                        <div className="admin-stat-card"><div className="admin-stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}><FiUsers /></div><div><div className="admin-stat-value">{stats.totalUsers || 0}</div><div className="admin-stat-label">Total Users</div></div></div>
                        <div className="admin-stat-card"><div className="admin-stat-icon" style={{ background: '#fce7f3', color: '#db2777' }}><FiTrendingUp /></div><div><div className="admin-stat-value">{stats.totalProducts || 0}</div><div className="admin-stat-label">Total Products</div></div></div>
                    </div>

                    <div className="admin-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, margin: '24px 0' }}>
                        <div className="admin-card">
                            <h3>Orders by Status</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                                {(stats.ordersByStatus || []).map(s => (
                                    <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ width: 90, fontSize: '0.85rem', textTransform: 'capitalize' }}>{s._id}</span>
                                        <div style={{ flex: 1, background: 'var(--gray-100)', borderRadius: 8, height: 24 }}>
                                            <div style={{ width: `${Math.min((s.count / (stats.totalOrders || 1)) * 100, 100)}%`, height: '100%', background: 'var(--primary)', borderRadius: 8, minWidth: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}>{s.count}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="admin-card">
                            <h3>Low Stock Alert</h3>
                            {(stats.lowStockProducts || []).length > 0 ? (
                                <div style={{ marginTop: 16 }}>
                                    {stats.lowStockProducts.map(p => (
                                        <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-100)', fontSize: '0.9rem' }}>
                                            <span>{p.name}</span>
                                            <span style={{ color: p.stock <= 5 ? 'var(--error)' : 'var(--warning)', fontWeight: 600 }}>{p.stock} left</span>
                                        </div>
                                    ))}
                                </div>
                            ) : <p style={{ color: 'var(--gray-500)', marginTop: 16 }}>All products are well stocked!</p>}
                        </div>
                    </div>

                    <div className="admin-card">
                        <h3>Recent Orders</h3>
                        <div className="admin-table-wrap" style={{ marginTop: 16, overflowX: 'auto' }}>
                            <table className="admin-table">
                                <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                                <tbody>
                                    {(stats.recentOrders || []).map(o => (
                                        <tr key={o._id}>
                                            <td>#{o._id.slice(-8)}</td>
                                            <td>{o.user?.name || 'N/A'}</td>
                                            <td>₹{(o.totalPrice || 0).toLocaleString()}</td>
                                            <td><span className={`status-badge status-${(o.status || 'Pending').toLowerCase()}`}>{o.status}</span></td>
                                            <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="empty-state"><div className="empty-state-icon">📊</div><h3>Dashboard data unavailable</h3></div>
            )}
        </div>
    );
}
