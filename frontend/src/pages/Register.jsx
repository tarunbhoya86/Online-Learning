import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const { logActivity } = useData();

    // --- State ---
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        image: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // --- 3D Tilt Logic (Same as SignIn) ---
    const imageRef = useRef(null);
    const [tiltStyle, setTiltStyle] = useState({});

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
    const validate = () => {
        let tempErrors = {};
        if (!formData.name) tempErrors.name = "Name is required";
        if (!formData.email) tempErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email is invalid";

        if (!formData.password) tempErrors.password = "Password is required";
        else if (formData.password.length < 6) tempErrors.password = "Min 6 characters";

        if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = "Pwd mismatch";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setIsLoading(true);
            try {
                const res = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        image: formData.image,
                        role: 'Student'
                    })
                });

                const data = await res.json();

                if (!res.ok) {
                    setErrors({ ...errors, email: data.message || 'Registration failed' });
                    setIsLoading(false);
                    return;
                }

                logActivity('User Registration', `New user registered: ${formData.name}`);
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });

                // Success Feedback/Redirect
                setTimeout(() => {
                    navigate('/signin');
                }, 1000);

            } catch (err) {
                setErrors({ ...errors, email: 'Network error. Please try again.' });
            } finally {
                setIsLoading(false);
            }
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
            overflowY: 'auto',
            padding: '1rem'
        }}>
            {/* Ambient Light Background */}
            {/* <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '50vw', height: '50vw', background: 'var(--primary)', opacity: 0.1, filter: 'blur(120px)', borderRadius: '50%', zIndex: 0 }}></div>
            <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '50vw', height: '50vw', background: 'var(--secondary)', opacity: 0.1, filter: 'blur(120px)', borderRadius: '50%', zIndex: 0 }}></div> */}

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
                <div className="auth-form" style={{ flex: 1.2, padding: '4rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, var(--primary), var(--secondary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800' }}>LearnX</h1>
                            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Get Started</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>Create your account to join the community</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <label htmlFor="profile-upload" style={{
                                cursor: 'pointer',
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                background: 'var(--bg-card)',
                                border: '2px dashed var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-muted)',
                                transition: 'all 0.2s',
                                overflow: 'hidden',
                                flexShrink: 0
                            }}
                                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'scale(1)'; }}
                                title="Upload Profile Photo"
                            >
                                {formData.image ? (
                                    <img src={formData.image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                                        <circle cx="12" cy="13" r="3"></circle>
                                    </svg>
                                )}
                            </label>
                            <label htmlFor="profile-upload" className="upload-btn-3d" style={{ cursor: 'pointer', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '600', letterSpacing: '0.5px' }}>
                                Upload Profile
                            </label>
                            <input id="profile-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }} autoComplete="off">

                        {/* Name */}
                        <div style={{ position: 'relative' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '500' }}>Full Name</label>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', borderRadius: '12px', border: errors.name ? '1px solid #ef4444' : '1px solid var(--border-color)', padding: '0 1rem', transition: 'all 0.3s' }}>
                                <input
                                    type="text" name="name" value={formData.name} onChange={handleChange}
                                    autoComplete="off"
                                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '1rem', padding: '0.8rem 0', width: '100%' }} placeholder="John Doe"
                                />
                                <span style={{ color: 'var(--text-muted)' }}>👤</span>
                            </div>
                            {errors.name && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.name}</span>}
                        </div>

                        {/* Email */}
                        <div style={{ position: 'relative' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '500' }}>Email Address</label>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', borderRadius: '12px', border: errors.email ? '1px solid #ef4444' : '1px solid var(--border-color)', padding: '0 1rem', transition: 'all 0.3s' }}>
                                <input
                                    type="email" name="email" value={formData.email} onChange={handleChange}
                                    autoComplete="off"
                                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '1rem', padding: '0.8rem 0', width: '100%' }} placeholder="name@example.com"
                                />
                                <span style={{ color: 'var(--text-muted)' }}>✉️</span>
                            </div>
                            {errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.email}</span>}
                        </div>

                        {/* Password Grid - Auto stacks on mobile due to natural flex/grid behavior or add media query */}
                        <div className="password-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '500' }}>Password</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', borderRadius: '12px', border: errors.password ? '1px solid #ef4444' : '1px solid var(--border-color)', padding: '0 1rem' }}>
                                    <input
                                        type="password" name="password" value={formData.password} onChange={handleChange}
                                        autoComplete="new-password"
                                        style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '1rem', padding: '0.8rem 0', width: '100%' }} placeholder="••••••"
                                    />
                                </div>
                                {errors.password && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.password}</span>}
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '500' }}>Confirm</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', borderRadius: '12px', border: errors.confirmPassword ? '1px solid #ef4444' : '1px solid var(--border-color)', padding: '0 1rem' }}>
                                    <input
                                        type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                        autoComplete="new-password"
                                        style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '1rem', padding: '0.8rem 0', width: '100%' }} placeholder="••••••"
                                    />
                                </div>

                                {errors.confirmPassword && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.confirmPassword}</span>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                marginTop: '1.5rem',
                                padding: '1rem',
                                borderRadius: '16px',
                                border: 'none',
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                color: 'white',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px var(--primary-glow)',
                                transition: 'transform 0.2s',
                                opacity: isLoading ? 0.7 : 1
                            }}
                            onMouseOver={e => !isLoading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                            onMouseOut={e => !isLoading && (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            {isLoading ? 'Creating Account...' : 'Sign Up Now'}
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Already have an account? <Link to="/signin" style={{ fontWeight: '600', color: 'var(--accent)', textDecoration: 'none' }}>Sign In</Link>
                    </div>
                </div>

                {/* RIGHT: 3D ILLUSTRATION */}
                <div
                    className="auth-image"
                    style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.98))',
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
                            height: '100%',
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
                                height: '100%',
                                objectFit: 'cover',
                                pointerEvents: 'none',
                                filter: 'drop-shadow(0 0 50px rgba(99, 102, 241, 0.5))'
                            }}
                        />
                    </div>
                </div>

            </div>
            {/* Scoped Styles for Responsiveness */}
            <style>{`
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
                    .password-grid {
                        grid-template-columns: 1fr !important; /* Stack passwords on mobile */
                    }
                }
            `}</style>
        </div>
    );
};

export default Register;
