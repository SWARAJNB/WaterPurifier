import { useState, useEffect } from 'react';
import { FiEye, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';
import { getAdminOrders, updateOrderStatus } from '../../api';
import toast from 'react-hot-toast';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const res = await getAdminOrders();
            setOrders(res.data.data.orders || res.data.orders || res.data);
        } catch {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateOrderStatus(id, status);
            toast.success(`Order status updated to ${status}`);
            loadOrders();
        } catch {
            toast.error('Failed to update status');
        }
    };

    const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

    return (
        <div className="admin-orders-page">
            <div className="page-header-admin">
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Order Management</h1>
                <div className="filter-tabs">
                    {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(f => (
                        <button
                            key={f}
                            className={`tab-btn ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="admin-card" style={{ marginTop: 24 }}>
                {loading ? <div className="spinner"></div> : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? filteredOrders.map(order => (
                                <tr key={order._id}>
                                    <td><span style={{ fontWeight: 600, color: '#0284c7' }}>#{order._id.slice(-6).toUpperCase()}</span></td>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{order.shippingAddress?.name || order.user?.name || 'Customer'}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{order.user?.email}</div>
                                    </td>
                                    <td>{order.orderItems?.length} items</td>
                                    <td>₹{order.totalPrice.toLocaleString()}</td>
                                    <td>
                                        <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <select
                                                className="form-control form-control-sm"
                                                style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                        No orders found in this category.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <style jsx>{`
                .filter-tabs {
                    display: flex;
                    gap: 12px;
                    margin-top: 12px;
                }
                .tab-btn {
                    padding: 6px 16px;
                    border-radius: 20px;
                    border: 1px solid #e2e8f0;
                    background: white;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .tab-btn.active {
                    background: #1e293b;
                    color: white;
                    border-color: #1e293b;
                }
            `}</style>
        </div>
    );
}
