'use client';

import { Container, Image, Spinner, Text, VStack } from '@chakra-ui/react';
import { useWallet, WalletButton } from '@vechain/vechain-kit';

export function WelcomeSection() {
    const { connection } = useWallet();

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
                    animation="bounce 3s infinite"
                    transform="rotate(-10deg)"
                    sx={{
                        '@keyframes bounce': {
                            '0%, 100%': {
                                transform: 'rotate(0deg) translateX(0)',
                            },
                            '50%': {
                                transform: 'rotate(0deg) translateY(5px)',
                            },
                        },
                    }}
                />
                <Text
                    textAlign={'center'}
                    fontSize="xl"
                    fontWeight="bold"
                    className="text-animation"
                    bg="linear-gradient(45deg, #2B6CB0, #4299E1, #63B3ED)"
                    backgroundClip="text"
                    color="transparent"
                >
                    Hi! I'm VeChain Kit, a new way to access applications on
                    VeChain, and I'm here to show you how to use me.
                </Text>
                {connection.isLoading ? (
                    <Spinner />
                ) : (
                    <WalletButton
                        mobileVariant="iconDomainAndAssets"
                        desktopVariant="iconDomainAndAssets"
                    />
                )}
            </VStack>
        </Container>
    );
}
