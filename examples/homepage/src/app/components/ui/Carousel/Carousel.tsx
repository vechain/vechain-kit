'use client';

import { themeColors } from '@/app/theme/colors';
import { Box, Flex, HStack, Text, useBreakpointValue } from '@chakra-ui/react';
import {
    useRef,
    useEffect,
    useState,
    ReactNode,
    useCallback,
    useMemo,
} from 'react';

const PaginationButton = ({
    onClick,
    isActive,
    children,
}: {
    onClick: () => void;
    isActive: boolean;
    children: ReactNode;
}) => {
    return (
        <Text
            as="span"
            height="32px"
            width="32px"
            aspectRatio="1/1"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={themeColors.secondary[200]}
            border="1px solid"
            borderColor={themeColors.secondary[300]}
            color={isActive ? 'gray.900' : 'gray.500'}
            borderRadius="full"
            onClick={isActive ? onClick : undefined}
            cursor={isActive ? 'pointer' : 'auto'}
            _hover={{
                bg: isActive
                    ? themeColors.secondary[100]
                    : themeColors.secondary[200],
            }}
            userSelect="none"
        >
            {children}
        </Text>
    );
};

interface CarouselProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
    itemWidth?: number;
    itemSpacing?: number;
    onItemClick?: (index: number, e?: React.MouseEvent) => void;
    onSelectItem?: (item: T) => void;
    wideMode?: boolean;
    blurSideItems?: boolean;
    isMobile?: boolean;
    infiniteLoop?: boolean;
}

