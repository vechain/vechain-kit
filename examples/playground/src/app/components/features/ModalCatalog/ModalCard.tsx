'use client';

import {
    Box,
    HStack,
    Icon,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';
import { HookBadge } from '../../demo/HookBadge';

interface ModalCardProps {
    title: string;
    description: ReactNode;
    icon: IconType;
    hook?: string;
    highlight?: boolean;
    onClick: () => void;
}

export function ModalCard({
    title,
    description,
    icon,
    hook,
    highlight,
    onClick,
}: ModalCardProps) {
    const { colorMode } = useColorMode();

    const borderColor = highlight
        ? 'blue.500'
        : colorMode === 'light'
        ? 'gray.200'
        : 'whiteAlpha.200';

    return (
        <Box
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            bg={colorMode === 'light' ? 'white' : 'whiteAlpha.50'}
            _hover={{
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                shadow: 'md',
                bg: colorMode === 'light' ? 'gray.50' : 'whiteAlpha.100',
            }}
            cursor="pointer"
            height="full"
        >
            <VStack spacing={3} align="start" h="full">
                <Icon
                    as={icon}
                    boxSize={6}
                    color={colorMode === 'light' ? 'blue.500' : 'blue.300'}
                />
                <Text fontWeight="semibold">{title}</Text>
                <Text
                    fontSize="sm"
                    color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    flex={1}
                >
                    {description}
                </Text>
                {hook && (
                    <HStack spacing={2} mt="auto">
                        <HookBadge name={hook} />
                    </HStack>
                )}
            </VStack>
        </Box>
    );
}
