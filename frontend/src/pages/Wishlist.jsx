import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Wishlist() {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    if (wishlistItems.length === 0) {
        return (
            <>
                <div className="page-header"><div className="container"><h1>My Wishlist</h1></div></div>
                <div className="container" style={{ padding: '60px 20px' }}>
                    <div className="empty-state"><div className="empty-state-icon">❤️</div><h3>Your wishlist is empty</h3><p>Save items you love for later</p><Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Products</Link></div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="page-header"><div className="container"><h1>My Wishlist</h1><p>{wishlistItems.length} item{wishlistItems.length > 1 ? 's' : ''} saved</p></div></div>
            <div className="container" style={{ padding: '40px 20px' }}>
                <div className="products-grid">
                    {wishlistItems.map(item => (
                        <div key={item._id} className="product-card">
                            <Link to={`/product/${item._id}`} className="product-card-image">
                                {item.image ? <img src={item.image} alt={item.name} /> : <div className="product-card-placeholder">💧</div>}
                            </Link>
                            <div className="product-card-body">
                                <div className="product-card-brand">{item.brand}</div>
                                <Link to={`/product/${item._id}`} className="product-card-name">{item.name}</Link>
                                <div className="product-card-price"><span className="price-current">₹{item.price?.toLocaleString()}</span></div>
                                <div className="product-card-actions" style={{ gap: 8 }}>
                                    <button className="btn btn-primary btn-sm" onClick={() => { addToCart(item); toast.success('Added to cart'); }}><FiShoppingCart /> Add to Cart</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => { removeFromWishlist(item._id); toast.success('Removed'); }}><FiTrash2 /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
