import { Box } from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { useVechainKitThemeConfig } from '@/providers';

type Props = {
    children: React.ReactNode;
};

export const StickyHeaderContainer = ({ children }: Props) => {
    const [hasContentBelow, setHasContentBelow] = useState(false);
    const observerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialMountRef = useRef(true);

    // Use semantic tokens for sticky header
    const { tokens } = useVechainKitThemeConfig();
    const backdropFilter =
        tokens?.effects?.backdropFilter?.stickyHeader ?? 'blur(20px)';

    useEffect(() => {
        // Ignore intersection changes during initial mount and transitions
        // This prevents the glitch when content is animating in
        const handleIntersection = ([entry]: IntersectionObserverEntry[]) => {
            // Clear any pending timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Debounce the state update to prevent rapid changes during animations
            timeoutRef.current = setTimeout(() => {
                // On initial mount, always start with false to prevent glitch
                if (isInitialMountRef.current) {
                    isInitialMountRef.current = false;
                    setHasContentBelow(false);
                    return;
                }
                setHasContentBelow(!entry.isIntersecting);
            }, 50); // Small debounce to let animations settle
        };

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0,
        });

        // Delay observation slightly to avoid initial glitch
        const observeTimeout = setTimeout(() => {
            if (observerRef.current) {
                observer.observe(observerRef.current);
            }
        }, 200); // Wait for animation to complete (0.17s + small buffer)

        return () => {
            clearTimeout(observeTimeout);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <Box
                position={'sticky'}
                top={'0'}
                left={'0'}
                w={'full'}
                borderRadius={'24px 24px 0px 0px'}
                backdropFilter={hasContentBelow ? backdropFilter : 'none'}
                style={{
                    WebkitBackdropFilter: hasContentBelow
                        ? backdropFilter
                        : 'none',
                }}
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
