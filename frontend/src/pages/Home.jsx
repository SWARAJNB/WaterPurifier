import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDroplet, FiShield, FiTruck, FiAward, FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { getProducts } from '../api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import SEO from '../components/SEO';

export default function Home() {
    const [featured, setFeatured] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const { addToCart } = useCart();
    const { toggleWishlistItem, isInWishlist } = useWishlist();

    useEffect(() => {
        getProducts({ featured: true, limit: 4 }).then(r => setFeatured(r.data.products)).catch(() => { });
        getProducts({ bestSeller: true, limit: 4 }).then(r => setBestSellers(r.data.products)).catch(() => { });
    }, []);

    const renderStars = (rating) => Array.from({ length: 5 }, (_, i) => (
        <FiStar key={i} style={{ fill: i < Math.round(rating) ? '#f59e0b' : 'none', color: '#f59e0b' }} />
    ));

    const ProductCard = ({ product }) => {
        const discount = product.discountPrice > 0 ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;
        return (
            <div className="product-card animate-in">
                <Link to={`/product/${product._id}`} className="product-card-image">
                    {product.images?.[0] ? <img src={product.images[0]} alt={product.name} loading="lazy" /> : <div className="product-card-placeholder">💧</div>}
                    {discount > 0 && <span className="product-badge badge-sale">{discount}% OFF</span>}
                </Link>
                <button className={`product-wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`} onClick={() => toggleWishlistItem(product)}><FiHeart style={{ fill: isInWishlist(product._id) ? '#ef4444' : 'none' }} /></button>
                <div className="product-card-body">
                    <div className="product-card-brand">{product.brand}</div>
                    <Link to={`/product/${product._id}`} className="product-card-name">{product.name}</Link>
                    <div className="product-card-price">
                        <span className="price-current">₹{(product.discountPrice || product.price).toLocaleString()}</span>
                        {product.discountPrice > 0 && <span className="price-original">₹{product.price.toLocaleString()}</span>}
                    </div>
                    <div className="product-card-rating">
                        <div className="stars">{renderStars(product.rating)}</div>
                        <span className="rating-count">({product.numReviews})</span>
                    </div>
                    <div className="product-card-actions">
                        <button className="btn btn-primary btn-sm" onClick={() => addToCart(product)}><FiShoppingCart /> Add to Cart</button>
                    </div>
                </div>
            </div>
        );
    };

    const testimonials = [
        { name: 'Rajesh Kumar', role: 'Verified Buyer', text: 'Amazing water quality after installing the Kent Grand Plus. The installation was free and the service team was very professional. Highly recommended!', rating: 5 },
        { name: 'Priya Sharma', role: 'Verified Buyer', text: 'Great experience with AquaPure. Ordered Aquaguard Aura and it was delivered next day. The water tastes so much better now. AMC plan is affordable too.', rating: 5 },
        { name: 'Amit Patel', role: 'Verified Buyer', text: 'Best prices compared to other websites. Got Pureit Ultima at 20% less than MRP. Free installation and 1 year warranty. Very happy with the purchase.', rating: 4 }
    ];

    return (
        <>
            <SEO
                title="Buy Best Water Purifiers Online in India"
                description="AquaPure — India's #1 online store for premium RO, UV & UF water purifiers. Shop Kent, Aquaguard, Pureit & more. Free installation, best prices, EMI available. Trusted by 50,000+ families."
                keywords="water purifier, RO water purifier, UV water purifier, buy water purifier online, Kent water purifier, Aquaguard, Pureit, best water purifier India, water filter for home"
                url="/"
                structuredData={{
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "LocalBusiness",
                            "@id": "https://aquapure.com/#business",
                            "name": "AquaPure",
                            "description": "India's leading online destination for premium water purifiers. RO, UV, UF purifiers from Kent, Aquaguard, Pureit and more.",
                            "url": "https://aquapure.com",
                            "telephone": "+91-99999-99999",
                            "email": "info@aquapure.com",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "123, Water Street",
                                "addressLocality": "Mumbai",
                                "addressRegion": "Maharashtra",
                                "postalCode": "400001",
                                "addressCountry": "IN"
                            },
                            "geo": {
                                "@type": "GeoCoordinates",
                                "latitude": 19.0760,
                                "longitude": 72.8777
                            },
                            "openingHoursSpecification": {
                                "@type": "OpeningHoursSpecification",
                                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                                "opens": "09:00",
                                "closes": "21:00"
                            },
                            "priceRange": "₹₹",
                            "image": "https://aquapure.com/og-image.jpg",
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": "4.8",
                                "reviewCount": "2450",
                                "bestRating": "5"
                            }
                        },
                        {
                            "@type": "WebSite",
                            "@id": "https://aquapure.com/#website",
                            "name": "AquaPure",
                            "url": "https://aquapure.com",
                            "potentialAction": {
                                "@type": "SearchAction",
                                "target": "https://aquapure.com/products?search={search_term_string}",
                                "query-input": "required name=search_term_string"
                            }
                        },
                        {
                            "@type": "Organization",
                            "@id": "https://aquapure.com/#organization",
                            "name": "AquaPure",
                            "url": "https://aquapure.com",
                            "logo": "https://aquapure.com/favicon.svg",
                            "sameAs": [
                                "https://www.facebook.com/aquapure",
                                "https://www.instagram.com/aquapure",
                                "https://twitter.com/aquapure",
                                "https://www.youtube.com/@aquapure"
                            ]
                        }
                    ]
                }}
            />
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-text animate-in">
                        <h1>Pure Water, <span>Healthy Life</span></h1>
                        <p>Discover India's finest range of water purifiers from top brands. Advanced RO, UV & UF technology ensures your family drinks only the purest water.</p>
                        <div className="hero-buttons">
                            <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
                            <Link to="/about" className="btn btn-secondary btn-lg" style={{ borderColor: '#fff', color: '#fff' }}>Learn More</Link>
                        </div>
                        <div className="hero-stats">
                            <div className="hero-stat"><div className="hero-stat-number">50K+</div><div className="hero-stat-label">Happy Customers</div></div>
                            <div className="hero-stat"><div className="hero-stat-number">15+</div><div className="hero-stat-label">Top Brands</div></div>
                            <div className="hero-stat"><div className="hero-stat-number">4.8★</div><div className="hero-stat-label">Average Rating</div></div>
                        </div>
                    </div>
                    <div className="hero-image animate-in delay-2">💧</div>
                </div>
            </section>

            {/* Featured */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title">Featured Water Purifiers</h2>
                    <p className="section-subtitle">Handpicked premium water purifiers with advanced features and best-in-class purification technology</p>
                    <div className="products-grid">
                        {featured.map(p => <ProductCard key={p._id} product={p} />)}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 32 }}>
                        <Link to="/products" className="btn btn-secondary">View All Products</Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section" style={{ background: '#fff' }}>
                <div className="container">
                    <h2 className="section-title">Why Choose AquaPure?</h2>
                    <p className="section-subtitle">We're committed to providing you with the best water purification solutions</p>
                    <div className="features-grid">
                        {[
                            { icon: <FiDroplet />, title: '100% Pure Water', desc: 'Advanced multi-stage RO+UV+UF purification removes 99.9% of contaminants' },
                            { icon: <FiShield />, title: 'Certified Quality', desc: 'All products are ISI, NSF certified with genuine manufacturer warranty' },
                            { icon: <FiTruck />, title: 'Free Installation', desc: 'Expert installation included with every purchase, delivered within 48 hours' },
                            { icon: <FiAward />, title: 'Best Price Guarantee', desc: 'We match any lower price. Save up to 40% compared to retail stores' },
                        ].map((f, i) => (
                            <div key={i} className={`feature-card animate-in delay-${i + 1}`}>
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Best Sellers */}
            {bestSellers.length > 0 && (
                <section className="section">
                    <div className="container">
                        <h2 className="section-title">Best Sellers</h2>
                        <p className="section-subtitle">Our most popular water purifiers loved by thousands of customers</p>
                        <div className="products-grid">
                            {bestSellers.map(p => <ProductCard key={p._id} product={p} />)}
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials */}
            <section className="section" style={{ background: '#fff' }}>
                <div className="container">
                    <h2 className="section-title">What Our Customers Say</h2>
                    <p className="section-subtitle">Join 50,000+ families who trust AquaPure for their water purification needs</p>
                    <div className="testimonials-grid">
                        {testimonials.map((t, i) => (
                            <div key={i} className="testimonial-card animate-in">
                                <div className="stars" style={{ marginBottom: 12 }}>{renderStars(t.rating)}</div>
                                <p className="testimonial-text">{t.text}</p>
                                <div className="testimonial-author">
                                    <div className="review-avatar">{t.name[0]}</div>
                                    <div><div className="testimonial-author-name">{t.name}</div><div className="testimonial-author-role">{t.role}</div></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section">
                <div className="container">
                    <div className="cta-banner">
                        <h2>Ready for Pure, Healthy Water?</h2>
                        <p>Get free expert consultation and find the perfect water purifier for your home</p>
                        <Link to="/products" className="btn btn-lg" style={{ background: '#fff', color: '#0077B6', fontWeight: 700 }}>Shop Now</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
