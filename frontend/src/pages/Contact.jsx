import { useState, useEffect } from 'react';
import { FiPhone, FiMail, FiMapPin, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { submitContact, getBusinessInfo } from '../api';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getBusinessInfo().then(res => setInfo(res.data)).catch(err => console.error(err));
    }, []);

    const phone = info?.phone || "+91 99999 99999";
    const email = info?.email || "info@aquapure.com";
    const whatsapp = info?.whatsapp || "919999999999";
    const address = info?.address || "123, Water Street, Clean City, India - 400001";
    const maps = info?.google_maps_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000";

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        try { const res = await submitContact(form); toast.success(res.data.message); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }
        catch { toast.error('Failed to send message'); }
        finally { setLoading(false); }
    };

    return (
        <>
            <SEO
                title="Contact Us"
                description="Get in touch with AquaPure. Call us at +91 99999 99999, email info@aquapure.com, or visit our store in Mumbai. Free consultation for water purifier selection."
                keywords="contact AquaPure, water purifier support, water purifier service near me, AquaPure Mumbai"
                url="/contact"
            />
            <div className="page-header"><div className="container"><h1>Contact Us</h1><p>We'd love to hear from you. Get in touch!</p></div></div>
            <section className="section">
                <div className="container">
                    <div className="contact-grid">
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 20 }}>Get In Touch</h2>
                            <div className="contact-info-cards">
                                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="contact-info-card"><div className="icon"><FiPhone /></div><div><h4>Phone</h4><p>{phone}</p></div></a>
                                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="contact-info-card"><div className="icon" style={{ background: '#dcfce7', color: '#16a34a' }}><FaWhatsapp /></div><div><h4>WhatsApp</h4><p>Chat with us on WhatsApp</p></div></a>
                                <a href={`mailto:${email}`} className="contact-info-card"><div className="icon"><FiMail /></div><div><h4>Email</h4><p>{email}</p></div></a>
                                <div className="contact-info-card"><div className="icon"><FiMapPin /></div><div><h4>Address</h4><p>{address}</p></div></div>
                            </div>
                            <div className="contact-map">
                                <iframe src={maps} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Location" />
                            </div>
                        </div>
                        <div className="contact-form-card">
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 20 }}>Send us a Message</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group"><label>Name</label><input className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                                    <div className="form-group"><label>Phone</label><input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                                </div>
                                <div className="form-group"><label>Email</label><input className="form-control" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                                <div className="form-group"><label>Subject</label><input className="form-control" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} /></div>
                                <div className="form-group"><label>Message</label><textarea className="form-control" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help..." /></div>
                                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}><FiSend /> {loading ? 'Sending...' : 'Send Message'}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
