import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiCheck, FiX, FiStar } from 'react-icons/fi';

export default function Compare() {
    const [items] = useState(() => {
        try { return JSON.parse(localStorage.getItem('compareItems') || '[]'); } catch { return []; }
    });

    const removeItem = (id) => {
        const updated = items.filter(i => i._id !== id);
        localStorage.setItem('compareItems', JSON.stringify(updated));
        window.location.reload();
    };

    if (items.length === 0) {
        return (
            <>
                <div className="page-header"><div className="container"><h1>Compare Products</h1></div></div>
                <div className="container" style={{ padding: '60px 20px' }}>
                    <div className="empty-state"><div className="empty-state-icon">⚖️</div><h3>No products to compare</h3><p>Add products to compare from the product detail page</p><Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Products</Link></div>
                </div>
            </>
        );
    }

    const specs = ['purifierType', 'capacity', 'warranty'];
    const specLabels = { purifierType: 'Purifier Type', capacity: 'Capacity', warranty: 'Warranty' };

    return (
        <>
            <div className="page-header"><div className="container"><h1>Compare Products</h1><p>Comparing {items.length} product{items.length > 1 ? 's' : ''}</p></div></div>
            <div className="container" style={{ padding: '40px 20px', overflowX: 'auto' }}>
                <table className="compare-table">
                    <thead>
                        <tr>
                            <th></th>
                            {items.map(item => (
                                <th key={item._id}>
                                    <button className="compare-remove" onClick={() => removeItem(item._id)}><FiTrash2 /></button>
                                    <div style={{ fontSize: '3rem', margin: '0 auto 12px' }}>💧</div>
                                    <Link to={`/product/${item._id}`} style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: '0.95rem' }}>{item.name}</Link>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Brand</td>{items.map(i => <td key={i._id}>{i.brand}</td>)}</tr>
                        <tr><td>Price</td>{items.map(i => <td key={i._id} style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{(i.discountPrice || i.price)?.toLocaleString()}</td>)}</tr>
                        <tr><td>Rating</td>{items.map(i => <td key={i._id}><div className="stars" style={{ justifyContent: 'center' }}>{Array.from({ length: 5 }, (_, idx) => <FiStar key={idx} style={{ fill: idx < Math.round(i.rating || 0) ? '#f59e0b' : 'none', color: '#f59e0b' }} />)}</div></td>)}</tr>
                        {specs.map(spec => (
                            <tr key={spec}><td>{specLabels[spec]}</td>{items.map(i => <td key={i._id}>{i.specifications?.[spec] || i[spec] || '—'}</td>)}</tr>
                        ))}
                        <tr><td>In Stock</td>{items.map(i => <td key={i._id}>{i.stock > 0 ? <span style={{ color: 'var(--success)' }}><FiCheck /> Yes</span> : <span style={{ color: 'var(--error)' }}><FiX /> No</span>}</td>)}</tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}
