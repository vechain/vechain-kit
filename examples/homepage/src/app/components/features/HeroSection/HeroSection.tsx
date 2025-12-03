'use client';

import { VStack, Text, Heading, useColorMode, Button } from '@chakra-ui/react';

export function HeroSection() {
    const { colorMode } = useColorMode();

    return (
        <VStack
            spacing={8}
            align="center"
            maxW="4xl"
            mx="auto"
            textAlign="center"
            p={8}
            my={[15, 20]}
        >
            <Heading
                as="h1"
                fontSize="xxx-large"
                fontWeight="800"
                lineHeight="1.1"
                fontFamily={
                    "'Satoshi', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
                }
                color={colorMode === 'dark' ? 'white' : 'gray.900'}
            >
                Build on VeChain, effortlessly
            </Heading>
            <Text
                fontSize={{ base: 'lg', md: 'xl' }}
                color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
                maxW="2xl"
                lineHeight="1.6"
            >
                VeChain Kit is an all-in-one SDK for building frontend
                applications on VeChain blockchain, supporting wallet
                integration, developer hooks, pre-built UI components, and more.
            </Text>

            <Button variant="homepagePrimary" size="lg">
                Get Started
            </Button>
        </VStack>
    );
}
