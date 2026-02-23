import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { loginUser } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await loginUser(form);
            const userData = res.data.data;
            login({ ...userData, id: userData._id, token: userData.token });
            toast.success('Welcome back!');
            navigate(userData.role === 'admin' ? '/admin' : '/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally { setLoading(false); }
    };

    return (
        <div className="auth-page">
            <div className="auth-card animate-in">
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div className="logo-icon" style={{ margin: '0 auto 12px', width: 48, height: 48, fontSize: '1.4rem' }}>💧</div>
                    <h2>Welcome Back</h2>
                    <p className="subtitle">Sign in to your AquaPure account</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label><FiMail style={{ marginRight: 6 }} />Email</label>
                        <input className="form-control" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                    </div>
                    <div className="form-group">
                        <label><FiLock style={{ marginRight: 6 }} />Password</label>
                        <input className="form-control" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
                    </div>
                    <div style={{ textAlign: 'right', marginBottom: 16 }}>
                        <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>Forgot Password?</Link>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
                </form>
                <div className="auth-footer">Don't have an account? <Link to="/register">Sign Up</Link></div>
            </div>
        </div>
    );
}
