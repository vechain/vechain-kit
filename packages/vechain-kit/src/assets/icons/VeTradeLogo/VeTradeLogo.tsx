import React, { useId } from 'react';

export const VeTradeLogo = ({ boxSize = '24px', ...props }: { boxSize?: string; [key: string]: any }) => {
    const id = useId();
    const gradient1Id = `vetrade-gradient-1-${id}`;
    const gradient2Id = `vetrade-gradient-2-${id}`;
    
    return (
        <svg
            width={boxSize}
            height={boxSize}
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <defs>
                <linearGradient id={gradient1Id} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
                <linearGradient id={gradient2Id} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
            </defs>
            <g transform="rotate(-30 256 256)">
                <path
                    d="M440.712 282.966c-32.398-54.779-92.034-91.509-160.268-91.509v32.705c0 11.693-13.789 17.925-22.566 10.197L156.16 144.796c-6.145-5.411-6.144-14.988.003-20.397l101.718-89.512c8.777-7.724 22.563-1.492 22.563 10.2v32.716c110.627 0 193.535 94.769 185.668 199.701C465.114 290.808 447.503 294.449 440.712 282.966z"
                    fill={`url(#${gradient1Id})`}
                />
                <path
                    d="M71.285 229.034c32.398 54.779 92.034 91.509 160.268 91.509v-32.705c0-11.693 13.789-17.925 22.566-10.197l101.718 89.563c6.145 5.411 6.144 14.988-.003 20.397l-101.718 89.512c-8.777 7.724-22.563 1.492-22.563-10.2l0-32.716c-110.627 0-193.535-94.768-185.668-199.701C46.882 221.192 64.493 217.551 71.285 229.034z"
                    fill={`url(#${gradient2Id})`}
                />
            </g>
            <rect width="512" height="512" rx="8" fill="none" />
        </svg>
    );
};

