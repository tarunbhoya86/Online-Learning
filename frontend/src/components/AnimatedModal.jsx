import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const AnimatedModal = ({ isOpen, onClose, title, children }) => {
    const [visible, setVisible] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            setTimeout(() => setAnimateIn(true), 10);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            setAnimateIn(false);
            setTimeout(() => setVisible(false), 300);
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    if (!visible) return null;

    return ReactDOM.createPortal(
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999, // High z-index to ensure it's on top
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `rgba(0, 0, 0, ${animateIn ? 0.7 : 0})`,
                backdropFilter: animateIn ? 'blur(8px)' : 'blur(0px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onClick={onClose}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%',
                    maxWidth: '550px',
                    margin: '2rem',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    background: '#1e293b',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    transform: animateIn ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
                    opacity: animateIn ? 1 : 0,
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'linear-gradient(to right, rgba(255,255,255,0.02), transparent)'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', margin: 0 }}>{title}</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                            padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '2rem' }}>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AnimatedModal;
