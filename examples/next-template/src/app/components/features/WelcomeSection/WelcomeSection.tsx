'use client';

import { Container, Text, VStack } from '@chakra-ui/react';
import { WalletButton } from '@vechain/vechain-kit';

export function WelcomeSection() {
    return (
        <Container alignItems={'center'} justifyContent={'center'}>
            <VStack spacing={10}>
                <Text textAlign={'center'}>
                    Hi! I'm VeChain Kit, a new way to access applications on
                    VeChain, and I'm here to show you my capabilities.
                </Text>
                <WalletButton
                    mobileVariant="iconDomainAndAssets"
                    desktopVariant="iconDomainAndAssets"
                />
            </VStack>
        </Container>
    );
}
