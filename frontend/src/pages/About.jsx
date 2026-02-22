import { Link } from 'react-router-dom';
import { FiDroplet, FiShield, FiAward, FiUsers, FiTarget, FiGlobe } from 'react-icons/fi';
import SEO from '../components/SEO';

export default function About() {
    return (
        <>
            <SEO
                title="About Us"
                description="Learn about AquaPure — India's trusted destination for premium water purification solutions since 2015. Serving 50,000+ families across 500+ cities with certified water purifiers."
                keywords="about AquaPure, water purifier company India, water purification solutions"
                url="/about"
            />
            <div className="about-hero">
                <div className="container">
                    <h1 className="animate-in">About AquaPure</h1>
                    <p className="animate-in delay-1">India's trusted destination for premium water purification solutions since 2015</p>
                    <div className="about-stats animate-in delay-2">
                        {[{ n: '50,000+', l: 'Happy Customers' }, { n: '100+', l: 'Products' }, { n: '15+', l: 'Brands' }, { n: '500+', l: 'Cities Served' }].map((s, i) => (
                            <div key={i} className="about-stat"><div className="about-stat-number">{s.n}</div><div className="about-stat-label">{s.l}</div></div>
                        ))}
                    </div>
                </div>
            </div>
            <section className="section">
                <div className="container">
                    <div className="about-content">
                        <div><h2>Our Story</h2><p>AquaPure was founded with a simple yet powerful mission — to make safe, pure drinking water accessible to every Indian household. Starting as a small local shop in 2015, we've grown into one of India's most trusted online platforms for water purifiers.</p><p>We partner with all major brands including Kent, Aquaguard, Pureit, Livpure, AO Smith, and more to bring you genuine products at the best prices, backed by professional installation and after-sales service.</p></div>
                        <div className="about-image">💧</div>
                    </div>
                </div>
            </section>
            <section className="section" style={{ background: '#fff' }}>
                <div className="container">
                    <h2 className="section-title">Our Mission & Vision</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 40 }}>
                        <div style={{ padding: 32, background: 'var(--accent)', borderRadius: 'var(--radius-lg)' }}><FiTarget style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: 12 }} /><h3 style={{ marginBottom: 8 }}>Mission</h3><p style={{ color: 'var(--gray-700)', lineHeight: 1.7 }}>To provide every Indian family access to pure, safe, and mineral-rich drinking water through affordable, advanced water purification technology.</p></div>
                        <div style={{ padding: 32, background: 'var(--accent)', borderRadius: 'var(--radius-lg)' }}><FiGlobe style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: 12 }} /><h3 style={{ marginBottom: 8 }}>Vision</h3><p style={{ color: 'var(--gray-700)', lineHeight: 1.7 }}>To become India's #1 water purifier marketplace and contribute to eradicating waterborne diseases by 2030.</p></div>
                    </div>
                </div>
            </section>
            <section className="section">
                <div className="container">
                    <h2 className="section-title">Certifications & Quality</h2>
                    <p className="section-subtitle">All our products meet the highest quality and safety standards</p>
                    <div className="cert-grid">
                        {[{ icon: <FiShield />, title: 'ISI Certified' }, { icon: <FiAward />, title: 'NSF Certified' }, { icon: <FiDroplet />, title: 'WQA Tested' }, { icon: <FiUsers />, title: 'ISO 9001:2015' }].map((c, i) => (
                            <div key={i} className="cert-card"><div className="cert-icon">{c.icon}</div><h4>{c.title}</h4></div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="section" style={{ background: '#fff' }}>
                <div className="container"><div className="cta-banner"><h2>Join 50,000+ Happy Families</h2><p>Shop now and get free installation with every purchase</p><Link to="/products" className="btn btn-lg" style={{ background: '#fff', color: '#0077B6', fontWeight: 700 }}>Browse Products</Link></div></div>
            </section>
        </>
    );
}
