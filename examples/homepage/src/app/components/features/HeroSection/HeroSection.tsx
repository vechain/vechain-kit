'use client';

import { Card, VStack, Text, Heading, Button, useColorMode } from '@chakra-ui/react';
import { WalletButton } from '@vechain/vechain-kit';
import { useMediaQuery } from '@chakra-ui/react';

export function HeroSection() {
    const { colorMode } = useColorMode();
    const [isMobile] = useMediaQuery('(max-width: 768px)');

    return (
        <Card variant="section" py={{ base: 16, md: 24 }} px={{ base: 4, md: 8 }}>
            <VStack spacing={8} align="center" maxW="4xl" mx="auto" textAlign="center">
                <Heading
                    as="h1"
                    fontSize={{ base: '2.5rem', md: '4rem' }}
                    fontWeight="bold"
                    lineHeight="1.1"
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
                    VeChain Kit is a comprehensive library designed to make building VeChain applications fast and straightforward. Connect wallets, manage assets, and integrate blockchain functionality with ease.
                </Text>
                <VStack spacing={4} pt={4}>
                    <WalletButton
                        mobileVariant="iconDomainAndAssets"
                        desktopVariant="iconDomainAndAssets"
                    />
                </VStack>
            </VStack>
        </Card>
    );
}

