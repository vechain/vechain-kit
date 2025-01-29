'use client';

import { Box, VStack, Text, Icon, Link, useColorMode } from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface FeatureCardProps {
    title: string;
    description: React.ReactNode;
    icon: IconType;
    link: string;
    highlight?: boolean;
    content: () => void;
}

export function FeatureCard({
    title,
    description,
    icon,
    link,
    highlight,
    content,
}: FeatureCardProps) {
    const { colorMode } = useColorMode();

    return (
        <Link
            href={link}
            isExternal={link.startsWith('http')}
            _hover={{ textDecoration: 'none' }}
            onClick={(e) => {
                e.preventDefault();
                content();
            }}
        >
            <Box
                p={4}
                borderRadius="md"
                borderWidth="1px"
                backdropFilter="blur(10px)"
                borderColor={highlight ? 'blue.500' : 'transparent'}
                bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
                _hover={{
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s',
                    bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100',
                }}
                cursor="pointer"
                height="full"
            >
                <VStack spacing={3} align="start">
                    <Icon
                        as={icon}
                        boxSize={6}
                        color={colorMode === 'light' ? 'blue.500' : 'blue.300'}
                    />
                    <Text fontWeight="bold">{title}</Text>
                    <Text
                        fontSize="sm"
                        color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    >
                        {description}
                    </Text>
                </VStack>
            </Box>
        </Link>
    );
}
