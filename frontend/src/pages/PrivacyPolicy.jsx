import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
    // Retain functionality
    const handleContact = () => {
        window.open('/help/ticket?subject=Privacy%20Inquiry&category=Other', '_blank');
    };

    const highlights = [
        { icon: '👁️', title: 'Transparency', desc: 'We are clear about what we collect.' },
        { icon: '🛡️', title: 'Encryption', desc: 'Bank-grade security for your data.' },
        { icon: '🎮', title: 'Control', desc: 'You own your personal information.' },
        { icon: '⚖️', title: 'Compliance', desc: 'Adhering to global privacy standards.' },
    ];

    const sections = [
        { title: 'Information Collection', content: 'We collect information you provide directly to us. For example, we collect information when you create an account, subscribe, participate in any interactive features of our services, fill out a form, request customer support, or otherwise communicate with us.' },
        { title: 'How We Use Data', content: 'We use the information we collect to operate, maintain, and improve our services, to develop new services, to protect LearnX and our users, and to verify your identity.' },
        { title: 'Data Security', content: 'We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.' },
        { title: 'Cookies & Tracking', content: 'We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.' },
        { title: 'Your Rights', content: 'You have the right to access, update or delete the information we have on you. Whenever made possible, you can access, update or request deletion of your Personal Data directly within your account settings section.' },
    ];

    return (
        <div style={{ minHeight: '100vh', padding: '6rem 0' }}>
            <div className="container">
                {/* Hero (Matched to Careers.jsx) */}
                <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <div style={{ display: 'inline-block', padding: '0.5rem 1.5rem', borderRadius: '50px', background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary)', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                        Trusted & Secure
                    </div>
                    <h1 className="gradient-text" style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.1' }}>
                        Your Privacy <br /> Our Priority
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        We believe that privacy is a fundamental human right. Here is how we protect yours.
                    </p>
                </div>

                {/* Highlights Grid (Matched to Perks Grid) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
                    {highlights.map((item, i) => (
                        <div key={i} className="glass-panel card-hover animate-slide-up" style={{ padding: '2rem', textAlign: 'center', animationDelay: `${i * 100}ms` }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
                            <h3 style={{ marginBottom: '0.5rem' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Detailed Sections (Matched to Open Positions List) */}
                <div className="animate-scale-in">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Policy Details</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {sections.map((section, i) => (
                            <div key={i} className="glass-panel card-hover" style={{
                                padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem',
                                borderLeft: `4px solid ${['#6366f1', '#ec4899', '#10b981', '#f59e0b'][i % 4]}`
                            }}>
                                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)' }}>{section.title}</h3>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                    {section.content}
                                </p>
                            </div>
                        ))}

                        {/* Contact CTA (Styled as a distinct highlighted card) */}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
