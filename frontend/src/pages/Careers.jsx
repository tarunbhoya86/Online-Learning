import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Careers = () => {
    const perks = [
        { icon: '🌍', title: 'Remote First', desc: 'Work from anywhere in the world.' },
        { icon: '🏥', title: 'Full Health', desc: 'Comprehensive health coverage for you.' },
        { icon: '💻', title: 'Latest Tech', desc: 'MacBook Pro and home office stipend.' },
        { icon: '🚀', title: 'Growth', desc: 'Annual learning budget of $2000.' },
    ];

    const [positions, setPositions] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/jobs')
            .then(res => res.json())
            .then(data => setPositions(data))
            .catch(err => console.error('Error fetching jobs:', err));
    }, []);

    return (
        <div style={{ minHeight: '100vh', padding: '6rem 0' }}>
            <div className="container">
                {/* Hero */}
                <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <div style={{ display: 'inline-block', padding: '0.5rem 1.5rem', borderRadius: '50px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                        We're Hiring!
                    </div>
                    <h1 className="gradient-text" style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.1' }}>
                        Build the Future of <br /> Education
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        Join a passionate team dedicated to democratizing learning for everyone, everywhere.
                    </p>
                </div>

                {/* Perks Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
                    {perks.map((perk, i) => (
                        <div key={i} className="glass-panel card-hover animate-slide-up" style={{ padding: '2rem', textAlign: 'center', animationDelay: `${i * 100}ms` }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{perk.icon}</div>
                            <h3 style={{ marginBottom: '0.5rem' }}>{perk.title}</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{perk.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Open Positions */}
                <div className="animate-scale-in">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Open Positions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {positions.map((job, i) => (
                            <div key={i} className="glass-panel card-hover" style={{
                                padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
                                borderLeft: `4px solid ${['#6366f1', '#ec4899', '#10b981', '#f59e0b'][i % 4]}`
                            }}>
                                <div>
                                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{job.title}</h3>
                                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <span>🏢 {job.department}</span>
                                        <span>📍 {job.type}</span>
                                        <span>💰 {job.salaryByYear}</span>
                                    </div>
                                </div>
                                <Link
                                    to={`/careers/apply/${job.title.toLowerCase().replace(/ /g, '-').replace(/[()]/g, '')}`}
                                    className="btn btn-primary"
                                    style={{ padding: '0.8rem 2rem', textDecoration: 'none' }}
                                >
                                    Apply Now
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Careers;
