'use client';

import {
    Box,
    VStack,
    Text,
    Icon,
    useColorMode,
    HStack,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { LuHand } from 'react-icons/lu';

interface FeatureCardProps {
    title: string;
    description: React.ReactNode;
    icon: IconType;
    highlight?: boolean;
    content: () => void;
    disabled?: boolean;
    showHint?: boolean;
}

export function FeatureCard({
    title,
    description,
    icon,
    highlight,
    content,
    disabled = false,
    showHint = false,
}: FeatureCardProps) {
    const { colorMode } = useColorMode();

    return (
        <Box
            onClick={(e) => {
                if (disabled) {
                    e.preventDefault();
                    return;
                }
                content();
            }}
            p={4}
            borderRadius="md"
            borderWidth="1px"
            backdropFilter="blur(10px)"
            borderColor={highlight ? 'blue.500' : 'transparent'}
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
            _hover={{
                transform: disabled ? 'translateY(0)' : 'translateY(-2px)',
                transition: 'transform 0.2s',
                bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100',
            }}
            cursor={disabled ? 'not-allowed' : 'pointer'}
            height="full"
        >
            <VStack spacing={3} align="start">
                <HStack>
                    <Icon
                        as={icon}
                        boxSize={6}
                        color={colorMode === 'light' ? 'blue.500' : 'blue.300'}
                    />
                    {showHint && (
                        <HStack
                            spacing={3}
                            animation="bounce-left 1s infinite"
                            justifyContent="center"
                            alignItems="center"
                            transform="rotate(-10deg)"
                            sx={{
                                '@keyframes bounce-left': {
                                    '0%, 100%': {
                                        transform: 'rotate(0deg) translateX(0)',
                                    },
                                    '50%': {
                                        transform:
                                            'rotate(0deg) translateX(-5px)',
                                    },
                                },
                            }}
                        >
                            <LuHand
                                size={24}
                                color={
                                    colorMode === 'light'
                                        ? '#4A5568'
                                        : '#A0AEC0'
                                }
                                style={{ marginLeft: '8px', transform: 'rotate(10deg)' }}
                            />

                            <Text
                                fontSize="sm"
                                color={
                                    colorMode === 'light'
                                        ? 'gray.600'
                                        : 'gray.400'
                                }
                            >
                                Click me!
                            </Text>
                        </HStack>
                    )}
                </HStack>
                <Text fontWeight="bold">{title}</Text>
                <Text
                    fontSize="sm"
                    color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                >
                    {description}
                </Text>
                {disabled && (
                    <Text fontSize="xs" opacity={0.5}>
                        Only available for social login users.
                    </Text>
                )}
            </VStack>
        </Box>
    );
}
