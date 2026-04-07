import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const ForgotPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage('Password updated successfully!');
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-dark)',
            fontFamily: "var(--font-main, 'Outfit', sans-serif)",
            position: 'relative',
            overflow: 'hidden',
            padding: '1rem'
        }}>
            <div style={{
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(20px)',
                borderRadius: '32px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow)',
                padding: '3rem',
                maxWidth: '500px', // Standard width for single column
                width: '100%',
                zIndex: 1
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Recover Password
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Enter your new password to reset your account access.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* New Password */}
                    <div style={{ position: 'relative' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>New Password</label>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '0 1rem', transition: 'all 0.3s' }}>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '1rem', padding: '1rem 0', width: '100%' }}
                                placeholder="••••••••"
                                required
                            />
                            <span style={{ color: 'var(--text-muted)' }}>🔒</span>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div style={{ position: 'relative' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Confirm Password</label>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '0 1rem', transition: 'all 0.3s' }}>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '1rem', padding: '1rem 0', width: '100%' }}
                                placeholder="••••••••"
                                required
                            />
                            <span style={{ color: 'var(--text-muted)' }}>🔐</span>
                        </div>
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.8rem', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {message && (
                        <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '0.8rem', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>✅</span> {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            marginTop: '0.5rem',
                            padding: '1rem',
                            borderRadius: '16px',
                            border: 'none',
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px var(--primary-glow)',
                            opacity: isLoading ? 0.7 : 1,
                            transition: 'transform 0.2s'
                        }}
                    >
                        {isLoading ? 'Updating...' : 'Reset Password'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <Link to="/signin" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                            <span>←</span> Back to Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
