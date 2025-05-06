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
    showInBottomSheet?: boolean;
};

export const StickyHeaderContainer = ({
    children,
    showInBottomSheet = true,
}: Props) => {
    const [hasContentBelow, setHasContentBelow] = useState(false);
    const observerRef = useRef<HTMLDivElement>(null);
    const { darkMode: isDark, useBottomSheet } = useVeChainKitConfig();
    const [isDesktop] = useMediaQuery('(min-width: 768px)');

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

    if (!showInBottomSheet && isBottomSheet) {
        return null;
    }

    return (
        <>
            <Box
                position={!isBottomSheet ? 'sticky' : 'relative'}
                top={'0'}
                left={'0'}
                w={'full'}
                borderRadius={'24px 24px 0px 0px'}
                bg={
                    !isBottomSheet
                        ? isDark
                            ? 'rgb(31 31 30 / 90%)'
                            : 'rgb(255 255 255 / 69%)'
                        : 'transparent'
                }
                backdropFilter={!isBottomSheet ? 'blur(12px)' : 'none'}
                style={
                    !isBottomSheet ? { WebkitBackdropFilter: 'blur(12px)' } : {}
                }
                zIndex={1000}
                boxShadow={
                    !isBottomSheet && hasContentBelow
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
