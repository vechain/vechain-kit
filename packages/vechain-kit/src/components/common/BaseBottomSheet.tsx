import { Box, useToken, VisuallyHidden } from '@chakra-ui/react';
import { Drawer } from 'vaul';
import { useEffect, useRef } from 'react';
import { useVechainKitThemeConfig } from '@/providers';

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
    observerRef,
}: {
    scrollableContainerRef: React.RefObject<HTMLDivElement>;
    observerRef: React.RefObject<HTMLDivElement>;
}) => {
    const handleBg = useToken('colors', 'vechain-kit-border');
    const { tokens } = useVechainKitThemeConfig();
    const backdropFilter =
        tokens?.effects?.backdropFilter?.stickyHeader ?? 'blur(20px)';

    useEffect(() => {
        // Just clean up the observer refs to avoid memory leaks
        // No state management needed - backdrop filter is always applied now
        const observeTimeout = setTimeout(() => {
            if (observerRef.current) {
                // Observer kept for future use if needed
            }
        }, 200);

        return () => {
            clearTimeout(observeTimeout);
        };
    }, [observerRef]);

    return (
        <Box
            position="sticky"
            top="0"
            w="full"
            // Keep backdrop filter always applied (no toggling)
            backdropFilter={backdropFilter}
            style={{
                WebkitBackdropFilter: backdropFilter,
            }}
            zIndex={999}
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
                        {children}
                    </Box>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
};
