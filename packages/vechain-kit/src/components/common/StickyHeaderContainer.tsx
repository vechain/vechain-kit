import { useVeChainKitConfig } from '@/providers';
import { Box } from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';

type Props = {
    children: React.ReactNode;
};

export const StickyHeaderContainer = ({ children }: Props) => {
    const [hasContentBelow, setHasContentBelow] = useState(false);
    const observerRef = useRef<HTMLDivElement>(null);
    const { darkMode: isDark } = useVeChainKitConfig();
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
                    hasContentBelow
                        ? isDark
                            ? 'rgba(21, 21, 21, 0.6)'
                            : 'rgba(255, 255, 255, 0.6)'
                        : 'transparent'
                }
                backdropFilter={hasContentBelow ? 'blur(15px)' : 'none'}
                style={
                    hasContentBelow
                        ? { WebkitBackdropFilter: 'blur(15px)' }
                        : {
                              WebkitBackdropFilter: 'none',
                          }
                }
                zIndex={1000}
                boxShadow={
                    hasContentBelow
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
