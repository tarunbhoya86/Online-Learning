import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';

const ChangePasswordForm = () => {
    const { user } = useStudent();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error on change
        if (message.type === 'error') setMessage({ type: '', text: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (formData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id || user._id,
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: data.message || 'Failed to change password' });
            } else {
                setMessage({ type: 'success', text: 'Password changed successfully!' });
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = (fieldName) => ({
        width: '100%',
        padding: '0.8rem 1rem 0.8rem 2.5rem',
        background: 'var(--bg-card)',
        border: focusedField === fieldName ? '1px solid var(--primary)' : '1px solid var(--border-color)',
        borderRadius: '8px',
        color: 'var(--text-main)',
        outline: 'none',
        transition: 'all 0.3s ease'
    });

    const iconStyle = {
        position: 'absolute',
        left: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-muted)',
        pointerEvents: 'none'
    };

    return (
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <form onSubmit={handleSubmit} style={{ maxWidth: '100%' }}>

                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Current Password</label>
                    <div style={{ position: 'relative' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('currentPassword')}
                            onBlur={() => setFocusedField(null)}
                            required
                            placeholder="Enter current password"
                            style={inputStyle('currentPassword')}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>New Password</label>
                        <div style={{ position: 'relative' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
                                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                            </svg>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('newPassword')}
                                onBlur={() => setFocusedField(null)}
                                required
                                placeholder="Create new password"
                                style={inputStyle('newPassword')}
                            />
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('confirmPassword')}
                                onBlur={() => setFocusedField(null)}
                                required
                                placeholder="Confirm new password"
                                style={inputStyle('confirmPassword')}
                            />
                        </div>
                    </div>
                </div>

                {message.text && (
                    <div className={`animate-fade-in ${message.type === 'error' ? 'animate-shake' : ''}`} style={{
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        borderRadius: '8px',
                        background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                        color: message.type === 'error' ? '#ef4444' : '#4ade80',
                        border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        {message.type === 'error' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        )}
                        {message.text}
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                    style={{
                        padding: '1rem 2rem',
                        opacity: isLoading ? 0.7 : 1,
                        width: '100%',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        background: isLoading ? 'var(--text-muted)' : 'linear-gradient(135deg, var(--primary), var(--secondary))'
                    }}
                >
                    {isLoading ? (
                        <span className="animate-pulse">Updating Password...</span>
                    ) : (
                        <>
                            <span>Update Password</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ChangePasswordForm;
