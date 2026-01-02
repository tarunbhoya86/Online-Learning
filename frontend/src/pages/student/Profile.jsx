import React, { useState } from 'react';
import { useStudent } from '../../context/StudentContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ChangePasswordForm from '../../components/ChangePasswordForm';

const Profile = () => {
    const { user, login, enrolledCourses, cancelCourse } = useStudent();
    const navigate = useNavigate();
    const location = useLocation();
    const message = location.state?.message;

    const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'enrollments', 'security'
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    // Initialize state with user data
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || '',
        country: user?.country || '',
        zipCode: user?.zipCode || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCancel = async (course) => {
        const priceString = course.price.toString().replace(/[^0-9.]/g, '');
        const price = parseFloat(priceString);
        const refundAmount = price / 2;

        if (window.confirm(`Are you sure you want to cancel '${course.title}'?\n\nYou will receive a 50% refund of Rs. ${refundAmount}.\n\nThis action cannot be undone.`)) {
            const success = await cancelCourse(course.id || course._id);
            if (success) {
                alert(`Course cancelled. Refund of Rs. ${refundAmount} initiated.`);
            } else {
                alert('Failed to cancel course. Please try again.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFeedback(null);

        if (!user || (!user.id && !user._id)) {
            setFeedback({ type: 'error', text: 'User session invalid. Please logout and login again.' });
            setIsLoading(false);
            return;
        }

        // Check for legacy demo ID
        const userId = user.id || user._id;
        if (userId === 'google_demo_123') {
            setFeedback({ type: 'error', text: 'Session expired (Demo). Please logout and sign in with Google again.' });
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/auth/update-profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    ...formData
                })
            });

            // Handle non-JSON responses (e.g. 404 HTML or network crash)
            const contentType = res.headers.get("content-type");
            let data;
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await res.json();
            } else {
                const text = await res.text();
                throw new Error(text || 'Server returned non-JSON response');
            }

            if (!res.ok) {
                setFeedback({ type: 'error', text: data.error || data.message || 'Update failed' });
            } else {
                setFeedback({ type: 'success', text: 'Profile updated successfully!' });
                const userWithId = { ...data.user, id: data.user._id };
                login(userWithId);
                if (message) setTimeout(() => navigate(-1), 1500);
            }
        } catch (err) {
            console.error("Update Profile Error:", err);
            setFeedback({ type: 'error', text: `Update failed: ${err.message || 'Network error'}` });
        } finally {
            setIsLoading(false);
        }
    };

    const SidebarItem = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            style={{
                width: '100%',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                background: activeTab === id ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.1), transparent)' : 'transparent',
                borderLeft: activeTab === id ? '3px solid var(--primary)' : '3px solid transparent',
                color: activeTab === id ? 'var(--primary)' : 'var(--text-muted)',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                fontWeight: activeTab === id ? '600' : '500'
            }}
        >
            {icon}
            {label}
        </button>
    );

    // Image handling
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result }); // Add image to formData
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container">
            {/* Header Stats */}
            <div className="animate-fade-in" style={{ marginBottom: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Status</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Active Student</div>
                    </div>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', borderRadius: '50%', background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Enrolled Courses</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{enrolledCourses.length}</div>
                    </div>
                </div>
            </div>

            <div className="glass-panel animate-slide-up" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', minHeight: '600px', overflow: 'hidden' }}>
                {/* Sidebar */}
                <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ padding: '2rem', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 1rem' }}>
                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', overflow: 'hidden' }}>
                                {formData.image || user?.image ? (
                                    <img src={formData.image || user.image} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    user?.name?.charAt(0).toUpperCase()
                                )}
                            </div>
                            <label htmlFor="profile-upload" style={{
                                position: 'absolute', bottom: '0', right: '0',
                                background: 'var(--primary)', color: 'white',
                                width: '28px', height: '28px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', border: '2px solid var(--bg-card)',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                            </label>
                            <input id="profile-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        </div>
                        <h3 style={{ fontSize: '1.1rem' }}>{user?.name}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                    </div>
                    <div style={{ padding: '1rem 0' }}>
                        <SidebarItem
                            id="personal"
                            label="Personal Details"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
                        />
                        <SidebarItem
                            id="enrollments"
                            label="My Enrollments"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>}
                        />
                        <SidebarItem
                            id="security"
                            label="Security"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>}
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ padding: '2rem', overflowY: 'auto' }}>
                    {message && (
                        <div className="animate-fade-in" style={{ padding: '1rem', marginBottom: '2rem', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.5)', color: '#facc15', borderRadius: '8px' }}>
                            ⚠️ {message}
                        </div>
                    )}

                    {activeTab === 'personal' && (
                        <div className="animate-fade-in">
                            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                Personal Information
                                <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.1)' }}></div>
                            </h2>
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }} />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Required for checkout" className="form-input" style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }} />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Address</label>
                                    <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Complete Address" required style={{ width: '100%', minHeight: '80px', padding: '0.8rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', resize: 'vertical' }} />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>City</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }} />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>State/Country</label>
                                    <input type="text" name="country" value={formData.country} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }} />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Zip Code</label>
                                    <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }} />
                                </div>
                                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                                    {feedback && (
                                        <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '8px', background: feedback.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: feedback.type === 'error' ? '#ef4444' : '#4ade80', border: `1px solid ${feedback.type === 'error' ? '#ef4444' : '#4ade80'}` }}>
                                            {feedback.type === 'error' ? '⚠️ ' : '✅ '} {feedback.text}
                                        </div>
                                    )}
                                    <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%', padding: '1rem', opacity: isLoading ? 0.7 : 1 }}>
                                        {isLoading ? 'Saving Changes...' : 'Save Profile'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'enrollments' && (
                        <div className="animate-fade-in">
                            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                My Enrollments
                                <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.1)' }}></div>
                                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>Total: {enrolledCourses.length}</span>
                            </h2>
                            {enrolledCourses.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    <p>You are not enrolled in any courses yet.</p>
                                    <button onClick={() => navigate('/courses')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Courses</button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {enrolledCourses.map((course, index) => (
                                        <div key={course.id || course._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', animation: `slideUp 0.3s ease forwards ${index * 0.1}s`, opacity: 0, transform: 'translateY(10px)' }}>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden' }}>
                                                    <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <div>
                                                    <h4 style={{ marginBottom: '0.3rem' }}>{course.title}</h4>
                                                    <span style={{ color: 'var(--accent)', fontSize: '0.9rem', background: 'rgba(20, 184, 166, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Paid: {course.price}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => handleCancel(course)} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                                                Cancel Course
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="animate-fade-in">
                            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                Security Settings
                                <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.1)' }}></div>
                            </h2>
                            <ChangePasswordForm />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
