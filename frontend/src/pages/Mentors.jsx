import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const Mentors = () => {
    const { users } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Filter users to get only mentors and add placeholder details if missing
    const mentors = users.filter(user => user.role === 'Mentor').map(user => ({
        id: user.id || user._id,
        name: user.name,
        role: 'Senior Instructor', // Maintain placeholder for title
        email: user.email,
        expertise: user.expertise && user.expertise.length > 0 ? user.expertise : ['Teaching', 'Mentorship'],
        bio: 'Dedicated educator with a passion for helping students achieve their goals.', // Default bio
        image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=200`
    }));

    // Extract unique categories from all mentors
    const allCategories = ['All', ...new Set(mentors.flatMap(m => m.expertise))];

    const filteredMentors = mentors.filter(mentor => {
        const matchesSearch = (
            mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mentor.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mentor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        const matchesCategory = selectedCategory === 'All' || mentor.expertise.includes(selectedCategory);

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="mentors-page container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginBottom: '1rem', perspective: '1000px' }}>
                <div className="animate-float" style={{ fontSize: '4rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))', animation: 'float 6s ease-in-out infinite' }}>
                    🎓
                </div>
                <h1 className="gradient-text animate-fade-in" style={{ fontSize: '3rem', margin: 0, textAlign: 'center' }}>
                    Meet Your Mentors
                </h1>
                <div className="animate-float" style={{ fontSize: '4rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))', animation: 'float 6s ease-in-out infinite', animationDelay: '3s' }}>
                    🚀
                </div>
            </div>
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
            `}</style>
            <p className="animate-fade-in" style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.2rem', animationDelay: '0.2s' }}>
                Learn from industry experts specialized in various fields.
            </p>

            {/* Search and Filter Section */}
            {/* Search and Filter Section */}
            <div className="animate-fade-in" style={{ marginBottom: '4rem', animationDelay: '0.3s', perspective: '1000px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', transformStyle: 'preserve-3d' }}>
                    <input
                        type="text"
                        placeholder="Search by name or skill..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '1.2rem 2.5rem',
                            width: '100%',
                            maxWidth: '600px',
                            borderRadius: '50px',
                            border: '1px solid var(--border-color)',
                            borderBottom: '4px solid var(--border-color)', // 3D bevel
                            background: 'var(--bg-glass)',
                            backdropFilter: 'blur(10px)',
                            color: 'var(--text-main)',
                            fontSize: '1.1rem',
                            outline: 'none',
                            boxShadow: 'var(--shadow)',
                            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            transform: 'translateZ(20px)'
                        }}
                        onFocus={(e) => {
                            e.target.style.transform = 'translateZ(30px) scale(1.02)';
                            e.target.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.2), inset 0 0 0 1px var(--primary)';
                            e.target.style.borderColor = 'var(--primary)';
                        }}
                        onBlur={(e) => {
                            e.target.style.transform = 'translateZ(20px) scale(1)';
                            e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3), inset 0 2px 5px rgba(255,255,255,0.05)';
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                    />
                </div>

                {/* Category Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', transformStyle: 'preserve-3d' }}>
                    {allCategories.map((category, i) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            style={{
                                padding: '0.8rem 1.5rem',
                                borderRadius: '30px',
                                border: '1px solid var(--border-color)',
                                borderBottom: selectedCategory === category ? 'none' : '4px solid var(--border-color)', // Remove bevel when pressed
                                background: selectedCategory === category
                                    ? 'linear-gradient(135deg, var(--primary), var(--secondary))'
                                    : 'var(--bg-glass)',
                                color: selectedCategory === category ? 'white' : 'var(--text-muted)',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                fontSize: '0.95rem',
                                fontWeight: selectedCategory === category ? '700' : '500',
                                boxShadow: selectedCategory === category
                                    ? '0 10px 25px var(--primary-glow), inset 0 2px 5px rgba(255,255,255,0.2)'
                                    : 'var(--shadow)',
                                transform: selectedCategory === category ? 'translateY(2px) scale(1.05)' : 'translateY(0)',
                                opacity: selectedCategory === category ? 1 : 0.8,
                                animation: 'fade-in 0.5s ease-out forwards',
                                animationDelay: `${i * 0.05}s`
                            }}
                            onMouseOver={(e) => {
                                if (selectedCategory !== category) {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.background = 'var(--bg-card)';
                                    e.currentTarget.style.color = 'var(--primary)';
                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (selectedCategory !== category) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.background = 'var(--bg-glass)';
                                    e.currentTarget.style.color = 'var(--text-muted)';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
                {filteredMentors.map((mentor, index) => (
                    <MentorCard key={mentor.id} mentor={mentor} index={index} />
                ))}
            </div>

            {filteredMentors.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <h3>No mentors found matching your search.</h3>
                </div>
            )}
        </div>
    );
};

const MentorCard = ({ mentor, index }) => {
    const [style, setStyle] = useState({});
    const [glareStyle, setGlareStyle] = useState({});

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();

        // Calculate rotational values
        const x = (e.clientX - left - width / 2) / 15;
        const y = (e.clientY - top - height / 2) / 15;

        // Calculate percentage for gradient positioning
        const mouseX = ((e.clientX - left) / width) * 100;
        const mouseY = ((e.clientY - top) / height) * 100;

        setStyle({
            transform: `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.08) translateY(-15px)`,
            boxShadow: `
                ${-x * 2}px ${y * 2}px 30px rgba(0, 0, 0, 0.4), 
                0 0 20px rgba(99, 102, 241, 0.2)
            `,
            background: `
                radial-gradient(
                    circle at ${mouseX}% ${mouseY}%, 
                    rgba(255, 255, 255, 0.1) 0%, 
                    rgba(99, 102, 241, 0.05) 30%, 
                    var(--bg-card) 100%
                )
            `,
            borderColor: 'rgba(255, 255, 255, 0.4)'
        });

        // Holographic/Coloring Glare Effect
        setGlareStyle({
            opacity: 1,
            background: `
                linear-gradient(
                    ${115 + x}deg, 
                    transparent 20%, 
                    rgba(255, 0, 150, 0.4) 40%, 
                    rgba(0, 255, 255, 0.4) 60%, 
                    transparent 80%
                )
            `,
            backgroundPosition: `${mouseX}% ${mouseY}%`
        });
    };

    const handleMouseLeave = () => {
        setStyle({
            transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1) translateY(0)',
            boxShadow: 'var(--shadow)',
            background: 'var(--bg-card)',
            borderColor: 'var(--border-color)'
        });
        setGlareStyle({ opacity: 0 });
    };

    return (
        <div
            className="animate-slide-up"
            style={{
                background: 'var(--bg-card)',
                borderRadius: '24px',
                padding: '3rem 2rem',
                textAlign: 'center',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow)',
                position: 'relative', // For absolute positioned glare
                transition: 'all 0.1s ease-out',
                animationDelay: `${index * 0.1}s`,
                cursor: 'pointer',
                overflow: 'hidden', // Contain the glare
                ...style
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Holographic Glare Overlay */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                pointerEvents: 'none',
                zIndex: 2,
                mixBlendMode: 'overlay',
                transition: 'opacity 0.2s',
                ...glareStyle
            }}></div>

            <div style={{
                position: 'relative', // Ensure content is above background but below glare (mostly) or handle z-index carefully
                zIndex: 3
            }}>
                <div style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    margin: '0 auto 1.5rem',
                    border: '4px solid rgba(99, 102, 241, 0.2)',
                    transform: 'translateZ(40px)',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                    transition: 'border-color 0.3s'
                }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)'}
                >
                    <img
                        src={mentor.image}
                        alt={mentor.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                <div style={{ transform: 'translateZ(30px)' }}>
                    <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: '700' }}>{mentor.name}</h3>
                    <p style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{mentor.role}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{mentor.email}</p>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
                    backdropFilter: 'blur(5px)',
                    padding: '1.2rem',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    marginBottom: '2rem',
                    transform: 'translateZ(30px)', // Distinct 3D layer
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}></div>
                    <p style={{
                        color: 'var(--text-muted)',
                        lineHeight: '1.6',
                        fontSize: '0.95rem',
                        margin: 0,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)' // Text floats inside the glass
                    }}>
                        "{mentor.bio}"
                    </p>
                </div>

                <style>{`
                    @keyframes float-skill {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-3px); }
                    }
                `}</style>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', transform: 'translateZ(50px)' }}> {/* Increased Z Depth */}
                    {mentor.expertise.map((skill, i) => (
                        <span
                            key={i}
                            style={{
                                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                                backdropFilter: 'blur(5px)',
                                color: 'var(--text-muted)',
                                padding: '0.6rem 1.2rem',
                                borderRadius: '30px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderBottom: '3px solid rgba(255,255,255,0.1)', // 3D Thickness
                                boxShadow: '0 5px 15px rgba(0,0,0,0.2)', // Deep shadow
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                cursor: 'default',
                                animation: `float-skill 3s ease-in-out infinite`,
                                animationDelay: `${i * 0.2}s`,
                                transformStyle: 'preserve-3d'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px) scale(1.1) translateZ(20px)'; // Super Lift
                                e.currentTarget.style.background = 'var(--primary)';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.boxShadow = '0 15px 30px var(--primary-glow), 0 5px 0 rgba(79, 70, 229, 0.5)'; // Colored 3D shadow
                                e.currentTarget.style.borderBottom = '3px solid typename(79, 70, 229, 0.5)';
                                e.currentTarget.style.borderColor = 'transparent';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1) translateZ(0)';
                                e.currentTarget.style.background = 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))';
                                e.currentTarget.style.color = 'var(--text-muted)';
                                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                                e.currentTarget.style.borderBottom = '3px solid rgba(255,255,255,0.1)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                            }}
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Mentors;
