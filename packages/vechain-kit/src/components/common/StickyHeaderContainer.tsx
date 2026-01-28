import { Box } from '@chakra-ui/react';
import { useEffect, useState, useRef, createContext, useContext } from 'react';
import { useVechainKitThemeConfig } from '../../providers';

type Props = {
    children: React.ReactNode;
};

// Context to share hasContentBelow state with bottom sheet handle
const StickyHeaderContext = createContext<{
    hasContentBelow: boolean;
}>({ hasContentBelow: false });

export const useStickyHeaderContext = () => useContext(StickyHeaderContext);

export const StickyHeaderContainer = ({ children }: Props) => {
    const [hasContentBelow, setHasContentBelow] = useState(false);
    const observerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialMountRef = useRef(true);

    // Use semantic tokens for sticky header
    const { tokens } = useVechainKitThemeConfig();
    const backdropFilter =
        tokens?.effects?.backdropFilter?.stickyHeader ?? 'blur(20px)';

    useEffect(() => {
        // Find the scrollable container (parent with overflow-y: auto)
        const findScrollableContainer = (
            element: HTMLElement | null,
        ): HTMLElement | null => {
            if (!element) return null;
            let current: HTMLElement | null = element.parentElement;
            while (current) {
                const style = window.getComputedStyle(current);
                if (
                    style.overflowY === 'auto' ||
                    style.overflowY === 'scroll' ||
                    style.overflow === 'auto' ||
                    style.overflow === 'scroll'
                ) {
                    return current;
                }
                current = current.parentElement;
            }
            return null;
        };

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

        const scrollableContainer = findScrollableContainer(headerRef.current);

        const observerOptions: IntersectionObserverInit = {
            threshold: 0,
        };

        // If we found a scrollable container, use it as the root
        if (scrollableContainer) {
            observerOptions.root = scrollableContainer;
            observerOptions.rootMargin = '0px';
        }

        const observer = new IntersectionObserver(
            handleIntersection,
            observerOptions,
        );

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
        <StickyHeaderContext.Provider value={{ hasContentBelow }}>
            <Box
                ref={headerRef}
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
                style={{
                    height: '1px',
                    width: '100%',
                    pointerEvents: 'none',
                    visibility: 'hidden',
                    marginTop: '-1px',
                }}
            />
        </StickyHeaderContext.Provider>
    );
};
