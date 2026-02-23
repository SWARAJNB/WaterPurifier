import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiKey } from 'react-icons/fi';
import { forgotPassword, resetPassword } from '../api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault(); setLoading(true);
        try { await forgotPassword(email); toast.success('OTP sent! Check console for demo'); setStep(2); }
        catch (err) { toast.error(err.response?.data?.detail || err.response?.data?.message || 'Failed'); }
        finally { setLoading(false); }
    };

    const handleReset = async (e) => {
        e.preventDefault(); setLoading(true);
        try { await resetPassword({ email, otp, newPassword }); toast.success('Password reset successfully!'); setStep(3); }
        catch (err) { toast.error(err.response?.data?.detail || err.response?.data?.message || 'Failed'); }
        finally { setLoading(false); }
    };

    return (
        <div className="auth-page">
            <div className="auth-card animate-in">
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div className="logo-icon" style={{ margin: '0 auto 12px', width: 48, height: 48, fontSize: '1.4rem' }}>🔑</div>
                    <h2>Reset Password</h2>
                    <p className="subtitle">{step === 1 ? 'Enter your email to receive an OTP' : step === 2 ? 'Enter the OTP and new password' : 'Password reset successful!'}</p>
                </div>
                {step === 1 && (
                    <form onSubmit={handleSendOTP}>
                        <div className="form-group"><label><FiMail style={{ marginRight: 6 }} />Email</label><input className="form-control" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button>
                    </form>
                )}
                {step === 2 && (
                    <form onSubmit={handleReset}>
                        <div className="form-group"><label><FiKey style={{ marginRight: 6 }} />OTP</label><input className="form-control" required value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" /></div>
                        <div className="form-group"><label><FiLock style={{ marginRight: 6 }} />New Password</label><input className="form-control" type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters" /></div>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
                    </form>
                )}
                {step === 3 && <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Sign In</Link>}
                <div className="auth-footer"><Link to="/login">Back to Login</Link></div>
            </div>
        </div>
    );
}
