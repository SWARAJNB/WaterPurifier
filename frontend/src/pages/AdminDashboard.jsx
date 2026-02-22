import { FiTrendingUp, FiShoppingBag, FiUsers, FiCreditCard } from 'react-icons/fi';

export default function AdminDashboard() {
    const stats = [
        { label: 'Total Revenue', value: '₹12,45,000', icon: <FiTrendingUp />, color: '#dcfce7', iconColor: '#166534' },
        { label: 'Total Orders', value: '452', icon: <FiShoppingBag />, color: '#e0f2fe', iconColor: '#0369a1' },
        { label: 'Active Services', value: '185', icon: <FiUsers />, color: '#fef9c3', iconColor: '#854d0e' },
        { label: 'Growth', value: '+12.5%', icon: <FiCreditCard />, color: '#f3e8ff', iconColor: '#7e22ce' },
    ];

    return (
        <div className="admin-dashboard">
            <h1 style={{ marginBottom: 24, fontSize: '1.5rem', fontWeight: 600 }}>Dashboard Overview</h1>

            <div className="stat-grid">
                {stats.map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: stat.color, color: stat.iconColor }}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <h3>{stat.label}</h3>
                            <p>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                <div className="admin-card">
                    <h2 style={{ fontSize: '1.1rem', marginBottom: 20 }}>Recent Orders</h2>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>#ORD-7721</td>
                                <td>Rahul Sharma</td>
                                <td><span className="status-badge status-completed">Delivered</span></td>
                                <td>₹54,999</td>
                            </tr>
                            <tr>
                                <td>#ORD-7720</td>
                                <td>Priya Patel</td>
                                <td><span className="status-badge status-pending">Processing</span></td>
                                <td>₹12,500</td>
                            </tr>
                            <tr>
                                <td>#ORD-7719</td>
                                <td>Amit Khan</td>
                                <td><span className="status-badge status-cancelled">Cancelled</span></td>
                                <td>₹8,900</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="admin-card">
                    <h2 style={{ fontSize: '1.1rem', marginBottom: 20 }}>Service Activity</h2>
                    <div className="activity-list">
                        <div style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>New Service Booking</p>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>2 mins ago • Regular RO Service</span>
                        </div>
                        <div style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>Installation Completed</p>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>45 mins ago • AquaPure Pro X</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
