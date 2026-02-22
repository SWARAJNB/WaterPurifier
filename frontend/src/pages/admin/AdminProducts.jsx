import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiX, FiCheck, FiUploadCloud } from 'react-icons/fi';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // 'add' | product object for edit
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '', brand: '', price: '', discountPrice: '',
        description: '', purifierType: 'RO+UV+UF', stock: '',
        category: 'Water Purifier', capacity: '', features: ''
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    useEffect(() => { loadProducts(); }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const res = await getProducts({ limit: 100 });
            setProducts(res.data.products);
        } catch {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);

        // Generate previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const resetForm = () => {
        setFormData({
            name: '', brand: '', price: '', discountPrice: '',
            description: '', purifierType: 'RO+UV+UF', stock: '',
            category: 'Water Purifier', capacity: '', features: ''
        });
        setSelectedImages([]);
        setPreviews([]);
    };

    const openEdit = (p) => {
        setFormData({
            name: p.name, brand: p.brand, price: p.price,
            discountPrice: p.discountPrice || '', description: p.description,
            purifierType: p.purifierType, stock: p.stock,
            category: p.category, capacity: p.capacity,
            features: p.features?.join(', ') || ''
        });
        setPreviews(p.images || []);
        setModal(p);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'features') {
                data.append(key, JSON.stringify(formData[key].split(',').map(s => s.trim())));
            } else {
                data.append(key, formData[key]);
            }
        });

        selectedImages.forEach(img => data.append('images', img));

        try {
            if (modal === 'add') {
                await createProduct(data);
                toast.success('Product created!');
            } else {
                await updateProduct(modal._id, data);
                toast.success('Product updated!');
            }
            setModal(null);
            loadProducts();
            resetForm();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await deleteProduct(id);
            toast.success('Product deleted');
            loadProducts();
        } catch {
            toast.error('Failed to delete product');
        }
    };

    return (
        <div className="admin-products-page">
            <div className="page-header-admin">
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Products Management</h1>
                <button className="btn btn-primary" onClick={() => { resetForm(); setModal('add'); }}>
                    <FiPlus /> Add New Product
                </button>
            </div>

            <div className="admin-card" style={{ marginTop: 24 }}>
                {loading ? <div className="spinner"></div> : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product Details</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p._id}>
                                    <td>
                                        <img src={p.images?.[0] || 'https://via.placeholder.com/50'} alt="" style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} />
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.brand} • {p.purifierType}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>₹{p.discountPrice || p.price}</div>
                                        {p.discountPrice > 0 && <div style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: '#94a3b8' }}>₹{p.price}</div>}
                                    </td>
                                    <td>
                                        <span style={{ color: p.stock < 10 ? '#ef4444' : 'inherit', fontWeight: 600 }}>{p.stock}</span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${p.isActive ? 'status-completed' : 'status-cancelled'}`}>
                                            {p.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="btn btn-sm btn-secondary" onClick={() => openEdit(p)}><FiEdit /></button>
                                            <button className="btn btn-sm" style={{ background: '#fee2e2', color: '#dc2626' }} onClick={() => handleDelete(p._id)}><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
                        <div className="modal-header">
                            <h3>{modal === 'add' ? 'Add New Product' : 'Edit Product'}</h3>
                            <button onClick={() => setModal(null)}><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Brand</label>
                                    <input type="text" className="form-control" required value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Base Price (₹)</label>
                                    <input type="number" className="form-control" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Offer Price (₹)</label>
                                    <input type="number" className="form-control" value={formData.discountPrice} onChange={e => setFormData({ ...formData, discountPrice: e.target.value })} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Current Stock</label>
                                    <input type="number" className="form-control" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Purifier Type</label>
                                    <select className="form-control" value={formData.purifierType} onChange={e => setFormData({ ...formData, purifierType: e.target.value })}>
                                        <option value="RO">RO</option>
                                        <option value="UV">UV</option>
                                        <option value="UF">UF</option>
                                        <option value="RO+UV">RO+UV</option>
                                        <option value="RO+UV+UF">RO+UV+UF</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea className="form-control" rows="3" required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>

                            <div className="form-group">
                                <label>Upload Product Images (Max 5)</label>
                                <div className="image-upload-wrapper">
                                    <input type="file" multiple accept="image/*" onChange={handleFileChange} id="prod-images" hidden />
                                    <label htmlFor="prod-images" className="upload-box-dashed">
                                        <FiUploadCloud size={24} />
                                        <span>Click to browse images</span>
                                    </label>
                                </div>
                                {previews.length > 0 && (
                                    <div className="image-previews-grid" style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                                        {previews.map((url, i) => (
                                            <div key={i} className="preview-item" style={{ position: 'relative' }}>
                                                <img src={url} alt="" style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Key Features (comma separated)</label>
                                <input type="text" className="form-control" placeholder="e.g. 10L Tank, RO Technology, Energy Saving" value={formData.features} onChange={e => setFormData({ ...formData, features: e.target.value })} />
                            </div>

                            <div className="form-footer" style={{ marginTop: 24 }}>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={saving}>
                                    {saving ? 'Processing...' : (modal === 'add' ? 'Create Product' : 'Save Changes')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
