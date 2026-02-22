import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiActivity } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', type: 'Maintenance' });

    useEffect(() => { loadServices(); }, []);

    const loadServices = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/services');
            setServices(res.data.data || res.data);
        } catch {
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modal === 'add') {
                await axios.post('/api/services', formData);
                toast.success('Service created');
            } else {
                await axios.put(`/api/services/${modal._id}`, formData);
                toast.success('Service updated');
            }
            setModal(null);
            loadServices();
        } catch {
            toast.error('Operation failed');
        }
    };

    return (
        <div className="admin-services-page">
            <div className="page-header-admin">
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Manage Service Types</h1>
                <button className="btn btn-primary" onClick={() => { setFormData({ name: '', description: '', price: '', type: 'Maintenance' }); setModal('add'); }}>
                    <FiPlus /> Add Service Plan
                </button>
            </div>

            <div className="admin-card" style={{ marginTop: 24, padding: 0 }}>
                {loading ? <div className="spinner"></div> : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Service Name</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Base Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.length > 0 ? services.map(s => (
                                <tr key={s._id}>
                                    <td><div style={{ fontWeight: 600 }}>{s.name}</div></td>
                                    <td><span className="status-badge status-pending">{s.type}</span></td>
                                    <td style={{ maxWidth: 300, fontSize: '0.85rem' }}>{s.description}</td>
                                    <td>₹{s.price}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="btn btn-sm btn-secondary" onClick={() => { setFormData(s); setModal(s); }}><FiEdit /></button>
                                            <button className="btn btn-sm" style={{ background: '#fee2e2', color: '#dc2626' }}><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40 }}>No service plans configured.</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h3>{modal === 'add' ? 'Add Service Plan' : 'Edit Service Plan'}</h3></div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Plan Name</label>
                                <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Service Category</label>
                                <select className="form-control" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                    <option value="Installation">Installation</option>
                                    <option value="Maintenance">Maintenance/AMC</option>
                                    <option value="Repair">Repair</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Base Price (₹)</label>
                                <input type="number" className="form-control" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Short Description</label>
                                <textarea className="form-control" rows="2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>Save Plan</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
