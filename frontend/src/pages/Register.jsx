import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { registerUser } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [passwordErrors, setPasswordErrors] = useState([]);
    const { login } = useAuth();
    const navigate = useNavigate();

    const validatePassword = (pwd) => {
        const errors = [];
        if (pwd.length < 6) errors.push('At least 6 characters');
        if (!/[A-Z]/.test(pwd)) errors.push('One uppercase letter');
        if (!/[0-9]/.test(pwd)) errors.push('One number');
        return errors;
    };

    const handlePasswordChange = (pwd) => {
        setForm({ ...form, password: pwd });
        setPasswordErrors(validatePassword(pwd));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!form.name) {
            setError('Full name is required');
            return;
        }
        if (!form.email) {
            setError('Email is required');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const res = await registerUser(form);
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
                toast.success('✅ Account created successfully!');
                navigate('/', { replace: true });
            } else {
                setError('Invalid response from server');
            }
        } catch (err) {
            console.error("❌ Registration Error:", err.response?.data);
            const message = err.response?.data?.detail || err.response?.data?.message || 'Registration failed. Try another email.';
            setError(message);
            toast.error('❌ ' + message);
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
                    <h2>Create Account</h2>
                    <p className="subtitle">Join AquaPure for pure water solutions</p>
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
                        <label><FiUser style={{ marginRight: 6 }} />Full Name</label>
                        <input
                            className="form-control"
                            required
                            value={form.name}
                            onChange={e => {
                                setForm({ ...form, name: e.target.value });
                                setError('');
                            }}
                            placeholder="Your full name"
                            disabled={loading}
                        />
                    </div>

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
                        <label><FiPhone style={{ marginRight: 6 }} />Phone (Optional)</label>
                        <input
                            className="form-control"
                            type="tel"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            placeholder="+91 XXXXX XXXXX"
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
                            onChange={e => handlePasswordChange(e.target.value)}
                            placeholder="Min 6 characters"
                            disabled={loading}
                        />
                        {form.password && (
                            <div style={{ fontSize: '0.85rem', marginTop: 8, color: '#666' }}>
                                {passwordErrors.length === 0 ? (
                                    <div style={{ color: '#2d8a2a', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <FiCheck /> Strong password
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ color: '#c33', marginBottom: 4 }}>Password should have:</div>
                                        {passwordErrors.map(e => (
                                            <div key={e} style={{ color: '#c33', fontSize: '0.8rem' }}>
                                                • {e}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%' }}
                        disabled={loading || passwordErrors.length > 0}
                    >
                        {loading ? '⏳ Creating Account...' : '✓ Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
}
