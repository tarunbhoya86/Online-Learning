import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const faqs = [
        {
            category: 'account',
            question: "How do I reset my password?",
            answer: "You can click on the 'Forgot Password' link on the sign-in page. We will send you an email with instructions to reset it."
        },
        {
            category: 'account',
            question: "Can I change my email address?",
            answer: "Yes, you can update your email address from your Profile Settings page. You'll need to verify the new email."
        },
        {
            category: 'courses',
            question: "Do I get a certificate after completion?",
            answer: "Yes! Every paid course comes with a verified certificate of completion that you can share on your LinkedIn profile."
        },
        {
            category: 'courses',
            question: "How do I download course materials?",
            answer: "Inside the course player, look for the 'Resources' tab. You can download all PDFs, source code, and assets from there."
        },
        {
            category: 'billing',
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, MasterCard, Amex), PayPal, and localized payment options depending on your country."
        },
        {
            category: 'billing',
            question: "Can I get a refund?",
            answer: "We offer a 30-day money-back guarantee. If you're not satisfied, contact support within 30 days for a full refund."
        },
        {
            category: 'technical',
            question: "Videos are not playing, what should I do?",
            answer: "Try clearing your browser cache or switching to a different browser. Ensure you have a stable internet connection."
        },
        {
            category: 'account',
            question: "Can I share my account with others?",
            answer: "No, accounts are for individual use only. Sharing credentials may lead to account suspension as per our Terms of Service."
        },
        {
            category: 'courses',
            question: "Do the courses expire?",
            answer: "Once you buy a course, you have lifetime access to it! You can learn at your own pace and revisit the material anytime."
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        (activeCategory === 'all' || faq.category === activeCategory) &&
        (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const contactMethods = [
        { icon: '💬', title: 'Live Chat', desc: 'Chat with our agents instantly.', action: 'Start Chat', color: '#6366f1', link: '/support/chat', type: 'link' },
        { icon: '📧', title: 'Email Support', desc: 'Get a response within 24 hours.', action: 'Send Email', color: '#ec4899', link: 'mailto:support@learnx.com', type: 'a' },
        { icon: '🎫', title: 'Submit Ticket', desc: 'For complex technical issues.', action: 'Open Ticket', color: '#10b981', link: '/support/ticket', type: 'link' },
    ];

    const quickActions = [
        { icon: '🔑', title: 'Reset Password', link: '/forgot-password' },
        { icon: '📜', title: 'My Certificates', link: '/student/profile' },
        { icon: '💳', title: 'Billing History', link: '/student/profile' },
    ];

    return (
        <div className="container" style={{ padding: '4rem 0 8rem' }}>
            {/* Hero Section */}
            <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Support Center</span>
                <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: '800' }}>How can we help you today?</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2.5rem' }}>Search our knowledge base or get in touch with our expert team.</p>

                {/* Search Bar */}
                <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                    <input
                        type="text"
                        placeholder="Search for answers, topics, or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="glass-panel"
                        style={{
                            width: '100%', padding: '1.2rem 1.5rem', borderRadius: '50px',
                            border: '1px solid var(--border-color)', outline: 'none',
                            color: 'var(--text-main)', fontSize: '1.1rem',
                            paddingLeft: '3.5rem',
                            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                        }}
                    />
                    <span style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', color: 'var(--text-muted)' }}>🔍</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="animate-slide-up" style={{ marginBottom: '5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Quick Actions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {quickActions.map((action, i) => (
                        <Link to={action.link} key={i} className="glass-panel card-hover" style={{
                            padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'var(--text-main)'
                        }}>
                            <div style={{ fontSize: '1.5rem' }}>{action.icon}</div>
                            <span style={{ fontWeight: '600' }}>{action.title}</span>
                            <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>→</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="animate-slide-up" style={{ marginBottom: '6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Frequently Asked Questions</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {['all', 'account', 'courses', 'billing', 'technical'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    padding: '0.5rem 1.2rem', borderRadius: '50px',
                                    background: activeCategory === cat ? 'var(--primary)' : 'transparent',
                                    color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                                    border: activeCategory === cat ? 'none' : '1px solid var(--border-color)',
                                    cursor: 'pointer', textTransform: 'capitalize', fontWeight: '500',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {filteredFaqs.map((faq, index) => (
                        <div key={index} className="glass-panel" style={{ padding: '1.5rem 2rem', transition: 'all 0.3s' }}>
                            <details style={{ cursor: 'pointer' }}>
                                <summary style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.5rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {faq.question}
                                    <span style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>+</span>
                                </summary>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>{faq.answer}</p>
                            </details>
                        </div>
                    ))}
                    {filteredFaqs.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            <p>No results found for "{searchTerm}".</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Contact Methods */}
            <div className="animate-scale-in">
                <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>Still need support?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    {contactMethods.map((method, i) => (
                        <div key={i} className="glass-panel card-hover" style={{ padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: method.color }}></div>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{method.icon}</div>
                            <h3 style={{ marginBottom: '0.5rem' }}>{method.title}</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{method.desc}</p>
                            {method.type === 'link' ? (
                                <Link to={method.link} className="btn" style={{
                                    background: 'transparent', border: `1px solid ${method.color}`, color: method.color, width: '100%', display: 'inline-block', textDecoration: 'none'
                                }}>{method.action}</Link>
                            ) : (
                                <a href={method.link} className="btn" style={{
                                    background: 'transparent', border: `1px solid ${method.color}`, color: method.color, width: '100%', display: 'inline-block', textDecoration: 'none'
                                }}>{method.action}</a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
