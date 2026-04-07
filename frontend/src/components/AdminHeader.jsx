import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import { useData } from '../context/DataContext';
import AnimatedModal from './AnimatedModal';
import ThemeToggle from './ThemeToggle';

const AdminHeader = () => {
    const { user } = useStudent();
    const { users, courses } = useData();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const searchRef = useRef(null);

    const [showNotifications, setShowNotifications] = useState(false);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const notificationsRef = useRef(null);

    // Search Logic
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }

        const lowerTerm = searchTerm.toLowerCase();

        // Filter Users
        const matchedUsers = users.filter(u =>
            u.name.toLowerCase().includes(lowerTerm) ||
            u.email.toLowerCase().includes(lowerTerm)
        ).map(u => ({ ...u, type: 'User', subtext: u.role }));

        // Filter Courses
        const matchedCourses = courses.filter(c =>
            c.title.toLowerCase().includes(lowerTerm)
        ).map(c => ({ ...c, type: 'Course', subtext: c.category }));

        setSearchResults([...matchedUsers.slice(0, 3), ...matchedCourses.slice(0, 3)]); // Limit results
    }, [searchTerm, users, courses]);

    const handleResultClick = (result) => {
        if (result.type === 'User') {
            navigate('/admin/users'); // Ideally highlight the user, but for now simple nav
        } else {
            navigate('/admin/courses');
        }
        setSearchTerm('');
        setShowSearch(false);
    };

    // Click outside to close search
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    // Notification Logic
    const [notifications, setNotifications] = useState([
        { id: 1, text: "New student registration: John Doe", time: "2 min ago", unread: true },
        { id: 2, text: "Course 'React Mastery' pending approval", time: "1 hour ago", unread: true },
        { id: 3, text: "Server maintenance scheduled for midnight", time: "5 hours ago", unread: false },
        { id: 4, text: "Weekly revenue report is ready", time: "1 day ago", unread: false },
    ]);

    // Mock Data for "All Activity"
    const allActivities = [
        { id: 1, action: "New User Registered", detail: "John Doe signed up", time: "2 mins ago", icon: "👤", color: "#60a5fa" },
        { id: 2, action: "Course Created", detail: "React Mastery by Sarah", time: "1 hour ago", icon: "📚", color: "#34d399" },
        { id: 3, action: "Payment Received", detail: "$49.99 from Mike", time: "3 hours ago", icon: "💰", color: "#fbbf24" },
        { id: 4, action: "System Alert", detail: "High CPU usage detected", time: "5 hours ago", icon: "⚠️", color: "#f87171" },
        { id: 5, action: "Review Posted", detail: "5 stars on 'Web Dev Bootcamp'", time: "1 day ago", icon: "⭐", color: "#a78bfa" },
        { id: 6, action: "User Deleted", detail: "Spam account removed", time: "1 day ago", icon: "🗑️", color: "#9ca3af" },
        { id: 7, action: "Course Updated", detail: "Advanced CSS - Module 4", time: "2 days ago", icon: "✏️", color: "#60a5fa" },
        { id: 8, action: "Login Attempt", detail: "Failed login from IP 192.168...", time: "2 days ago", icon: "🔒", color: "#f87171" }
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    const toggleNotifications = () => setShowNotifications(!showNotifications);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    const handleViewAllActivity = () => {
        setShowNotifications(false);
        setShowActivityModal(true);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem 3rem',
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--border-color)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                {/* Search Bar */}
                <div style={{ position: 'relative', width: '300px' }} ref={searchRef}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search users, courses..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setShowSearch(true); }}
                        onFocus={() => setShowSearch(true)}
                        style={{
                            width: '100%',
                            padding: '0.6rem 1rem 0.6rem 2.5rem',
                            borderRadius: '20px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                        }}
                    />

                    {/* Search Results Dropdown */}
                    {showSearch && searchTerm && (
                        <div className="glass-panel animate-slide-up" style={{
                            position: 'absolute',
                            top: 'calc(100% + 10px)',
                            left: 0,
                            width: '100%',
                            padding: '0.5rem',
                            zIndex: 1000,
                            boxShadow: 'var(--shadow)',
                            maxHeight: '300px',
                            overflowY: 'auto'
                        }}>
                            {searchResults.length > 0 ? searchResults.map((result, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleResultClick(result)}
                                    style={{
                                        padding: '0.8rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.8rem',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        transition: 'background 0.2s',
                                        borderBottom: idx === searchResults.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{
                                        fontSize: '1.2rem',
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: result.type === 'User' ? 'rgba(96, 165, 250, 0.2)' : 'rgba(52, 211, 153, 0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {result.type === 'User' ? '👤' : '📚'}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: '500' }}>{result.name || result.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{result.type} • {result.subtext}</div>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    No results found.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <ThemeToggle />
                    {/* Notifications */}
                    <div style={{ position: 'relative' }} ref={notificationsRef}>
                        <button
                            onClick={toggleNotifications}
                            style={{ position: 'relative', background: 'transparent', border: 'none', color: showNotifications ? 'white' : 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', transition: 'color 0.2s' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                            {unreadCount > 0 && (
                                <span className="animate-pulse-slight" style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', border: '2px solid #0f172a' }}></span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="glass-panel animate-slide-up" style={{
                                position: 'absolute',
                                top: 'calc(100% + 15px)',
                                right: '-10px',
                                width: '340px',
                                padding: '0',
                                zIndex: 1000,
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow)',
                                background: 'var(--bg-card)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '16px'
                            }}>
                                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)' }}>Notifications</h3>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>{unreadCount} New</span>
                                </div>
                                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                    {notifications.length > 0 ? notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            onClick={() => markAsRead(notification.id)}
                                            style={{
                                                padding: '1rem',
                                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                background: notification.unread ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                gap: '0.8rem',
                                                alignItems: 'flex-start'
                                            }}
                                            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                            onMouseOut={e => e.currentTarget.style.background = notification.unread ? 'rgba(59, 130, 246, 0.08)' : 'transparent'}
                                        >
                                            <div style={{ marginTop: '4px', width: '8px', height: '8px', borderRadius: '50%', background: notification.unread ? 'var(--primary)' : 'transparent' }}></div>
                                            <div>
                                                <div style={{ fontSize: '0.9rem', marginBottom: '0.2rem', color: notification.unread ? 'var(--text-main)' : 'var(--text-muted)', lineHeight: '1.4' }}>
                                                    {notification.text}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    {notification.time}
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            No new notifications
                                        </div>
                                    )}
                                </div>
                                <div style={{ padding: '0.8rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                                    <button
                                        onClick={handleViewAllActivity}
                                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500', transition: 'opacity 0.2s' }}
                                        onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                                        onMouseOut={e => e.currentTarget.style.opacity = '1'}
                                    >
                                        View All Activity
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border-color)' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>{user?.name || 'Admin User'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrator</div>
                        </div>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', overflow: 'hidden' }}>
                            <span style={{ color: 'white', fontSize: '1.2rem' }}>A</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* All Activities Modal */}
            <AnimatedModal
                isOpen={showActivityModal}
                onClose={() => setShowActivityModal(false)}
                title="System Activity Log"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {allActivities.map((activity, index) => (
                        <div
                            key={activity.id}
                            className="animate-slide-up"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                animationDelay: `${index * 0.05}s`,
                                animationFillMode: 'both'
                            }}
                        >
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: `${activity.color}20`, color: activity.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.2rem'
                            }}>
                                {activity.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600', color: 'white', marginBottom: '0.2rem' }}>{activity.action}</div>
                                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{activity.detail}</div>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                {activity.time}
                            </div>
                        </div>
                    ))}
                </div>
            </AnimatedModal>
        </>
    );
};

export default AdminHeader;
