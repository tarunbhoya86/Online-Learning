import React from 'react';

const RevenueChart = ({ data, onDownload }) => {
    // Use passed data or fallback mock data
    const points = data && data.length > 0 ? data : [20, 45, 30, 60, 50, 80, 65];
    const maxVal = Math.max(...points, 100); // Ensure at least some height
    const minVal = Math.min(...points);
    const height = 200;
    const width = 800; // Viewbox width

    // Improved Scale logic ensures graph uses full height without clipping
    const scaleY = (val) => height - ((val / (maxVal * 1.2)) * height); // Scale with 20% margin
    const scaleX = (idx) => (idx / (points.length - 1)) * width;

    // Generate Path
    const pathD = points.map((p, i) =>
        `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(p)}`
    ).join(' ');

    // Generate Area fill path (closes the loop at bottom)
    const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

    return (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.3rem' }}>Revenue Analytics</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Income trends over the last 7 days</p>
                </div>
                <button onClick={onDownload} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'text-bottom' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download Report
                </button>
            </div>

            <div style={{ position: 'relative', width: '100%', height: '250px', overflow: 'hidden' }}>
                <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <defs>
                        <linearGradient id="gradientRevenue" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 1, 2, 3, 4].map(i => (
                        <line
                            key={i}
                            x1="0"
                            y1={i * (height / 4)}
                            x2={width}
                            y2={i * (height / 4)}
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Area Fill */}
                    <path
                        d={areaD}
                        fill="url(#gradientRevenue)"
                        className="animate-fade-in"
                        style={{ animationDuration: '1s' }}
                    />

                    {/* Stroke Line */}
                    <path
                        d={pathD}
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-draw" // We can add a draw animation here if we want using dasharray
                        style={{
                            strokeDasharray: 2000,
                            strokeDashoffset: 0,
                            animation: 'dash 2s ease-out forwards'
                        }}
                    />

                    {/* Points and Tooltips (CSS magic) */}
                    {points.map((p, i) => (
                        <g key={i} className="chart-point" style={{ cursor: 'pointer' }}>
                            <circle
                                cx={scaleX(i)}
                                cy={scaleY(p)}
                                r="4"
                                fill="var(--bg-body)"
                                stroke="var(--primary)"
                                strokeWidth="2"
                                style={{ transition: 'all 0.2s' }}
                            />
                            <circle
                                cx={scaleX(i)}
                                cy={scaleY(p)}
                                r="12"
                                fill="transparent"
                            />
                            {/* Hover info could be added here or strictly handled via CSS/Js mouseover */}
                        </g>
                    ))}
                </svg>

                {/* CSS for draw animation */}
                <style>{`
                    @keyframes dash {
                        from { stroke-dashoffset: 2000; }
                        to { stroke-dashoffset: 0; }
                    }
                    .chart-point:hover circle:first-child {
                        r: 6;
                        fill: var(--primary);
                    }
                `}</style>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
        </div>
    );
};

export default RevenueChart;
