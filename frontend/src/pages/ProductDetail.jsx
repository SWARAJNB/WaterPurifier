import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiHeart, FiCheck, FiX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { getProduct, getReviews, createReview, getBusinessInfo } from '../api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
    const { addToCart } = useCart();
    const { toggleWishlistItem, isInWishlist } = useWishlist();
    const { user } = useAuth();
    const [info, setInfo] = useState(null);

    useEffect(() => {
        setLoading(true);
        Promise.all([getProduct(id), getReviews(id), getBusinessInfo()])
            .then(([pRes, rRes, iRes]) => { setProduct(pRes.data); setReviews(rRes.data); setInfo(iRes.data); })
            .catch(() => toast.error('Failed to load product'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleReview = async (e) => {
        e.preventDefault();
        if (!user) return toast.error('Please login to write a review');
        try {
            const res = await createReview({ product: id, ...reviewForm });
            setReviews(prev => [res.data, ...prev]);
            setReviewForm({ rating: 5, title: '', comment: '' });
            toast.success('Review submitted!');
        } catch (err) {
            toast.error(err.response?.data?.detail || err.response?.data?.message || 'Action failed');
        }
    };

    const renderStars = (rating) => Array.from({ length: 5 }, (_, i) => (
        <FiStar key={i} style={{ fill: i < Math.round(rating) ? '#f59e0b' : 'none', color: '#f59e0b' }} />
    ));

    if (loading) return <div className="loading" style={{ padding: '100px 0' }}><div className="spinner"></div></div>;
    if (!product) return <div className="empty-state" style={{ padding: '100px 20px' }}><h3>Product not found</h3></div>;

    const discount = product.discountPrice > 0 ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;
    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    const whatsappMsg = encodeURIComponent(`Hi, I'm interested in ${product.name} (₹${price.toLocaleString()}). Please share more details.`);

    return (
        <>
            <div className="page-header">
                <div className="container">
                    <div className="breadcrumb"><Link to="/">Home</Link> / <Link to="/products">Products</Link> / <span>{product.name}</span></div>
                </div>
            </div>

            <div className="container product-detail">
                <div className="product-detail-grid">
                    {/* Gallery */}
                    <div className="product-gallery">
                        <div className="gallery-main">
                            {product.images?.length > 0
                                ? <img src={product.images[activeImage]} alt={product.name} loading="lazy" />
                                : <div style={{ fontSize: '6rem', color: 'var(--primary)', opacity: 0.3 }}>💧</div>}
                        </div>
                        {product.images?.length > 1 && (
                            <div className="gallery-thumbs">
                                {product.images.map((img, i) => (
                                    <div key={i} className={`gallery-thumb ${i === activeImage ? 'active' : ''}`} onClick={() => setActiveImage(i)}>
                                        <img src={img} alt="" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="product-info">
                        <div className="brand">{product.brand}</div>
                        <h1>{product.name}</h1>
                        <div className="rating-row">
                            <div className="stars">{renderStars(product.rating)}</div>
                            <span style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{product.rating} ({product.numReviews} reviews)</span>
                        </div>
                        <div className="price-row">
                            <span className="price-big">₹{price.toLocaleString()}</span>
                            {product.discountPrice > 0 && (
                                <>
                                    <span className="price-cut">₹{product.price.toLocaleString()}</span>
                                    <span className="price-save">You save ₹{(product.price - product.discountPrice).toLocaleString()} ({discount}%)</span>
                                </>
                            )}
                        </div>
                        <div className={`stock-status ${product.stock > 0 ? 'stock-in' : 'stock-out'}`}>
                            {product.stock > 0 ? <><FiCheck /> In Stock ({product.stock} available)</> : <><FiX /> Out of Stock</>}
                        </div>
                        <p style={{ color: 'var(--gray-700)', lineHeight: 1.7, marginBottom: 20 }}>{product.description}</p>

                        {product.stock > 0 && (
                            <>
                                <div className="quantity-selector">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                                </div>
                                <div className="product-actions">
                                    <button className="btn btn-primary btn-lg" onClick={() => { addToCart(product, quantity); toast.success('Added to cart!'); }}><FiShoppingCart /> Add to Cart</button>
                                    <Link to="/checkout" className="btn btn-success btn-lg" onClick={() => addToCart(product, quantity)}>Buy Now</Link>
                                    <a href={`https://wa.me/919999999999?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg"><FaWhatsapp /> WhatsApp Order</a>
                                </div>
                            </>
                        )}
                        <button className={`btn btn-secondary`} onClick={() => { toggleWishlistItem(product); toast.success(isInWishlist(product._id) ? 'Removed from wishlist' : 'Added to wishlist'); }}>
                            <FiHeart style={{ fill: isInWishlist(product._id) ? '#ef4444' : 'none' }} /> {isInWishlist(product._id) ? 'In Wishlist' : 'Add to Wishlist'}
                        </button>

                        {/* Specs */}
                        {product.specifications && (
                            <div style={{ marginTop: 24 }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 12 }}>Specifications</h3>
                                <table className="specs-table">
                                    <tbody>
                                        {Object.entries(product.specifications).filter(([, v]) => v).map(([key, val]) => (
                                            <tr key={key}><td>{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</td><td>{val}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {product.features?.length > 0 && (
                            <div className="product-features">
                                <h3>Key Features</h3>
                                <ul>{product.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews */}
                <section style={{ marginTop: 60 }}>
                    <h2 className="section-title" style={{ textAlign: 'left' }}>Customer Reviews ({reviews.length})</h2>
                    {user && (
                        <form className="review-form" onSubmit={handleReview}>
                            <h3>Write a Review</h3>
                            <div className="star-input">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <button key={s} type="button" className={reviewForm.rating >= s ? 'active' : ''} onClick={() => setReviewForm(p => ({ ...p, rating: s }))}>
                                        <FiStar style={{ fill: reviewForm.rating >= s ? '#f59e0b' : 'none' }} />
                                    </button>
                                ))}
                            </div>
                            <input className="form-control" placeholder="Review title (optional)" value={reviewForm.title} onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))} style={{ marginBottom: 12 }} />
                            <textarea className="form-control" placeholder="Write your review..." value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))} required />
                            <button type="submit" className="btn btn-primary" style={{ marginTop: 12 }}>Submit Review</button>
                        </form>
                    )}
                    <div className="reviews-list" style={{ marginTop: 24 }}>
                        {reviews?.length === 0 ? <p style={{ color: 'var(--gray-500)' }}>No reviews yet. Be the first!</p> :
                            reviews?.map(r => (
                                <div key={r?._id} className="review-card">
                                    <div className="review-header">
                                        <div className="review-user">
                                            <div className="review-avatar">{r?.user?.name?.[0] || 'U'}</div>
                                            <div><div className="review-name">{r?.user?.name || 'User'}</div><div className="stars" style={{ marginTop: 2 }}>{renderStars(r?.rating)}</div></div>
                                        </div>
                                        <span className="review-date">{new Date(r?.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {r?.title && <p style={{ fontWeight: 600, margin: '8px 0 4px' }}>{r.title}</p>}
                                    <p className="review-comment">{r?.comment}</p>
                                </div>
                            ))}
                    </div>
                </section>
            </div>
        </>
    );
}
