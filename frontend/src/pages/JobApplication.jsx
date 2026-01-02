import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const JobApplication = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        portfolio: '',
        coverLetter: ''
    });

    // In a real app, you'd fetch job details based on jobId. 
    // For now, we'll just format the ID to show as a title.
    const jobTitle = jobId ? jobId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Job';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    jobId,
                    jobTitle,
                    ...formData
                })
            });

            if (response.ok) {
                setSubmitted(true);
            } else {
                alert('Failed to submit application. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '6rem 0', position: 'relative' }}>
            <div className="container" style={{ maxWidth: '700px' }}>
                <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Apply for Position</span>
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>{jobTitle}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>We're excited to see what you bring to the team!</p>
                </div>

                <div className="glass-panel animate-slide-up" style={{ padding: '3rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="glass-panel"
                                    required
                                    style={{ width: '100%', padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="glass-panel"
                                    required
                                    style={{ width: '100%', padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="glass-panel"
                                required
                                style={{ width: '100%', padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>LinkedIn Profile</label>
                                <input
                                    type="url"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    className="glass-panel"
                                    placeholder="https://linkedin.com/in/..."
                                    style={{ width: '100%', padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Portfolio URL</label>
                                <input
                                    type="url"
                                    name="portfolio"
                                    value={formData.portfolio}
                                    onChange={handleChange}
                                    className="glass-panel"
                                    placeholder="https://..."
                                    style={{ width: '100%', padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Cover Letter / Why You?</label>
                            <textarea
                                name="coverLetter"
                                value={formData.coverLetter}
                                onChange={handleChange}
                                required
                                rows="6"
                                className="glass-panel"
                                style={{ width: '100%', padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', resize: 'vertical' }}
                            ></textarea>
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>Submit Application</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Success Popup Modal */}
            {submitted && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
                    animation: 'fadeIn 0.3s'
                }}>
                    <div className="glass-panel animate-scale-in" style={{ padding: '3rem', maxWidth: '500px', textAlign: 'center', border: '1px solid var(--primary)', boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>Application Sent!</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                            Thank you for applying. We will review your application and get back to you if your profile matches our needs.
                        </p>
                        <button
                            onClick={() => {
                                setSubmitted(false);
                                navigate('/careers');
                            }}
                            className="btn btn-primary"
                            style={{ padding: '0.8rem 2rem' }}
                        >
                            Return to Careers
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobApplication;
