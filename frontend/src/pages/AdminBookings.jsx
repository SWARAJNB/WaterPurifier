import { useState, useEffect } from 'react';
import { FiPlus, FiTool, FiCalendar, FiUser, FiInfo } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadBookings(); }, []);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/services/bookings');
            setBookings(res.data.data || res.data);
        } catch {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`/api/services/bookings/${id}`, { status });
            toast.success('Booking status updated');
            loadBookings();
        } catch {
            toast.error('Update failed');
        }
    };

    return (
        <div className="admin-bookings-page">
            <div className="page-header-admin">
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Service Bookings</h1>
            </div>

            <div className="admin-card" style={{ marginTop: 24 }}>
                {loading ? <div className="spinner"></div> : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Customer</th>
                                <th>Service Type</th>
                                <th>Preferred Date</th>
                                <th>Status</th>
                                <th>Technician</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length > 0 ? bookings.map(booking => (
                                <tr key={booking._id}>
                                    <td><span style={{ fontWeight: 600, color: '#0284c7' }}>#{booking._id.slice(-6).toUpperCase()}</span></td>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{booking.user?.name || 'Customer'}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{booking.user?.phone}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{booking.issue || 'General Maintenance'}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{booking.service?.name}</div>
                                    </td>
                                    <td>{new Date(booking.preferredDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>{booking.assignedTechnician || 'Unassigned'}</td>
                                    <td>
                                        <select
                                            className="form-control form-control-sm"
                                            value={booking.status}
                                            onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Assigned">Assigned</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No bookings found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
