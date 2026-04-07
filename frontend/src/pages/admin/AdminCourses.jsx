import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import PageTransition from '../../components/PageTransition';
import AnimatedModal from '../../components/AnimatedModal';

const AdminCourses = () => {
    const { courses, addCourse, updateCourse, deleteCourse } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        title: '', category: 'Development', instructor: '', price: '', rating: '4.5', students: '0', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    });

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || course.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = ['Development', 'Data Science', 'Design', 'Marketing', 'Business', 'Lifestyle'];

    const handleEdit = (course) => {
        setIsEditing(true);
        setEditId(course.id);
        setFormData({ ...course });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            await deleteCourse(id);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await updateCourse(editId, formData);
        } else {
            await addCourse(formData);
        }
        setShowModal(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            title: '', category: 'Development', instructor: '', price: '', rating: '4.5', students: '0', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        });
        setIsEditing(false);
        setEditId(null);
    };

    const CourseCard = ({ course, index }) => (
        <div
            className="glass-panel card-hover animate-slide-up"
            style={{
                padding: '0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
            }}
        >
            <div style={{ position: 'relative', height: '160px' }}>
                <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>
                    {course.category}
                </div>
                <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.9rem', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
                    {course.price}
                </div>
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', lineHeight: '1.4' }}>{course.title}</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>By {course.instructor}</p>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#fbbf24' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            {course.rating}
                        </span>
                        <span>{course.students} students</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEdit(course)} style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }} className="hover:bg-blue-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button onClick={() => handleDelete(course.id)} style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }} className="hover:bg-red-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <PageTransition>
            <div style={{ paddingBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Course Management</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Create, edit, and manage your course catalog.</p>
                    </div>
                    <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Add New Course
                    </button>
                </div>

                {/* Filters */}
                <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input
                            type="text"
                            placeholder="Search courses or instructors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            style={{
                                padding: '0.8rem 2.5rem 0.8rem 1.2rem',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                color: 'var(--text-main)',
                                outline: 'none',
                                cursor: 'pointer',
                                appearance: 'none',
                                minWidth: '180px'
                            }}
                        >
                            <option value="All" style={{ color: 'var(--text-main)', background: 'var(--bg-card)' }}>All Categories</option>
                            {categories.map(cat => <option key={cat} value={cat} style={{ color: 'var(--text-main)', background: 'var(--bg-card)' }}>{cat}</option>)}
                        </select>
                        <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                </div>

                {/* Course Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {filteredCourses.map((course, index) => (
                        <CourseCard key={course.id} course={course} index={index} />
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        No courses found matching your criteria.
                    </div>
                )}

                {/* Animated Modal */}
                <AnimatedModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={isEditing ? 'Edit Course Details' : 'Launch New Course'}
                >
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>

                        {/* Course Cover Preview */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <div style={{
                                width: '100%', height: '180px', borderRadius: '12px',
                                background: formData.image ? `url(${formData.image}) center/cover` : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'relative', overflow: 'hidden',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                {!formData.image && (
                                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                        <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Course Cover Preview</div>
                                    </div>
                                )}
                            </div>

                            <div style={{ position: 'relative', width: '100%' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                <input
                                    type="text"
                                    placeholder="Cover Image URL"
                                    required
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
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
                        </div>

                        {/* Title */}
                        <div style={{ position: 'relative' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                            <input
                                type="text"
                                placeholder="Course Title"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                style={{
                                    width: '100%', padding: '0.9rem 1rem 0.9rem 3rem',
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '10px', color: 'white', outline: 'none',
                                    fontSize: '0.95rem'
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>

                        {/* Grid: Category & Price */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    style={{
                                        width: '100%', padding: '0.9rem 1rem 0.9rem 1rem',
                                        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                                        borderRadius: '10px', color: 'var(--text-main)', outline: 'none', cursor: 'pointer', appearance: 'none',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    {categories.map(cat => <option key={cat} value={cat} style={{ color: 'var(--text-main)', background: 'var(--bg-card)' }}>{cat}</option>)}
                                </select>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>₹</span>
                                <input
                                    type="text"
                                    placeholder="Price"
                                    required
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    style={{
                                        width: '100%', padding: '0.9rem 1rem 0.9rem 2.5rem',
                                        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                                        borderRadius: '10px', color: 'var(--text-main)', outline: 'none',
                                        fontSize: '0.95rem'
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                                />
                            </div>
                        </div>

                        {/* Instructor */}
                        <div style={{ position: 'relative' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            <input
                                type="text"
                                placeholder="Instructor Name"
                                required
                                value={formData.instructor}
                                onChange={e => setFormData({ ...formData, instructor: e.target.value })}
                                style={{
                                    width: '100%', padding: '0.9rem 1rem 0.9rem 3rem',
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '10px', color: 'white', outline: 'none',
                                    fontSize: '0.95rem'
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>

                        {/* Grid: Rating & Students */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                <input
                                    type="text"
                                    placeholder="Rating (0-5)"
                                    value={formData.rating}
                                    onChange={e => setFormData({ ...formData, rating: e.target.value })}
                                    style={{
                                        width: '100%', padding: '0.9rem 1rem 0.9rem 3rem',
                                        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                                        borderRadius: '10px', color: 'var(--text-main)', outline: 'none',
                                        fontSize: '0.95rem'
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                <input
                                    type="text"
                                    placeholder="Students"
                                    value={formData.students}
                                    onChange={e => setFormData({ ...formData, students: e.target.value })}
                                    style={{
                                        width: '100%', padding: '0.9rem 1rem 0.9rem 3rem',
                                        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                                        borderRadius: '10px', color: 'var(--text-main)', outline: 'none',
                                        fontSize: '0.95rem'
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                                />
                            </div>
                        </div>

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
                                className="btn btn-primary"
                                style={{ flex: 1, padding: '0.8rem', justifyContent: 'center' }}
                            >
                                {isEditing ? 'Save Changes' : 'Create Course'}
                            </button>
                        </div>
                    </form>
                </AnimatedModal>
            </div>
        </PageTransition>
    );
};

export default AdminCourses;
