'use client';

import { Container, Image, Text, VStack } from '@chakra-ui/react';
import { WalletButton } from '@vechain/vechain-kit';
import './logo.css';

export function WelcomeSection() {
    return (
        <Container alignItems={'center'} justifyContent={'center'}>
            <VStack spacing={10}>
                <Image
                    src={
                        'https://i.ibb.co/ncysMF9/vechain-kit-logo-transparent.png'
                    }
                    maxW={'350px'}
                    maxH={'175px'}
                    alt="logo"
                    className="bounce-animation"
                />
                <Text textAlign={'center'}>
                    Hi! I'm VeChain Kit, a new way to access applications on
                    VeChain, and I'm here to show you how to use me.
                </Text>
                <WalletButton
                    mobileVariant="iconDomainAndAssets"
                    desktopVariant="iconDomainAndAssets"
                />
            </VStack>
        </Container>
    );
}
