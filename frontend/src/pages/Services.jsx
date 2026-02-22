import { useState, useEffect } from 'react';
import { FiTool, FiSettings, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';

export default function Services() {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        service: '',
        preferredDate: '',
        issue: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const loadServices = async () => {
            try {
                const res = await axios.get('/api/services');
                setServices(res.data.data || []);
            } catch {
                toast.error('Failed to load service plans');
            } finally {
                setFetching(false);
            }
        };
        loadServices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return toast.error('Please login to book a service');
        setLoading(true);
        try {
            await axios.post('/api/services/book', form);
            toast.success('Service booked successfully!');
            setForm({ ...form, issue: '', preferredDate: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to book');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEO
                title="Water Purifier Services"
                description="Professional water purifier installation, maintenance, repair & AMC plans. Certified technicians, genuine parts, 90-day service warranty. Book a service now."
                keywords="water purifier installation, water purifier service, water purifier AMC, RO service near me, water filter repair"
                url="/services"
            />
            <div className="page-header"><div className="container"><h1>Our Services</h1><p>Expert water purifier services for your peace of mind</p></div></div>
            <section className="section">
                <div className="container">
                    {fetching ? <div className="spinner"></div> : (
                        <div className="services-grid">
                            {services.map((s, i) => (
                                <div key={i} className="service-card animate-in">
                                    <div className="service-icon"><FiTool /></div>
                                    <h3>{s.name}</h3>
                                    <p>{s.description}</p>
                                    <div className="price">Starting ₹{s.price}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <section className="section" style={{ background: '#fff' }}>
                <div className="container">
                    <h2 className="section-title">Book a Service</h2>
                    <p className="section-subtitle">Select your plan and preferred date, and our team will visit you</p>
                    <div style={{ maxWidth: 600, margin: '0 auto' }}>
                        <form className="contact-form-card" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group"><label>Phone Number</label><input className="form-control" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                                <div className="form-group">
                                    <label>Select Service</label>
                                    <select className="form-control" required value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                                        <option value="">Choose a plan...</option>
                                        {services.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Preferred Visit Date</label>
                                <input type="date" className="form-control" required value={form.preferredDate} onChange={e => setForm({ ...form, preferredDate: e.target.value })} min={new Date().toISOString().split('T')[0]} />
                            </div>
                            <div className="form-group"><label>Issue Details</label><textarea className="form-control" required value={form.issue} onChange={e => setForm({ ...form, issue: e.target.value })} placeholder="Tell us what's wrong..." /></div>
                            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>{loading ? 'Booking...' : 'Book Service Now'}</button>
                            {!user && <p style={{ textAlign: 'center', marginTop: 12, fontSize: '0.85rem', color: '#dc2626' }}>* Please login to book a service</p>}
                        </form>
                    </div>
                </div>
            </section>
            <section className="section">
                <div className="container">
                    <h2 className="section-title">Why Choose Our Services?</h2>
                    <div className="features-grid" style={{ marginTop: 32 }}>
                        {[{ icon: <FiCheckCircle />, title: 'Certified Technicians', desc: 'All our technicians are factory-trained and certified' },
                        { icon: <FiCheckCircle />, title: 'Genuine Parts', desc: 'We use only 100% genuine replacement parts' },
                        { icon: <FiCheckCircle />, title: '90-Day Warranty', desc: 'Every service comes with a 90-day service warranty' },
                        { icon: <FiCheckCircle />, title: '24/7 Support', desc: 'Round-the-clock customer support via call and WhatsApp' }
                        ].map((f, i) => (<div key={i} className="feature-card"><div className="feature-icon">{f.icon}</div><h3>{f.title}</h3><p>{f.desc}</p></div>))}
                    </div>
                </div>
            </section>
        </>
    );
}
