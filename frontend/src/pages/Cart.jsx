import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiTag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { validateCoupon } from '../api';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity, subtotal, discount, shipping, tax, total, coupon, setCoupon } = useCart();
    const [couponCode, setCouponCode] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        try {
            const { data } = await validateCoupon({ code: couponCode, cartTotal: subtotal });
            setCoupon({ code: data.code, discount: data.discount, maxDiscount: data.discountAmount });
            toast.success(data.message);
        } catch (err) { toast.error(err.response?.data?.message || 'Invalid coupon'); }
        finally { setCouponLoading(false); }
    };

    if (cartItems.length === 0) {
        return (
            <>
                <div className="page-header"><div className="container"><h1>Shopping Cart</h1></div></div>
                <div className="container" style={{ padding: '60px 20px' }}>
                    <div className="empty-state"><div className="empty-state-icon">🛒</div><h3>Your cart is empty</h3><p>Add some water purifiers to get started</p><Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Products</Link></div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="page-header"><div className="container"><h1>Shopping Cart</h1><div className="breadcrumb"><Link to="/">Home</Link> / <span>Cart ({cartItems.length} items)</span></div></div></div>
            <div className="container cart-page">
                <div className="cart-layout">
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item._id} className="cart-item">
                                <Link to={`/product/${item._id}`} className="cart-item-image">{item.image ? <img src={item.image} alt={item.name} /> : <span style={{ fontSize: '2rem' }}>💧</span>}</Link>
                                <div className="cart-item-info">
                                    <Link to={`/product/${item._id}`} className="cart-item-name">{item.name}</Link>
                                    <div className="cart-item-brand">{item.brand}</div>
                                    <div className="cart-item-price">₹{item.price.toLocaleString()}{item.originalPrice > item.price && <span style={{ fontSize: '0.85rem', color: 'var(--gray-400)', textDecoration: 'line-through', marginLeft: 8 }}>₹{item.originalPrice.toLocaleString()}</span>}</div>
                                    <div className="cart-item-actions">
                                        <div className="quantity-selector">
                                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)}><FiMinus /></button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)}><FiPlus /></button>
                                        </div>
                                        <button className="cart-item-remove" onClick={() => { removeFromCart(item._id); toast.success('Removed from cart'); }}><FiTrash2 /> Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h3><FiShoppingBag style={{ marginRight: 8 }} />Order Summary</h3>
                        <div className="coupon-input">
                            <input className="form-control" placeholder="Coupon code" value={couponCode} onChange={e => setCouponCode(e.target.value)} />
                            <button className="btn btn-secondary btn-sm" onClick={applyCoupon} disabled={couponLoading}><FiTag /></button>
                        </div>
                        {coupon && <div style={{ fontSize: '0.85rem', color: 'var(--success)', marginBottom: 12 }}>✓ {coupon.code} applied — {coupon.discount}% off</div>}
                        <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                        {discount > 0 && <div className="summary-row" style={{ color: 'var(--success)' }}><span>Discount</span><span>−₹{Math.round(discount).toLocaleString()}</span></div>}
                        <div className="summary-row"><span>GST (18%)</span><span>₹{tax.toLocaleString()}</span></div>
                        <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : `₹${shipping}`}</span></div>
                        <div className="summary-row total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
                        {shipping > 0 && <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: 8 }}>Free shipping on orders above ₹5,000</div>}
                        <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 20 }}>Proceed to Checkout</Link>
                        <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: '0.9rem', color: 'var(--primary)' }}>Continue Shopping</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
