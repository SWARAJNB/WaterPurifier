import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import { registerUser } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
        setLoading(true);
        try {
            const { data } = await registerUser(form);
            login(data);
            toast.success('Account created!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.detail || err.response?.data?.message || 'Registration failed');
        } finally { setLoading(false); }
    };

    return (
        <div className="auth-page">
            <div className="auth-card animate-in">
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div className="logo-icon" style={{ margin: '0 auto 12px', width: 48, height: 48, fontSize: '1.4rem' }}>💧</div>
                    <h2>Create Account</h2>
                    <p className="subtitle">Join AquaPure for pure water solutions</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label><FiUser style={{ marginRight: 6 }} />Full Name</label><input className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></div>
                    <div className="form-group"><label><FiMail style={{ marginRight: 6 }} />Email</label><input className="form-control" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></div>
                    <div className="form-group"><label><FiPhone style={{ marginRight: 6 }} />Phone</label><input className="form-control" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" /></div>
                    <div className="form-group"><label><FiLock style={{ marginRight: 6 }} />Password</label><input className="form-control" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" /></div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</button>
                </form>
                <div className="auth-footer">Already have an account? <Link to="/login">Sign In</Link></div>
            </div>
        </div>
    );
}
