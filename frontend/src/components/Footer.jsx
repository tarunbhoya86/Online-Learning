import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            alert('Thanks for subscribing!');
            setEmail('');
        }
    };

    return (
        <footer style={{
            marginTop: '8rem',
            position: 'relative',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-card)'
        }}>
            {/* Soft Ambient Glow */}
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '300px', height: '100px', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.1, pointerEvents: 'none' }}></div>

            <div className="container" style={{ padding: '4rem 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem' }}>

                    {/* Brand Column */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                            {/* <div style={{ fontSize: '2rem' }}>🚀</div> */}
                            <h2 className="gradient-text" style={{ fontSize: '2rem', margin: 0, fontWeight: '800' }}>LearnX</h2>
                        </Link>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem', maxWidth: '350px', fontSize: '1.05rem' }}>
                            Join 10,000+ students mastering the future of technology with expert-led courses and personalized mentorship.
                        </p>
                        <div className="social-links">
                            {[
                                {
                                    id: 'twitter',
                                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
                                    url: 'https://twitter.com'
                                },
                                {
                                    id: 'facebook',
                                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.648 0-2.928 1.67-2.928 3.403v1.575h3.913l-.504 3.677h-3.409v7.98h-4.887Z" /></svg>,
                                    url: 'https://facebook.com'
                                },
                                {
                                    id: 'linkedin',
                                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" /></svg>,
                                    url: 'https://linkedin.com'
                                },
                                {
                                    id: 'instagram',
                                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>,
                                    url: 'https://instagram.com'
                                }
                            ].map((social) => (
                                <a
                                    key={social.id}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-btn"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.8rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>Platform</h4>
                        <ul className="footer-links" style={{ listStyle: 'none', padding: 0 }}>
                            <li><Link to="/courses">Browse Courses</Link></li>
                            <li><Link to="/mentors">Find a Mentor</Link></li>
                            <li><Link to="/about">Success Stories</Link></li>
                            <li><Link to="/">How it works</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.8rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>Support</h4>
                        <ul className="footer-links" style={{ listStyle: 'none', padding: 0 }}>
                            <li><Link to="/help">Help Center</Link></li>
                            <li><Link to="/careers">Careers</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>Stay in the Loop</h4>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                            Subscribe to our newsletter for exclusive discounts and early access.
                        </p>
                        <form onSubmit={handleSubscribe} style={{ position: 'relative', maxWidth: '400px' }}>
                            <input
                                type="email"
                                placeholder="name@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="newsletter-input"
                            />
                            <button type="submit" className="newsletter-btn">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div style={{
                    paddingTop: '3rem',
                    marginTop: '4rem',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '2rem'
                }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        &copy; {new Date().getFullYear()} LearnX Technologies Inc.
                    </p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer' }}>English (US)</span>
                        <Link to="/terms" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Terms</Link>
                        <Link to="/privacy" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Privacy</Link>
                    </div>
                </div>
            </div>

            <style>{`
                .social-links {
                    display: flex;
                    gap: 1.2rem;
                }

                .social-btn {
                    width: 44px; height: 44px; /* Slightly larger clickable area */
                    border-radius: 12px;
                    background: var(--bg-glass); /* Theme aware background */
                    border: 1px solid var(--border-color); /* Theme aware border */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: var(--text-muted);
                    text-decoration: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-weight: 700;
                    padding: 0;
                    box-sizing: border-box;
                    backdrop-filter: blur(5px);
                }
                .social-btn:hover {
                    background: var(--primary);
                    color: white;
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px var(--primary-glow);
                    border-color: var(--primary);
                }

                .footer-links li { margin-bottom: 1rem; }
                .footer-links a {
                    text-decoration: none;
                    color: var(--text-muted);
                    transition: all 0.2s;
                    font-size: 1rem;
                }
                .footer-links a:hover {
                    color: var(--primary);
                    padding-left: 5px;
                }

                .newsletter-input {
                    width: 100%;
                    padding: 1rem 1.5rem;
                    padding-right: 8rem;
                    border-radius: 50px;
                    border: 1px solid var(--border-color);
                    background: var(--bg-glass); /* Theme aware background */
                    color: var(--text-main);
                    outline: none;
                    transition: all 0.3s;
                }
                .newsletter-input:focus {
                    border-color: var(--primary);
                    background: var(--bg-card);
                    box-shadow: 0 0 0 4px var(--primary-glow);
                }

                .newsletter-btn {
                    position: absolute;
                    right: 6px;
                    top: 6px;
                    bottom: 6px;
                    background: var(--primary);
                    color: white;
                    border: none;
                    border-radius: 50px;
                    padding: 0 1.5rem;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s;
                }
                .newsletter-btn:hover {
                    background: var(--secondary);
                    transform: scale(1.05);
                }

                @media (max-width: 768px) {
                    .container { text-align: center; }
                    .container > div:first-child { grid-template-columns: 1fr !important; }
                    div[style*="grid-column"] { grid-column: span 1 !important; }
                    .social-links { justify-content: center; margin-bottom: 2rem; }
                    .footer-links { text-align: center; }
                    form { margin: 0 auto; }
                    div[style*="justify-content: space-between"] { justify-content: center !important; }
                }
            `}</style>
        </footer>
    );
};

export default Footer;


