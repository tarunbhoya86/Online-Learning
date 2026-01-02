import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import { useGoogleLogin } from '@react-oauth/google';

import toast from 'react-hot-toast';
import './Auth.css';

const SignIn = () => {
    const navigate = useNavigate();
    const { login } = useStudent();

    // --- State ---
    const [formData, setFormData] = useState({ email: '', password: '', userImage: null });
    const [authMethod, setAuthMethod] = useState('email');
    const [phone, setPhone] = useState('');
    const [phonePassword, setPhonePassword] = useState('');
    const [googleEmail, setGoogleEmail] = useState('');
    const [googlePassword, setGooglePassword] = useState('');
    const [otp, setOtp] = useState('');
    const [phoneStep, setPhoneStep] = useState('input');
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // --- 3D Tilt Logic ---
    const imageRef = useRef(null);
    const [tiltStyle, setTiltStyle] = useState({});

    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setFormData(prev => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    const handleMouseMove = (e) => {
        if (!imageRef.current || window.innerWidth < 768) return;
        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 30;
        const y = (e.clientY - top - height / 2) / 30;
        setTiltStyle({ transform: `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.02)` });
    };

    const handleMouseLeave = () => {
        setTiltStyle({ transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)' });
    };

    // --- Form Logic ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };



    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');

            if (rememberMe) {
                localStorage.setItem('rememberedEmail', formData.email);
                setFormData({ email: formData.email, password: '' }); // Clear password only
            } else {
                localStorage.removeItem('rememberedEmail');
                setFormData({ email: '', password: '' }); // Clear all
            }

            login({ ...data.user, id: data.user._id });
            navigate(data.user.role === 'Admin' ? '/admin' : '/student/dashboard');
        } catch (err) {
            setErrors({ email: err.message || 'Login Failed' });
        } finally {
            setIsLoading(false);
        }
    };


    // --- Phone & Google Logic ---
    const handleSendOtp = (e) => {
        e.preventDefault();
        if (!phone || !phonePassword) return alert("Please enter both Phone Number and Password");
        setIsLoading(true);
        setTimeout(() => { setIsLoading(false); setPhoneStep('verify'); alert('OTP sent: 1234'); }, 1000);
    };
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp !== '1234') return alert('Invalid OTP');
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/phone-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            login({ ...data.user, id: data.user._id });

            toast.success('Successfully logged in with Phone');
            navigate('/student/dashboard');
        } catch (err) { alert(err.message); } finally { setIsLoading(false); }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await fetch('http://localhost:5000/api/auth/google', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: tokenResponse.access_token }) });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                login({ ...data.user, id: data.user._id });

                toast.success('Successfully logged in with Google');
                navigate(data.user.role === 'Admin' ? '/admin' : '/student/dashboard');
            } catch (err) { alert('Google Login Failed'); }
        },
        onError: () => {
            // If real login fails (or is cancelled), do nothing or alert
            console.log("Google Login Failed/Cancelled");
        }
    });

    const handleGoogleSubmit = (e) => {
        e.preventDefault();
        if (!googleEmail || !googlePassword) return alert("Please enter Google Email and Password");
        executeGoogleLogin();
    };

    const handleGoogleLogin = () => setAuthMethod('google');

    // Smart Login Wrapper
    const executeGoogleLogin = () => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        // Check for valid Google Client ID (usually long string)
        const isRealId = clientId && clientId.length > 20 && !clientId.includes("demo");

        if (!isRealId) {
            // DEMO MODE: Simulate Login via Backend
            setIsLoading(true);
            fetch('http://localhost:5000/api/auth/demo-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(async (res) => {
                    const contentType = res.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        return res.json();
                    } else {
                        const text = await res.text();
                        throw new Error(text || "Server returned non-JSON response");
                    }
                })
                .then(data => {
                    if (data.user) {
                        login({ ...data.user, id: data.user._id });
                        navigate(data.user.role === 'Admin' ? '/admin' : '/student/dashboard');
                    } else {
                        alert("Demo Login Failed: No user data returned");
                    }
                })
                .catch(err => {
                    console.error("Demo Login Error:", err);
                    alert(`Demo Login Failed: ${err.message}. Ensure backend is running.`);
                })
                .finally(() => setIsLoading(false));
        } else {
            // REAL MODE
            googleLogin();
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
            overflowY: 'auto', /* Allow scroll on mobile */
            padding: '1rem' /* Padding for mobile edges */
        }}>
            {/* Background Gradients acting as ambient light */}
            {/* <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '50vw', height: '50vw', background: 'var(--primary)', opacity: 0.1, filter: 'blur(120px)', borderRadius: '50%', zIndex: 0 }}></div>
            <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '50vw', height: '50vw', background: 'var(--secondary)', opacity: 0.1, filter: 'blur(120px)', borderRadius: '50%', zIndex: 0 }}></div> */}

            <div className="auth-card" style={{
                display: 'flex',
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(20px)',
                borderRadius: '32px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow)',
                margin: 'auto',
                maxWidth: '1000px',
                width: '100%',
                position: 'relative',
                zIndex: 1,
                overflow: 'hidden',
                minHeight: '600px'
            }}>

                {/* LEFT: FORM SECTION */}
                <div className="auth-form" style={{ flex: 1.2, padding: '1rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, var(--primary), var(--secondary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800' }}>LearnX</h1>
                            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Welcome Back</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>Enter your details to access your learning space</p>
                        </div>


                    </div>

                    {authMethod === 'email' ? (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} autoComplete="off">
                            {/* Email Input */}
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '0 1rem', transition: 'all 0.3s' }}>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="off"

                                        style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '1rem', padding: '1rem 0', width: '100%' }}
                                        placeholder="name@example.com"
                                    />
                                    <span style={{ color: 'var(--text-muted)' }}>✉️</span>
                                </div>
                                {errors.email && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.2rem', display: 'block' }}>{errors.email}</span>}
                            </div>

                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '0 1rem', transition: 'all 0.3s' }}>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '1rem', padding: '1rem 0', width: '100%' }}
                                        placeholder="••••••••"
                                    />
                                    <span style={{ color: 'var(--text-muted)' }}>🔒</span>
                                </div>
                                {errors.password && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.2rem', display: 'block' }}>{errors.password}</span>}
                            </div>

                            <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
                                <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'var(--accent)'}>
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    marginTop: '1rem',
                                    padding: '1rem',
                                    borderRadius: '16px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                    color: 'white',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px var(--primary-glow)',
                                    transition: 'transform 0.2s',
                                    opacity: isLoading ? 0.7 : 1
                                }}
                                onMouseOver={e => !isLoading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                                onMouseOut={e => !isLoading && (e.currentTarget.style.transform = 'translateY(0)')}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>
                    ) : authMethod === 'phone' ? (
                        /* Phone Form */
                        <form onSubmit={phoneStep === 'input' ? handleSendOtp : handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>{phoneStep === 'input' ? 'Mobile Number' : 'One Time Password'}</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '0 1rem', transition: 'all 0.3s' }}>
                                    <input
                                        type={phoneStep === 'input' ? 'tel' : 'text'}
                                        value={phoneStep === 'input' ? phone : otp}
                                        onChange={e => phoneStep === 'input' ? setPhone(e.target.value) : setOtp(e.target.value)}
                                        style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '1rem', padding: '1rem 0', width: '100%' }}
                                        placeholder={phoneStep === 'input' ? '+91 98765 43210' : '1234'}
                                    />
                                    <span style={{ color: 'var(--text-muted)' }}>{phoneStep === 'input' ? '📞' : '🔑'}</span>
                                </div>
                            </div>

                            {phoneStep === 'input' && (
                                <div style={{ position: 'relative' }}>
                                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '0 1rem', transition: 'all 0.3s' }}>
                                        <input
                                            type="password"
                                            value={phonePassword}
                                            onChange={e => setPhonePassword(e.target.value)}
                                            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '1rem', padding: '1rem 0', width: '100%' }}
                                            placeholder="••••••••"
                                        />
                                        <span style={{ color: 'var(--text-muted)' }}>🔒</span>
                                    </div>
                                </div>
                            )}
                            <button type="submit" style={{ marginTop: '1rem', padding: '1rem', borderRadius: '16px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px var(--primary-glow)' }}>
                                {isLoading ? 'Processing...' : (phoneStep === 'input' ? 'Send OTP' : 'Verify')}
                            </button>
                            <button type="button" onClick={() => setAuthMethod('email')} style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}>Back to Email</button>
                        </form>
                    ) : (
                        /* Google Form */
                        <form onSubmit={handleGoogleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Google Email</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '0 1rem', transition: 'all 0.3s' }}>
                                    <input
                                        type="email"
                                        value={googleEmail}
                                        onChange={e => setGoogleEmail(e.target.value)}
                                        style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '1rem', padding: '1rem 0', width: '100%' }}
                                        placeholder="name@gmail.com"
                                    />
                                    <span style={{ color: 'var(--text-muted)' }}>✉️</span>
                                </div>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>Google Password</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '0 1rem', transition: 'all 0.3s' }}>
                                    <input
                                        type="password"
                                        value={googlePassword}
                                        onChange={e => setGooglePassword(e.target.value)}
                                        style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '1rem', padding: '1rem 0', width: '100%' }}
                                        placeholder="••••••••"
                                    />
                                    <span style={{ color: 'var(--text-muted)' }}>🔒</span>
                                </div>
                            </div>
                            <button type="submit" style={{ marginTop: '1rem', padding: '1rem', borderRadius: '16px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px var(--primary-glow)' }}>
                                {isLoading ? 'Processing...' : 'Proceed to Google Login'}
                            </button>
                            <button type="button" onClick={() => setAuthMethod('email')} style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}>Back to Email</button>
                        </form>
                    )}

                    <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Don't have an account? <Link to="/register" style={{ fontWeight: '600', color: 'var(--accent)', textDecoration: 'none' }}>Sign Up</Link>
                    </div>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button
                            onClick={handleGoogleLogin}
                            className="glass-btn-full"
                            style={{
                                width: '100%',
                                padding: '0.9rem',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-card)',
                                color: 'var(--text-main)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.8rem',
                                fontSize: '1rem',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        <button
                            onClick={() => setAuthMethod('phone')}
                            className="glass-btn-full"
                            style={{
                                width: '100%',
                                padding: '0.9rem',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-card)',
                                color: 'var(--text-main)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.8rem',
                                fontSize: '1rem',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                                <line x1="12" y1="18" x2="12.01" y2="18"></line>
                            </svg>
                            Login with Phone
                        </button>
                    </div>
                </div>

                {/* RIGHT: 3D ILLUSTRATION */}
                <div
                    className="auth-image"
                    style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.98))', // Darker background for contrast
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        perspective: '1500px',
                        borderLeft: '1px solid var(--border-color)',
                        overflow: 'hidden'
                    }}
                >
                    {/* CSS Animations */}
                    <style>{`
                        @keyframes spin-rays {
                            from { transform: translate(-50%, -50%) rotate(0deg); }
                            to { transform: translate(-50%, -50%) rotate(360deg); }
                        }
                        @keyframes pulse-light {
                            0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
                            50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
                        }
                        @keyframes fall {
                            0% { transform: translateY(-20px) scaleY(1); opacity: 0; }
                            10% { opacity: 0.8; }
                            100% { transform: translateY(100vh) scaleY(1.5); opacity: 0; }
                        }
                        @keyframes leaf-fall {
                            0% { transform: translate(0, -20px) rotate(0deg); opacity: 0; }
                            10% { opacity: 1; }
                            100% { transform: translate(var(--sway), 100vh) rotate(360deg); opacity: 0; }
                        }
                    `}</style>

                    {/* Light Rays (Prakash beams) */}
                    <div style={{
                        position: 'absolute',
                        top: '50%', left: '50%',
                        width: '200%', height: '200%',
                        background: 'conic-gradient(from 0deg, transparent 0deg, rgba(99, 102, 241, 0.3) 20deg, transparent 40deg, rgba(236, 72, 153, 0.3) 60deg, transparent 80deg, rgba(99, 102, 241, 0.3) 100deg, transparent 120deg)',
                        animation: 'spin-rays 20s linear infinite',
                        zIndex: 0,
                        pointerEvents: 'none',
                        filter: 'blur(30px)'
                    }}></div>

                    {/* Central Glowing Core */}
                    <div style={{
                        position: 'absolute',
                        top: '50%', left: '50%',
                        width: '600px', height: '600px',
                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(99, 102, 241, 0.2) 40%, transparent 70%)',
                        animation: 'pulse-light 4s ease-in-out infinite',
                        zIndex: 0,
                        pointerEvents: 'none'
                    }}></div>

                    {/* Digital Water/Rain Effect */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2, overflow: 'hidden' }}>
                        {[...Array(30)].map((_, i) => (
                            <div
                                key={`rain-${i}`}
                                style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    left: `${Math.random() * 100}%`,
                                    width: '2px',
                                    height: `${Math.random() * 20 + 10}px`,
                                    background: 'linear-gradient(to bottom, transparent, rgba(64, 224, 208, 0.6))',
                                    opacity: 0,
                                    animation: `fall ${Math.random() * 2 + 1}s linear infinite`,
                                    animationDelay: `${Math.random() * 5}s`
                                }}
                            ></div>
                        ))}
                    </div>

                    {/* Falling Leaves Effect (Panda) */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3, overflow: 'hidden' }}>
                        {[...Array(15)].map((_, i) => (
                            <div
                                key={`leaf-${i}`}
                                style={{
                                    position: 'absolute',
                                    top: '-30px',
                                    left: `${Math.random() * 100}%`,
                                    fontSize: `${Math.random() * 10 + 12}px`,
                                    color: Math.random() > 0.5 ? 'rgba(74, 222, 128, 0.9)' : 'rgba(167, 139, 250, 0.9)',
                                    opacity: 0,
                                    filter: 'blur(0.5px)',
                                    textShadow: '0 0 5px rgba(255,255,255,0.2)',
                                    animation: `leaf-fall ${Math.random() * 5 + 8}s linear infinite`,
                                    animationDelay: `${Math.random() * 10}s`,
                                    '--sway': `${(Math.random() - 0.5) * 150}px`
                                }}
                            >
                                {Math.random() > 0.5 ? '🍃' : '🍂'}
                            </div>
                        ))}
                    </div>

                    {/* 3D Asset Container */}
                    <div
                        ref={imageRef}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{
                            width: '100%',
                            height: '100%', // Full Height
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.1s ease-out',
                            zIndex: 1,
                            ...tiltStyle
                        }}
                    >
                        <img
                            src="/assets/signin_3d_tree.png"
                            alt="Tree of Knowledge"
                            style={{
                                width: '100%',
                                height: '100%', // Force Full Height
                                objectFit: 'cover', // Cover the area "tree-like"
                                pointerEvents: 'none',
                                filter: 'drop-shadow(0 0 50px rgba(99, 102, 241, 0.5))' // Glow behind the tree image itself
                            }}
                        />
                    </div>
                </div>

            </div>

            {/* Scoped Styles for Responsiveness */}
            <style>{`
                .glass-btn:hover { background: var(--bg-card-hover) !important; transform: translateY(-2px); }
                
                @media (max-width: 900px) {
                    .auth-card {
                        flex-direction: column !important;
                        margin: 0 !important;
                        height: auto !important;
                        min-height: auto !important;
                        border-radius: 0 !important;
                    }
                    .auth-image {
                        display: none !important; 
                    }
                    .auth-form {
                        padding: 2rem 1.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default SignIn;
