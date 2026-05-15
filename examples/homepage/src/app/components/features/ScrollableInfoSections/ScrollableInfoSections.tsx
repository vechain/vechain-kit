'use client';

import { useRef, useEffect, useState } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { InfoSection } from '@/app/components/features/InfoSection';
import { LoginMethodsSection } from '../LoginMethodsSection';
import { LanguagesSection } from '../LanguagesSection';
import { AISection } from '../AISection';
import { BoostedDevSection } from '../BoostedDevSection';

interface ScrollableSection {
    bg?: string;
    title: string;
    content: string;
    imageSrc: string;
    imageAlt: string;
    imageWidth?: string;
    mobileImageSrc?: string;
    isLoginMethods?: boolean;
    isLanguages?: boolean;
    isAi?: boolean;
    isBoosted?: boolean;
}

export function ScrollableInfoSections() {
    const { t } = useTranslation();
    const sections: ScrollableSection[] = [
        {
            bg: '#e0daea',
            title: t('No blockchain plumbing'),
            content: t(
                'RPC endpoints, chain configs, connection handlers — pre-wired with sensible defaults so you can focus on your app.',
            ),
            imageSrc:
                'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/out.webm',
            mobileImageSrc:
                'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/previewed+(4).png',
            imageAlt: t('VeChain Kit'),
            imageWidth: '950px',
        },
        {
            bg: '#dae8fb',
            title: t('Hooks, not boilerplate'),
            content: t(
                'Type-safe React hooks for wallets, balances, transactions, and contracts.',
            ),
            imageSrc: '',
            imageAlt: t('VeChain Kit'),
            isBoosted: true,
        },
        {
            bg: '#e8e0d3',
            title: t('AI-native development'),
            content: t(
                'Plug VeChain expertise into your coding agent. Claude Code, Cursor, and any MCP-compatible agent get deep context on VeChain Kit, smart contracts, VeBetterDAO, and more.',
            ),
            imageSrc: '',
            imageAlt: t('VeChain AI Skills'),
            isAi: true,
        },
        {
            bg: '#eae3d1',
            title: t('Yours to shape'),
            content: t(
                'Theme it, override it, or build on top — every screen, modal, and button is opt-in.',
            ),
            imageSrc:
                'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/image1+4.png',
            imageAlt: t('VeChain Kit'),
            imageWidth: '600px',
        },
        {
            bg: '#dae8fb',
            title: t('Login your way'),
            content: t(
                'VeWorld, WalletConnect, social logins (Google, Apple, X, GitHub), passkeys, and more — pick what fits your users.',
            ),
            imageSrc:
                'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/kit1.png',
            imageAlt: t('Login methods'),
            imageWidth: '550px',
            isLoginMethods: true,
        },
        {
            bg: '#e1e5e4',
            title: t('Speaks 15 languages'),
            content: t(
                'Built-in translations sync both ways with your app — switch locale once, the kit follows.',
            ),
            imageSrc:
                'https://cdn.prod.website-files.com/685387e21f37b28674efb768/685c258fb5b73e62bd8de0c0_0e9040e92251da2f7c363a4f48682fee_5-4.webp',
            imageAlt: t('Multiple language support'),
            imageWidth: '400px',
            isLanguages: true,
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
                        {section.isLoginMethods ? (
                            <LoginMethodsSection
                                bg={section.bg}
                                title={section.title}
                                content={section.content}
                            />
                        ) : section.isLanguages ? (
                            <LanguagesSection
                                bg={section.bg}
                                title={section.title}
                                content={section.content}
                            />
                        ) : section.isAi ? (
                            <AISection
                                bg={section.bg}
                                title={section.title}
                                content={section.content}
                            />
                        ) : section.isBoosted ? (
                            <BoostedDevSection
                                bg={section.bg}
                                title={section.title}
                                content={section.content}
                            />
                        ) : (
                            <InfoSection
                                bg={section.bg}
                                title={section.title}
                                content={section.content}
                                imageSrc={section.imageSrc}
                                imageAlt={section.imageAlt}
                                imageWidth={section.imageWidth}
                                mobileImageSrc={section.mobileImageSrc}
                            />
                        )}
                    </Box>
                );
            })}
        </VStack>
    );
}
