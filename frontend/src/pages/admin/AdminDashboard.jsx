import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import RevenueChart from '../../components/RevenueChart';

const AdminDashboard = () => {
    const { users, courses, activities } = useData();
    const navigate = useNavigate();

    // 1. Calculate Total Revenue and Sort Recent Users
    const recentUsers = [...users].sort((a, b) => new Date(b.joinDate || Date.now()) - new Date(a.joinDate || Date.now())).slice(0, 5);

    // ... rest of revenue calc ...
    const totalRevenue = users.reduce((acc, user) => {
        if (!user.enrolledCourses) return acc;
        const userTotal = user.enrolledCourses.reduce((sum, enrollment) => {
            const priceVal = enrollment.course ? enrollment.course.price : enrollment.price;
            if (!priceVal) return sum;
            const priceNum = typeof priceVal === 'string' ? parseInt(priceVal.replace(/[^0-9]/g, '') || 0) : priceVal;
            return sum + priceNum;
        }, 0);
        return acc + userTotal;
    }, 0);

    // ... trend data and stats ...
    const generateTrendData = (total) => {
        if (total === 0) return [0, 0, 0, 0, 0, 0, 0];
        const base = total / 10;
        return Array.from({ length: 7 }, () => Math.floor(base * (0.8 + Math.random() * 0.4)));
    };
    const chartData = generateTrendData(totalRevenue);

    // ... handleDownloadReport ...
    const handleDownloadReport = () => {
        const headers = ['Student Name', 'Email', 'Course Title', 'Price', 'Transaction Date'];
        const rows = [];
        users.forEach(user => {
            if (user.enrolledCourses && user.enrolledCourses.length > 0) {
                user.enrolledCourses.forEach(enrollment => {
                    const priceVal = enrollment.course ? enrollment.course.price : enrollment.price;
                    rows.push([
                        `"${user.name}"`,
                        `"${user.email}"`,
                        `"${enrollment.course ? enrollment.course.title : 'Deleted Course'}"`,
                        `"${priceVal || 'N/A'}"`,
                        `"${new Date().toLocaleDateString()}"`
                    ]);
                });
            }
        });

        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `revenue_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const stats = [
        { label: 'Total Students', value: users.filter(u => u.role === 'Student').length, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>, color: 'from-blue-500 to-blue-600', trend: '+12%', bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' },
        { label: 'Total Courses', value: courses.length, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>, color: 'from-purple-500 to-purple-600', trend: '+5%', bg: 'rgba(168, 85, 247, 0.1)', text: '#a855f7' },
        { label: 'Active Mentors', value: users.filter(u => u.role === 'Mentor').length, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>, color: 'from-amber-500 to-amber-600', trend: '+2%', bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' },
        { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>, color: 'from-emerald-500 to-emerald-600', trend: '+18%', bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' }
    ];

    const StatCard = ({ stat, index }) => (
        <div
            className="glass-panel card-hover"
            style={{
                padding: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
                animation: `slideUp 0.5s ease-out forwards ${index * 0.1}s`,
                opacity: 0,
                transform: 'translateY(20px)'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ padding: '0.8rem', borderRadius: '12px', background: stat.bg, color: stat.text }}>
                    {stat.icon}
                </div>
                <div style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', background: 'var(--bg-glass)', fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--border-color)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                    {stat.trend}
                </div>
            </div>
            <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{stat.label}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-main)' }}>{stat.value}</div>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem', paddingTop: '1rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Dashboard Overview</h1>
                <p style={{ color: 'var(--text-muted)' }}>Welcome back, Admin! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {stats.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)}
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <RevenueChart data={chartData} onDownload={handleDownloadReport} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '3rem' }}>
                {/* Recent Users Table */}
                <div className="glass-panel animate-slide-up" style={{ padding: '0', overflow: 'hidden', animationDelay: '0.4s' }}>
                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Recent Registrations</h3>
                        <button
                            onClick={() => navigate('/admin/users')}
                            style={{ fontSize: '0.85rem', color: 'var(--primary)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                            View All <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-glass)' }}>
                                    <th style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>USER</th>
                                    <th style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>ROLE</th>
                                    <th style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>STATUS</th>
                                    <th style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500', textAlign: 'right' }}>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map((user, index) => {
                                    // Gradient generation based on name length/char code to be consistent but varied
                                    const gradients = [
                                        'linear-gradient(135deg, #FF6B6B 0%, #EE5D5D 100%)',
                                        'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
                                        'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
                                        'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
                                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    ];
                                    const gradient = gradients[user.name.length % gradients.length];

                                    // Mock relative time for "Number One" feel (in real app, use date-fns)
                                    const times = ['2 mins ago', '15 mins ago', '1 hour ago', '3 hours ago', '1 day ago'];
                                    const timeAgo = times[index] || 'Recently';

                                    return (
                                        <tr
                                            key={user.id}
                                            style={{
                                                borderBottom: '1px solid var(--border-color)',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                cursor: 'pointer'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = 'var(--bg-glass)';
                                                e.currentTarget.style.transform = 'translateX(5px)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.transform = 'translateX(0)';
                                            }}
                                            onClick={() => navigate('/admin/users')}
                                        >
                                            <td style={{ padding: '1rem 2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{
                                                        width: '42px', height: '42px', borderRadius: '12px',
                                                        background: gradient,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontWeight: '700', fontSize: '1.2rem', color: 'white',
                                                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                                    }}>
                                                        {user.image ? (
                                                            <img src={user.image} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                                                        ) : (
                                                            user.name.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{user.name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem 2rem' }}>
                                                <span style={{
                                                    padding: '0.4rem 1rem',
                                                    borderRadius: '8px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    letterSpacing: '0.02em',
                                                    background: user.role === 'Admin' ? 'rgba(239, 68, 68, 0.15)' : user.role === 'Mentor' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                                                    color: user.role === 'Admin' ? '#ef4444' : user.role === 'Mentor' ? '#f59e0b' : '#3b82f6',
                                                }}>
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem 2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                    <div style={{ position: 'relative', width: '8px', height: '8px' }}>
                                                        <div className="animate-ping" style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: '#10b981', opacity: 0.7 }}></div>
                                                        <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: '#10b981' }}></div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)' }}>{user.status}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{timeAgo}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem 2rem', textAlign: 'right' }}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); navigate('/admin/users'); }}
                                                    className="btn-icon"
                                                    style={{
                                                        width: '36px', height: '36px', borderRadius: '50%',
                                                        background: 'var(--bg-glass)', color: 'var(--text-muted)', border: '1px solid var(--border-color)',
                                                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--text-main)'; e.currentTarget.style.color = 'var(--bg-dark)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                                                    onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-glass)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'scale(1)'; }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="glass-panel animate-slide-up" style={{ padding: '0', overflow: 'hidden', animationDelay: '0.5s', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Recent Activity</h3>
                    </div>
                    <div style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: '400px' }}>
                        <div style={{ position: 'relative', paddingLeft: '1rem' }}>
                            {/* Vertical Line */}
                            <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border-color)' }}></div>

                            {activities.slice(0, 6).map((activity, idx) => (
                                <div key={activity.id} style={{ position: 'relative', paddingLeft: '2rem', marginBottom: '2rem' }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: '0',
                                        top: '0',
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        background: 'var(--bg-card)',
                                        border: `2px solid ${activity.action.includes('Delete') ? '#ef4444' : 'var(--primary)'}`,
                                        zIndex: 1
                                    }}></div>

                                    <div style={{ marginBottom: '0.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <span style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-main)' }}>{activity.action}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activity.time}</span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                                        {activity.details}
                                    </p>
                                </div>
                            ))}
                            {activities.length === 0 && <p style={{ color: 'var(--text-muted)', paddingLeft: '1rem' }}>No recent activity to show.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
