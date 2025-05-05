import { Box, useColorModeValue, VisuallyHidden } from '@chakra-ui/react';
import { Drawer } from 'vaul';

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
    const bgColor = useColorModeValue('#F9FAFB', '#1A1A1A');

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
                        zIndex: 2,
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.50)',
                    }}
                />
                <Drawer.Content
                    aria-description={ariaDescription}
                    aria-describedby={ariaTitle}
                    style={{
                        zIndex: 3,
                        backgroundColor: bgColor,
                        borderRadius: '24px 24px 0 0',
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        minHeight: '60vh',
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
                        bg={'#D7D6D4'}
                        my={2}
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
