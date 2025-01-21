import { useVeChainKitConfig } from '@/providers';
import { Box } from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';

type Props = {
    children: React.ReactNode;
};

export const StickyHeaderContainer = ({ children }: Props) => {
    const { darkMode: isDark } = useVeChainKitConfig();
    const [hasContentBelow, setHasContentBelow] = useState(false);
    const observerRef = useRef<HTMLDivElement>(null);

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
                position={'sticky'}
                top={'0'}
                left={'0'}
                w={'full'}
                borderRadius={'24px 24px 0px 0px'}
                bg={
                    isDark
                        ? 'rgba(31, 31, 30, 0.8)'
                        : 'rgba(255, 255, 255, 0.8)'
                }
                backdropFilter={'blur(12px)'}
                style={{ WebkitBackdropFilter: 'blur(12px)' }}
                zIndex={1000}
                boxShadow={
                    hasContentBelow
                        ? '0px 3px 1px 1px rgb(0 0 0 / 10%)'
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
