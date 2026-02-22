import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiFilter, FiStar, FiShoppingCart, FiHeart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getProducts, getBrands } from '../api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import SEO from '../components/SEO';

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const { addToCart } = useCart();
    const { toggleWishlistItem, isInWishlist } = useWishlist();

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        brand: searchParams.get('brand') || '',
        purifierType: searchParams.get('purifierType') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        minRating: searchParams.get('minRating') || '',
        sort: searchParams.get('sort') || 'newest',
        page: Number(searchParams.get('page')) || 1
    });

    useEffect(() => { getBrands().then(r => setBrands(r.data)).catch(() => { }); }, []);

    useEffect(() => {
        setLoading(true);
        const params = {};
        Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
        getProducts(params).then(r => {
            setProducts(r.data.products); setTotal(r.data.total); setPages(r.data.pages);
        }).catch(() => { }).finally(() => setLoading(false));
    }, [filters]);

    const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    const renderStars = (rating) => Array.from({ length: 5 }, (_, i) => (
        <FiStar key={i} style={{ fill: i < Math.round(rating) ? '#f59e0b' : 'none', color: '#f59e0b', fontSize: '0.8rem' }} />
    ));

    const purifierTypes = ['RO', 'UV', 'UF', 'RO+UV', 'RO+UF', 'RO+UV+UF', 'Gravity'];

    return (
        <>
            <SEO
                title="Buy Water Purifiers Online"
                description="Browse our collection of premium RO, UV & UF water purifiers from Kent, Aquaguard, Pureit, Livpure & more. Best prices, free installation, EMI available."
                keywords="buy water purifier online, RO water purifier price, UV water purifier, Kent purifier, Aquaguard purifier, Pureit water purifier, best water purifier 2024"
                url="/products"
            />
            <div className="page-header">
                <div className="container">
                    <h1>Water Purifiers</h1>
                    <p>Find the perfect water purifier for your home</p>
                    <div className="breadcrumb"><Link to="/">Home</Link> / <span>Products</span></div>
                </div>
            </div>

            <div className="container">
                <div className="listing-page">
                    <button className="btn btn-secondary filter-toggle-btn" onClick={() => setFiltersOpen(!filtersOpen)}>
                        <FiFilter /> {filtersOpen ? 'Hide Filters' : 'Show Filters'}
                    </button>

                    <aside className={`filters-sidebar ${filtersOpen ? 'open' : ''}`}>
                        <div className="filter-group">
                            <h3>Search</h3>
                            <input className="form-control" placeholder="Search..." value={filters.search} onChange={e => updateFilter('search', e.target.value)} />
                        </div>
                        <div className="filter-group">
                            <h3>Price Range</h3>
                            <div className="price-range">
                                <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} />
                                <span>-</span>
                                <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} />
                            </div>
                        </div>
                        <div className="filter-group">
                            <h3>Brand</h3>
                            {brands.map(b => (
                                <label key={b} className="filter-option">
                                    <input type="checkbox" checked={filters.brand.split(',').includes(b)} onChange={e => {
                                        const curr = filters.brand ? filters.brand.split(',') : [];
                                        updateFilter('brand', e.target.checked ? [...curr, b].join(',') : curr.filter(x => x !== b).join(','));
                                    }} />
                                    {b}
                                </label>
                            ))}
                        </div>
                        <div className="filter-group">
                            <h3>Purifier Type</h3>
                            {purifierTypes.map(t => (
                                <label key={t} className="filter-option">
                                    <input type="checkbox" checked={filters.purifierType.split(',').includes(t)} onChange={e => {
                                        const curr = filters.purifierType ? filters.purifierType.split(',') : [];
                                        updateFilter('purifierType', e.target.checked ? [...curr, t].join(',') : curr.filter(x => x !== t).join(','));
                                    }} />
                                    {t}
                                </label>
                            ))}
                        </div>
                        <div className="filter-group">
                            <h3>Minimum Rating</h3>
                            {[4, 3, 2].map(r => (
                                <label key={r} className="filter-option">
                                    <input type="radio" name="rating" checked={filters.minRating === String(r)} onChange={() => updateFilter('minRating', String(r))} />
                                    {r}★ & above
                                </label>
                            ))}
                            <label className="filter-option">
                                <input type="radio" name="rating" checked={!filters.minRating} onChange={() => updateFilter('minRating', '')} /> All
                            </label>
                        </div>
                        <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={() => setFilters({ search: '', brand: '', purifierType: '', minPrice: '', maxPrice: '', minRating: '', sort: 'newest', page: 1 })}>Clear All Filters</button>
                    </aside>

                    <div>
                        <div className="sort-bar">
                            <span className="results-count">{total} products found</span>
                            <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}>
                                <option value="newest">Newest First</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                                <option value="popularity">Most Popular</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="loading"><div className="spinner"></div></div>
                        ) : products.length === 0 ? (
                            <div className="empty-state"><div className="empty-state-icon">🔍</div><h3>No products found</h3><p>Try adjusting your filters</p></div>
                        ) : (
                            <>
                                <div className="products-grid">
                                    {products.map(product => {
                                        const discount = product.discountPrice > 0 ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;
                                        return (
                                            <div key={product._id} className="product-card">
                                                <Link to={`/product/${product._id}`} className="product-card-image">
                                                    {product.images?.[0] ? <img src={product.images[0]} alt={product.name} loading="lazy" /> : <div className="product-card-placeholder">💧</div>}
                                                    {discount > 0 && <span className="product-badge badge-sale">{discount}% OFF</span>}
                                                    {product.bestSeller && <span className="product-badge badge-best" style={{ left: discount > 0 ? 'auto' : 12, right: discount > 0 ? 12 : 'auto', top: discount > 0 ? 42 : 12 }}>Best Seller</span>}
                                                </Link>
                                                <button className={`product-wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`} onClick={() => toggleWishlistItem(product)}>
                                                    <FiHeart style={{ fill: isInWishlist(product._id) ? '#ef4444' : 'none' }} />
                                                </button>
                                                <div className="product-card-body">
                                                    <div className="product-card-brand">{product.brand}</div>
                                                    <Link to={`/product/${product._id}`} className="product-card-name">{product.name}</Link>
                                                    <div className="product-card-price">
                                                        <span className="price-current">₹{(product.discountPrice || product.price).toLocaleString()}</span>
                                                        {product.discountPrice > 0 && <span className="price-original">₹{product.price.toLocaleString()}</span>}
                                                        {discount > 0 && <span className="price-discount">{discount}% off</span>}
                                                    </div>
                                                    <div className="product-card-rating">
                                                        <div className="stars">{renderStars(product.rating)}</div>
                                                        <span className="rating-count">({product.numReviews})</span>
                                                    </div>
                                                    <div className="product-card-actions">
                                                        <button className="btn btn-primary btn-sm" onClick={() => addToCart(product)}><FiShoppingCart /> Add to Cart</button>
                                                        <Link to={`/product/${product._id}`} className="btn btn-secondary btn-sm">View</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {pages > 1 && (
                                    <div className="pagination">
                                        <button disabled={filters.page <= 1} onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}><FiChevronLeft /></button>
                                        {Array.from({ length: pages }, (_, i) => (
                                            <button key={i + 1} className={filters.page === i + 1 ? 'active' : ''} onClick={() => setFilters(p => ({ ...p, page: i + 1 }))}>{i + 1}</button>
                                        ))}
                                        <button disabled={filters.page >= pages} onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}><FiChevronRight /></button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
