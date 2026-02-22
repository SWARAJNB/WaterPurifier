import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiTag, FiUploadCloud } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminOffers() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', code: '', discount: '', expiryDate: '', isActive: true });
    const [image, setImage] = useState(null);

    useEffect(() => { loadOffers(); }, []);

    const loadOffers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/offers');
            setOffers(res.data.data || res.data);
        } catch {
            toast.error('Failed to load offers');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) data.append('image', image);

        try {
            await axios.post('/api/offers', data);
            toast.success('Offer/Banner created');
            setModal(false);
            loadOffers();
        } catch {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/offers/${id}`);
            toast.success('Offer deleted');
            loadOffers();
        } catch {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="admin-offers-page">
            <div className="page-header-admin">
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Marketing & Offers</h1>
                <button className="btn btn-primary" onClick={() => setModal(true)}>
                    <FiPlus /> Add Banner/Coupon
                </button>
            </div>

            <div className="admin-card" style={{ marginTop: 24 }}>
                {loading ? <div className="spinner"></div> : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                        {offers.map(offer => (
                            <div key={offer._id} className="offer-card" style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                                {offer.image && <img src={offer.image} alt="" style={{ width: '100%', height: 140, objectFit: 'cover' }} />}
                                <div style={{ padding: 16 }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{offer.title}</h3>
                                    {offer.code && <div style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: 4, display: 'inline-block', marginTop: 8, fontWeight: 700, letterSpacing: 1 }}>{offer.code}</div>}
                                    <div style={{ marginTop: 12, color: '#64748b', fontSize: '0.85rem' }}>Expires: {new Date(offer.expiryDate).toLocaleDateString()}</div>
                                    <button
                                        className="btn btn-sm"
                                        style={{ marginTop: 12, width: '100%', background: '#fee2e2', color: '#dc2626' }}
                                        onClick={() => handleDelete(offer._id)}
                                    >
                                        <FiTrash2 /> Delete Offer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h3>Add New Offer</h3></div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Offer Title</label>
                                <input type="text" className="form-control" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Coupon Code (Optional)</label>
                                    <input type="text" className="form-control" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} />
                                </div>
                                <div className="form-group">
                                    <label>Expiry Date</label>
                                    <input type="date" className="form-control" required value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Banner Image</label>
                                <input type="file" className="form-control" onChange={e => setImage(e.target.files[0])} />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>Create Offer</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
