'use client';

import { Container, Image, Text, VStack } from '@chakra-ui/react';
import { WalletButton } from '@vechain/vechain-kit';

export function WelcomeSection() {
    return (
        <Container alignItems={'center'} justifyContent={'center'}>
            <VStack spacing={10}>
                <Image
                    src={
                        'https://i.ibb.co/ncysMF9/vechain-kit-logo-transparent.png'
                    }
                    maxW={'250px'}
                    maxH={'125px'}
                    alt="logo"
                />
                <Text textAlign={'center'}>
                    Hi! I'm VeChain Kit, a new way to access applications on
                    VeChain, and I'm here to show how to use the kit and its
                    features.
                </Text>
                <WalletButton
                    mobileVariant="iconDomainAndAssets"
                    desktopVariant="iconDomainAndAssets"
                />
            </VStack>
        </Container>
    );
}
