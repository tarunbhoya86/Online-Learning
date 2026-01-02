import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useLocation } from 'react-router-dom';
import PageTransition from '../../components/PageTransition';
import AnimatedModal from '../../components/AnimatedModal';

const AdminUsers = ({ onlyMentors = false }) => {
    const { users, courses, addUser, updateUser, deleteUser } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const location = useLocation();

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: onlyMentors ? 'Mentor' : 'Student', status: 'Active', image: '', expertise: ''
    });

    // Handle Open User from Search
    useEffect(() => {
        if (location.state?.openUserId && users.length > 0) {
            const userToOpen = users.find(u => u.id === location.state.openUserId);
            if (userToOpen) {
                handleEdit(userToOpen);
                // Clear state to avoid reopening on simple re-renders (handled by dependency array, but robust navigation reset is complex, this is sufficent for now)
                window.history.replaceState({}, document.title);
            }
        }
    }, [location.state, users]);

    // Reset filters when mode changes (Student <-> Mentor)
    useEffect(() => {
        setSearchTerm('');
        setRoleFilter('All');
    }, [onlyMentors]);

    // Filter Logic
    const filteredUsers = users.filter(user => {
        if (onlyMentors && user.role !== 'Mentor') return false;
        if (!onlyMentors && user.role === 'Mentor' && roleFilter === 'Student') return false; // Show only students if filter active
        if (!onlyMentors && user.role === 'Student' && roleFilter === 'Mentor') return false;
        // For general users page, we might want to show all or filter. 
        // If !onlyMentors, we show both unless filtered.
        // Actually, let's keep it simple:
        // If onlyMentors=true, show ONLY Mentors.
        // If onlyMentors=false, show Everyone (Students, Mentors, Admins).

        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    const handleEdit = (user) => {
        setIsEditing(true);
        setEditId(user.id);
        setFormData({
            name: user.name,
            email: user.email,
            password: '', // Don't show password
            role: user.role,
            status: user.status,
            image: user.image || '',
            expertise: user.expertise ? user.expertise.join(', ') : ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you certain you want to delete this user? This action cannot be undone.')) {
            await deleteUser(id);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSubmit = {
            ...formData,
            expertise: formData.role === 'Mentor' && formData.expertise ? formData.expertise.split(',').map(s => s.trim()) : []
        };

        if (isEditing) {
            await updateUser(editId, dataToSubmit);
        } else {
            await addUser(dataToSubmit);
        }
        setShowModal(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', password: '', role: onlyMentors ? 'Mentor' : 'Student', status: 'Active', image: '', expertise: '' });
        setIsEditing(false);
        setEditId(null);
    };

    const exportToCSV = () => {
        // Simple mock export for now, or reuse logic if needed. 
        // For visual demo, we'll just alert or console log.
        const csvContent = filteredUsers.map(u => `${u.id},${u.name},${u.email},${u.role}`).join('\n');
        const blob = new Blob([`ID,Name,Email,Role\n${csvContent}`], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_export_${new Date().toISOString()}.csv`;
        a.click();
    };

    return (
        <PageTransition>
            <div style={{ paddingBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                            {onlyMentors ? 'Manage Mentors' : 'User Management'}
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {onlyMentors ? ' oversee and update mentor profiles.' : 'View, edit, and manage all system users.'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={exportToCSV}
                            className="btn"
                            style={{
                                background: 'var(--bg-glass)',
                                border: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.6rem 1.2rem',
                                color: 'var(--text-main)',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.background = 'var(--primary)';
                                e.currentTarget.style.borderColor = 'var(--primary)';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.background = 'var(--bg-glass)';
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                e.currentTarget.style.color = 'var(--text-main)';
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Export CSV
                        </button>
                        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Add {onlyMentors ? 'Mentor' : 'User'}
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}
                        />
                    </div>
                    {!onlyMentors && (
                        <div style={{ position: 'relative' }}>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                style={{
                                    padding: '0.8rem 2.5rem 0.8rem 1.2rem',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    color: 'var(--text-main)',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    minWidth: '150px'
                                }}
                            >
                                <option value="All" style={{ color: 'var(--text-main)', background: 'var(--bg-card)' }}>All Roles</option>
                                <option value="Student" style={{ color: 'var(--text-main)', background: 'var(--bg-card)' }}>Student</option>
                                <option value="Mentor" style={{ color: 'var(--text-main)', background: 'var(--bg-card)' }}>Mentor</option>
                                <option value="Admin" style={{ color: 'var(--text-main)', background: 'var(--bg-card)' }}>Admin</option>
                            </select>
                            <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-glass)', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '1.2rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>USER INFO</th>
                                <th style={{ padding: '1.2rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>ROLE</th>
                                <th style={{ padding: '1.2rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>STATUS</th>
                                <th style={{ padding: '1.2rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>JOIN DATE</th>
                                <th style={{ padding: '1.2rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'right' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? filteredUsers.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className="animate-slide-up"
                                    style={{
                                        borderBottom: '1px solid var(--border-color)',
                                        transition: 'background 0.2s',
                                        animationDelay: `${index * 0.05}s`, // Staggered Animation
                                        animationFillMode: 'both'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-glass)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '1rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', overflow: 'hidden' }}>
                                                {user.image ? (
                                                    <img src={user.image} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    user.name.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '500', color: 'var(--text-main)' }}>{user.name}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 2rem' }}>
                                        <span style={{
                                            padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600',
                                            background: user.role === 'Admin' ? 'rgba(239, 68, 68, 0.15)' : user.role === 'Mentor' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                                            color: user.role === 'Admin' ? '#fb7185' : user.role === 'Mentor' ? '#fbbf24' : '#60a5fa',
                                            boxShadow: `0 0 10px ${user.role === 'Admin' ? 'rgba(239, 68, 68, 0.1)' : user.role === 'Mentor' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                                                <span className="animate-ping" style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: user.status === 'Active' ? '#4ade80' : '#f87171', opacity: 0.75 }}></span>
                                                <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', background: user.status === 'Active' ? '#4ade80' : '#f87171' }}></span>
                                            </span>
                                            <span style={{ fontSize: '0.9rem', color: user.status === 'Active' ? '#4ade80' : '#f87171' }}>{user.status}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        {new Date(user.joinDate).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem 2rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <button onClick={() => handleEdit(user)} style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--bg-glass)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }} onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-glass)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                            <button onClick={() => handleDelete(user.id)} style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No users found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Animated Modal */}
                <AnimatedModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={isEditing ? 'Edit User Profile' : 'Create New User'}
                >
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>

                        {/* Avatar Preview & Image Input */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <div style={{
                                width: '100px', height: '100px', borderRadius: '50%',
                                background: formData.image ? `url(${formData.image}) center/cover` : 'linear-gradient(135deg, #6366f1, #a855f7)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '2.5rem', fontWeight: 'bold', color: 'white',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                                border: '4px solid rgba(255,255,255,0.1)'
                            }}>
                                {!formData.image && formData.name.charAt(0)}
                            </div>
                            <div style={{ position: 'relative', width: '100%' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                <input
                                    type="text"
                                    placeholder="Profile Image URL"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    style={{
                                        width: '100%', padding: '0.9rem 1rem 0.9rem 3rem',
                                        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                                        borderRadius: '10px', color: 'var(--text-main)', outline: 'none', transition: 'all 0.2s',
                                        fontSize: '0.9rem'
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                                />
                            </div>
                        </div>

                        {/* Name Input */}
                        <div style={{ position: 'relative' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                style={{
                                    width: '100%', padding: '0.9rem 1rem 0.9rem 3rem',
                                    background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                                    borderRadius: '10px', color: 'var(--text-main)', outline: 'none', transition: 'all 0.2s',
                                    fontSize: '0.95rem'
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                            />
                        </div>

                        {/* Grid: Email & Role */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    style={{
                                        width: '100%', padding: '0.9rem 1rem 0.9rem 3rem',
                                        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                                        borderRadius: '10px', color: 'var(--text-main)', outline: 'none', transition: 'all 0.2s',
                                        fontSize: '0.95rem'
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                                />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    style={{
                                        width: '100%', padding: '0.9rem 0.5rem 0.9rem 2.5rem',
                                        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                                        borderRadius: '10px', color: 'var(--text-main)', outline: 'none', cursor: 'pointer', appearance: 'none',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    <option value="Student" style={{ color: 'var(--text-main)', background: 'var(--bg-card)' }}>Student</option>
                                    <option value="Mentor" style={{ color: 'var(--text-main)', background: 'var(--bg-card)' }}>Mentor</option>
                                    <option value="Admin" style={{ color: 'var(--text-main)', background: 'var(--bg-card)' }}>Admin</option>
                                </select>
                                <div style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>

                        {/* Password Input (Only for creating or if admin wants to force reset - kept simple for now) */}
                        {!isEditing && (
                            <div style={{ position: 'relative' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    style={{
                                        width: '100%', padding: '0.9rem 1rem 0.9rem 3rem',
                                        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                                        borderRadius: '10px', color: 'var(--text-main)', outline: 'none', transition: 'all 0.2s',
                                        fontSize: '0.95rem'
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                                />
                            </div>
                        )}

                        {/* Mentor Expertise */}
                        {formData.role === 'Mentor' && (
                            <div className="animate-slide-up" style={{ position: 'relative' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                <input
                                    type="text"
                                    placeholder="Expertise (comma separated)"
                                    value={formData.expertise}
                                    onChange={e => setFormData({ ...formData, expertise: e.target.value })}
                                    style={{
                                        width: '100%', padding: '0.9rem 1rem 0.9rem 3rem',
                                        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                                        borderRadius: '10px', color: 'var(--text-main)', outline: 'none', transition: 'all 0.2s',
                                        fontSize: '0.95rem'
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                                />
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="btn"
                                style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.8rem' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary animate-pulse-slight"
                                style={{ flex: 1, padding: '0.8rem', justifyContent: 'center' }}
                            >
                                {isEditing ? 'Save Changes' : 'Create User'}
                            </button>
                        </div>
                    </form>
                </AnimatedModal>
            </div>
        </PageTransition>
    );
};

export default AdminUsers;
