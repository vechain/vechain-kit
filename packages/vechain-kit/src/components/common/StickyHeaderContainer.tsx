import { useVeChainKitConfig } from '@/providers';
import { Box, useMediaQuery } from '@chakra-ui/react';
import {
    useEffect,
    useState,
    useRef,
    useMemo,
    Children,
    isValidElement,
    cloneElement,
} from 'react';
import { ModalCloseButton } from '@chakra-ui/react';

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

    const isBottomSheet = useMemo(() => {
        return !isDesktop && Boolean(useBottomSheet);
    }, [isDesktop, useBottomSheet]);

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

    // Process children to remove ModalCloseButton when in bottom sheet mode
    const processedChildren = useMemo(() => {
        if (!isBottomSheet) {
            return children; // Return unchanged if not in bottom sheet mode
        }

        // Function to process each child node
        const processChild = (child: React.ReactNode): React.ReactNode => {
            // Skip non-element nodes
            if (!isValidElement(child)) return child;

            // If it's a ModalCloseButton, don't render it
            if (child.type === ModalCloseButton) {
                return null;
            }

            // If the child has children, recursively process them
            if (child.props.children) {
                return cloneElement(child, {
                    ...child.props,
                    children: Children.map(child.props.children, processChild),
                });
            }

            return child;
        };

        return Children.map(children, processChild);
    }, [children, isBottomSheet]);

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
                {processedChildren}
            </Box>
            <div
                ref={observerRef}
                style={{ position: 'absolute', top: '25px' }}
            />
        </>
    );
};
