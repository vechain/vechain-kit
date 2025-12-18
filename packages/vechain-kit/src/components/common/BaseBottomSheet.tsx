import { Box, useToken, VisuallyHidden } from '@chakra-ui/react';
import { Drawer } from 'vaul';
import { useEffect, useState, useRef } from 'react';
import { useVechainKitThemeConfig } from '@/providers';
import { BottomSheetProvider } from './BottomSheetContext';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    height?: string;
    children: React.ReactNode;
    ariaTitle: string;
    ariaDescription: string;
    isDismissable?: boolean;
    minHeight?: string;
    maxHeight?: string;
};

/**
 * HandleArea component for the bottom sheet drag indicator
 *
 * PROBLEM: When content scrolls in the bottom sheet, the sticky header (from StickyHeaderContainer)
 * gets a backdrop filter effect, but the drawer handle (drag indicator) above it doesn't,
 * creating a visual inconsistency where part of the top area has the effect and part doesn't.
 *
 * SOLUTION: This component makes the handle area also sticky and applies the same backdrop filter
 * effect when content scrolls below it. It uses an IntersectionObserver to detect when content
 * has scrolled past a sentinel element, similar to how StickyHeaderContainer works.
 *
 * IMPORTANT: The handle must be rendered INSIDE the scrollable container (not as a sibling)
 * so that the IntersectionObserver can properly detect scrolling within that container's viewport.
 * If the handle were outside the scrollable container, the observer wouldn't detect scroll events.
 */
const HandleArea = ({
    scrollableContainerRef,
    observerRef,
}: {
    scrollableContainerRef: React.RefObject<HTMLDivElement>;
    observerRef: React.RefObject<HTMLDivElement>;
}) => {
    const handleBg = useToken('colors', 'vechain-kit-border');
    const { tokens } = useVechainKitThemeConfig();
    const backdropFilter =
        tokens?.effects?.backdropFilter?.stickyHeader ?? 'blur(20px)';
    const [hasContentBelow, setHasContentBelow] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialMountRef = useRef(true);

    useEffect(() => {
        /**
         * IntersectionObserver callback that detects when the sentinel element
         * (observerRef) scrolls out of view. When it's not intersecting, it means
         * content has scrolled past the handle area, so we apply the backdrop filter.
         */
        const handleIntersection = ([entry]: IntersectionObserverEntry[]) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Debounce state updates to prevent rapid changes during animations
            timeoutRef.current = setTimeout(() => {
                // On initial mount, always start with false to prevent visual glitch
                if (isInitialMountRef.current) {
                    isInitialMountRef.current = false;
                    setHasContentBelow(false);
                    return;
                }
                // When sentinel is not intersecting, content has scrolled below
                setHasContentBelow(!entry.isIntersecting);
            }, 50);
        };

        const observerOptions: IntersectionObserverInit = {
            threshold: 0,
        };

        // Use the scrollable container as the root for the observer
        // This ensures we detect intersections relative to the scrollable viewport,
        // not the document viewport
        if (scrollableContainerRef.current) {
            observerOptions.root = scrollableContainerRef.current;
            observerOptions.rootMargin = '0px';
        }

        const observer = new IntersectionObserver(
            handleIntersection,
            observerOptions,
        );

        // Delay observation to avoid initial glitch when content is animating in
        const observeTimeout = setTimeout(() => {
            if (observerRef.current) {
                observer.observe(observerRef.current);
            }
        }, 200);

        return () => {
            clearTimeout(observeTimeout);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            observer.disconnect();
        };
    }, [scrollableContainerRef, observerRef]);

    return (
        <Box
            position="sticky"
            top="0"
            w="full"
            // Apply backdrop filter when content has scrolled below the handle
            // This matches the effect applied to StickyHeaderContainer for visual consistency
            backdropFilter={hasContentBelow ? backdropFilter : 'none'}
            style={{
                WebkitBackdropFilter: hasContentBelow ? backdropFilter : 'none',
            }}
            zIndex={999}
            transition="backdrop-filter 0.2s ease-in-out"
        >
            {/* Drawer handle / drag indicator */}
            <Box
                mx={'auto'}
                w={'34px'}
                h={'5px'}
                bg={handleBg}
                mt={4}
                rounded={'full'}
            />
        </Box>
    );
};

export const BaseBottomSheet = ({
    isOpen,
    onClose,
    children,
    ariaTitle,
    ariaDescription,
    isDismissable = true,
    minHeight,
    maxHeight = '68vh',
}: Props) => {
    // Use semantic tokens for bottom sheet and overlay colors
    const modalBg = useToken('colors', 'vechain-kit-modal');
    const overlayBg = useToken('colors', 'vechain-kit-overlay');
    const scrollableContainerRef = useRef<HTMLDivElement>(null);
    const handleObserverRef = useRef<HTMLDivElement>(null);

    // Get backdrop filter from tokens context
    const { tokens } = useVechainKitThemeConfig();
    const overlayBackdropFilter = tokens?.effects?.backdropFilter?.overlay;
    const modalBorder = tokens?.colors?.border?.modal || 'none';

    return (
        <Drawer.Root
            dismissible={isDismissable}
            shouldScaleBackground
            repositionInputs={false}
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            <Drawer.Portal>
                <Drawer.Overlay
                    style={{
                        zIndex: 100,
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        backgroundColor: overlayBg,
                        backdropFilter: overlayBackdropFilter,
                        WebkitBackdropFilter: overlayBackdropFilter,
                    }}
                />
                <Drawer.Content
                    aria-description={ariaDescription}
                    aria-labelledby={ariaTitle}
                    style={{
                        zIndex: 101,
                        backgroundColor: modalBg,
                        borderRadius: '24px 24px 0 0',
                        border: modalBorder,
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        ...(minHeight && { minHeight }),
                        maxHeight,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <VisuallyHidden>
                        <Drawer.Title id={ariaTitle}>{ariaTitle}</Drawer.Title>
                    </VisuallyHidden>

                    {/* 
                        Scrollable container that wraps all content.
                        The handle must be INSIDE this container (not as a sibling) so that:
                        1. The IntersectionObserver can detect scrolling within this container's viewport
                        2. The handle can be sticky relative to this scrollable container
                        3. The backdrop filter effect works consistently with StickyHeaderContainer
                    */}
                    <Box ref={scrollableContainerRef} flex="1" overflowY="auto">
                        {/* 
                            Sticky handle area that gets backdrop filter when content scrolls.
                            Positioned first so it stays at the top when scrolling.
                        */}
                        <HandleArea
                            scrollableContainerRef={scrollableContainerRef}
                            observerRef={handleObserverRef}
                        />
                        {/* 
                            Sentinel element for IntersectionObserver.
                            When this invisible 1px element scrolls out of view, it means content
                            has scrolled past the handle area, triggering the backdrop filter effect.
                            Positioned right after the handle so it's at the boundary between
                            handle and content.
                        */}
                        <div
                            ref={handleObserverRef}
                            style={{
                                height: '1px',
                                width: '100%',
                                // pointerEvents: 'none',
                                visibility: 'hidden',
                                marginTop: '-1px',
                            }}
                        />
                        <BottomSheetProvider>{children}</BottomSheetProvider>
                    </Box>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
};
