import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [coupon, setCoupon] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('aquapure_cart');
        if (stored) try { setCartItems(JSON.parse(stored)); } catch { /**/ }
    }, []);

    useEffect(() => {
        localStorage.setItem('aquapure_cart', JSON.stringify(cartItems));
    }, [cartItems]);

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

    const clearCart = () => { setCartItems([]); setCoupon(null); };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = coupon ? Math.min((subtotal * coupon.discount) / 100, coupon.maxDiscount || Infinity) : 0;
    const shipping = subtotal > 5000 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18);
    const total = Math.round(subtotal + tax + shipping - discount);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, subtotal, discount, shipping, tax, total, coupon, setCoupon }}>
            {children}
        </CartContext.Provider>
    );
}
