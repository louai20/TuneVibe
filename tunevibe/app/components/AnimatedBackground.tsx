// src/components/AnimatedBackground.tsx

import React from 'react';

const AnimatedBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#22577A] via-[#38A3A5] to-[#C7F9CC] animate-gradient" />
            <style jsx>{`
                @keyframes gradient {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
                .animate-gradient {
                    animation: gradient 10s ease infinite;
                    background-size: 300% 300%;
                }
            `}</style>
        </div>
    );
};

export default AnimatedBackground;

