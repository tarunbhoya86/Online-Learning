import React, { useState } from 'react';

const About = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Thank you, ${formData.name}! Your message has been sent.\n\n(This is a demo action)`);
        setFormData({ name: '', email: '', message: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="about-page" style={{ paddingTop: '8rem', paddingBottom: '4rem', overflowX: 'hidden' }}>
            {/* 3D Hero Section */}
            <section style={{ textAlign: 'center', position: 'relative', marginBottom: '8rem' }}>
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '600px', height: '600px', background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
                    opacity: 0.1, filter: 'blur(100px)', zIndex: -1, animation: 'pulse 5s infinite'
                }}></div>

                <div className="container" style={{ perspective: '1000px' }}>
                    <div className="animate-float">
                        <h1 className="gradient-text" style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: '1.1', fontWeight: '800' }}>
                            Empowering the Future <br /> of Education
                        </h1>
                    </div>
                    <p className="animate-fade-in" style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', animationDelay: '0.2s', lineHeight: '1.6' }}>
                        At LearnX, we believe that quality education should be accessible to everyone. We're building a global community of learners and leaders using cutting-edge technology.
                    </p>
                </div>
            </section>

            {/* 3D Stats Section using Tilt Cards */}
            <section className="container" style={{ marginBottom: '8rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
                    <TiltCard delay={0}>
                        <h2 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '0.5rem', fontWeight: '800' }}>50k+</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Students Enrolled</p>
                    </TiltCard>
                    <TiltCard delay={1}>
                        <h2 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '0.5rem', fontWeight: '800' }}>100+</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Expert Mentors</p>
                    </TiltCard>
                    <TiltCard delay={2}>
                        <h2 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '0.5rem', fontWeight: '800' }}>4.8</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Average Rating</p>
                    </TiltCard>
                    <TiltCard delay={3}>
                        <h2 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '0.5rem', fontWeight: '800' }}>20+</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Countries Reached</p>
                    </TiltCard>
                </div>
            </section>

            {/* Mission Section with 3D Tilt */}
            <section className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center', marginBottom: '8rem' }}>
                <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontWeight: '700' }}>Our Mission</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.8', fontSize: '1.1rem' }}>
                        We are on a mission to democratize education by connecting eager learners with industry veterans. We bridge the gap between theoretical knowledge and practical application through immersive, interactive learning experiences.
                    </p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>
                        Whether you're looking to switch careers, upskill for your current role, or just explore a new passion, LearnX provides the 3D-enabled resources and support you need to succeed in the modern world.
                    </p>
                </div>
                <TiltCard delay={4} style={{ padding: '10px' }}> {/* Less padding for image wrapper */}
                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                        alt="Team collaboration"
                        style={{ width: '100%', borderRadius: '16px', display: 'block', transform: 'translateZ(20px)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                    />
                </TiltCard>
            </section>

            {/* 3D Contact Form Section */}
            <section className="container" style={{ marginBottom: '8rem' }}>
                <TiltCard style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left', pointerEvents: 'auto' }}> {/* Provide override to ensure form inputs work nicely if needed, though they work in 3D usually */}
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem', fontWeight: '700' }}>Get in Touch</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Your Full Name"
                                style={{
                                    width: '100%', padding: '1rem', background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
                                    borderRadius: '12px', color: 'var(--text-main)', outline: 'none', transition: 'all 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="name@example.com"
                                style={{
                                    width: '100%', padding: '1rem', background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
                                    borderRadius: '12px', color: 'var(--text-main)', outline: 'none', transition: 'all 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="5"
                                placeholder="How can we help you?"
                                style={{
                                    width: '100%', padding: '1rem', background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
                                    borderRadius: '12px', color: 'var(--text-main)', outline: 'none', fontFamily: 'inherit', resize: 'vertical', transition: 'all 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start', marginTop: '1rem', padding: '1rem 2rem' }}>Send Message</button>
                    </form>
                </TiltCard>
            </section>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.1; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 0.15; transform: translate(-50%, -50%) scale(1.1); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

// Reusable Advanced 3D Tilt Card Component
const TiltCard = ({ children, delay = 0, style = {} }) => {
    const [transformStyle, setTransformStyle] = useState({});
    const [glareStyle, setGlareStyle] = useState({});

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 25; // Gentler tilt
        const y = (e.clientY - top - height / 2) / 25;
        const mouseX = ((e.clientX - left) / width) * 100;
        const mouseY = ((e.clientY - top) / height) * 100;

        setTransformStyle({
            transform: `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.02) translateY(-5px)`,
            boxShadow: `${-x}px ${y}px 20px rgba(0,0,0,0.2), 0 0 15px rgba(99, 102, 241, 0.1)`,
            borderColor: 'rgba(255, 255, 255, 0.5)'
        });

        setGlareStyle({
            opacity: 1,
            background: `radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.1), transparent 50%)`
        });
    };

    const handleMouseLeave = () => {
        setTransformStyle({ transform: 'perspective(1000px) rotate(0) scale(1) translateY(0)', boxShadow: 'var(--shadow)', borderColor: 'var(--border-color)' });
        setGlareStyle({ opacity: 0 });
    };

    return (
        <div
            className="animate-slide-up"
            style={{
                background: 'var(--bg-card)',
                borderRadius: '24px',
                padding: '2rem',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow)',
                position: 'relative',
                transition: 'all 0.1s ease-out',
                animationDelay: `${delay * 0.1}s`,
                overflow: 'hidden',
                ...style,
                ...transformStyle
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', transition: 'opacity 0.2s', ...glareStyle }}></div>
            <div style={{ position: 'relative', zIndex: 1, transform: 'translateZ(20px)' }}>
                {children}
            </div>
        </div>
    );
};

export default About;
