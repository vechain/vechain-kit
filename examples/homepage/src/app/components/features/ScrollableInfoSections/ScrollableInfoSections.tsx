'use client';

import { useRef, useEffect, useState } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { InfoSection } from '@/app/components/features/InfoSection';

interface ScrollableSection {
    bg?: string;
    title: string;
    content: string;
    imageSrc: string;
    imageAlt: string;
    imageWidth?: string;
}

export function ScrollableInfoSections() {
    const sections: ScrollableSection[] = [
        {
            bg: '#e0daea',
            title: 'Seamless Wallet Integration',
            content:
                'Connect your users to your dApp with out-of-the-box wallet connection options. Support for VeWorld, Sync2, WalletConnect, and social logins including Google, Twitter, Email, and more.',
            imageSrc:
                'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/kit1.png',
            imageAlt: 'VeChain Kit',
            imageWidth: '550px',
        },
        {
            bg: '#dae8fb',
            title: 'Boosted Development',
            content:
                'Use our hooks and components to speed up your development. No need to worry about the underlying VeChain infrastructure—we handle it for you. Focus on building your dApp, not the blockchain integration.',
            imageSrc:
                'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/MyApp.png',
            imageAlt: 'VeChain Kit',
            imageWidth: '550px',
        },
        {
            bg: '#eae3d1',
            title: 'Style Customization',
            content:
                "The kit is designed to be customizable to your needs. Decide what features you want to use and which ones you don't. Add call-to-action buttons to your app to guide your users to the features they need.",
            imageSrc:
                'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/vechain-kit-v2-shocase.png',
            imageAlt: 'VeChain Kit',
            imageWidth: '400px',
        },
        {
            bg: '#e1e5e4',
            title: 'Multiple language support',
            content:
                'The kit supports multiple languages out of the box allowing bidirectional sync between the kit and the host app.',
            imageSrc:
                'https://cdn.prod.website-files.com/685387e21f37b28674efb768/685c258fb5b73e62bd8de0c0_0e9040e92251da2f7c363a4f48682fee_5-4.webp',
            imageAlt: 'Multiple language support',
            imageWidth: '400px',
        },
    ];

    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [scrollProgresses, setScrollProgresses] = useState<number[]>(
        new Array(sections.length - 1).fill(0),
    );
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        checkDesktop();
        window.addEventListener('resize', checkDesktop);

        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    useEffect(() => {
        if (!isDesktop || sectionRefs.current.length < sections.length) {
            return;
        }

        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const newProgresses: number[] = [];

            // Calculate progress for each section pair
            for (let i = 0; i < sections.length - 1; i++) {
                const currentSection = sectionRefs.current[i];
                const nextSection = sectionRefs.current[i + 1];

                if (!currentSection || !nextSection) {
                    newProgresses.push(0);
                    continue;
                }

                const nextRect = nextSection.getBoundingClientRect();
                const nextSectionTop = nextRect.top;

                // Calculate progress: fade starts when next section enters viewport
                // and completes when it reaches the top
                const progress = Math.max(
                    0,
                    Math.min(1, (windowHeight - nextSectionTop) / windowHeight),
                );

                newProgresses.push(progress);
            }

            setScrollProgresses(newProgresses);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial calculation

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isDesktop, sections.length]);

    const getSectionStyle = (index: number) => {
        const isLast = index === sections.length - 1;
        // Only the section being covered should fade
        // scrollProgresses[index] tracks how much the NEXT section has scrolled over this one
        const progress = isLast ? 0 : scrollProgresses[index];

        // Each section (except last) fades out and scales down as next section scrolls over it
        // The section scrolling over stays at opacity 1 (it's not affected by this progress value)
        const opacity = isDesktop && !isLast ? 1 - progress : 1;
        const scale = isDesktop && !isLast ? 1 - (1 - 0.85231) * progress : 1;
        const transform = isDesktop
            ? `translate3d(0px, 0px, 0px) scale3d(${scale}, ${scale}, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)`
            : 'none';

        return {
            willChange: isDesktop ? ('opacity, transform' as const) : 'auto',
            opacity,
            transform,
            ...(isDesktop && { transformStyle: 'preserve-3d' as const }),
        };
    };

    return (
        <VStack spacing={12} align="stretch">
            {sections.map((section, index) => {
                const isLast = index === sections.length - 1;
                // Later sections should have higher z-index so they can scroll over earlier ones
                const zIndex = isDesktop ? index + 1 : 'auto';

                return (
                    <Box
                        key={index}
                        ref={(el) => {
                            sectionRefs.current[index] = el;
                        }}
                        position={isDesktop && !isLast ? 'sticky' : 'relative'}
                        top={isDesktop && !isLast ? 0 : 'auto'}
                        zIndex={zIndex}
                        style={getSectionStyle(index)}
                    >
                        <InfoSection
                            bg={section.bg}
                            title={section.title}
                            content={section.content}
                            imageSrc={section.imageSrc}
                            imageAlt={section.imageAlt}
                            imageWidth={section.imageWidth}
                        />
                    </Box>
                );
            })}
        </VStack>
    );
}
