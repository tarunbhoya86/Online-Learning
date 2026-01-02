import React, { useState, useEffect, useRef } from 'react';
import { useStudent } from '../../context/StudentContext';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const { user, enrolledCourses } = useStudent();

    // --- Stats Animation Logic ---
    const [stats, setStats] = useState({ active: 0, completed: 0, hours: 0 });

    useEffect(() => {
        // Calculate raw stats
        const totalCourses = enrolledCourses.length;
        const completed = enrolledCourses.filter(c => c.progress === 100).length;
        const active = totalCourses - completed;
        const hours = enrolledCourses.reduce((acc, curr) => acc + (curr.duration ? parseInt(curr.duration) : 10), 0);

        // Animate stats counting up
        let start = 0;
        const duration = 2000;
        const step = 20;

        const timer = setInterval(() => {
            start += step;
            const progress = Math.min(start / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4); // EaseOutQuart

            setStats({
                active: Math.floor(active * ease),
                completed: Math.floor(completed * ease),
                hours: Math.floor(hours * ease)
            });

            if (progress === 1) clearInterval(timer);
        }, step);

        return () => clearInterval(timer);
    }, [enrolledCourses]);

    return (
        <div style={{ padding: '2rem', minHeight: '100vh', paddingBottom: '5rem' }} className="dashboard-container">

            {/* HERO SECTION */}
            <div className="glass-panel animate-fade-in hero-section" style={{
                marginBottom: '3rem',
                padding: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '32px',
                border: '1px solid var(--border-color)'
            }}>
                {/* Background Ambient Glow */}
                <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '600px', height: '600px', background: 'var(--primary)', opacity: 0.15, filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }}></div>

                <div className="hero-content" style={{ position: 'relative', zIndex: 1, maxWidth: '60%' }}>
                    <h1 className="gradient-text hero-title" style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '1rem' }}>
                        Welcome back,<br />{user?.name || 'Student'}! 🚀
                    </h1>
                    <p className="hero-subtitle" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px' }}>
                        You're making great progress. Continue where you left off or explore new skills today.
                    </p>

                    <div className="hero-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                        <Link to="/courses" className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: '50px', fontSize: '1.1rem' }}>
                            Explore Courses
                        </Link>
                        <button style={{ padding: '1rem 2rem', borderRadius: '50px', background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '1.1rem' }}>
                            View Schedule
                        </button>
                    </div>
                </div>

                {/* 3D Floating Asset */}
                <div className="animate-float hero-image-container" style={{ position: 'relative', zIndex: 1, width: '400px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                        src="/assets/learnx_3d.png"
                        alt="3D Asset"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 20px 50px rgba(99, 102, 241, 0.4))',
                            transform: 'perspective(1000px) rotateY(-15deg)',
                        }}
                    />
                </div>
            </div>

            {/* STATS ROW */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <StatCard label="Courses in Progress" value={stats.active} icon="🔥" color="var(--primary)" delay="0.1s" />
                <StatCard label="Completed Courses" value={stats.completed} icon="🏆" color="var(--secondary)" delay="0.2s" />
                <StatCard label="Learning Hours" value={stats.hours} icon="⏳" color="var(--accent)" delay="0.3s" />
            </div>

            {/* COURSES SECTION */}
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>

                {/* 3D HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem', perspective: '1000px' }}>
                    <div style={{ transformStyle: 'preserve-3d' }}>
                        <h2 className="gradient-text" style={{
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            transform: 'rotateX(10deg) translateZ(20px)',
                            textShadow: '0 10px 20px rgba(0,0,0,0.3), 0 0 0 transparent',
                            letterSpacing: '-1px'
                        }}>
                            <span className="animate-float" style={{ fontSize: '3rem', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))' }}>🚀</span>
                            My Learning Space
                        </h2>
                        <div style={{
                            height: '4px',
                            width: '100%',
                            background: 'linear-gradient(90deg, var(--primary), transparent)',
                            marginTop: '0.5rem',
                            borderRadius: '2px',
                            transform: 'translateZ(10px)',
                            boxShadow: '0 5px 10px var(--primary-glow)'
                        }}></div>
                    </div>
                    <Link to="/courses" style={{ color: 'var(--primary)', fontWeight: '600', alignSelf: 'center', marginBottom: '1rem' }}>Browse All &rarr;</Link>
                </div>

                {enrolledCourses.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem 2rem', borderStyle: 'dashed', borderColor: 'var(--border-color)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }} className="animate-float">📚</div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>No active enrollments</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Start your journey by enrolling in your first course.</p>
                        <Link to="/courses" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Find a Course</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {enrolledCourses.map((course, index) => (
                            <Course3DCard key={course.id} course={course} index={index} />
                        ))}
                    </div>
                )}
            </div>

            {/* Responsive Styles */}
            <style>{`
                @media (max-width: 900px) {
                    .dashboard-container {
                        padding: 1rem !important;
                        padding-bottom: 5rem !important;
                    }
                    .hero-section {
                        flex-direction: column-reverse !important;
                        padding: 2rem !important;
                        text-align: center !important;
                        gap: 2rem;
                    }
                    .hero-content {
                        max-width: 100% !important;
                    }
                    .hero-title {
                        fontSize: 2.2rem !important;
                    }
                    .hero-image-container {
                        width: 250px !important;
                        height: 250px !important;
                    }
                    .hero-actions {
                        justify-content: center !important;
                    }
                }
            `}</style>
        </div>
    );
};

