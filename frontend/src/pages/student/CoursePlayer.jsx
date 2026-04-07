import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudent } from '../../context/StudentContext';

const CoursePlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enrolledCourses, markChapterCompleted } = useStudent();
    const [activeTab, setActiveTab] = useState('content'); // content, resources, notes
    const [showConfetti, setShowConfetti] = useState(false);

    // Find the current course object
    const currentEnrollment = enrolledCourses.find(c => c.id === id || c._id === id);
    const courseTitle = currentEnrollment?.title || 'Default';

    // Data Map for Course Content (Same as before)
    const courseContent = {
        'Full Stack Web Development': [
            {
                unitTitle: 'Unit 1: Introduction to Web Development',
                chapters: [
                    {
                        id: '1-1',
                        title: 'HTML Tutorial for Beginners',
                        duration: '1:06:00',
                        videoId: 'HcOc7P5BMi4',
                        resources: [
                            { title: 'HTML Cheatsheet (PDF)', type: 'pdf', url: '#' },
                            { title: 'Source Code (GitHub)', type: 'link', url: '#' }
                        ]
                    },
                    {
                        id: '1-2',
                        title: 'CSS Tutorial for Beginners',
                        duration: '2:11:00',
                        videoId: 'ESnrn1kAD4E',
                        resources: [
                            { title: 'CSS Selector Guide', type: 'pdf', url: '#' },
                            { title: 'Starter Project Files', type: 'zip', url: '#' }
                        ]
                    },
                ]
            },
            {
                unitTitle: 'Unit 2: JavaScript Mastery',
                chapters: [
                    { id: '2-1', title: 'JavaScript Tutorial for Beginners', duration: '1:32:00', videoId: 'hKB-YGF14SY' },
                    { id: '2-2', title: 'Advanced JavaScript Concepts', duration: '45:00', videoId: 'B7wHpNUUT4Y' }
                ]
            },
            {
                unitTitle: 'Unit 3: Frontend Frameworks (React)',
                chapters: [
                    { id: '3-1', title: 'React JS Tutorial for Beginners', duration: '1:33:00', videoId: 'gY5BGRdz8Xg' },
                    { id: '3-2', title: 'React Hooks Explained', duration: '20:00', videoId: 'j8s01ThR7bQ' }
                ]
            },
            {
                unitTitle: 'Unit 4: Full Stack Projects',
                chapters: [
                    { id: '4-1', title: 'Amazon Clone Project', duration: '1:50:00', videoId: 'l1EssrLxt7E' },
                    { id: '4-2', title: 'Git & GitHub Crash Course', duration: '48:00', videoId: 'Ez8F0nW6S-w' }
                ]
            }
        ],
        'Python for Data Science': [
            {
                unitTitle: 'Unit 1: Python Basics',
                chapters: [
                    {
                        id: 'p1-1',
                        title: 'Python Tutorial for Beginners',
                        duration: '1:00:00',
                        videoId: 'vLnPwxZdW4Y',
                        resources: [
                            { title: 'Python Cheatsheet', type: 'pdf', url: '#' },
                            { title: 'Practice Exercises', type: 'link', url: '#' }
                        ]
                    },
                ]
            },
            {
                unitTitle: 'Unit 2: Data Analysis with Pandas',
                chapters: [
                    {
                        id: 'p2-1',
                        title: 'Pandas Tutorial',
                        duration: '45:00',
                        videoId: 'vmEHCJofslg',
                        resources: [
                            { title: 'Pandas Documentation', type: 'link', url: '#' },
                            { title: 'Dataset.csv', type: 'zip', url: '#' }
                        ]
                    }
                ]
            }
        ],
        'UI/UX Design Masterclass': [
            {
                unitTitle: 'Unit 1: Introduction to UI/UX',
                chapters: [
                    {
                        id: 'ui-1',
                        title: 'UI/UX Design Full Course',
                        duration: '1:00:00',
                        videoId: 'c9Wg6Cb_YlU',
                        resources: [
                            { title: 'Design Principles PDF', type: 'pdf', url: '#' },
                            { title: 'Figma Community File', type: 'link', url: '#' }
                        ]
                    }
                ]
            },
            {
                unitTitle: 'Unit 2: Figma Crash Course',
                chapters: [
                    {
                        id: 'ui-2',
                        title: 'Figma Tutorial',
                        duration: '45:00',
                        videoId: 'Gu1so3pz4bA',
                        resources: [
                            { title: 'Figma Shortcuts', type: 'pdf', url: '#' }
                        ]
                    }
                ]
            }
        ],
        'Node.js Microservices': [
            {
                unitTitle: 'Unit 1: Node.js Fundamentals',
                chapters: [
                    {
                        id: 'node-1',
                        title: 'Node.js Tutorial for Beginners',
                        duration: '1:15:00',
                        videoId: 'BLl32FvcdVM',
                        resources: [
                            { title: 'Node.js Guide', type: 'pdf', url: '#' },
                            { title: 'Source Code', type: 'zip', url: '#' }
                        ]
                    }
                ]
            },
            {
                unitTitle: 'Unit 2: Express & MongoDB',
                chapters: [
                    {
                        id: 'node-2',
                        title: 'Express.js Tutorial',
                        duration: '50:00',
                        videoId: 'OEbyM6tL7kI',
                        resources: [
                            { title: 'Express Cheatsheet', type: 'pdf', url: '#' }
                        ]
                    }
                ]
            }
        ],
        'Flutter Mobile App Development': [
            {
                unitTitle: 'Unit 1: Dart & Flutter Basics',
                chapters: [
                    {
                        id: 'fl-1',
                        title: 'Flutter Crash Course',
                        duration: '1:10:00',
                        videoId: 'VPvVD8t02U8',
                        resources: [
                            { title: 'Dart Guide', type: 'pdf', url: '#' },
                            { title: 'Flutter Widget Catalog', type: 'link', url: '#' }
                        ]
                    }
                ]
            }
        ],
        'Machine Learning A-Z': [
            {
                unitTitle: 'Unit 1: Intro to ML',
                chapters: [
                    {
                        id: 'ml-1',
                        title: 'Machine Learning Basics',
                        duration: '55:00',
                        videoId: 'GwIo3gDZCVQ',
                        resources: [
                            { title: 'ML Algorithms Chart', type: 'pdf', url: '#' },
                            { title: 'Python Notebook', type: 'link', url: '#' }
                        ]
                    }
                ]
            }
        ],
        'Ethical Hacking 101': [
            {
                unitTitle: 'Unit 1: Cyber Security Basics',
                chapters: [
                    {
                        id: 'eh-1',
                        title: 'Ethical Hacking Course',
                        duration: '2:00:00',
                        videoId: 'Rkqn437yAcw',
                        resources: [
                            { title: 'Kali Linux Guide', type: 'pdf', url: '#' },
                            { title: 'Safety Disclaimer', type: 'pdf', url: '#' }
                        ]
                    }
                ]
            }
        ],
        'Default': [
            {
                unitTitle: 'Unit 1: Getting Started',
                chapters: [
                    {
                        id: 'd1-1',
                        title: 'Course Introduction',
                        duration: '5:00',
                        videoId: 'kJQP7kiw5Fk',
                        resources: [
                            { title: 'Welcome Guide', type: 'pdf', url: '#' }
                        ]
                    },
                    {
                        id: 'd1-2',
                        title: 'Setting Up Environment',
                        duration: '10:00',
                        videoId: 'bJzb-RuUcMU',
                        resources: [
                            { title: 'Setup Script', type: 'zip', url: '#' }
                        ]
                    }
                ]
            }
        ]
    };

    const units = courseContent[courseTitle] || courseContent['Default'];
    const allChapterIds = units.flatMap(u => u.chapters.map(c => c.id));
    const completedChapters = currentEnrollment?.completedChapters || [];
    const [currentChapter, setCurrentChapter] = useState(units[0].chapters[0]);

    useEffect(() => {
        const units = courseContent[courseTitle] || courseContent['Default'];
        if (units && units.length > 0) {
            setCurrentChapter(units[0].chapters[0]);
        }
    }, [courseTitle]);

    const handleMarkComplete = () => {
        if (!completedChapters.includes(currentChapter.id)) {
            markChapterCompleted(id, currentChapter.id, allChapterIds);

            // Trigger Confetti
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }
    };

    // Calculate Progress Ring
    const progress = currentEnrollment?.progress || 0;
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="course-player-container" style={{
            padding: '2rem',
            minHeight: 'calc(100vh - 80px)',
            background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent 40%)'
        }}>

            {/* Confetti Overlay */}
            {showConfetti && (
                <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
                    {[...Array(50)].map((_, i) => (
                        <div key={i} className="confetti" style={{
                            left: Math.random() * 100 + 'vw',
                            animationDelay: Math.random() * 2 + 's',
                            backgroundColor: ['#6366f1', '#ec4899', '#10b981', '#fbbf24'][Math.floor(Math.random() * 4)]
                        }}></div>
                    ))}
                </div>
            )}

            <div className="player-grid" style={{ maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '2rem' }}>

                {/* Left Column: Video & Title */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Cinema Video Player */}
                    <div className="video-wrapper glass-panel" style={{ padding: '0.5rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: '16px', overflow: 'hidden', background: '#000', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                            <iframe
                                src={`https://www.youtube.com/embed/${currentChapter.videoId}`}
                                title={currentChapter.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                            ></iframe>
                        </div>
                    </div>

                    {/* Video Meta & Controls */}
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <div>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem', color: '#1e293b' }}>
                                {currentChapter.title}
                            </h1>
                            <div style={{ display: 'flex', gap: '1rem', color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>
                                <span>{courseTitle}</span>
                                <span>•</span>
                                <span>{currentChapter.duration}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleMarkComplete}
                            disabled={completedChapters.includes(currentChapter.id)}
                            className={`action-btn ${completedChapters.includes(currentChapter.id) ? 'completed' : ''}`}
                            style={{
                                padding: '0.8rem 1.8rem',
                                borderRadius: '50px',
                                border: 'none',
                                background: completedChapters.includes(currentChapter.id) ? 'rgba(16, 185, 129, 0.1)' : 'var(--primary)',
                                color: completedChapters.includes(currentChapter.id) ? '#10b981' : 'white',
                                fontWeight: '600',
                                cursor: completedChapters.includes(currentChapter.id) ? 'default' : 'pointer',
                                boxShadow: completedChapters.includes(currentChapter.id) ? 'none' : '0 4px 15px var(--primary-glow)',
                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            {completedChapters.includes(currentChapter.id) ? (
                                <><span>✓</span> Completed</>
                            ) : (
                                'Mark as Complete'
                            )}
                        </button>
                    </div>

                </div>

                {/* Right Column: Sidebar (Course Content) */}
                <div className="sidebar glass-panel" style={{
                    height: 'calc(100vh - 120px)',
                    position: 'sticky',
                    top: '2rem',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>

                    {/* Header: Progress */}
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Course Progress</span>
                            <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{progress}%</span>
                        </div>
                        {/* Linear Progress Bar */}
                        <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gradient-primary)', transition: 'width 0.5s ease' }}></div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                        {['content', 'resources', 'notes'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Scrollable List */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '0 1rem 1rem' }} className="custom-scrollbar">
                        {activeTab === 'content' && units.map((unit, i) => (
                            <div key={i} style={{ marginTop: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.8rem', paddingLeft: '0.5rem' }}>
                                    {unit.unitTitle}
                                </h3>
                                {unit.chapters.map(chapter => {
                                    const isActive = currentChapter.id === chapter.id;
                                    const isCompleted = completedChapters.includes(chapter.id);
                                    return (
                                        <div
                                            key={chapter.id}
                                            onClick={() => setCurrentChapter(chapter)}
                                            className={`lesson-row ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                                        >
                                            <div className="status-icon">
                                                {isCompleted ? '✓' : (isActive ? '▶' : '')}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div className="lesson-title">{chapter.title}</div>
                                                <div className="lesson-time">{chapter.duration}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}

                        {activeTab === 'resources' && (
                            <div style={{ padding: '2rem', color: 'var(--text-main)' }}>
                                {currentChapter.resources && currentChapter.resources.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {currentChapter.resources.map((resource, idx) => (
                                            <a
                                                key={idx}
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '1rem',
                                                    padding: '1rem',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    borderRadius: '12px',
                                                    textDecoration: 'none',
                                                    color: 'inherit',
                                                    transition: 'background 0.2s',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                                            >
                                                <div style={{
                                                    fontSize: '1.5rem',
                                                    padding: '0.8rem',
                                                    background: 'rgba(99, 102, 241, 0.1)',
                                                    borderRadius: '12px',
                                                    color: 'var(--primary)'
                                                }}>
                                                    {resource.type === 'pdf' ? '📄' : resource.type === 'zip' ? '📦' : '🔗'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', marginBottom: '0.2rem' }}>{resource.title}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{resource.type}</div>
                                                </div>
                                                <div style={{ marginLeft: 'auto', color: 'var(--primary)' }}>⬇</div>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📂</div>
                                        <p>No resources available for this lesson.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'notes' && (
                            <div style={{ paddingTop: '1rem' }}>
                                <textarea
                                    placeholder="Type your notes here..."
                                    style={{ width: '100%', height: '300px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem', color: 'var(--text-main)', resize: 'none' }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <button onClick={() => navigate('/student/dashboard')} style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.target.style.borderColor = 'var(--text-main)'} onMouseOut={e => e.target.style.borderColor = 'var(--border-color)'}>
                            &larr; Back to Dashboard
                        </button>
                    </div>

                </div>

            </div>

            <style>{`
                /* Layout Responsiveness */
                @media (max-width: 1100px) {
                    .player-grid { grid-template-columns: 1fr !important; }
                    .sidebar { height: auto !important; position: static !important; }
                    .video-wrapper { margin-bottom: 2rem; }
                }

                /* Styling Classes */
                .action-btn {
                    padding: 0.8rem 1.8rem;
                    border-radius: 50px;
                    border: none;
                    background: var(--gradient-primary);
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 4px 15px var(--primary-glow);
                    transition: transform 0.2s;
                }
                .action-btn:hover:not(:disabled) { transform: translateY(-2px); }
                .action-btn.completed { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid #10b981; box-shadow: none; cursor: default; }

                .tab-btn {
                    padding: 0.6rem;
                    border-radius: 8px;
                    border: none;
                    background: transparent;
                    color: var(--text-muted);
                    font-weight: 500;
                    cursor: pointer;
                    text-transform: capitalize;
                    transition: all 0.2s;
                }
                .tab-btn:hover { color: var(--text-main); background: rgba(255,255,255,0.05); }
                .tab-btn.active { background: var(--bg-card); color: var(--primary); font-weight: 700; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }

                .lesson-row {
                    display: flex; gap: 1rem; align-items: center;
                    padding: 0.8rem 1rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }
                .lesson-row:hover { background: rgba(255,255,255,0.03); }
                .lesson-row.active { background: rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.3); }
                
                .status-icon {
                    width: 24px; height: 24px;
                    border-radius: 50%;
                    border: 2px solid rgba(255,255,255,0.1);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.7rem; color: white;
                }
                .lesson-row.completed .status-icon { background: #10b981; border-color: #10b981; }
                .lesson-row.active .status-icon { border-color: var(--primary); color: var(--primary); }

                .lesson-title { font-size: 0.95rem; color: var(--text-main); margin-bottom: 0.2rem; }
                .lesson-row.active .lesson-title { color: var(--primary); font-weight: 600; }
                .lesson-row.completed .lesson-title { text-decoration: line-through; opacity: 0.7; }
                .lesson-time { font-size: 0.8rem; color: var(--text-muted); }

                /* Scrollbar */
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

                /* Confetti */
                .confetti { position: absolute; width: 8px; height: 8px; top: -10vh; animation: fall-confetti 3s linear forwards; }
                @keyframes fall-confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
            `}</style>

        </div>
    );
};

export default CoursePlayer;
