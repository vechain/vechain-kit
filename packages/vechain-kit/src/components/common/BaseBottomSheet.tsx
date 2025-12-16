import { Box, useToken, VisuallyHidden } from '@chakra-ui/react';
import { Drawer } from 'vaul';
import { useVechainKitThemeConfig } from '@/providers';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    height?: string;
    children: React.ReactNode;
    ariaTitle: string;
    ariaDescription: string;
    isDismissable?: boolean;
};

export const BaseBottomSheet = ({
    isOpen,
    onClose,
    children,
    ariaTitle,
    ariaDescription,
    isDismissable = true,
}: Props) => {
    // Use semantic tokens for bottom sheet and overlay colors
    const modalBg = useToken('colors', 'vechain-kit-modal');
    const overlayBg = useToken('colors', 'vechain-kit-overlay');
    const handleBg = useToken('colors', 'vechain-kit-border');

    // Get backdrop filter from tokens context
    const { tokens } = useVechainKitThemeConfig();
    const overlayBackdropFilter = tokens?.effects?.backdropFilter?.overlay;

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
                    aria-describedby={ariaTitle}
                    style={{
                        zIndex: 101,
                        backgroundColor: modalBg,
                        borderRadius: '24px 24px 0 0',
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        // minHeight: '60vh',
                        maxHeight: '95vh',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <VisuallyHidden>
                        <Drawer.Title>{ariaTitle}</Drawer.Title>
                    </VisuallyHidden>

                    <Box
                        mx={'auto'}
                        w={'34px'}
                        h={'5px'}
                        bg={handleBg}
                        mt={4}
                        rounded={'full'}
                    />

                    <Box flex="1" overflowY="auto">
                        {children}
                    </Box>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
};
