import React, { useRef } from 'react';
import { useStudent } from '../../context/StudentContext';
import { useParams, useNavigate } from 'react-router-dom';

const Certificate = () => {
    const { id } = useParams();
    const { user, enrolledCourses } = useStudent();
    const navigate = useNavigate();
    const certificateRef = useRef();

    const course = enrolledCourses.find(c => c.id === id || c._id === id);
    // Generate a mock Certificate ID based on user/course ID
    const certificateId = `CERT-${id.substring(0, 6).toUpperCase()}-${Date.now().toString().substring(8)}`;
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const handlePrint = () => {
        window.print();
    };

    if (!course || !user) {
        return <div style={{ padding: '2rem', color: 'white' }}>Loading certificate details...</div>;
    }

    return (
        <div className="container" style={{ padding: '2rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Fonts */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Raleway:wght@400;700;800&family=Roboto:wght@300;400;500&family=Dancing+Script&display=swap');
                    
                    /* Responsive Scaling for Screen */
                    @media screen and (max-width: 1350px) {
                        .certificate-container {
                            transform: scale(0.9);
                            transform-origin: top center;
                            margin-bottom: calc(920px * (1 - 0.9) * -1);
                        }
                    }
                    @media screen and (max-width: 1150px) {
                        .certificate-container {
                            transform: scale(0.75);
                            transform-origin: top center;
                            margin-bottom: calc(920px * (1 - 0.75) * -1);
                        }
                    }
                    @media screen and (max-width: 900px) {
                        .certificate-container {
                            transform: scale(0.6);
                            transform-origin: top center;
                            margin-bottom: calc(920px * (1 - 0.6) * -1);
                        }
                    }
                    @media screen and (max-width: 650px) {
                        .certificate-container {
                            transform: scale(0.45);
                            transform-origin: top center;
                            margin-bottom: calc(920px * (1 - 0.45) * -1);
                        }
                    }
                     @media screen and (max-width: 480px) {
                        .certificate-container {
                            transform: scale(0.3);
                            transform-origin: top center;
                            margin-bottom: calc(920px * (1 - 0.3) * -1);
                        }
                    }

                    @media print {
                        @page {
                            size: landscape;
                            margin: 0;
                        }
                        body, html {
                            width: 297mm;
                            height: 210mm;
                            margin: 0;
                            padding: 0;
                            overflow: hidden;
                        }
                        body * {
                            visibility: hidden;
                        }
                        .certificate-container, .certificate-container * {
                            visibility: visible;
                        }
                        .certificate-container {
                            position: fixed;
                            left: 0;
                            top: 0;
                            width: 297mm;
                            height: 210mm;
                            margin: 0;
                            padding: 0 !important;
                            box-sizing: border-box;
                            z-index: 9999;
                            display: flex;
                            background: white;
                            transform: none !important; /* Reset scale for print */
                        }
                        .no-print {
                            display: none !important;
                        }
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                `}
            </style>

            {/* Controls */}
            <div className="no-print" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                <button
                    onClick={() => navigate('/student/dashboard')}
                    className="btn btn-glass-3d btn-3d"
                >
                    Back to Dashboard
                </button>
                <button
                    onClick={handlePrint}
                    className="btn btn-primary btn-3d btn-animated"
                    style={{ padding: '0.75rem 2rem' }}
                >
                    Download / Print Certificate
                </button>
            </div>

            {/* Responsive Wrapper to prevent scrollbars */}
            <div className="certificate-wrapper" style={{ width: '100%', overflowX: 'hidden', display: 'flex', justifyContent: 'center', paddingBottom: '2rem' }}>
                {/* Premium Certificate Container */}
                <div
                    ref={certificateRef}
                    className="certificate-container"
                    style={{
                        width: '1300px',
                        height: '920px', // Larger Landscape
                        background: '#fffbf0', // Warm off-white
                        position: 'relative',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                        color: '#1e293b',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', // Fix alignment
                        justifyContent: 'center',
                        border: '15px solid #0f172a', // Dark Navy border
                        flexShrink: 0 // Prevent flex shrinking
                    }}
                >
                    {/* Inner Gold Frame */}
                    <div style={{
                        position: 'absolute',
                        top: '15px', left: '15px', right: '15px', bottom: '15px',
                        border: '3px solid #d97706', // Gold border
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}>

                        {/* Background Pattern (CSS Radial) */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            backgroundImage: 'radial-gradient(#d97706 0.5px, transparent 0.5px)',
                            backgroundSize: '30px 30px',
                            opacity: 0.05,
                            zIndex: -1
                        }}></div>

                        {/* Corner Flourishes */}
                        <svg width="150" height="150" viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, fill: '#0f172a' }}>
                            <path d="M0 0 L50 0 C20 0 0 20 0 50 Z" fill="#0f172a" />
                            <path d="M5 5 L45 5 C20 5 5 20 5 45 Z" fill="#d97706" />
                        </svg>
                        <svg width="150" height="150" viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, right: 0, transform: 'rotate(90deg)', fill: '#0f172a' }}>
                            <path d="M0 0 L50 0 C20 0 0 20 0 50 Z" fill="#0f172a" />
                            <path d="M5 5 L45 5 C20 5 5 20 5 45 Z" fill="#d97706" />
                        </svg>
                        <svg width="150" height="150" viewBox="0 0 100 100" style={{ position: 'absolute', bottom: 0, right: 0, transform: 'rotate(180deg)', fill: '#0f172a' }}>
                            <path d="M0 0 L50 0 C20 0 0 20 0 50 Z" fill="#0f172a" />
                            <path d="M5 5 L45 5 C20 5 5 20 5 45 Z" fill="#d97706" />
                        </svg>
                        <svg width="150" height="150" viewBox="0 0 100 100" style={{ position: 'absolute', bottom: 0, left: 0, transform: 'rotate(270deg)', fill: '#0f172a' }}>
                            <path d="M0 0 L50 0 C20 0 0 20 0 50 Z" fill="#0f172a" />
                            <path d="M5 5 L45 5 C20 5 5 20 5 45 Z" fill="#d97706" />
                        </svg>

                        {/* Content Layer */}
                        <div style={{ textAlign: 'center', zIndex: 10, padding: '4rem', width: '100%', maxWidth: '1000px' }}>

                            {/* Logo / Header */}
                            <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ width: '50px', height: '50px', background: '#0f172a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '0.5rem' }}>L</div>
                                <div style={{ letterSpacing: '4px', color: '#0f172a', fontSize: '1.2rem', textTransform: 'uppercase', fontWeight: '700' }}>LearnX Academy</div>
                            </div>

                            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '5rem', color: '#d97706', margin: '0.5rem 0', fontWeight: 'bold' }}>
                                Certificate
                            </h1>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '2rem' }}>
                                of Completion
                            </div>

                            <p style={{ fontSize: '1.2rem', color: '#64748b', fontFamily: "'Roboto', sans-serif" }}>
                                THIS CERTIFICATE IS PROUDLY PRESENTED TO
                            </p>

                            <h2 style={{ fontSize: '4rem', fontFamily: "'Dancing Script', cursive", color: '#0f172a', margin: '1rem 0', padding: '0 2rem', borderBottom: '2px solid #e2e8f0', display: 'inline-block', minWidth: '400px' }}>
                                {user.name}
                            </h2>

                            <p style={{ fontSize: '1.2rem', color: '#64748b', fontFamily: "'Roboto', sans-serif", marginTop: '2rem' }}>
                                For successfully completing the comprehensive course styled on professional industry standards.
                            </p>

                            <h3 style={{ fontSize: '2.5rem', color: '#0f172a', margin: '1rem 0 3rem', fontFamily: "'Playfair Display', serif", fontWeight: '700' }}>
                                {course.title}
                            </h3>

                            {/* Signatures */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 2rem', marginTop: '2rem', width: '100%' }}>
                                <div style={{ textAlign: 'center', flex: 1 }}>
                                    <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: '2rem', color: '#0f172a', marginBottom: '5px' }}>
                                        {currentDate}
                                    </div>
                                    <div style={{ borderTop: '1px solid #94a3b8', width: '150px', margin: '0 auto', paddingTop: '5px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</div>
                                </div>

                                <div style={{ textAlign: 'center', flex: 1 }}>
                                    {/* Premium Badge */}
                                    <div style={{ width: '100px', height: '100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#d97706', borderRadius: '50%', color: 'white', boxShadow: '0 5px 15px rgba(217, 119, 6, 0.4)', border: '4px solid white', outline: '4px solid #d97706' }}>
                                        <span style={{ fontSize: '2rem' }}>★</span>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'center', flex: 1 }}>
                                    <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: '2.5rem', color: '#0f172a', marginBottom: '-5px' }}>
                                        Tarun Bhoya
                                    </div>
                                    <div style={{ borderTop: '1px solid #94a3b8', width: '200px', margin: '0 auto', paddingTop: '5px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Director & CEO</div>
                                </div>
                            </div>

                            <div style={{ marginTop: '2.5rem', fontSize: '0.7rem', color: '#cbd5e1', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                Credential ID: {certificateId}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Certificate;
