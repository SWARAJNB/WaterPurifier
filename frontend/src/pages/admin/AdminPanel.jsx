import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProducts, getServices, getBusinessInfo, updateBusinessInfo, createProduct, updateProduct, deleteProduct } from '../../api';
import toast from 'react-hot-toast';
import { FiPackage, FiSettings, FiInfo, FiPlus, FiEdit, FiTrash2, FiExternalLink } from 'react-icons/fi';

export default function AdminPanel() {
    const { user } = useAuth();
    const [tab, setTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [info, setInfo] = useState({ vision: '', mission: '', description: '', phone: '', email: '', whatsapp: '', google_maps_url: '', address: '' });
    const [loading, setLoading] = useState(false);

    // Forms
    const [productForm, setProductForm] = useState(null); // null means list, {} means add/edit

    useEffect(() => {
        if (tab === 'products') getProducts().then(res => setProducts(res.data.products));
        if (tab === 'services') getServices().then(res => setServices(res.data));
        if (tab === 'info') getBusinessInfo().then(res => setInfo(res.data));
    }, [tab]);

    const handleInfoUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateBusinessInfo(info);
            toast.success('Business info updated!');
        } catch (err) { toast.error('Update failed'); }
        finally { setLoading(false); }
    };

    if (user?.role !== 'admin') return <div className="container"><h1>Access Denied</h1></div>;

    return (
        <div className="container admin-panel">
            <div className="admin-header">
                <h1>Client Management Portal</h1>
                <div className="admin-tabs">
                    <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}><FiPackage /> Products</button>
                    <button className={tab === 'services' ? 'active' : ''} onClick={() => setTab('services')}><FiSettings /> Services</button>
                    <button className={tab === 'info' ? 'active' : ''} onClick={() => setTab('info')}><FiInfo /> Company Info</button>
                </div>
            </div>

            <div className="admin-content">
                {tab === 'info' && (
                    <div className="card admin-card">
                        <h3>Update Company Details</h3>
                        <form onSubmit={handleInfoUpdate}>
                            <div className="form-group"><label>Our Vision</label><textarea className="form-control" value={info.vision} onChange={e => setInfo({ ...info, vision: e.target.value })} rows={3} /></div>
                            <div className="form-group"><label>Our Mission</label><textarea className="form-control" value={info.mission} onChange={e => setInfo({ ...info, mission: e.target.value })} rows={3} /></div>
                            <div className="form-group"><label>Business Description</label><textarea className="form-control" value={info.description} onChange={e => setInfo({ ...info, description: e.target.value })} rows={4} /></div>
                            <div className="form-row">
                                <div className="form-group"><label>WhatsApp Number (without +)</label><input className="form-control" value={info.whatsapp} onChange={e => setInfo({ ...info, whatsapp: e.target.value })} /></div>
                                <div className="form-group"><label>Contact Phone</label><input className="form-control" value={info.phone} onChange={e => setInfo({ ...info, phone: e.target.value })} /></div>
                            </div>
                            <div className="form-group"><label>Google Maps Embed URL</label><input className="form-control" value={info.google_maps_url} onChange={e => setInfo({ ...info, google_maps_url: e.target.value })} /></div>
                            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                        </form>
                    </div>
                )}

                {tab === 'products' && (
                    <div className="card admin-product-list">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3>Product Inventory</h3>
                            <button className="btn btn-primary btn-sm"><FiPlus /> Add Product</button>
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p._id}>
                                        <td><img src={p.images?.[0]} alt="" style={{ width: 40, height: 40, objectFit: 'cover' }} /></td>
                                        <td>{p.name}</td>
                                        <td>₹{p.price.toLocaleString()}</td>
                                        <td>{p.stock}</td>
                                        <td>
                                            <button className="btn-icon"><FiEdit /></button>
                                            <button className="btn-icon delete"><FiTrash2 /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === 'services' && (
                    <div className="card admin-service-list">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3>Manage Services</h3>
                            <button className="btn btn-primary btn-sm"><FiPlus /> Add Service</button>
                        </div>
                        <div className="admin-grid">
                            {services.map(s => (
                                <div key={s._id} className="admin-item-card">
                                    <h4>{s.name}</h4>
                                    <p>{s.description.substring(0, 100)}...</p>
                                    <div className="actions">
                                        <button className="btn-icon"><FiEdit /></button>
                                        <button className="btn-icon delete"><FiTrash2 /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
