'use client';

import { Box, Flex, useColorMode } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';

export default function PlaygroundLayout({
    children,
}: {
    children: ReactNode;
}) {
    const { colorMode } = useColorMode();

    return (
        <Flex
            minH="100vh"
            bg={colorMode === 'light' ? 'gray.50' : '#0c0c10'}
        >
            <Box
                as="nav"
                display={{ base: 'none', md: 'block' }}
                w="260px"
                position="sticky"
                top={0}
                h="100vh"
                flexShrink={0}
            >
                <Sidebar />
            </Box>

            <Flex direction="column" flex={1} minW={0}>
                <TopBar />
                <Box
                    as="main"
                    flex={1}
                    px={{ base: 4, md: 8 }}
                    py={{ base: 6, md: 8 }}
                    maxW="6xl"
                    w="full"
                    mx="auto"
                >
                    {children}
                </Box>
            </Flex>
        </Flex>
    );
}
