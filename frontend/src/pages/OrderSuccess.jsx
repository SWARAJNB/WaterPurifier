import { Link, useParams } from 'react-router-dom';
import { FiCheck, FiPackage, FiHome } from 'react-icons/fi';

export default function OrderSuccess() {
    const { id } = useParams();
    return (
        <div className="container">
            <div className="order-success animate-in">
                <div className="order-success-icon"><FiCheck /></div>
                <h2>Order Placed Successfully!</h2>
                <p>Thank you for your purchase. Your order <strong>#{id?.slice(-8)}</strong> has been confirmed and is being processed.</p>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: 24 }}>You will receive a confirmation email shortly. You can track your order from your profile page.</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/profile" className="btn btn-primary"><FiPackage /> View Orders</Link>
                    <Link to="/" className="btn btn-secondary"><FiHome /> Continue Shopping</Link>
                </div>
            </div>
        </div>
    );
}
