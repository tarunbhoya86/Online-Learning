import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useStudent();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        localStorage.removeItem('rememberedEmail');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            zIndex: 1000,
            padding: scrolled ? '0.5rem 0' : '1rem 0',
            transition: 'all 0.3s ease',
            background: scrolled ? 'var(--bg-glass)' : 'transparent',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            borderBottom: scrolled ? '1px solid var(--border-color)' : 'transparent',
            boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.1)' : 'none'
        }}>
            <div className="container">
                <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    {/* Logo */}
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {/* <div style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))' }}>🚀</div> */}
                        <h1 className="gradient-text" style={{ fontSize: '1.8rem', margin: 0, fontWeight: '800', letterSpacing: '-0.5px' }}>LearnX</h1>
                    </Link>

                    {/* Navigation Links */}
                    <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                        <NavLink to="/" active={isActive('/')}>Home</NavLink>
                        <NavLink to="/courses" active={isActive('/courses')}>Courses</NavLink>
                        <NavLink to="/mentors" active={isActive('/mentors')}>Mentors</NavLink>
                        <NavLink to="/about" active={isActive('/about')}>About</NavLink>

                        {user && user.role === 'Student' && (
                            <>
                                <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }}></div>
                                <NavLink to="/student/dashboard" active={isActive('/student/dashboard')} isSpecial>My Learning</NavLink>
                                <NavLink to="/student/profile" active={isActive('/student/profile')}>Profile</NavLink>
                            </>
                        )}
                        {user && user.role === 'admin' && (
                            <Link to="/admin" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Admin Panel</Link>
                        )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <ThemeToggle />

                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {/* User Avatar Fallback */}
                                <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                    {user.name ? user.name[0].toUpperCase() : 'U'}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="btn-glass"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/signin" className="btn-glass">Sign In</Link>
                                <Link to="/register" className="btn-primary-glow">Get Started</Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>

            <style>{`
                .nav-item {
                    text-decoration: none;
                    color: var(--text-muted);
                    font-weight: 500;
                    font-size: 0.95rem;
                    position: relative;
                    transition: color 0.3s;
                }
                .nav-item:hover { color: var(--text-main); }
                .nav-item.active { color: var(--text-main); font-weight: 600; }
                .nav-item.active::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: var(--primary);
                    border-radius: 2px;
                    box-shadow: 0 0 10px var(--primary);
                }

                .nav-special {
                    color: var(--primary);
                    font-weight: 600;
                }
                .nav-special:hover { color: var(--secondary); }

                .btn-glass {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-main);
                    border: 1px solid var(--border-color);
                    padding: 0.6rem 1.2rem;
                    border-radius: 50px;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 0.9rem;
                    transition: all 0.3s;
                    cursor: pointer;
                }
                .btn-glass:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-1px);
                    border-color: var(--text-muted);
                }

                .btn-primary-glow {
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    color: white;
                    padding: 0.6rem 1.5rem;
                    border-radius: 50px;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 0.9rem;
                    box-shadow: 0 4px 15px var(--primary-glow);
                    transition: all 0.3s;
                }
                .btn-primary-glow:hover {
                    box-shadow: 0 8px 25px var(--primary-glow);
                    transform: translateY(-2px);
                }
            `}</style>
        </header>
    );
};

// Helper Component for cleaner code
const NavLink = ({ to, children, active, isSpecial }) => (
    <Link
        to={to}
        className={`nav-item ${active ? 'active' : ''} ${isSpecial ? 'nav-special' : ''}`}
    >
        {children}
    </Link>
);

export default Navbar;
