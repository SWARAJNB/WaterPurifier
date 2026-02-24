import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { loginUser } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (!form.email || !form.password) {
            setError('Email and password are required');
            setLoading(false);
            return;
        }

        try {
            const res = await loginUser(form);
            const userData = res.data;

            // Handle the new response format
            if (userData.token && userData.id) {
                const authData = {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role || 'user',
                    avatar: userData.avatar || '',
                    token: userData.token
                };

                login(authData);
                toast.success('✅ Welcome back!');

                // Redirect to intended page or dashboard
                const from = location.state?.from?.pathname;
                if (userData.role === 'admin') {
                    navigate('/admin-panel', { replace: true });
                } else {
                    navigate(from || '/', { replace: true });
                }
            } else {
                setError('Invalid response from server');
            }
        } catch (err) {
            const message = err.response?.data?.detail || 'Login failed. Please try again.';
            setError(message);
            toast.error('❌ ' + message);
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card animate-in">
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div className="logo-icon" style={{ margin: '0 auto 12px', width: 48, height: 48, fontSize: '1.4rem' }}>
                        💧
                    </div>
                    <h2>Welcome Back</h2>
                    <p className="subtitle">Sign in to your AquaPure account</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fee',
                        border: '1px solid #fcc',
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: 16,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color: '#c33',
                        fontSize: '0.9rem'
                    }}>
                        <FiAlertCircle />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label><FiMail style={{ marginRight: 6 }} />Email</label>
                        <input
                            className="form-control"
                            type="email"
                            required
                            value={form.email}
                            onChange={e => {
                                setForm({ ...form, email: e.target.value });
                                setError('');
                            }}
                            placeholder="you@example.com"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label><FiLock style={{ marginRight: 6 }} />Password</label>
                        <input
                            className="form-control"
                            type="password"
                            required
                            value={form.password}
                            onChange={e => {
                                setForm({ ...form, password: e.target.value });
                                setError('');
                            }}
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>

                    <div style={{ textAlign: 'right', marginBottom: 16 }}>
                        <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? '⏳ Signing in...' : '✓ Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </div>

                <div style={{ marginTop: 20, padding: 12, background: '#f0f8ff', borderRadius: 8, fontSize: '0.85rem', color: '#666' }}>
                    <strong>🧪 Demo Account:</strong>
                    <br />Email: admin@aquapure.com
                    <br />Password: admin123
                    <br />
                    <br /><strong>Or Create a New Account</strong>
                </div>
            </div>
        </div>
    );
}
