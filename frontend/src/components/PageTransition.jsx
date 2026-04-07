import React from 'react';

const PageTransition = ({ children }) => {
    return (
        <div
            className="animate-slide-up"
            style={{
                width: '100%',
                animationDuration: '0.5s',
                animationFillMode: 'both'
            }}
        >
            {children}
        </div>
    );
};

export default PageTransition;
