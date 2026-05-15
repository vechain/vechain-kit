'use client';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    Box,
    useColorModeValue,
} from '@chakra-ui/react';
import { GitBookProvider, GitBookFrame } from '@gitbook/embed/react';

interface DocsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DocsModal({ isOpen, onClose }: DocsModalProps) {
    const frameBg = useColorModeValue('white', '#0d1117');

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={{ base: 'full', md: '5xl' }}
            isCentered
        >
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent
                mx={{ base: 0, md: 4 }}
                my={{ base: 0, md: 4 }}
                maxH={{ base: '100vh', md: '90vh' }}
                borderRadius={{ base: 0, md: 'xl' }}
                overflow="hidden"
            >
                <ModalCloseButton zIndex={2} />
                <ModalBody p={0}>
                    <Box
                        w="full"
                        h={{ base: '100vh', md: '85vh' }}
                        bg={frameBg}
                    >
                        <GitBookProvider siteURL="https://docs.vechainkit.vechain.org">
                            <GitBookFrame tabs={['assistant', 'docs']} />
                        </GitBookProvider>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
