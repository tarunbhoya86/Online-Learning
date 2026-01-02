import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';

const SubmitTicket = () => {
    const location = useLocation();
    const { user } = useStudent();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        subject: location.state?.subject || '',
        category: location.state?.category || 'Technical Issue',
        description: ''
    });

    useEffect(() => {
        // Pre-fill email if user is logged in
        if (user) {
            setFormData(prev => ({ ...prev, email: user.email }));
        }

        // Check for state passed via navigation
        if (location.state) {
            setFormData(prev => ({
                ...prev,
                subject: location.state.subject || prev.subject,
                category: location.state.category || prev.category
            }));
        }

        // Check for query parameters
        const searchParams = new URLSearchParams(location.search);
        const subjectParam = searchParams.get('subject');
        const categoryParam = searchParams.get('category');

        if (subjectParam || categoryParam) {
            setFormData(prev => ({
                ...prev,
                subject: subjectParam || prev.subject,
                category: categoryParam || prev.category
            }));
        }
    }, [location.state, location.search, user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/support', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'ticket',
                    ...formData
                })
            });

            if (response.ok) {
                setSubmitted(true);
            } else {
                alert('Failed to submit ticket. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting ticket:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '6rem 0', position: 'relative' }}>
            <div className="container" style={{ maxWidth: '700px' }}>
                <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 className="gradient-text" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>Submit a Ticket</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Describe your issue and we'll help you resolve it.</p>
                </div>

                <div className="glass-panel animate-slide-up" style={{ padding: '3rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="glass-panel"
                                required
                                placeholder="Enter your email"
                                style={{ width: '100%', padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="glass-panel"
                                required
                                style={{ width: '100%', padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="glass-panel"
                                style={{ width: '100%', padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                            >
                                <option>Technical Issue</option>
                                <option>Billing & Payments</option>
                                <option>Course Content</option>
                                <option>Account Access</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="6"
                                className="glass-panel"
                                style={{ width: '100%', padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', resize: 'vertical' }}
                            ></textarea>
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>Submit Ticket</button>
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
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>Ticket Submitted!</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                            We have received your request. Our support team will review it and get back to you shortly.
                        </p>
                        <button
                            onClick={() => {
                                setSubmitted(false);
                                setFormData({ subject: '', category: 'Technical Issue', description: '' });
                            }}
                            className="btn btn-primary"
                            style={{ padding: '0.8rem 2rem' }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmitTicket;
