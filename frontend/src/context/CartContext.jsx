import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { syncCart, getCart } from '../api';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [savedItems, setSavedItems] = useState([]);
    const [coupon, setCoupon] = useState(null);
    const initialSyncDone = useRef(false);

    // Initial Load from LocalStorage
    useEffect(() => {
        const storedCart = localStorage.getItem('aquapure_cart');
        const storedSaved = localStorage.getItem('aquapure_saved');
        if (storedCart) try { setCartItems(JSON.parse(storedCart)); } catch { /**/ }
        if (storedSaved) try { setSavedItems(JSON.parse(storedSaved)); } catch { /**/ }
    }, []);

    // Sync to LocalStorage
    useEffect(() => {
        localStorage.setItem('aquapure_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('aquapure_saved', JSON.stringify(savedItems));
    }, [savedItems]);

    // Sync with Backend (Cart)
    useEffect(() => {
        if (user && !initialSyncDone.current) {
            // First time login sync
            const loadAndSync = async () => {
                try {
                    const dbCart = await getCart();
                    // Merge logic: For now, if local cart exists, sync it to DB
                    if (cartItems.length > 0) {
                        await syncCart(cartItems.map(item => ({ product: item._id, quantity: item.quantity })));
                    } else if (dbCart.data?.length > 0) {
                        // If local empty but DB has items, load from DB
                        // Note: Backend returns product IDs, frontend needs full objects. 
                        // Simpler to just let backend return full objects if possible or map them.
                        // Assuming backend returns enough info for now.
                    }
                    initialSyncDone.current = true;
                } catch (e) {
                    console.error("Cart sync error:", e);
                }
            };
            loadAndSync();
        }
    }, [user]);

    // Update DB on changes
    useEffect(() => {
        if (user && initialSyncDone.current) {
            const timer = setTimeout(() => {
                syncCart(cartItems.map(item => ({ product: item._id, quantity: item.quantity })));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [cartItems, user]);

    const addToCart = (product, qty = 1) => {
        setCartItems(prev => {
            const exists = prev.find(item => item._id === product._id);
            if (exists) {
                return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + qty } : item);
            }
            return [...prev, { _id: product._id, name: product.name, price: product.discountPrice > 0 ? product.discountPrice : product.price, originalPrice: product.price, image: product.images?.[0] || '', brand: product.brand, quantity: qty, stock: product.stock }];
        });
    };

    const removeFromCart = (id) => setCartItems(prev => prev.filter(item => item._id !== id));

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return removeFromCart(id);
        setCartItems(prev => prev.map(item => item._id === id ? { ...item, quantity } : item));
    };

    const toggleSaveForLater = (id) => {
        const itemInCart = cartItems.find(i => i._id === id);
        if (itemInCart) {
            removeFromCart(id);
            setSavedItems(prev => [...prev, itemInCart]);
        } else {
            const itemInSaved = savedItems.find(i => i._id === id);
            if (itemInSaved) {
                setSavedItems(prev => prev.filter(i => i._id !== id));
                setCartItems(prev => [...prev, itemInSaved]);
            }
        }
    };

    const clearCart = () => { setCartItems([]); setCoupon(null); };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = coupon ? Math.min((subtotal * coupon.discount) / 100, coupon.maxDiscount || Infinity) : 0;
    const shipping = subtotal > 5000 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18);
    const total = Math.round(subtotal + tax + shipping - discount);

    return (
        <CartContext.Provider value={{ cartItems, savedItems, addToCart, removeFromCart, updateQuantity, toggleSaveForLater, clearCart, cartCount, subtotal, discount, shipping, tax, total, coupon, setCoupon }}>
            {children}
        </CartContext.Provider>
    );
}
