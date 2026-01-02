import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import { useData } from '../context/DataContext';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useStudent();
    const { courses } = useData();

    // Find course from context
    const course = courses.find(c => c.id === id);

    // --- 3D Tilt Logic ---
    const [tiltStyle, setTiltStyle] = useState({});
    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 20;
        const y = (e.clientY - top - height / 2) / 20;
        setTiltStyle({ transform: `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.05)` });
    };
    const handleMouseLeave = () => {
        setTiltStyle({ transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)' });
    };

    if (!course) {
        return (
            <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'white', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h2>Finding your course...</h2>
                <Link to="/courses" style={{ color: 'var(--primary)', marginTop: '1rem' }}>Back to Courses</Link>
            </div>
        );
    }

    return (
        <div className="course-detail-page container" style={{ padding: '6rem 2rem 4rem', minHeight: '100vh', position: 'relative' }}>

            {/* Background Decoration */}
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)', zIndex: 0, pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1), transparent 70%)', zIndex: 0, pointerEvents: 'none' }}></div>

            <Link to="/courses" className="back-link animate-fade-in">
                <span>&larr;</span> Back to Courses
            </Link>

            <div className="course-grid">

                {/* LEFT: CONTENT */}
                <div className="course-content animate-slide-up">
                    <h1 className="course-title gradient-text">{course.title}</h1>

                    <div className="course-meta">
                        <div className="meta-item">
                            <span className="icon">👨‍🏫</span>
                            <div>
                                <span className="label">Instructor</span>
                                <span className="value">{course.instructor}</span>
                            </div>
                        </div>
                        <div className="meta-item">
                            <span className="icon">⭐</span>
                            <div>
                                <span className="label">Rating</span>
                                <span className="value">{course.rating || 'New'} <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>(120 reviews)</span></span>
                            </div>
                        </div>
                        <div className="meta-item">
                            <span className="icon">⏱️</span>
                            <div>
                                <span className="label">Duration</span>
                                <span className="value">12 Weeks</span>
                            </div>
                        </div>
                    </div>

                    <div className="course-description glass-card">
                        <h3>About this Course</h3>
                        <p>{course.description || 'Dive deep into this subject with our comprehensive curriculum designed by industry experts. You will learn practical skills through hands-on projects.'}</p>
                    </div>

                    <div className="course-syllabus">
                        <h3>What You'll Learn</h3>
                        <div className="syllabus-grid">
                            {course.syllabus && course.syllabus.length > 0 ? course.syllabus.map((item, index) => (
                                <div key={index} className="syllabus-item" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="check-icon">✓</div>
                                    <span>{item}</span>
                                </div>
                            )) : (
                                <p>Detailed syllabus coming soon.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: 3D CARD & ENROLLMENT */}
                <div className="course-sidebar animate-slide-up" style={{ animationDelay: '0.2s' }}>

                    {/* 3D TILT IMAGE CARD */}
                    <div
                        className="course-3d-card"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{ ...tiltStyle }}
                    >
                        <div className="card-shine"></div>
                        <img src={course.image} alt={course.title} />
                        <div className="card-badge">Best Seller</div>
                    </div>

                    {/* GLASS ENROLLMENT PANEL */}
                    <div className="enrollment-panel glass-card">
                        <div className="price-tag">
                            <span className="currency">$</span>
                            <span className="amount">{course.price ? course.price.replace('$', '') : 'Free'}</span>
                        </div>
                        <p className="guarantee">30-Day Money-Back Guarantee</p>

                        <div className="features-list">
                            <div>🔓 Full Lifetime Access</div>
                            <div>📱 Mobile & TV Access</div>
                            <div>📜 Certificate of Completion</div>
                        </div>

                        <button
                            onClick={() => user ? navigate(`/courses/${id}/checkout`, { state: { course } }) : navigate('/signin')}
                            className="enroll-btn"
                        >
                            Enroll Now
                        </button>
                    </div>

                </div>
            </div>

            <style>{`
                .back-link {
                    display: inline-flex;
                    alignItems: center;
                    gap: 0.5rem;
                    color: var(--text-muted);
                    margin-bottom: 2rem;
                    text-decoration: none;
                    transition: color 0.2s;
                    font-weight: 500;
                    position: relative;
                    z-index: 10;
                }
                .back-link:hover { color: var(--primary); }
                .back-link span { transition: transform 0.2s; }
                .back-link:hover span { transform: translateX(-3px); }

                .course-grid {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 4rem;
                    align-items: start;
                    position: relative;
                    z-index: 10;
                }

                /* Typography */
                .course-title {
                    font-size: 3.5rem;
                    line-height: 1.1;
                    margin-bottom: 2rem;
                    font-weight: 800;
                    text-shadow: 0 10px 30px rgba(0,0,0,0.3);
                }

                /* Meta Data */
                .course-meta {
                    display: flex;
                    gap: 2rem;
                    margin-bottom: 3rem;
                    flex-wrap: wrap;
                }
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: rgba(255,255,255,0.03);
                    padding: 0.8rem 1.2rem;
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.05);
                    transition: transform 0.2s;
                }
                .meta-item:hover { transform: translateY(-3px); background: rgba(255,255,255,0.05); }
                .meta-item .icon { font-size: 1.5rem; }
                .meta-item .label { display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
                .meta-item .value { font-size: 1.1rem; font-weight: 600; color: var(--text-main); }

                /* Glass Card Generic */
                .glass-card {
                    background: var(--bg-glass);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--border-color);
                    border-radius: 24px;
                    padding: 2rem;
                    box-shadow: var(--shadow);
                }

                .course-description { margin-bottom: 3rem; }
                .course-description h3 { font-size: 1.8rem; margin-bottom: 1rem; color: var(--text-main); }
                .course-description p { font-size: 1.1rem; line-height: 1.8; color: var(--text-muted); }

                /* Syllabus */
                .course-syllabus h3 { font-size: 1.8rem; margin-bottom: 1.5rem; }
                .syllabus-grid { display: grid; gap: 1rem; }
                .syllabus-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: rgba(20, 20, 30, 0.4);
                    border-radius: 12px;
                    border-left: 3px solid var(--primary);
                    transition: all 0.2s;
                    animation: fade-in 0.5s ease-out forwards;
                    opacity: 0;
                }
                .syllabus-item:hover { transform: translateX(5px); background: rgba(20, 20, 30, 0.6); }
                .check-icon {
                    width: 24px; height: 24px;
                    background: rgba(16, 185, 129, 0.2);
                    color: #10b981;
                    border-radius: 50%;
                    display: flex; align-items: center; justifyContent: center;
                    font-size: 0.8rem;
                }

                /* 3D Sidebar */
                .course-sidebar { position: sticky; top: 2rem; }
                
                .course-3d-card {
                    width: 100%;
                    aspect-ratio: 16/9;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.4);
                    margin-bottom: 2rem;
                    position: relative;
                    transition: all 0.1s ease-out;
                    transform-style: preserve-3d;
                    cursor: pointer;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .course-3d-card img { width: 100%; height: 100%; object-fit: cover; }
                .card-shine {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%);
                    pointer-events: none; z-index: 2;
                }
                .card-badge {
                    position: absolute; top: 1rem; right: 1rem;
                    background: #fbbf24; color: #000;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-weight: 700; font-size: 0.8rem;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                    transform: translateZ(20px);
                }

                /* Enrollment Panel */
                .enrollment-panel {
                    text-align: center;
                    border-top: 4px solid var(--primary);
                    transform: translateZ(0); /* Fix for some browsers */
                }
                .price-tag { margin-bottom: 0.5rem; }
                .currency { font-size: 1.5rem; vertical-align: top; margin-right: 2px; }
                .amount { font-size: 3.5rem; font-weight: 800; color: var(--text-main); }
                .guarantee { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem; }
                
                .features-list { text-align: left; margin-bottom: 2rem; color: var(--text-muted); display: grid; gap: 0.8rem; }

                .enroll-btn {
                    width: 100%;
                    padding: 1.2rem;
                    border-radius: 12px;
                    border: none;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    color: white;
                    font-size: 1.2rem;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 10px 20px var(--primary-glow);
                    transition: transform 0.2s, box-shadow 0.2s;
                    position: relative;
                    overflow: hidden;
                }
                .enroll-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 30px var(--primary-glow);
                }
                .enroll-btn::after {
                    content: '';
                    position: absolute;
                    top: -50%; left: -50%; width: 200%; height: 200%;
                    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent);
                    transform: rotate(45deg) translateY(-100%);
                    animation: shine 3s infinite;
                }

                @keyframes shine {
                    0% { transform: rotate(45deg) translateY(-100%); }
                    20% { transform: rotate(45deg) translateY(100%); }
                    100% { transform: rotate(45deg) translateY(100%); }
                }

                @media (max-width: 900px) {
                    .course-grid { grid-template-columns: 1fr; }
                    .course-sidebar { order: -1; position: relative; top: 0; }
                    .course-title { font-size: 2.5rem; }
                }
            `}</style>
        </div>
    );
};

export default CourseDetail;
