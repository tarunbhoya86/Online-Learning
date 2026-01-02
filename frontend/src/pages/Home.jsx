import React from 'react';
import { Link } from 'react-router-dom';

import { useData } from '../context/DataContext';

const Home = () => {
    const { users } = useData();
    const realMentors = users.filter(user => user.role === 'Mentor');

    // Fallback/Demo Mentors if none exist in DB
    const demoMentors = [
        { id: 'm1', name: 'Dr. Emily Carter', email: 'emily.carter@learnx.edu', role: 'Mentor', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
        { id: 'm2', name: 'Michael Chen', email: 'michael.chen@learnx.edu', role: 'Mentor', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { id: 'm3', name: 'Sarah Johnson', email: 'sarah.johnson@learnx.edu', role: 'Mentor', image: 'https://randomuser.me/api/portraits/women/68.jpg' }
    ];

    const newMentors = [
        { id: 'm4', name: 'David Kim', email: 'david.kim@learnx.edu', role: 'Mentor', image: 'https://randomuser.me/api/portraits/men/45.jpg' },

    ];

    const mentors = [...(realMentors.length > 0 ? realMentors : demoMentors), ...newMentors];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section style={{ padding: '1rem 0', overflow: 'hidden', position: 'relative' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'center' }}>

                    {/* Hero Text */}
                    <div className="animate-slide-up">
                        <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '30px', color: 'var(--primary)', fontWeight: '600', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            🚀 The Future of Learning
                        </div>
                        <h1 style={{ fontSize: '4.5rem', lineHeight: '1.1', marginBottom: '1.5rem', fontWeight: '800' }}>
                            Unlock Your <br />
                            <span className="gradient-text">True Potential</span>
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '500px', lineHeight: '1.6' }}>
                            Master in-demand skills with our premium courses and expert mentorship. Join a community of achievers today.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/courses" className="btn btn-primary btn-3d btn-animated" style={{ padding: '1rem 2rem', fontSize: '1.1rem', textDecoration: 'none' }}>Start Learning</Link>
                            <Link to="/about" className="btn btn-glass-3d btn-animated" style={{ color: 'var(--text-main)', padding: '1rem 2rem', fontSize: '1.1rem', textDecoration: 'none' }}>Our Mission</Link>
                        </div>

                        <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex' }}>
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', background: `url(https://randomuser.me/api/portraits/thumb/men/${i + 10}.jpg)`, backgroundSize: 'cover', border: '2px solid var(--bg-dark)', marginLeft: i > 0 ? '-10px' : 0 }}></div>
                                ))}
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <span style={{ color: 'white', fontWeight: 'bold' }}>50k+</span> students already enrolled
                            </p>
                        </div>
                    </div>

                    {/* Hero Graphic */}
                    <div style={{ position: 'relative', height: '500px' }} className="animate-fade-in">
                        {/* Main Abstract Shape or Image */}
                        <div className="glass-panel animate-float card-3d-hover" style={{
                            width: '100%', height: '100%',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))',
                            borderRadius: '30px',
                            position: 'relative',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            overflow: 'hidden'
                        }}>
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                alt="Learning"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.8', mixBlendMode: 'overlay' }}
                            />
                            {/* Decorative Elements */}
                            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px', background: 'var(--primary)', filter: 'blur(80px)', borderRadius: '50%', opacity: '0.4' }}></div>
                            <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '200px', height: '200px', background: 'var(--secondary)', filter: 'blur(80px)', borderRadius: '50%', opacity: '0.4' }}></div>
                        </div>

                        {/* Floating Cards */}
                        <div className="glass-panel animate-float" style={{
                            position: 'absolute', top: '10%', right: '-30px', // More overlap
                            padding: '1rem', borderRadius: '16px',
                            display: 'flex', alignItems: 'center', gap: '1rem',
                            animationDelay: '1s',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            zIndex: 2
                        }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#10b981' }}>✓</div>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Certified</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Top Rated Course</div>
                            </div>
                        </div>

                        <div className="glass-panel animate-float" style={{
                            position: 'absolute', bottom: '10%', left: '-30px', // More overlap
                            padding: '1rem', borderRadius: '16px',
                            display: 'flex', alignItems: 'center', gap: '1rem',
                            animationDelay: '2s',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            zIndex: 2
                        }}>
                            <div style={{ fontSize: '2rem' }}>🎓</div>
                            <div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>100+</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Expert Mentors</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mentors Section */}
            <section style={{ padding: '6rem 0', background: 'rgba(255,255,255,0.02)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Meet Our Expert Mentors</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Learn from industry leaders with proven track records.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {mentors.length > 0 ? mentors.map((mentor, index) => (
                            <div key={mentor.id} className="glass-panel card-3d-hover" style={{
                                padding: '2rem',
                                textAlign: 'center',
                                marginTop: '3rem', // Push down to make room for popped-out image
                                position: 'relative'
                            }}>
                                <div style={{
                                    width: '120px', height: '120px', borderRadius: '50%', margin: '-5rem auto 1.5rem', // Negative margin to pop out
                                    background: `linear-gradient(135deg, ${['#ff00cc', '#333399', '#ffcc00', '#00ccff'][Math.floor(Math.random() * 4)]}, #1e293b)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'white',
                                    overflow: 'hidden', border: '4px solid var(--bg-card)', boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                                    position: 'relative', zIndex: 1
                                }}>
                                    {mentor.image ? (
                                        <img src={mentor.image} alt={mentor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        mentor.name.charAt(0)
                                    )}
                                </div>
                                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.3rem' }}>{mentor.name}</h3>
                                <p style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '0.9rem' }}>Senior Instructor</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{mentor.email}</p>
                            </div>
                        )) : (
                            <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <p style={{ fontSize: '1.2rem' }}>Top-tier mentors joining soon. Stay tuned!</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '6rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Why Choose LearnX?</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>We provide everything you need to succeed in your career.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {[
                            { icon: '⚡', title: 'Interactive Learning', desc: 'Engage with quizzes, challenges, and projects.' },
                            { icon: '🤝', title: '1-on-1 Mentorship', desc: 'Get personal guidance from industry experts.' },
                            { icon: '🏆', title: 'Certified Completion', desc: 'Earn recognized certificates for every course.' },
                        ].map((feature, i) => (
                            <div key={i} className="glass-panel card-3d-hover" style={{
                                padding: '2.5rem',
                                textAlign: 'center',
                                transitionDelay: `${i * 100}ms`,
                                transform: i % 2 !== 0 ? 'translateY(2rem)' : 'none', // Stagger effect
                                marginBottom: i % 2 !== 0 ? '-2rem' : '0'
                            }}>
                                <div style={{
                                    fontSize: '3rem', marginBottom: '1.5rem',
                                    position: 'relative', display: 'inline-block'
                                }}>
                                    {feature.icon}
                                    <div style={{
                                        position: 'absolute', top: '-10px', right: '-20px', fontSize: '4rem', opacity: '0.05', fontWeight: 'bold'
                                    }}>{i + 1}</div>
                                </div>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{feature.title}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section style={{ padding: '6rem 0', background: 'linear-gradient(to bottom, transparent, rgba(99, 102, 241, 0.05))' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem' }}>What Our Students Say</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {[
                            { name: 'Alex Johnson', role: 'Frontend Dev', text: 'LearnX changed my career path completely. The mentors are amazing!', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
                            { name: 'Maria Garcia', role: 'UX Designer', text: 'The courses are well-structured and the projects are very practical.', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
                            { name: 'James Wilson', role: 'Data Analyst', text: 'Best investment I made for my education. Highly recommended.', image: 'https://randomuser.me/api/portraits/men/86.jpg' },
                        ].map((review, i) => (

                            <div key={i} className="glass-panel" style={{
                                padding: '2rem',
                                position: 'relative',
                                marginTop: '1.5rem'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '-1.5rem',
                                    left: '2rem',
                                    width: '60px', height: '60px', borderRadius: '50%',
                                    overflow: 'hidden', border: '3px solid var(--bg-card)',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                }}>
                                    <img src={review.image} alt={review.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ marginTop: '1.5rem', textAlign: 'right', marginBottom: '1rem', color: '#fbbf24' }}>★★★★★</div>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontStyle: 'italic' }}>"{review.text}"</p>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{review.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{review.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
                <div className="glass-panel animate-scale-in" style={{
                    padding: '5rem 2rem',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))',
                    borderRadius: '30px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontWeight: '800' }}>Ready to Transform your life?</h2>
                        <p style={{ color: 'var(--text-main)', marginBottom: '2.5rem', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                            Join 50,000+ others and start learning today. No credit card required for free courses.
                        </p>
                        <Link to="/courses" className="btn btn-primary btn-3d btn-animated" style={{ padding: '1rem 2.5rem', fontSize: '1.2rem', textDecoration: 'none' }}>Get Started for Free</Link>
                    </div>
                </div>
            </section>
        </div >
    );
};

export default Home;
