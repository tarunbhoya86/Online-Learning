import React from 'react';

const TermsOfService = () => {
    return (
        <div style={{ minHeight: '100vh', padding: '6rem 0' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem' }}>Terms of Service</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        Last Updated: <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>January 1, 2026</span>
                    </p>
                </div>

                <div className="glass-panel animate-slide-up" style={{ padding: '3rem' }}>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem', fontSize: '1.1rem' }}>
                        Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the LearnX website operated by LearnX Technologies Inc.
                    </p>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--secondary)' }}>1. Acceptance of Terms</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--secondary)' }}>2. Educational Content</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            The content provided on LearnX is for educational purposes only. While we verify all our mentors, we cannot guarantee the complete accuracy or suitability of information for your specific situation.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--secondary)' }}>3. Accounts</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--secondary)' }}>4. Termination</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                        </p>
                    </section>


                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
