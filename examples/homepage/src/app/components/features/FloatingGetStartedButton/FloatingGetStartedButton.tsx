'use client';

import { useEffect, useState, useRef } from 'react';
import { Button, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface FloatingGetStartedButtonProps {
    heroSectionRef: React.RefObject<HTMLDivElement>;
    scrollableSectionsRef: React.RefObject<HTMLDivElement>;
}

export function FloatingGetStartedButton({
    heroSectionRef,
    scrollableSectionsRef,
}: FloatingGetStartedButtonProps) {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!heroSectionRef.current || !scrollableSectionsRef.current) {
                return;
            }

            const heroRect = heroSectionRef.current.getBoundingClientRect();
            const scrollableRect =
                scrollableSectionsRef.current.getBoundingClientRect();

            // Show button when hero section is scrolled past and scrollable sections are in view
            const heroBottom = heroRect.bottom;
            const scrollableTop = scrollableRect.top;
            const windowHeight = window.innerHeight;

            // Button appears when:
            // 1. Hero section bottom is above viewport top (scrolled past)
            // 2. Scrollable sections are visible (top is above viewport bottom)
            const shouldShow = heroBottom < 0 && scrollableTop < windowHeight;

            setIsVisible(shouldShow);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [heroSectionRef, scrollableSectionsRef]);

    return (
        <Box
            ref={buttonRef}
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            zIndex={100}
            px={4}
            pb={4}
            pointerEvents={isVisible ? 'auto' : 'none'}
            transition="opacity 0.3s ease-in-out, transform 0.3s ease-in-out"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(100%)'}
            display="flex"
            justifyContent="center"
        >
            <Button
                variant="homepagePrimary"
                size="lg"
                maxW="400px"
                boxShadow={'0px 2px 20px 10px rgb(150 150 150 / 32%)'}
                _hover={{
                    transform: 'translateY(-2px)',
                }}
                as="a"
                href="https://docs.vechainkit.vechain.org/quickstart/installation"
                rel="noopener noreferrer"
            >
                {t('Get Started Now')} 🚀
            </Button>
        </Box>
    );
}
