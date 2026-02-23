import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiPackage, FiEdit } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getMyOrders, updateProfile } from '../api';
import toast from 'react-hot-toast';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [tab, setTab] = useState('profile');
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

    useEffect(() => {
        getMyOrders().then(r => setOrders(r.data?.data || r.data || [])).catch(() => { });
        axios.get('/api/services/bookings').then(r => setBookings(r.data?.data || r.data || [])).catch(() => { });
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await updateProfile(form);
            updateUser(data.data || data);
            toast.success('Profile updated!');
            setEditing(false);
        } catch (err) {
            toast.error(err.response?.data?.detail || err.response?.data?.message || 'Update failed');
        }
    };

    const statusClass = (s) => `status-badge status-${s.replace(' ', '').toLowerCase()}`;

    return (
        <>
            <div className="page-header"><div className="container"><h1>My Account</h1></div></div>
            <div className="container profile-page">
                <div className="profile-layout">
                    <div className="profile-card">
                        <div className="profile-avatar">{user?.name?.[0]}</div>
                        <h2>{user?.name}</h2>
                        <p>{user?.email}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, marginTop: 16 }}>
                            <button className={`btn btn-sm ${tab === 'profile' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('profile')}>Profile Details</button>
                            <button className={`btn btn-sm ${tab === 'orders' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('orders')}>My Orders ({orders.length})</button>
                            <button className={`btn btn-sm ${tab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('bookings')}>Bookings ({bookings.length})</button>
                        </div>
                    </div>
                    <div className="profile-content">
                        {tab === 'profile' && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                                    <h2 style={{ fontSize: '1.3rem', fontWeight: 600 }}>Profile Information</h2>
                                    <button className="btn btn-secondary btn-sm" onClick={() => setEditing(!editing)}><FiEdit /> {editing ? 'Cancel' : 'Edit'}</button>
                                </div>
                                {editing ? (
                                    <form onSubmit={handleUpdate}>
                                        <div className="form-group"><label>Name</label><input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                                        <div className="form-group"><label>Phone</label><input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                                        <button type="submit" className="btn btn-primary">Save Changes</button>
                                    </form>
                                ) : (
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--gray-200)' }}><FiUser /> <div><div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Full Name</div><div style={{ fontWeight: 500 }}>{user?.name}</div></div></div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--gray-200)' }}><FiMail /> <div><div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Email</div><div style={{ fontWeight: 500 }}>{user?.email}</div></div></div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}><FiPhone /> <div><div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Phone</div><div style={{ fontWeight: 500 }}>{user?.phone || 'Not set'}</div></div></div>
                                    </div>
                                )}
                            </>
                        )}
                        {tab === 'bookings' && (
                            <>
                                <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 20 }}>Service Bookings</h2>
                                {bookings.length === 0 ? (
                                    <div className="empty-state"><div className="empty-state-icon">🛠️</div><h3>No bookings found</h3><p>Need help? Book a service request today</p><Link to="/services" className="btn btn-primary" style={{ marginTop: 16 }}>Book Service</Link></div>
                                ) : bookings.map(b => (
                                    <div key={b._id} className="order-card">
                                        <div className="order-card-header">
                                            <div><strong>Booking #{b._id.slice(-8)}</strong></div>
                                            <span className={statusClass(b.status)}>{b.status}</span>
                                        </div>
                                        <div className="order-card-body">
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{b.service?.name || 'General Maintenance'}</div>
                                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Scheduled: {new Date(b.preferredDate).toLocaleDateString()}</div>
                                                    <div style={{ marginTop: 8, fontSize: '0.9rem' }}>Issue: {b.issue}</div>
                                                </div>
                                                {b.assignedTechnician && <div style={{ textAlign: 'right' }}><div style={{ fontSize: '0.8rem', color: '#64748b' }}>Technician</div><div style={{ fontWeight: 500 }}>{b.assignedTechnician}</div></div>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
