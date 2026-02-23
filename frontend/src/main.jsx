import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import './App.css';

// Simple Error Boundary to catch production crashes
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, errorInfo) { console.error("Logged Error:", error, errorInfo); }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h1 style={{ color: '#0f172a', marginBottom: '16px' }}>Oops! Something went wrong.</h1>
                    <p style={{ color: '#64748b', maxWidth: '500px' }}>The application crashed. This is usually due to a missing configuration or an unexpected data format.</p>
                    <pre style={{ margin: '20px 0', padding: '16px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', overflow: 'auto', maxWidth: '90%', fontSize: '0.8rem' }}>
                        {this.state.error?.toString()}
                    </pre>
                    <button onClick={() => window.location.href = '/'} style={{ padding: '10px 24px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Back to Home</button>
                </div>
            );
        }
        return this.props.children;
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <AuthProvider>
                    <CartProvider>
                        <WishlistProvider>
                            <App />
                        </WishlistProvider>
                    </CartProvider>
                </AuthProvider>
            </BrowserRouter>
        </ErrorBoundary>
    </React.StrictMode>
);
