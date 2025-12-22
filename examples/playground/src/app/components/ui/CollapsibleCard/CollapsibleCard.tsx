'use client';

import {
    Box,
    VStack,
    Heading,
    Icon,
    Collapse,
    HStack,
    IconButton,
    BoxProps,
} from '@chakra-ui/react';
import { useState } from 'react';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';

interface CollapsibleCardProps {
    title: string;
    icon?: React.ElementType;
    children: React.ReactNode;
    defaultIsOpen?: boolean;
    style?: BoxProps;
}

export function CollapsibleCard({
    title,
    icon,
    children,
    defaultIsOpen = false,
    style,
}: CollapsibleCardProps) {
    const [isOpen, setIsOpen] = useState(defaultIsOpen);

    return (
        <Box
            p={4}
            borderRadius="lg"
            boxShadow="xl"
            backdropFilter="blur(10px)"
            w="full"
            {...style}
        >
            <VStack spacing={6} align="stretch" justifyContent={'center'}>
                <HStack
                    justify="space-between"
                    align="center"
                    cursor={'pointer'}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <HStack spacing={2}>
                        {icon && <Icon as={icon} boxSize={6} />}
                        <Heading size="sm" textAlign="center">
                            {title}
                        </Heading>
                    </HStack>
                    <IconButton
                        aria-label={isOpen ? 'Collapse' : 'Expand'}
                        icon={isOpen ? <LuChevronUp /> : <LuChevronDown />}
                        variant="ghost"
                        size="sm"
                    />
                </HStack>
                <Collapse in={isOpen} animateOpacity>
                    {children}
                </Collapse>
            </VStack>
        </Box>
    );
}
