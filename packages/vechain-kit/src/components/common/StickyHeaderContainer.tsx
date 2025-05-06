import { useVeChainKitConfig } from '@/providers';
import { Box, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState, useRef, useMemo } from 'react';

type Props = {
    children: React.ReactNode;
};

export const StickyHeaderContainer = ({ children }: Props) => {
    const [hasContentBelow, setHasContentBelow] = useState(false);
    const observerRef = useRef<HTMLDivElement>(null);
    const { darkMode: isDark, useBottomSheet } = useVeChainKitConfig();
    const [isDesktop] = useMediaQuery('(min-width: 768px)');

    const isUsingModal = useMemo(() => {
        return isDesktop || useBottomSheet === false;
    }, [useBottomSheet, isDesktop]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setHasContentBelow(!entry.isIntersecting);
            },
            { threshold: 0 },
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Box
                position={isUsingModal ? 'sticky' : 'relative'}
                top={'0'}
                left={'0'}
                w={'full'}
                borderRadius={'24px 24px 0px 0px'}
                bg={
                    isUsingModal
                        ? isDark
                            ? 'rgb(31 31 30 / 90%)'
                            : 'rgb(255 255 255 / 69%)'
                        : 'transparent'
                }
                backdropFilter={isUsingModal ? 'blur(12px)' : 'none'}
                style={
                    isUsingModal ? { WebkitBackdropFilter: 'blur(12px)' } : {}
                }
                zIndex={1000}
                boxShadow={
                    isUsingModal && hasContentBelow
                        ? '0px 2px 4px 1px rgb(0 0 0 / 10%)'
                        : 'none'
                }
                transition="box-shadow 0.2s ease-in-out"
            >
                {children}
            </Box>
            <div
                ref={observerRef}
                style={{ position: 'absolute', top: '25px' }}
            />
        </>
    );
};
