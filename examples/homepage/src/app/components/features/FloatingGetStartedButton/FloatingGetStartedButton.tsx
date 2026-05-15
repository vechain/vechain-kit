'use client';

import { useEffect, useState, useRef } from 'react';
import { Button, Box, Icon, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuSparkles } from 'react-icons/lu';
import { DocsModal } from '../DocsModal';

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
    const [isAskDocsMode, setIsAskDocsMode] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const scrollToQuickStart = () => {
        const el = document.getElementById('quick-start');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (!heroSectionRef.current || !scrollableSectionsRef.current) {
                return;
            }

            const heroRect = heroSectionRef.current.getBoundingClientRect();
            const scrollableRect =
                scrollableSectionsRef.current.getBoundingClientRect();

            const heroBottom = heroRect.bottom;
            const scrollableTop = scrollableRect.top;
            const windowHeight = window.innerHeight;

            // Button appears once the hero section has scrolled past and the
            // scrollable sections (or anything below them) are in view.
            const shouldShow = heroBottom < 0 && scrollableTop < windowHeight;
            setIsVisible(shouldShow);

            // Once the QuickStart section enters the viewport, the user has
            // "arrived" — flip the button into Ask Docs mode.
            const quickStartEl = document.getElementById('quick-start');
            if (quickStartEl) {
                const quickStartTop =
                    quickStartEl.getBoundingClientRect().top;
                setIsAskDocsMode(quickStartTop < windowHeight);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [heroSectionRef, scrollableSectionsRef]);

    return (
        <>
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
                {isAskDocsMode ? (
                    <Button
                        variant="homepagePrimary"
                        size="lg"
                        maxW="400px"
                        boxShadow={'0px 2px 20px 10px rgb(150 150 150 / 32%)'}
                        _hover={{ transform: 'translateY(-2px)' }}
                        onClick={onOpen}
                        leftIcon={<Icon as={LuSparkles} />}
                    >
                        {t('Ask Docs')}
                    </Button>
                ) : (
                    <Button
                        variant="homepagePrimary"
                        size="lg"
                        maxW="400px"
                        boxShadow={'0px 2px 20px 10px rgb(150 150 150 / 32%)'}
                        _hover={{ transform: 'translateY(-2px)' }}
                        onClick={scrollToQuickStart}
                    >
                        {t('Get Started')} 🚀
                    </Button>
                )}
            </Box>
            <DocsModal isOpen={isOpen} onClose={onClose} />
        </>
    );
}
