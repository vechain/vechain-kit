import { Box, useColorMode } from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';

type Props = {
    children: React.ReactNode;
};

export const StickyHeaderContainer = ({ children }: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
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
                bg={isDark ? '#1f1f1e' : 'white'}
                zIndex={1000}
                boxShadow={
                    hasContentBelow
                        ? '0px 2px 13px -1px rgb(0 0 0 / 68%)'
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
