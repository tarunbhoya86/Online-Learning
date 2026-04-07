import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';

import { useData } from '../context/DataContext';

const categories = ['All', 'Development', 'Design', 'Data Science', 'Marketing'];

const Courses = () => {
    const { courses } = useData();
    const { user } = useStudent();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [hoveredCourse, setHoveredCourse] = useState(null);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="courses-page container">
            {/* Hero Header */}
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <h1 className="gradient-text animate-fade-in" style={{ fontSize: '4rem', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                    Expand Your Horizons
                </h1>
                <p className="animate-fade-in" style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', animationDelay: '0.1s' }}>
                    World-class education for anyone, anywhere.
                </p>
            </div>

            {/* Controls */}
            <div className="animate-fade-in" style={{ marginBottom: '4rem', animationDelay: '0.2s' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
                    <input
                        type="text"
                        placeholder="What do you want to learn?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1.2rem 2rem',
                            borderRadius: '50px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-card)',
                            color: 'var(--text-main)',
                            fontSize: '1.1rem',
                            outline: 'none',
                            boxShadow: 'var(--shadow)'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '30px',
                                border: 'none',
                                background: selectedCategory === category ? 'var(--primary)' : 'var(--bg-card)',
                                color: selectedCategory === category ? 'white' : 'var(--text-muted)',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                fontSize: '0.95rem',
                                fontWeight: '500'
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
                {filteredCourses.map((course, index) => (
                    <Link
                        to={`/courses/${course.id}`}
                        key={course.id}
                        className="animate-slide-up"
                        style={{ textDecoration: 'none', color: 'inherit', display: 'block', animationDelay: `${index * 0.1}s` }}
                        onMouseEnter={() => setHoveredCourse(course.id)}
                        onMouseLeave={() => setHoveredCourse(null)}
                    >
                        <div style={{
                            background: 'var(--bg-card)', // Adapted for light mode
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow)',
                            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            transform: hoveredCourse === course.id ? 'translateY(-10px)' : 'translateY(0)',
                            border: '1px solid var(--border-color)'
                        }}>
                            {/* Image Section */}
                            <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', transform: hoveredCourse === course.id ? 'scale(1.1)' : 'scale(1)' }}
                                />
                                <div style={{
                                    position: 'absolute', top: '1rem', right: '1rem',
                                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                                    padding: '0.4rem 0.8rem', borderRadius: '30px',
                                    fontSize: '0.85rem', fontWeight: '600', color: '#fff'
                                }}>
                                    {course.category}
                                </div>
                            </div>

                            {/* Content Section */}
                            <div style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <span>👤</span> {course.instructor}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <span style={{ color: '#fbbf24' }}>★</span> {course.rating} ({course.students})
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '1.5rem', lineHeight: '1.3', marginBottom: '1.5rem', fontWeight: '700' }}>{course.title}</h3>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>{course.price}</span>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent parent Link click
                                            if (user) {
                                                navigate(`/courses/${course.id}/checkout`, { state: { course } });
                                            } else {
                                                navigate('/signin');
                                            }
                                        }}
                                        style={{
                                            padding: '0.6rem 1.2rem',
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            transition: 'all 0.3s ease',
                                            textDecoration: 'none',
                                            border: '1px solid var(--border-color)',
                                            cursor: 'pointer',
                                            background: hoveredCourse === course.id ? 'var(--primary)' : 'var(--bg-glass)',
                                            color: hoveredCourse === course.id ? 'white' : 'var(--text-main)'
                                        }}
                                    >
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredCourses.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                    <h3>No courses found matching "{searchTerm}"</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};

export default Courses;