export const Carousel = <T,>({
    items,
    renderItem,
    itemWidth = 300,
    itemSpacing = 0,
    onItemClick,
    onSelectItem,
    wideMode = true,
    blurSideItems = true,
    isMobile: _isMobile,
    infiniteLoop = false,
}: CarouselProps<T>) => {
    const breakpointValue = useBreakpointValue({ base: true, md: false });
    const isMobile = _isMobile ?? breakpointValue;

    // For infinite loop, we need to duplicate items
    const displayItems = useMemo(() => {
        if (infiniteLoop && items.length > 1) {
            return [...items, ...items, ...items];
        }
        return items;
    }, [items, infiniteLoop]);

    // Calculate the offset for infinite loop (start in the middle set)
    const infiniteOffset = useMemo(() => {
        if (infiniteLoop && items.length > 1) {
            return items.length;
        }
        return 0;
    }, [infiniteLoop, items.length]);

    const carouselRef = useRef<HTMLDivElement>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const rafRef = useRef<number | null>(null);
    const isScrollingRef = useRef(false);
    const lastScrollPositionRef = useRef(0);

    const [activeIndex, setActiveIndex] = useState(infiniteOffset);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [dragDistance, setDragDistance] = useState(0);
    const [clickedItemIndex, setClickedItemIndex] = useState<number | null>(
        null,
    );
    const [clickedOnButton, setClickedOnButton] = useState(false);
    const [clickedEvent, setClickedEvent] = useState<React.MouseEvent | null>(
        null,
    );

    // Helper function to convert display index to real index
    const getRealIndex = useCallback(
        (displayIndex: number): number => {
            if (!infiniteLoop || items.length === 0) return displayIndex;
            return displayIndex % items.length;
        },
        [infiniteLoop, items.length],
    );

    // Calculate item size
    const itemSize = itemWidth + itemSpacing;

    // Get the real index for pagination display
    const realActiveIndex = useMemo(() => {
        return getRealIndex(activeIndex);
    }, [activeIndex, getRealIndex]);

    // Calculate the total width needed
    const totalWidth = useMemo(() => {
        if (displayItems.length === 1) return '100%';
        if (isMobile || wideMode) {
            return `${
                displayItems.length * itemWidth +
                (displayItems.length - 1) * itemSpacing
            }px`;
        }
        return `${
            displayItems.length * itemWidth +
            (displayItems.length - 1) * itemSpacing +
            (itemWidth + itemSpacing)
        }px`;
    }, [displayItems.length, itemWidth, itemSpacing, isMobile, wideMode]);

    const cardMargin = useMemo(() => {
        if (blurSideItems && !isMobile) {
            return `calc((100% - ${itemWidth}px) / 2)`;
        }
        return 0;
    }, [blurSideItems, itemWidth, isMobile]);

    const paginationDotsCount = useMemo(() => {
        return items.length - (isMobile || blurSideItems ? 0 : 2);
    }, [items.length, isMobile, blurSideItems]);

    const hidePagination = useMemo(() => {
        return !isMobile && paginationDotsCount < 2;
    }, [isMobile, paginationDotsCount]);

    const MAX_MOBILE_PAGINATION_DOTS = 20;

    const paginationDotsMapping = () => {
        if (isMobile && paginationDotsCount > MAX_MOBILE_PAGINATION_DOTS)
            return null;
        return Array.from({ length: paginationDotsCount }).map((_, index) => (
            <Box
                key={index}
                width="full"
                height="4px"
                borderRadius="full"
                bg={
                    index === realActiveIndex
                        ? themeColors.primary[500]
                        : themeColors.secondary[300]
                }
                mx={1}
                cursor="pointer"
                onClick={() => scrollToItem(index)}
                transition="background-color 0.3s ease"
                _hover={{
                    bg:
                        index === realActiveIndex
                            ? themeColors.primary[600]
                            : themeColors.secondary[400],
                }}
                hidden={
                    isMobile && paginationDotsCount > MAX_MOBILE_PAGINATION_DOTS
                }
            />
        ));
    };

    // Function to scroll to a specific item
    const scrollToItem = useCallback(
        (index: number) => {
            if (!carouselRef.current || items.length <= 1) return;

            let targetIndex: number;
            if (infiniteLoop) {
                // For infinite loop, find the closest instance of the target item
                const realIndex = index % items.length;
                const currentRealIndex = getRealIndex(activeIndex);

                // Calculate which set to use based on current position
                const currentDisplayIndex = activeIndex;
                const currentSet = Math.floor(
                    currentDisplayIndex / items.length,
                );

                // Try to stay in the same set or move to adjacent set
                let targetSet = currentSet;
                const diff = realIndex - currentRealIndex;

                // If wrapping around (going backwards), use previous set
                if (diff < -items.length / 2) {
                    targetSet = currentSet - 1;
                }
                // If wrapping around (going forwards), use next set
                else if (diff > items.length / 2) {
                    targetSet = currentSet + 1;
                }

                // Ensure we stay within bounds of displayItems
                const maxSet = Math.floor(
                    (displayItems.length - 1) / items.length,
                );
                targetSet = Math.max(0, Math.min(targetSet, maxSet));

                targetIndex = targetSet * items.length + realIndex;
            } else {
                const clampedIndex = Math.max(
                    0,
                    Math.min(index, items.length - 1),
                );
                targetIndex = clampedIndex;
            }

            const scrollPosition = targetIndex * itemSize;
            isScrollingRef.current = true;

            carouselRef.current.scrollTo({
                left: scrollPosition,
                behavior: 'smooth',
            });

            // Update active index after scroll animation
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            scrollTimeoutRef.current = setTimeout(() => {
                setActiveIndex(targetIndex);
                const realIdx = getRealIndex(targetIndex);
                onSelectItem?.(items[realIdx]);
                isScrollingRef.current = false;
            }, 300);
        },
        [
            items,
            infiniteLoop,
            activeIndex,
            getRealIndex,
            itemSize,
            onSelectItem,
            displayItems.length,
        ],
    );

    // Detect which item is visible when scrolling
    const handleScroll = useCallback(() => {
        if (!carouselRef.current || items.length <= 1 || isDragging) return;

        // Cancel any pending RAF
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        // Use RAF for smooth scroll handling
        rafRef.current = requestAnimationFrame(() => {
            if (!carouselRef.current) return;

            const scrollPosition = carouselRef.current.scrollLeft;
            const newIndex = Math.round(scrollPosition / itemSize);

            let targetIndex: number;
            if (infiniteLoop) {
                // Allow continuous scrolling without bounds checking
                const maxIndex = displayItems.length - 1;
                const clampedIndex = Math.max(0, Math.min(newIndex, maxIndex));
                targetIndex = clampedIndex;
            } else {
                const clampedIndex = Math.max(
                    0,
                    Math.min(newIndex, items.length - 1),
                );
                targetIndex = clampedIndex;
            }

            // Only update if index changed significantly
            if (Math.abs(targetIndex - activeIndex) > 0) {
                setActiveIndex(targetIndex);
                const realIdx = getRealIndex(targetIndex);
                onSelectItem?.(items[realIdx]);
            }

            lastScrollPositionRef.current = scrollPosition;
        });
    }, [
        itemSize,
        activeIndex,
        items,
        displayItems.length,
        infiniteLoop,
        getRealIndex,
        onSelectItem,
        isDragging,
    ]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isMobile) return;

        const target = e.target as HTMLElement;
        const isButton = target.closest('button') !== null;
        setClickedOnButton(isButton);

        if (isButton) {
            return;
        }

        setIsDragging(true);
        setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
        setScrollLeft(carouselRef.current?.scrollLeft || 0);
        setDragDistance(0);

        const itemElement = target.closest('[data-item-index]');
        if (itemElement) {
            const index = parseInt(
                itemElement.getAttribute('data-item-index') || '-1',
                10,
            );
            setClickedItemIndex(index);
            setClickedEvent(e);
        } else {
            setClickedItemIndex(null);
            setClickedEvent(null);
        }

        e.preventDefault();
    };

    const handleMouseUp = () => {
        if (isMobile) return;

        if (clickedOnButton) {
            setClickedOnButton(false);
            setClickedItemIndex(null);
            setClickedEvent(null);
            return;
        }

        if (dragDistance <= 3 && clickedItemIndex !== null && onItemClick) {
            const realIdx = getRealIndex(clickedItemIndex);
            onItemClick(realIdx, clickedEvent || undefined);
            setIsDragging(false);
            setClickedItemIndex(null);
            setClickedEvent(null);
            return;
        }

        setIsDragging(false);
        setClickedItemIndex(null);
        setClickedEvent(null);

        // Snap to nearest item
        if (carouselRef.current && items.length > 1) {
            const scrollPosition = carouselRef.current.scrollLeft;
            const newIndex = Math.round(scrollPosition / itemSize);
            if (infiniteLoop) {
                const realIdx = getRealIndex(newIndex);
                scrollToItem(realIdx);
            } else {
                scrollToItem(newIndex);
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (
            !isDragging ||
            isMobile ||
            !carouselRef.current ||
            items.length <= 1
        )
            return;

        const x = e.pageX - (carouselRef.current.offsetLeft || 0);
        const walk = (x - startX) * 1.5;
        let newScrollLeft = scrollLeft - walk;

        if (infiniteLoop) {
            carouselRef.current.scrollLeft = newScrollLeft;
        } else {
            const viewWidth = carouselRef.current.clientWidth;
            const maxScroll = carouselRef.current.scrollWidth - viewWidth;
            if (newScrollLeft < 0) newScrollLeft = 0;
            if (newScrollLeft > maxScroll) newScrollLeft = maxScroll;
            carouselRef.current.scrollLeft = newScrollLeft;
        }

        const currentDistance = Math.abs(x - startX);
        setDragDistance(currentDistance);

        e.preventDefault();
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            setClickedItemIndex(null);
            setClickedOnButton(false);
            setClickedEvent(null);

            if (carouselRef.current && items.length > 1) {
                const scrollPosition = carouselRef.current.scrollLeft;
                const newIndex = Math.round(scrollPosition / itemSize);
                if (infiniteLoop) {
                    const realIdx = getRealIndex(newIndex);
                    scrollToItem(realIdx);
                } else {
                    scrollToItem(newIndex);
                }
            }
        }
    };

    // Add scroll event listener
    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', handleScroll, {
                passive: true,
            });
            return () => {
                carousel.removeEventListener('scroll', handleScroll);
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                }
            };
        }
    }, [handleScroll]);

    // Call onSelectItem for initial item
    useEffect(() => {
        if (items.length > 0) {
            const realIdx = getRealIndex(activeIndex);
            onSelectItem?.(items[realIdx]);
        }
    }, []); // Only on mount

    // Calculate item styles based on distance from active index
    const getItemStyles = useCallback(
        (index: number) => {
            let distance: number;
            if (infiniteLoop && items.length > 1) {
                const realIndex1 = getRealIndex(index);
                const realIndex2 = getRealIndex(activeIndex);
                const diff = Math.abs(realIndex1 - realIndex2);
                distance = Math.min(diff, items.length - diff);
            } else {
                distance = Math.abs(index - activeIndex);
            }

            if (distance === 0 || !blurSideItems) {
                return {
                    transform: 'scale(1)',
                    filter: 'blur(0)',
                    opacity: 1,
                    zIndex: 2,
                };
            } else {
                return {
                    transform: 'scale(0.85)',
                    filter: 'blur(4px)',
                    opacity: 0.6,
                    zIndex: 0,
                };
            }
        },
        [infiniteLoop, items.length, getRealIndex, activeIndex, blurSideItems],
    );

    return (
        <Flex direction="column" width="full" align="center">
            <Box
                ref={carouselRef}
                overflowX="auto"
                width="full"
                maxWidth={'100%'}
                css={{
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                    scrollbarWidth: 'none',
                    cursor: !isMobile
                        ? isDragging
                            ? 'grabbing'
                            : 'grab'
                        : 'default',
                    userSelect: 'none',
                    scrollBehavior: 'smooth',
                }}
                px={5}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <Flex
                    direction="row"
                    justifyContent={
                        !isMobile && items.length <= 3 ? 'center' : 'flex-start'
                    }
                    pb={hidePagination ? 0 : 2}
                    width={!isMobile && items.length <= 3 ? '100%' : totalWidth}
                    position="relative"
                    ml={cardMargin}
                    mr={cardMargin}
                    pointerEvents={isDragging ? 'none' : 'auto'}
                >
                    {displayItems.map((item, itemIndex) => {
                        const styles = getItemStyles(itemIndex);
                        const realIndex = getRealIndex(itemIndex);
                        return (
                            <Box
                                key={`${itemIndex}-${realIndex}`}
                                minWidth={
                                    displayItems.length === 1
                                        ? '100%'
                                        : `${itemWidth}px`
                                }
                                maxWidth={
                                    displayItems.length === 1
                                        ? '100%'
                                        : `${itemWidth}px`
                                }
                                mr={
                                    itemIndex < displayItems.length - 1
                                        ? `${itemSpacing}px`
                                        : 0
                                }
                                data-item-index={itemIndex}
                                onClick={
                                    isMobile && onItemClick
                                        ? () => onItemClick(realIndex)
                                        : undefined
                                }
                                cursor={onItemClick ? 'pointer' : 'default'}
                                style={styles}
                                transition="all 0.3s ease-in-out"
                                justifyItems={
                                    displayItems.length === 1
                                        ? 'center'
                                        : 'flex-start'
                                }
                                _hover={{
                                    transform:
                                        !isDragging &&
                                        styles.transform.replace(
                                            'scale(',
                                            'scale(',
                                        ) === 'scale(1)'
                                            ? 'scale(1.05)'
                                            : styles.transform,
                                }}
                            >
                                {renderItem(item, realIndex)}
                            </Box>
                        );
                    })}
                </Flex>
            </Box>

            <HStack
                hidden={hidePagination}
                alignItems="center"
                justifyContent="center"
                w="full"
                gap={2}
                mt={{ base: 4, md: 2 }}
                px={4}
            >
                <PaginationButton
                    onClick={() => {
                        const nextIndex =
                            realActiveIndex - 1 < 0
                                ? items.length - 1
                                : realActiveIndex - 1;
                        scrollToItem(nextIndex);
                    }}
                    isActive={infiniteLoop || realActiveIndex > 0}
                >
                    ←
                </PaginationButton>
                <Flex
                    justify="center"
                    maxWidth={{
                        base: '256px',
                        md:
                            paginationDotsCount > MAX_MOBILE_PAGINATION_DOTS
                                ? 'full'
                                : '256px',
                    }}
                    w="full"
                >
                    {paginationDotsMapping()}
                </Flex>
                <PaginationButton
                    onClick={() => {
                        const nextIndex =
                            realActiveIndex + 1 >= items.length
                                ? 0
                                : realActiveIndex + 1;
                        scrollToItem(nextIndex);
                    }}
                    isActive={
                        infiniteLoop ||
                        realActiveIndex < paginationDotsCount - 1
                    }
                >
                    →
                </PaginationButton>
            </HStack>
        </Flex>
    );
};
