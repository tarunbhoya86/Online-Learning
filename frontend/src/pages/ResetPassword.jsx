import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './Auth.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Something went wrong');
            } else {
                setMessage('Password updated successfully! Redirecting...');
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Background elements */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '20%',
                width: '300px',
                height: '300px',
                background: 'var(--primary)',
                filter: 'blur(100px)',
                borderRadius: '50%',
                opacity: '0.2',
                zIndex: -1
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '20%',
                width: '300px',
                height: '300px',
                background: 'var(--secondary)',
                filter: 'blur(100px)',
                borderRadius: '50%',
                opacity: '0.2',
                zIndex: -1
            }}></div>

            <div className="auth-card">
                <div className="auth-header">
                    <h2 className="auth-title">Reset Password</h2>
                    <p className="auth-subtitle">Enter your new password</p>
                </div>

                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">New Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className={`form-input ${error ? 'error' : ''}`}
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength="6"
                                style={{ paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    color: 'var(--text-muted)'
                                }}
                            >
                                {showPassword ? '🫣' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirmPassword"
                                className={`form-input ${error ? 'error' : ''}`}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={{ paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    color: 'var(--text-muted)'
                                }}
                            >
                                {showPassword ? '🫣' : '👁️'}
                            </button>
                        </div>
                        {error && (
                            <div className="error-message">
                                <span>⚠️</span> {error}
                            </div>
                        )}
                        {message && (
                            <div className="success-message" style={{ color: '#4ade80', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                <span>✅</span> {message}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary auth-btn"
                        disabled={isLoading}
                        style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                    >
                        {isLoading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <span className="loader"></span> Updating...
                            </span>
                        ) : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
