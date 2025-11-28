'use client';

import { Box } from '@chakra-ui/react';
import React from 'react';

export function ColorfulBackground() {
    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={0}
            overflow="hidden"
            sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradientShift 15s ease infinite',
                '@keyframes gradientShift': {
                    '0%': {
                        backgroundPosition: '0% 50%',
                    },
                    '50%': {
                        backgroundPosition: '100% 50%',
                    },
                    '100%': {
                        backgroundPosition: '0% 50%',
                    },
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                    animation: 'rotate 20s linear infinite',
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    background: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)',
                    animation: 'pulse 8s ease-in-out infinite',
                },
                '@keyframes rotate': {
                    '0%': {
                        transform: 'rotate(0deg)',
                    },
                    '100%': {
                        transform: 'rotate(360deg)',
                    },
                },
                '@keyframes pulse': {
                    '0%, 100%': {
                        opacity: 1,
                    },
                    '50%': {
                        opacity: 0.7,
                    },
                },
            }}
        >
            {/* Floating colorful shapes */}
            <Box
                position="absolute"
                top="10%"
                left="10%"
                width="200px"
                height="200px"
                borderRadius="50%"
                bg="rgba(255, 100, 150, 0.3)"
                filter="blur(40px)"
                animation="float1 6s ease-in-out infinite"
                sx={{
                    '@keyframes float1': {
                        '0%, 100%': {
                            transform: 'translate(0, 0) scale(1)',
                        },
                        '50%': {
                            transform: 'translate(30px, -30px) scale(1.2)',
                        },
                    },
                }}
            />
            <Box
                position="absolute"
                top="60%"
                right="15%"
                width="300px"
                height="300px"
                borderRadius="50%"
                bg="rgba(100, 200, 255, 0.3)"
                filter="blur(50px)"
                animation="float2 8s ease-in-out infinite"
                sx={{
                    '@keyframes float2': {
                        '0%, 100%': {
                            transform: 'translate(0, 0) scale(1)',
                        },
                        '50%': {
                            transform: 'translate(-40px, 40px) scale(1.1)',
                        },
                    },
                }}
            />
            <Box
                position="absolute"
                bottom="20%"
                left="30%"
                width="250px"
                height="250px"
                borderRadius="50%"
                bg="rgba(200, 100, 255, 0.3)"
                filter="blur(45px)"
                animation="float3 7s ease-in-out infinite"
                sx={{
                    '@keyframes float3': {
                        '0%, 100%': {
                            transform: 'translate(0, 0) scale(1)',
                        },
                        '50%': {
                            transform: 'translate(50px, -50px) scale(1.15)',
                        },
                    },
                }}
            />
            <Box
                position="absolute"
                top="30%"
                right="40%"
                width="180px"
                height="180px"
                borderRadius="50%"
                bg="rgba(255, 200, 100, 0.3)"
                filter="blur(35px)"
                animation="float4 9s ease-in-out infinite"
                sx={{
                    '@keyframes float4': {
                        '0%, 100%': {
                            transform: 'translate(0, 0) scale(1)',
                        },
                        '50%': {
                            transform: 'translate(-30px, 30px) scale(1.2)',
                        },
                    },
                }}
            />
        </Box>
    );
}

