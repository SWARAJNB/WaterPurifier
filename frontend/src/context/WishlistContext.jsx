import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('aquapure_wishlist');
        if (stored) try { setWishlist(JSON.parse(stored)); } catch { /**/ }
    }, []);

    useEffect(() => {
        localStorage.setItem('aquapure_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const toggleWishlistItem = (product) => {
        setWishlist(prev => {
            const exists = prev.find(item => item._id === product._id);
            if (exists) return prev.filter(item => item._id !== product._id);
            return [...prev, { _id: product._id, name: product.name, price: product.price, discountPrice: product.discountPrice, image: product.images?.[0] || '', brand: product.brand, rating: product.rating }];
        });
    };

    const isInWishlist = (id) => wishlist.some(item => item._id === id);
    const clearWishlist = () => setWishlist([]);

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlistItem, isInWishlist, clearWishlist, wishlistCount: wishlist.length }}>
            {children}
        </WishlistContext.Provider>
    );
}