// --- Sub-Components for 3D Effects ---

const StatCard = ({ label, value, icon, color, delay }) => (
    <div className="glass-panel animate-slide-up" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderRadius: '24px', animationDelay: delay, transition: 'transform 0.3s' }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
        <div style={{
            width: '60px', height: '60px', borderRadius: '20px',
            background: `linear-gradient(135deg, ${color}20, ${color}10)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', border: `1px solid ${color}40`,
            boxShadow: `0 8px 20px -5px ${color}30`
        }}>
            {icon}
        </div>
        <div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: 1 }}>{value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>{label}</div>
        </div>
    </div>
);

const Course3DCard = ({ course, index }) => {
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });

    const handleMouseMove = (e) => {
        if (!cardRef.current || window.innerWidth < 768) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / 20;
        const y = (e.clientY - rect.top - rect.height / 2) / 20;
        setTilt({ x, y, scale: 1.05 });
    };

    const handleMouseLeave = () => setTilt({ x: 0, y: 0, scale: 1 });

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="animate-slide-up"
            style={{
                animationDelay: `${index * 0.1}s`,
                perspective: '1000px',
                cursor: 'pointer'
            }}
        >
            <div className="glass-panel" style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '24px',
                overflow: 'hidden',
                transition: 'all 0.1s ease-out',
                transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg) scale(${tilt.scale})`,
                boxShadow: tilt.scale > 1 ? '0 25px 50px -12px rgba(0,0,0,0.5)' : 'var(--shadow)',
                border: '1px solid var(--border-color)'
            }}>
                {/* Image Section */}
                <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', zIndex: 1 }}></div>
                    <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{
                        position: 'absolute', top: '1rem', right: '1rem', zIndex: 2,
                        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
                        padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.8rem',
                        border: '1px solid rgba(255,255,255,0.2)', fontWeight: '600'
                    }}>
                        {course.category}
                    </span>
                </div>

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>{course.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                        {course.description || 'Master this skill with our comprehensive curriculum.'}
                    </p>

                    {/* Dynamic Glowing Progress */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                            <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{course.progress || 0}%</span>
                        </div>
                        <div style={{ height: '8px', background: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                            <div style={{
                                width: `${course.progress || 0}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                                borderRadius: '4px',
                                boxShadow: '0 0 10px var(--primary)',
                                transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}></div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: course.progress === 100 ? '1fr 1fr' : '1fr', gap: '1rem' }}>
                        <Link to={`/course/${course.id}/learn`} className="btn btn-primary" style={{ justifyContent: 'center', textAlign: 'center', textDecoration: 'none' }}>
                            {course.progress > 0 ? 'Continue' : 'Start'}
                        </Link>
                        {course.progress === 100 && (
                            <Link to={`/student/course/${course.id}/certificate`} className="btn" style={{ justifyContent: 'center', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', textDecoration: 'none' }}>
                                Certificate 🏅
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
