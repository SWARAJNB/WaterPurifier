import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder, createRazorpayOrder, verifyPayment } from '../api';
import toast from 'react-hot-toast';

const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function Checkout() {
    const { cartItems, subtotal, discount, shipping, tax, total, coupon, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [payment, setPayment] = useState('COD');
    const [address, setAddress] = useState({ fullName: '', phone: '', street: '', city: '', state: '', zipCode: '' });

    const handleOrder = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return toast.error('Cart is empty');
        setLoading(true);

        try {
            if (payment === 'Online') {
                const res = await loadRazorpay();
                if (!res) return toast.error('Razorpay SDK failed to load');

                const { data: razorOrder } = await createRazorpayOrder(total);

                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
                    amount: razorOrder.amount,
                    currency: razorOrder.currency,
                    name: 'AquaPure',
                    description: 'Water Purifier Purchase',
                    order_id: razorOrder.id,
                    handler: async (response) => {
                        try {
                            await verifyPayment({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });

                            // Create actual order in DB after payment verification
                            const { data } = await createOrder({
                                orderItems: cartItems.map(i => ({ product: i._id, quantity: i.quantity })),
                                shippingAddress: address,
                                paymentMethod: 'Online',
                                paymentInfo: response,
                                isPaid: true,
                                totalPrice: total
                            });

                            clearCart();
                            toast.success('Payment successful & Order placed!');
                            navigate(`/order-success/${data._id}`);
                        } catch (err) { toast.error('Payment verification failed'); }
                    },
                    prefill: { name: address.fullName, contact: address.phone },
                    theme: { color: '#0066cc' }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
            } else {
                // COD Flow
                const { data } = await createOrder({
                    orderItems: cartItems.map(i => ({ product: i._id, quantity: i.quantity })),
                    shippingAddress: address,
                    paymentMethod: 'COD',
                    totalPrice: total
                });
                clearCart();
                toast.success('Order placed successfully!');
                navigate(`/order-success/${data._id}`);
            }
        } catch (err) {
            toast.error(err.response?.data?.detail || err.response?.data?.message || 'Order failed');
        } finally { setLoading(false); }
    };

    return (
        <>
            <div className="page-header"><div className="container"><h1>Checkout</h1></div></div>
            <div className="container checkout-page">
                <form className="checkout-layout" onSubmit={handleOrder}>
                    <div>
                        <div className="checkout-section">
                            <h3>Shipping Address</h3>
                            <div className="form-row">
                                <div className="form-group"><label>Full Name</label><input className="form-control" required value={address.fullName} onChange={e => setAddress({ ...address, fullName: e.target.value })} /></div>
                                <div className="form-group"><label>Phone</label><input className="form-control" type="tel" required value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} /></div>
                            </div>
                            <div className="form-group"><label>Street Address</label><input className="form-control" required value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} /></div>
                            <div className="form-row">
                                <div className="form-group"><label>City</label><input className="form-control" required value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} /></div>
                                <div className="form-group"><label>State</label><input className="form-control" required value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} /></div>
                            </div>
                            <div className="form-group" style={{ maxWidth: 200 }}><label>ZIP Code</label><input className="form-control" required value={address.zipCode} onChange={e => setAddress({ ...address, zipCode: e.target.value })} /></div>
                        </div>
                        <div className="checkout-section">
                            <h3>Payment Method</h3>
                            <div className="payment-options">
                                <label className={`payment-option ${payment === 'COD' ? 'selected' : ''}`}><input type="radio" name="payment" value="COD" checked={payment === 'COD'} onChange={() => setPayment('COD')} /><div><div style={{ fontWeight: 600 }}>Cash on Delivery</div><div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Pay when you receive your order</div></div></label>
                                <label className={`payment-option ${payment === 'Online' ? 'selected' : ''}`}><input type="radio" name="payment" value="Online" checked={payment === 'Online'} onChange={() => setPayment('Online')} /><div><div style={{ fontWeight: 600 }}>Online Payment</div><div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Pay securely with UPI, Card, or Net Banking</div></div></label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="cart-summary">
                            <h3>Order Summary</h3>
                            {cartItems.map(item => (
                                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.9rem', borderBottom: '1px solid var(--gray-100)' }}>
                                    <span>{(item.name || 'Product').substring(0, 30)}... × {item.quantity || 1}</span>
                                    <span style={{ fontWeight: 500 }}>₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="summary-row" style={{ marginTop: 12 }}><span>Subtotal</span><span>₹{(subtotal || 0).toLocaleString()}</span></div>
                            {discount > 0 && <div className="summary-row" style={{ color: 'var(--success)' }}><span>Discount</span><span>−₹{Math.round(discount || 0).toLocaleString()}</span></div>}
                            <div className="summary-row"><span>GST (18%)</span><span>₹{(tax || 0).toLocaleString()}</span></div>
                            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping || 0}`}</span></div>
                            <div className="summary-row total"><span>Total</span><span>₹{(total || 0).toLocaleString()}</span></div>
                            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 20 }} disabled={loading}>{loading ? 'Placing Order...' : `Place Order — ₹${(total || 0).toLocaleString()}`}</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}
