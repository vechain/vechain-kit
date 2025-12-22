'use client';

import { Box, VStack, Text, Icon, Link, useColorMode } from '@chakra-ui/react';
import { LuGithub } from 'react-icons/lu';

export function GithubCard() {
    const { colorMode } = useColorMode();

    return (
        <Link
            href="https://github.com/vechain/vechain-kit/issues/new"
            isExternal
            _hover={{ textDecoration: 'none' }}
        >
            <Box
                p={4}
                borderRadius="md"
                bg={colorMode === 'light' ? 'green.50' : 'green.900'}
                _hover={{
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s',
                    bg: colorMode === 'light' ? 'green.100' : 'green.800',
                }}
                cursor="pointer"
                height="full"
            >
                <VStack spacing={3} align="start">
                    <Icon
                        as={LuGithub}
                        boxSize={6}
                        color={
                            colorMode === 'light' ? 'green.500' : 'green.300'
                        }
                    />
                    <Text fontWeight="bold">Feature Request</Text>
                    <Text
                        fontSize="sm"
                        color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    >
                        Would you like to see something that is still missing?
                        Request the feature by opening an issue on our GitHub!
                    </Text>
                </VStack>
            </Box>
        </Link>
    );
}
