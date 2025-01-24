'use client';

import {
    Box,
    VStack,
    Heading,
    Icon,
    Collapse,
    HStack,
    IconButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

interface CollapsibleCardProps {
    title: string;
    icon?: React.ElementType;
    children: React.ReactNode;
    defaultIsOpen?: boolean;
}

export function CollapsibleCard({
    title,
    icon,
    children,
    defaultIsOpen = false,
}: CollapsibleCardProps) {
    const [isOpen, setIsOpen] = useState(defaultIsOpen);

    return (
        <Box
            p={8}
            borderRadius="lg"
            boxShadow="xl"
            bg="whiteAlpha.100"
            backdropFilter="blur(10px)"
            w="full"
        >
            <VStack spacing={6} align="stretch">
                <HStack justify="space-between" align="center">
                    <HStack spacing={2}>
                        {icon && <Icon as={icon} boxSize={8} />}
                        <Heading size="lg" textAlign="center">
                            {title}
                        </Heading>
                    </HStack>
                    <IconButton
                        aria-label={isOpen ? 'Collapse' : 'Expand'}
                        icon={isOpen ? <MdExpandLess /> : <MdExpandMore />}
                        onClick={() => setIsOpen(!isOpen)}
                        variant="ghost"
                        size="lg"
                    />
                </HStack>
                <Collapse in={isOpen} animateOpacity>
                    {children}
                </Collapse>
            </VStack>
        </Box>
    );
}
